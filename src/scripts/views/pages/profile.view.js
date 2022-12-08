import { service } from '../../sdk';
import { isExpired } from '../../utils/date';
import { createPageHeader } from '../templates/creator.template';

class ProfileView {
  renderHeader() {
    return createPageHeader({
      title: 'Tentang Saya',
      menu: [
        String.raw`
          <a href="/#/profile-edit" class="font-semibold">Ubah</a>
        `,
        String.raw`
          <button @click="logout" class="font-semibold">
            Logout
            <iconify-icon icon="mdi:logout" inline></iconify-icon>
          </button>
        `,
      ],
    });
  }

  async render() {
    return String.raw`
      <div class="profile" x-data="profile">
        <div class="p-4">
          <div class="flex flex-row mx-auto mb-6">
            <div>
              <img x-bind:data-src="user.profile.avatar_url" alt="Profile Picture" class="lazyload rounded-full w-24" referrerpolicy="no-referrer">
            </div>
            <div class="flex flex-col gap-2 self-center ml-4">
              <h1 class="capitalize text-xl text-gray-900 font-semibold" x-text="user.profile.full_name"></h1>
              
              <template x-if="stats.helped_count <= 0">
                <p class="text-gray-700 text-sm">Belum ada orang yang terbantu, waktunya menjadi pahlawan.</p>
              </template>
              <template x-if="stats.helped_count > 0">
                <p class="text-gray-700 text-sm">Sudah <b x-text="stats.helped_count"></b> orang terbantu.</p>
              </template>
            </div>
          </div>

          <div class="mb-6">
            <label for="about" class="form-control-label">About</label>
            <p class="leading-6 text-sm text-gray-700 break-all" x-text="user.profile.description || '-'"></p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between mb-3">
              <label for="phone" class="text-base text-emerald-600">Email</label>
              <span x-text="user.email"></span>
            </div>

            <div class="flex justify-between mb-3">
              <label class="text-base text-emerald-600">Phone</label>
              <span x-text="user.profile.phone || '-'"></span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex justify-between items-end mb-3">
              <label class="form-control-label" style="margin-bottom:0;">Alamat</label>
              <a href="/#/location" class="border bg-pink-50 border-pink-600 text-pink-600 text-sm px-3 py-1 rounded-md hover:bg-pink-600 hover:text-pink-50">
                Ubah Lokasi Saya
              </a>
            </div>
            <p class="leading-6 text-sm text-gray-700 break-all" x-text="address || '-'"></p>
          </div>

          <div class="flex gap-3 my-4">
            <div class="basis-1/2">
              <div class="bg-white rounded-md border border-gray-300 p-3 text-center">
                <h1 class="text-2xl font-semibold text-gray-900" x-text="stats.monthly">0</h1>
                <span class="text-sm text-gray-700">30 hari terakhir</span>
              </div>
            </div>
            <div class="basis-1/2">
              <div class="bg-white rounded-md border border-gray-300 p-3 text-center">
                <h1 class="text-2xl font-semibold text-gray-900" x-text="stats.all_time">0</h1>
                <span class="text-sm text-gray-700">Selama ini</span>
              </div>
            </div>

          </div>
          <div>
            <h2 class="form-control-label">Daftar Item</h2>

            <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul class="flex flex-wrap -mb-px">
                <li class="mr-2">
                  <a href="#" class="inline-block p-4 rounded-t-lg border-b-2" @click.prevent="tab = 'food'" x-bind:class="{'text-green-700 border-green-600': (tab === 'food'), 'border-transparent': (tab !== 'food')}">Food</a>

                </li>
                <li class="mr-2">
                  <a href="#" class="inline-block p-4 rounded-t-lg border-b-2" @click.prevent="tab = 'non-food'" x-bind:class="{'text-green-700 border-green-600': (tab === 'non-food'), 'border-transparent': (tab !== 'non-food')}">Non Food</a>
                </li>
              </ul>
            </div>

            <div x-show="tab === 'food'" x-transition>
              <div class="flex flex-col gap-2 pb-8" x-bind:class="{'divide-y': useCategory('food').length > 0}">
                <template x-if="useCategory('food').length === 0">
                  <div class="card-pink mt-4">
                    <p>Produk dengan kategori <b>Food</b> masih kosong.</p>
                  </div>
                </template>
                <template x-for="item in useCategory('food')">
                  <div class="flex pt-2 pb-1 gap-4">
                    <div class="relative">
                      <img class="lazyload lazypreload w-32 h-24 object-cover rounded shadow" x-bind:data-src="productImage(item)" src="images/loading.gif" x-bind:alt="item.title">
                  
                      <template x-if="item.qty === 0">
                        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/80 flex items-center justify-center">
                          <span class="text-white">Kosong</span>
                        </div>
                      </template>
                      
                      <template x-if="isExpired(item)">
                        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/80 flex items-center justify-center">
                          <span class="text-white">Expired</span>
                        </div>
                      </template>
                    </div>
                    <div class="flex flex-col gap-2">
                      <a x-bind:href="'/#/product/' + item.id">
                        <h3 x-text="item.title" class="font-semibold"></h3>
                      </a>
                      <div class="flex gap-2 text-gray-700">
                        <div class="flex gap-2 text-sm items-center">
                          <iconify-icon icon="ri:eye-line" inline></iconify-icon>
                          <span title="View" x-text="item.view">0</span>
                        </div>
                        <span>·</span>
                        <div class="flex gap-2 text-sm items-center">
                          <iconify-icon icon="fluent-mdl2:quantity" inline></iconify-icon>
                          <span title="QTY" x-text="item.qty">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div x-show="tab === 'non-food'" x-transition>
              <div class="flex flex-col gap-2 pb-8" x-bind:class="{'divide-y': useCategory('non-food').length > 0}">
                <template x-if="useCategory('non-food').length === 0">
                  <div class="card-pink mt-4">
                    <p>Produk dengan kategori <b>Non Food</b> masih kosong.</p>
                  </div>
                </template>
                <template x-for="item in useCategory('non-food')">
                  <div class="flex pt-2 pb-1 gap-4">
                    <div class="relative">
                      <img class="lazyload w-32 h-24 object-cover rounded shadow" x-bind:data-src="productImage(item)" x-bind:alt="item.title">

                      <template x-if="item.qty === 0">
                        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/80 flex items-center justify-center">
                          <span class="text-white">Kosong</span>
                        </div>
                      </template>
                      
                      <template x-if="isExpired(item)">
                        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/80 flex items-center justify-center">
                          <span class="text-white">Expired</span>
                        </div>
                      </template>
                    </div>
                    <div class="flex flex-col gap-2">
                      <a x-bind:href="'/#/product/' + item.id">
                        <h3 x-text="item.title" class="font-semibold"></h3>
                      </a>
                      <div class="flex gap-4">
                        <div class="flex gap-2 text-sm items-center">
                          <iconify-icon icon="ri:eye-line" inline></iconify-icon>
                          <span title="View" x-text="item.view">0</span>
                        </div>
                        <span>·</span>
                        <div class="flex gap-2 text-sm items-center">
                          <iconify-icon icon="fluent-mdl2:quantity" inline></iconify-icon>
                          <span title="QTY" x-text="item.qty">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('profile', () => ({
      tab: 'food',
      user: null,
      address: null,
      products: [],
      stats: {
        all_time: 0,
        monthly: 0,
        helped_count: 0,
      },
      init() {
        const user = service.user.me();
        this.user = user;
        console.log(user);

        Promise.all([
          service.user.getHelpedPeopleCount().then((stat) => {
            this.stats.helped_count = stat.count;
          }),
          service.user.listedProductCount().then((stat) => {
            this.stats.all_time = stat.all_time;
            this.stats.monthly = stat.monthly;
          }),
          service.product.all().then((products) => {
            this.products = products;
          }),
          service.user.getAddress(user).then((address) => {
            this.address = address;
          }),
        ]);
      },
      useCategory(category) {
        return this.products.filter((item) => item.category === category);
      },
      productImage(item) {
        return item.images[0];
      },
      image(item) {
        const { data: { publicUrl } } = service.helpers.usePublicUrl(item);
        return publicUrl;
      },
      isExpired(product) {
        return (product.category === 'food' && isExpired(product.expired_at));
      },
    }));
  }
}

export default new ProfileView();
