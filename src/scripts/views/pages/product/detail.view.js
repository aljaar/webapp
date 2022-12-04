import { service } from '../../../sdk';
import { fromNow } from '../../../utils/date';
import { delay } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import UrlParser from '../../../utils/url.parser';
import { createPageHeader } from '../../templates/creator.template';

class ProductDetailView {
  renderHeader() {
    return createPageHeader({
      title: 'Detail Item',
    });
  }

  async render() {
    return String.raw`
      <div x-data="productDetail" class="p-4">
        <template x-if="isLoading">
          <div role="status" class="animate-pulse">
            <div class="flex justify-center items-center mb-4 h-48 bg-gray-300 rounded">
              <svg class="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
            </div>
            <div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full"></div>
            <div class="flex items-center mt-4 space-x-3">
              <svg class="w-14 h-14 text-gray-200" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
                <div>
                  <div class="h-2.5 bg-gray-200 rounded-full w-32 mb-2"></div>
                  <div class="w-48 h-2 bg-gray-200 rounded-full"></div>
                </div>
            </div>
            <span class="sr-only">Loading...</span>
          </div>
        </template>

        <template x-if="product">
          <div class="flex flex-col gap-2 text-gray-800">
            <div class="relative">
              <img x-bind:data-src="product.images[0]" class="lazyload lazypreload rounded-md h-64 w-full object-cover border border-green-600" src="images/loading.gif" x-bind:alt="product.title">

              <div class="absolute top-3 right-3 flex flex-col gap-2">
                <div class="flex items-center gap-2 text-sm rounded-md bg-black/60 text-white py-2 px-4">
                  <iconify-icon icon="heroicons-outline:eye" inline></iconify-icon>
                  <span x-text="product.view"></span>
                </div>
              </div>
            </div>
            <!-- Judul -->
            <h3 x-text="product.title" class="text-2xl font-semibold"></h3>
            <!-- Tanggal -->
            <span class="text-sm text-gray-500">
              <iconify-icon icon="ri:time-line" inline></iconify-icon>
              ditambahkan <span x-text="ago(product.created_at)"></span> yang lalu.
            </span>
            <!-- Deskripsi -->
            <p x-text="product.description" class="text-[14px]"></p>
            
            <div class="flex flex-col gap-2 divide-y">
              <!-- Qty -->
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600 font-medium">Barang Tersedia</h4>
                <span x-text="product.qty + ' item'"></span>
              </div>
              <!-- Category dan Tag -->
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600 font-medium">Kategori</h4>
                <span x-text="product.category" class="capitalize"></span>
              </div>
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600 font-medium">Tag</h4>
                <span x-text="tagsText(product.tags)"></span>
              </div>
              <template x-if="(product.category == 'food')">
                <div class="pt-2 flex justify-between">
                  <h4 class="text-emerald-600 font-medium">Expired</h4>
                  <span x-text="product.expired_at"></span>
                </div>
              </template>
              <template x-if="(product.category === 'non-food')">
                <div class="pt-2 flex justify-between">
                  <h4 class="text-emerald-600 font-medium">Digunakan</h4>
                  <span x-text="product.used_since"></span>
                </div>
              </template>
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600 font-medium">Waktu Ambil</h4>
                <span x-text="product.drop_time.join(', ')"></span>
              </div>
              <div></div>
            </div>

            <!-- User (Avatar Nama) -->
            <div class="flex items-center gap-2 my-4">
              <img x-bind:data-src="product.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload w-8 h-8 rounded-full" alt="">
              <div class="flex flex-col flex-1">
                <span x-text="product.profile.full_name"></span>
              </div>

              <!-- Button Contact WA -->
              <template x-if="product.profile.phone">
                <a x-bind:href="createWhatsappLink(product.profile)" target="_blank" class="py-2 px-4 text-sm text-white bg-emerald-600 bg rounded-md shadow">
                  <iconify-icon icon="ri:whatsapp-line" inline></iconify-icon>
                  <span>Whatsapp</span>
                </a>
              </template>
            </div>

            <div class="flex gap-3">
              <!-- Button Request -->
              <button @click="createRequest" class="w-full py-3 text-white bg-emerald-600 rounded-md shadow">
                Buat Permintaan
              </button>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  async afterRender(alpine) {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();

    alpine.data('productDetail', () => ({
      product: null,
      isLoading: true,
      async init() {
        // TODO: Buat error message atau display untuk not found atau error
        try {
          const product = await service.product.detail(id);
          await delay(500);
          console.log(product);

          this.product = product;
          this.isLoading = false;
        } catch (err) {
          toastHelpers.error('Opps, informasi detail untuk produk ini gagal dimuat.');
          this.isLoading = false;
        }
      },
      async createRequest() {
        const loading = toastHelpers.loading();
        const { data: result } = await service.transaction.request(id);

        toastHelpers.dismiss(loading);
        if (result && result.includes('Whopss')) {
          toastHelpers.error(result);
        } else if (result && !result.includes('Whopss')) {
          toastHelpers.success(result);
        }
      },
      tagsText(tags = []) {
        return tags.map((tag) => tag.name).join(', ');
      },
      ago(date) {
        return fromNow(date);
      },
      createWhatsappLink(profile) {
        const message = `Hai, saya baru saja melihat barang **${this.product.title}** yang anda posting di Aljaar. Bisakah saya tanya sesuatu tentangnya? terima kasih sebelumnya.`;

        return `https://wa.me/${profile.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
      },
    }));
  }
}

export default new ProductDetailView();
