import { service } from '../../../sdk';
import UrlParser from '../../../utils/url.parser';

class ProductDetailView {
  async render() {
    return String.raw`
      <div x-data="product" class="p-3">
        <template x-if="product">
          <div class="flex flex-col gap-2 text-gray-800">
            <img x-bind:data-src="product.images[0]" class="lazyload rounded-md h-64 w-full object-cover ring-2 ring-emerald-100" alt="">
            <!-- Judul -->
            <h3 x-text="product.title" class="text-2xl"></h3>
            <!-- Tanggal -->
            <span class="text-sm text-gray-500">
              <iconify-icon icon="ri:time-line" inline></iconify-icon>
              ditambahkan <span x-text="ago(product.created_at)"></span> yang lalu.
            </span>
            <!-- Deskripsi -->
            <p x-text="product.description" class=""></p>
            
            <div class="flex flex-col gap-2 divide-y">
              <!-- Qty -->
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600">Barang Tersedia</h4>
                <span x-text="product.qty + ' item'"></span>
              </div>
              <!-- Category dan Tag -->
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600">Kategori</h4>
                <span x-text="product.category" class="capitalize"></span>
              </div>
              <div class="pt-2 flex justify-between">
                <h4 class="text-emerald-600">Tag</h4>
                <span x-text="tagsText(product.tags)"></span>
              </div>
              <template x-if="(product.category == 'food')">
                <div class="pt-2 flex justify-between">
                  <h4 class="text-emerald-600">Expired</h4>
                  <span x-text="product.expired_at"></span>
                </div>
              </template>
              <template x-if="(product.category === 'non-food')">
                <div class="pt-2 flex justify-between">
                  <h4 class="text-emerald-600">Digunakan</h4>
                  <span x-text="product.used_since"></span>
                </div>
              </template>
              <div></div>
            </div>

            <!-- Drop Time -->
            <h4 class="text-emerald-600">Waktu Ambil</h4>
            <ul>
              <template x-for="time in product.drop_time">
                <li x-text="time"></li>
              </template>
            </ul>

            <!-- User (Avatar Nama) -->
            <div class="flex gap-2 my-4">
              <img x-bind:data-src="product.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload w-8 h-8 rounded-full" alt="">
              <div class="flex flex-col">
                <span x-text="product.profile.full_name"></span>
              </div>
            </div>

            <div class="flex gap-3">
              <!-- Button Request -->
              <button class="w-full py-3 text-sm text-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 bg rounded-md">
                Buat Permintaan
              </button>
              <!-- Button Contact WA -->
              <a x-bind:href="createWhatsappLink(product.profile)" target="_blank" class="w-full py-3 text-center text-sm text-white bg-emerald-600 bg rounded-md">
                <iconify-icon icon="ri:whatsapp-line" inline></iconify-icon>
                <span>Whatsapp</span>
              </a>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  async afterRender() {
    
  }
}

export default new ProductDetailView();
