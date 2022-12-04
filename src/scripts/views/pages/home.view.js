import { service } from '../../sdk';
import { delay } from '../../utils/helpers';
import toastHelpers from '../../utils/toast.helpers';
import { createProduct, listsSkeletonLoading } from '../templates/creator.template';

class HomeView {
  async render() {
    return String.raw`
      <button id="login" class="hidden">Login</button>

      <div x-data="productLists" class="flex flex-col px-4 pt-4 gap-3">
        <!-- Search -->
        <form>   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <iconify-icon icon="heroicons-solid:search" class="text-gray-500"></iconify-icon>
            </div>
            <input type="search" id="default-search" @keydown.enter="filter.search = $event.target.value" class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500" placeholder="Cari">
          </div>
        </form>

        <!-- Filter -->
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <button @click="filterOpen = !filterOpen" type="button" class="text-white bg-green-600 border border-green-600 font-medium rounded-full text-sm px-3 py-1">
              Filter
            </button>
            <button @click="toggleCategory('food')" x-bind:class="useFilterCategoryClass('food')" class="rounded-full text-sm px-3 py-1">
              Food
            </button>
            <button @click="toggleCategory('non-food')" x-bind:class="useFilterCategoryClass('non-food')" class="rounded-full text-sm px-3 py-1">
              Non-Food
            </button>
          </div>

          <div class="flex gap-2">
            <iconify-icon class="text-xl text-green-600" icon="clarity:users-outline-badged" inline></iconify-icon>
            <span class="text-sm">
              <template x-if="neighbor_count >= 0">
                <b x-text="neighbor_count">0</b>
              </template>
              orang
            </span>
          </div>
        </div>

        <!-- Product Lists -->
        <div class="flex flex-col gap-2 divide-y">
          <template x-if="!isLoading">
            <template x-for="item in items">
              ${createProduct()}
            </template>
          </template>

          <template x-if="isLoading">
            ${listsSkeletonLoading()}
          </template>
        </div> 

        <!-- Empty Product Lists -->
        <template x-if="!isLoading && items.length === 0">
          <div class="flex gap-4 items-center">
            <img src="images/donation.webp" class="w-1/3" alt="Donation">

            <div class="flex flex-col items-start w-3/4">
              <p class="text-sm text-gray-700">Belum ada makanan atau barang tidak terpakai yang dibagikan disekitar anda saat ini. Jadilah yang pertama!</p>
              <br>
              <a href="/#/product" class="text-sm text-gray-800 bg-gray-100 hover:bg-gray-800 hover:text-gray-50 rounded-md px-4 py-2">
                Tambahkan Sekarang
                <iconify-icon class="text-lg" icon="material-symbols:arrow-right-alt" inline></iconify-icon>
              </a>
            </div>
          </div>
        </template>

        <div class="sheet-modal bg-white border-t p-4 border-t-gray-200 " x-bind:class="{'active': filterOpen}">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-green-500">Filter</h4>

            <button @click="filterOpen = false">
              <iconify-icon icon="ri:close-line" inline></iconify-icon>
            </button>
          </div>

          <div class="flex flex-col gap-2 divide-y">
              <div class="pt-2 flex items-center justify-between">
                <h4 class="font-bold">Jarak</h4>
                <div class="flex gap-2">
                  <button 
                    @click="toggleFilter('distance', 'asc')"
                    x-bind:class="useFilterClass('distance', 'asc')" 
                    class="bottom-2.5 focus:outline-none font-medium rounded-lg text-sm px-3 pt-2 pb-1"
                  >
                    <iconify-icon icon="ri:sort-asc" inline></iconify-icon>
                  </button>
                  <button 
                    @click="toggleFilter('distance', 'desc')"
                    x-bind:class="useFilterClass('distance', 'desc')" 
                    class="bottom-2.5 focus:outline-none font-medium rounded-lg text-sm px-3 pt-2 pb-1"
                  >
                    <iconify-icon icon="ri:sort-desc" inline></iconify-icon>
                  </button>
                </div>
              </div>
              <div class="pt-2 flex items-center justify-between">
                <h4 class="font-bold">View</h4>
                <div class="flex gap-2">
                  <button 
                    @click="toggleFilter('view', 'asc')"
                    x-bind:class="useFilterClass('view', 'asc')" 
                    class="bottom-2.5 focus:outline-none font-medium rounded-lg text-sm px-3 pt-2 pb-1"
                  >
                    <iconify-icon icon="ri:sort-asc" inline></iconify-icon>
                  </button>
                  <button 
                    @click="toggleFilter('view', 'desc')"
                    x-bind:class="useFilterClass('view', 'desc')" 
                    class="bottom-2.5 focus:outline-none font-medium rounded-lg text-sm px-3 pt-2 pb-1"
                  >
                    <iconify-icon icon="ri:sort-desc" inline></iconify-icon>
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    const user = service.user.me();

    alpine.data('productLists', () => ({
      items: [],
      itemsAll: [],
      isLoading: true,
      filterOpen: false,
      filter: {
        search: '',
        filters: [],
        category: null,
      },
      permission: {
        location: false,
      },
      neighbor_count: 0,
      async init() {
        await this.permissionCheck();
        await this.fetchProducts();

        this.$watch('filter', () => {
          this.fetchProducts().catch(console.error);
        });

        this.getNeighborCount().catch();
      },
      async getNeighborCount() {
        const { data: count, error } = await service.user.getNeighborCount();

        if (error) {
          this.neighbor_count = 0;
        } else {
          this.neighbor_count = count;
        }
      },
      async permissionCheck() {
        if (!navigator.geolocation) {
          toastHelpers.error('Whopss, fitur GeoLocation tidak bisa digunakan di browser ini.');
          return;
        }

        navigator.geolocation.getCurrentPosition(async () => {
          this.permission.location = true;

          if (!user.location) {
            await service.auth.updateWithCurrentLocation();
            toastHelpers.success('Lokasi anda berhasil diperbarui');
          }
        }, (error) => {
          if (error.message.includes('denied')) {
            this.permission.location = false;
            service.permission.set('geolocation', false);

            toastHelpers.error('Whopss, kami membutuhkan izin geolocation untuk mengetahui lokasi anda saat ini.');
          }
        });
      },
      async fetchProducts() {
        this.isLoading = true;
        const filter = {
          search: this.filter.search,
          category: this.filter.category,
          sort: (this.filter.filters.length > 0) ? {
            column: this.filter.filters[0],
            type: this.filter.filters[1],
          } : null,
        };

        const { data: products } = await service.lists.near(200, filter);
        await delay(500);

        this.items = products;
        this.isLoading = false;
      },
      image(item) {
        const { data: { publicUrl } } = service.helpers.usePublicUrl(item);
        return publicUrl;
      },
      toggleFilter(column, type) {
        this.filter.filters = [column, type];
      },
      toggleCategory(type) {
        if (this.filter.category !== type) {
          this.filter.category = type;
        } else {
          this.filter.category = null;
        }
        console.log(this.filter.category);
      },
      isFilterActive(column, type) {
        if (this.filter.filters.length === 0) return false;

        return (this.filter.filters[0] === column && this.filter.filters[1] === type);
      },
      useFilterClass(column, type) {
        return {
          'text-white bg-green-500': this.isFilterActive(column, type),
          'text-green-700 bg-green-50 ring-1 ring-green-500': !this.isFilterActive(column, type),
        };
      },
      useFilterCategoryClass(type) {
        return {
          'text-white bg-green-600': (this.filter.category === type),
          'text-green-700 bg-green-50 ring-1 ring-green-500': (this.filter.category !== type),
        };
      },
    }));
  }
}

export default new HomeView();
