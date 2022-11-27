import { service } from "../../sdk";

const HomeView = {
  async render() {
    return String.raw`
      <button id="login" class="hidden">Login</button>

      <div x-data="products" class="flex flex-col px-4 pt-4 gap-3">
        <!-- Search -->
        <form>   
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <iconify-icon icon="heroicons-solid:search" class="text-gray-500"></iconify-icon>
            </div>
            <input type="search" id="default-search" class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Cari" required>
          </div>
        </form>

        <!-- Filter -->
        <div class="flex gap-2">
          <button @click="filter.open = !filter.open" type="button" class="text-white bottom-2.5 bg-emerald-500 hover:bg-emerald-800 focus:ring-2 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-3 pt-2 pb-1">
            <iconify-icon icon="ri:filter-3-fill"></iconify-icon>
          </button>
          <button @click="toggleCategory('food')" x-bind:class="useFilterCategoryClass('food')" class="rounded-lg text-sm px-3 py-2">
            Food
          </button>
          <button @click="toggleCategory('non-food')" x-bind:class="useFilterCategoryClass('non-food')" class="rounded-lg text-sm px-3 py-2">
            Non-Food
          </button>
        </div>

        <!-- Product Lists -->
        <div class="flex flex-col gap-2 divide-y">
          <template x-for="item in items">
            <div class="flex pt-2 pb-1 gap-4">
              <div class="">
                <img class="lazyload w-32 h-24 object-cover rounded" x-bind:data-src="image(item.image)" x-bind:alt="item.title">
              </div>
              <div class="flex flex-col gap-2">
                <a x-bind:href="'/#/product/' + item.product_id">
                  <h3 x-text="item.title" class="font-bold"></h3>
                </a>
                <div class="flex gap-2 text-xs items-center">
                  <img x-bind:data-src="item.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload rounded-full w-4" alt="">
                  <span x-text="item.profile.full_name"></span>
                </div>
                <div class="flex gap-4">
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:map-pin-2-line"></iconify-icon>
                    <span x-text="(item.distance * 100).toFixed(2) + 'm'"></span>
                  </div>
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:eye-line"></iconify-icon>
                    <span>99</span>
                  </div>
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:hand-heart-line"></iconify-icon>
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="sheet-modal bg-white border-t p-4 border-t-gray-200 " x-bind:class="{'active': filter.open}">
          <h4 class="text-emerald-500 mb-3">Filter</h4>

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
  },
  async afterRender() {
    const button = document.getElementById('login');

    button.addEventListener('click', () => {
      service.auth.signInWith({
        type: 'email',
        credential: {
          email: 'nyanhashmail@gmail.com',
          password: 'testpassword'
        }
      }).then(console.log)
    })
  }
}

export default HomeView;
