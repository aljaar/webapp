import { v4 as uuid } from 'uuid';
import {
  emitter, wrapper, useProduct, useGeoJson, useGoogleMaps, geographyToCoordinates, coordinateEncoder,
} from './helpers/wrapper';
import * as validator from './helpers/validate';
import { service } from '.';

function Aljaar({ supabase }) {
  const states = {
    auth_state: null,
    session: null,
    user: null,
    tags: [],
  };
  const redirect = {
    onResetPassword: 'https://apps.aljaar.my.id/#/reset-password',
  };

  const { data: { publicUrl: publicAvatar } } = supabase.storage
    .from('avatars')
    .getPublicUrl('public/avatar.default.webp');

  const usePublicUrl = (path) => supabase.storage.from('products').getPublicUrl(path);

  emitter.on('aljaar:on:error', (error) => {
    console.info(error.message);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    states.auth_state = event;

    if (!session) {
      states.session = null;
      states.user = null;
    }

    switch (event) {
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
        emitter.emit('aljaar:auth:login', { event, session });
        states.session = session;
        // states.user = session.user;

        if (event === 'TOKEN_REFRESHED') {
          emitter.emit('aljaar:auth:refreshed', { event, session });
        }
        break;
      case 'SIGNED_OUT':
        emitter.emit('aljaar:auth:logout', { event, session });
        break;
      case 'PASSWORD_RECOVERY':
        emitter.emit('aljaar:auth:recovery', { event, session });
        break;
      default:
        emitter.emit('aljaar:on:auth', { event, session });
        break;
    }
  });

  return {
    emitter,
    raw: supabase,
    permission: new Map(),
    auth: {
      async session() {
        return wrapper(() => supabase.auth.getSession());
      },
      async user() {
        const { data: { session: { user } } } = await supabase.auth.getSession();
        const { data: profile } = await supabase.from('profiles').select().eq('user_id', user.id).single();

        user.profile = profile;

        if (profile.location) {
          user.location = await geographyToCoordinates(supabase, profile.location);
        } else {
          user.location = false;
        }

        states.user = user;

        return user;
      },
      signInWith({ type, credential = {} }) {
        switch (type) {
          case 'google':
          case 'facebook':
          case 'github':
            return wrapper(() => supabase.auth.signInWithOAuth({
              provider: type,
            }));
          case 'email':
            return wrapper(() => supabase.auth.signInWithPassword({
              email: credential.email,
              password: credential.password,
            }));
          default:
            return wrapper(() => ({ error: 'unknown method' }));
        }
      },
      async signUp(data) {
        const { value: validated, error } = await wrapper(() => validator.signUp(data));

        if (error) {
          return { data: null, error };
        }

        return wrapper(() => supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            data: {
              full_name: validated.full_name,
              avatar_url: publicAvatar,
              phone: validated.phone,
            },
          },
        }));
      },
      signOut() {
        return wrapper(() => supabase.auth.signOut());
      },
      resetPassword(email) {
        return wrapper(() => supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirect.onResetPassword,
        }));
      },
      updatePassword(password) {
        return wrapper(() => supabase.auth.updateUser({
          password,
        }));
      },
      updateWithCurrentLocation() {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve({ data: null, error: { message: "Can't get user current location" } });
          }

          navigator.geolocation.getCurrentPosition((position) => {
            const { error } = wrapper(() => supabase.from('profiles').update({
              location: `SRID=4326;POINT(${position.coords.longitude} ${position.coords.latitude})`,
            }).eq('user_id', states.user.id));

            resolve({ data: position.coords, error });
          }, () => {

          }, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: true,
          });
        });
      },
    },
    user: {
      me() {
        return states.user;
      },
      async profile(id) {
        if (id === states.user.profile.id) {
          redirect('#/profile');
        }

        const { data: profile } = await supabase.from('profiles')
          .select()
          .eq('id', id)
          .single();

        if (profile.location) {
          profile.user_location = await geographyToCoordinates(supabase, profile.location);
        } else {
          profile.user_location = false;
        }

        return profile;
      },
      async update(data) {
        const { full_name: fullName, phone, description } = states.user.profile;
        const update = {};

        if (data.full_name !== fullName) {
          update.full_name = data.full_name;
        }
        if (data.phone !== phone) {
          update.phone = data.phone;
        }
        if (data.description !== description) {
          update.description = data.description;
        }

        if (data.avatar) {
          const ext = data.avatar.name.split('.').pop();
          const filename = `${uuid()}.${ext}`;

          const { data: avatar } = await wrapper(() => supabase.storage
            .from('avatars')
            .upload(`${states.user.id}/${filename}`, data.avatar));

          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(avatar.path);

          update.avatar_url = publicUrl;
        }

        return wrapper(() => supabase.from('profiles')
          .update(update)
          .eq('user_id', states.user.id));
      },
      getHelpedPeopleCount() {
        return wrapper(() => supabase.from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', states.user.id)
          .eq('status', 'approved'));
      },
      async getNeighborCount() {
        return wrapper(() => supabase.rpc('get_neighbor_count', {
          radius: 200,
        }));
      },
      async listedProductCount() {
        const { data: stats, error } = await supabase.rpc('product_stats');

        if (error) {
          return {
            all_time: 0,
            monthly: 0,
          };
        }

        return stats[0];
      },
      updateLocation(position) {
        return wrapper(() => supabase.from('profiles').update({
          location: `SRID=4326;POINT(${position.lng} ${position.lat})`,
        }).eq('user_id', states.user.id));
      },
      async getAddress(user, update = false) {
        if (user.profile.address && !update) return user.profile.address;

        const { result: { address } } = await coordinateEncoder([
          user.location.lat,
          user.location.lon,
        ]);

        if (user.profile.address !== address || update) {
          await supabase.from('profiles').update({
            address,
          }).eq('id', user.profile.id);
        }

        return address;
      },
    },
    product: {
      async detail(id) {
        const productResult = await wrapper(() => supabase
          .from('products')
          .select('*, product_images ( image ), likes (count), product_tags ( tags (id, name) ), product_analytics ( view )')
          .eq('id', id)
          .maybeSingle());

        if (productResult.error) return productResult;

        const { data: product } = productResult;

        const isOwner = (product.user_id === states.user.id);
        const transactionRPC = isOwner ? 'get_transactions' : 'count_transactions';

        const [transaction, profile] = await Promise.all([
          wrapper(() => supabase.rpc(transactionRPC, {
            p_id: id,
          })),
          wrapper(() => supabase
            .from('profiles')
            .select('id, full_name, avatar_url, phone, rating')
            .eq('user_id', product.user_id)),
        ]);

        product.profile = profile.data;
        product.transaction = transaction.data;

        if (product.user_id !== states.user.id) {
          wrapper(() => supabase.rpc('increment_view', {
            p_id: id,
          })).catch(console.info);
        }

        return useProduct(product).format(usePublicUrl);
      },
      async all() {
        const { data } = await wrapper(() => supabase
          .from('products')
          .select('*, product_images ( image ), likes (count), product_tags ( tags (id, name) ), product_analytics ( view )')
          .eq('user_id', states.user?.id)
          .neq('status', 'deleted'));

        const products = data.map((product) => useProduct(product).format(usePublicUrl));

        return products;
      },
      async create({ data, images }) {
        // Image Upload
        const uploadTasks = images.map(async (image) => {
          const ext = image.name.split('.').pop();
          const filename = `${uuid()}.${ext}`;

          const { data: imageResult } = await wrapper(() => supabase.storage
            .from('products')
            .upload(`${states.user.id}/${filename}`, image));

          return imageResult;
        });

        const results = await Promise.all(uploadTasks);
        // const results = [{
        //   path: '09a93ad3-1313-4198-a0dd-3082a68f9fd8/96c85c42-682f-477c-85ad-b1bcd1329969.jpeg',
        // }];
        const uploadedImages = results.map((image) => image.path);
        const [lat, lon] = data.drop_point;

        const unvalidatedProduct = {
          ...data,
          images: uploadedImages,
        };

        const { value: product, error } = await wrapper(() => validator
          .product(unvalidatedProduct));

        if (error) {
          return { data: null, error };
        }

        product.drop_point = `SRID=4326;POINT(${lon} ${lat})`;

        return wrapper(() => supabase.rpc('create_product', {
          product_raw: JSON.stringify(product),
          images: uploadedImages,
          drop_time: data.drop_time,
        }));
      },
      async update(id, { data, tags }) {
        const { value: product, error } = await wrapper(() => validator.editProduct({
          ...data,
        }));

        if (error) return { data: null, error };

        // if (product.drop_point) {
        //   const [lat, lon] = product.drop_point;

        //   product.drop_point = `SRID=4326;POINT(${lon} ${lat})`;
        // }

        const tasks = [
          wrapper(() => supabase.from('products').update({
            ...product,
          }).eq('id', id)),
        ];

        if (tags.isChanged) {
          if (tags.added.length) {
            const addedTags = tags.added.map((tag) => tag.id);

            tasks.push(wrapper(() => supabase.rpc('add_product_tag', {
              p_id: parseInt(id, 10),
              tags: addedTags,
            })));
          }
          if (tags.deleted.length) {
            const deletedTags = tags.deleted.map((tag) => tag.id);

            tasks.push(wrapper(() => supabase.rpc('delete_product_tag', {
              p_id: parseInt(id, 10),
              tags: deletedTags,
            })));
          }
        }

        try {
          await Promise.all(tasks);

          return { data: true, error: null };
        } catch (err) {
          return { data: true, error: err };
        }
      },
      async delete(id) {
        // return wrapper(() => supabase.rpc('delete_product', {
        //   p_id: id,
        // }));
        return wrapper(() => supabase.from('products').update({
          status: 'deleted',
        }).eq('id', id).eq('user_id', states.user.id));
      },
      async like(id) {
        return wrapper(() => supabase.rpc('like_product', {
          p_id: id,
        }));
      },
    },
    lists: {
      near(radius, filter = {}) {
        /**
         * Filter:
         * search
         * category
         * sort: { column, type }
         */
        const filters = [];

        if (filter.search && filter.search !== '') {
          filters.push(['or', `title.wfts.${filter.search.toLowerCase()},description.wfts.${filter.search.toLowerCase()}`]);
        }

        if (filter.category && filter.category !== '') {
          filters.push(['eq', 'category', filter.category]);
        }

        if (filter.sort && filter.sort.column && filter.sort.type) {
          filters.push(['order', filter.sort.column, { ascending: (filter.sort.type === 'asc') }]);
        }

        const query = filters.reduce((chain, [prev, ...args]) => chain[prev](...args), supabase.rpc('get_near_products', {
          radius,
        }));

        return wrapper(() => query);
      },
      async nearMap(radius, filter = {}) {
        const { data: products, error } = await this.near(radius, filter);

        if (error) return { data: null, error };

        return {
          data: useGeoJson(products),
          error: null,
        };
      },
    },
    tags: {
      all() {
        return wrapper(() => supabase.from('tags').select('id, name'))
          .then((result) => {
            if (result.error) return result;

            states.tags = result.data;

            return result;
          });
      },
      async search(query) {
        return wrapper(() => supabase.from('tags').select('id, name').limit(8).ilike('name', `%${query}%`));
      },
      useCache() {
        return {
          all() {
            return states.tags;
          },
          search(query) {
            return states.tags.filter((item) => (item.name.toLowerCase()
              .includes(query.toLowerCase())));
          },
        };
      },
    },
    transaction: {
      async waiting() {
        const { data: transactions } = await supabase.from('transactions')
          .select('*, products ( title, category, product_images (image) )')
          .eq('owner_id', states.user.id);

        const userId = transactions.map((tx) => tx.user_id);
        const { data: users } = await supabase.from('profiles')
          .select('user_id, full_name, avatar_url, status')
          .in('user_id', userId);

        return {
          data: transactions.map((tx) => ({
            ...tx,
            products: {
              ...tx.products,
              product_images: usePublicUrl(tx.products.product_images[0].image)
                .data.publicUrl,
            },
            user: users.find((user) => user.user_id === tx.user_id),
          })),
        };
      },
      async waitingCount() {
        return wrapper(() => supabase.from('transactions')
          .select('*', { count: 'exact', head: false })
          .eq('owner_id', states.user.id)
          .eq('status', 'waiting'));
      },
      // List of approved transactions and ready to pickup and need some review
      needReviews() {
        return wrapper(() => supabase.from('transactions')
          .select('*, products ( title, product_images (image) )')
          .eq('user_id', states.user.id)
          .eq('status', 'approved')
          .is('rating', null));
      },
      async detail(id, isRequest = false) {
        const column = isRequest ? 'owner_id' : 'user_id';
        const result = await wrapper(() => supabase.from('transactions')
          .select('*, products (id, title, category, drop_time, drop_point, user_id, product_images (image)), transaction_logs (status, created_at)')
          .eq(column, states.user.id)
          .eq('id', id)
          .single());

        if (!result.error) {
          const userType = !isRequest ? 'owner_id' : 'user_id';
          const userId = result.data[userType];
          const { data: profile } = await supabase.from('profiles')
            .select('id, full_name, avatar_url, phone')
            .eq('user_id', userId)
            .single();

          result.data.products = {
            ...result.data.products,
            product_images: usePublicUrl(result.data.products.product_images[0].image)
              .data.publicUrl,
          };

          result.data.profile = profile;
        }

        return result;
      },
      async lists() {
        const result = await wrapper(() => supabase.from('transactions')
          .select('*, products (id, title, category, product_images (image))')
          .eq('user_id', states.user.id));

        if (!result.error) {
          result.data = result.data.map((item) => ({
            ...item,
            products: {
              ...item.products,
              product_images: usePublicUrl(item.products.product_images[0].image).data.publicUrl,
            },
          }));
        }

        return result;
      },
      request(id) {
        return wrapper(() => supabase.rpc('request_transactions', {
          p_id: id,
        }));
      },
      approve(id) {
        return wrapper(() => supabase.rpc('response_transactions', {
          tx_id: id,
          response: 'approved',
          reason_txt: '',
        }));
      },
      reject(id, reason) {
        return wrapper(() => supabase.rpc('response_transactions', {
          tx_id: id,
          response: 'rejected',
          reason_txt: reason,
        }));
      },
      review(id, { rating, comment }) {
        return wrapper(() => supabase.rpc('review_transaction', {
          tx_id: id,
          rating_value: rating,
          comment_value: comment,
        }));
      },
    },
    helpers: {
      usePublicUrl,
      getLocation(geo) {
        return geographyToCoordinates(supabase, geo);
      },
      googleMaps({ start, stop }) {
        const link = useGoogleMaps({ start, stop });

        return {
          link,
          openLink() {
            window.open(link, '_blank');
          },
        };
      },
    },
  };
}

export default Aljaar;
