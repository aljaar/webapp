export const createHomeHeader = () => String.raw`
  <div class="flex items-center gap-4">
    <a href="" class="header-logo">
      <img src="leaf-white-small.webp" class="w-9 ml-4 rounded-full alt="">
    </a>
    <h1 class="text-xl font-semibold text-white">Aljaar</h1>  
  </div>
`;

export const createPageHeader = ({ title, menu, withBack = true }) => String.raw`
  <div x-data="{}" class="flex items-center gap-4">
    <button x-show="${withBack}" @click="() => history.back()" class="header-logo">
      <iconify-icon class="text-xl" icon="ri:arrow-left-line" inline></iconify-icon>
    </button>
    <h1 class="text-xl font-semibold">${title}</h1>  
  </div>
  ${(menu) ? String.raw`
  <div class="flex gap-4 mr-4" x-data="navbarMenu">
    ${menu.join('')}
  </div>
  ` : ''}
`;

export const createProduct = () => String.raw`
  <div class="flex items-center pt-2 pb-1 gap-4">
    <div class="relative">
      <img class="lazypreload lazyload w-32 h-24 object-cover rounded bg-green-50 border border-green-600" src="images/loading.gif" x-bind:data-src="image(item.image)" x-bind:alt="item.title">
    
      <template x-if="item.qty === 0">
        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/40 flex items-center justify-center">
          <span class="text-white">Kosong</span>
        </div>
      </template>

      <template x-if="isExpired(item)">
        <div class="absolute top-0 left-0 w-32 h-24 rounded bg-black/60 flex items-center justify-center">
          <span class="text-white">Expired</span>
        </div>
      </template>
    </div>
    <div class="h-24 flex flex-col flex-1 justify-between">
      <a x-bind:href="'/#/product/' + item.product_id">
        <h3 x-text="item.title" class="font-semibold"></h3>
      </a>
      <div class="flex gap-2 text-xs items-center">
        <img x-bind:data-src="item.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload rounded-full w-4" alt="">
        <span class="font-medium w-[200px] truncate" x-text="item.profile.full_name"></span>
      </div>
      <div class="flex gap-2 text-gray-700">
        <div class="flex gap-2 text-xs items-center">
          <iconify-icon icon="ri:map-pin-2-line"></iconify-icon>
          <span title="Jarak" x-text="(item.distance).toFixed(2) + 'm'"></span>
        </div>
        <span>·</span>
        <div class="flex gap-2 text-xs items-center">
          <iconify-icon icon="ri:eye-line"></iconify-icon>
          <span title="View" x-text="item.view">0</span>
        </div>
        <span>·</span>
        <div class="flex gap-2 text-xs items-center">
          <iconify-icon icon="fluent-mdl2:quantity"></iconify-icon>
          <span title="QTY" x-text="item.qty">0</span>
        </div>
      </div>
    </div>
    <a x-bind:href="'/#/product/' + item.product_id" class="sm:flex items-center justify-center rounded-full hover:bg-gray-100 w-12 h-12 hidden">
      <iconify-icon icon="heroicons-outline:arrow-right" inline></iconify-icon>
    </a>
  </div>
`;

export const createLoadingOverlay = () => String.raw`
  <div id="overlay-loading" class="bg-black/50 fixed top-0 left-0 z-10 w-full h-full">
    <div class="left-1/2 top-1/2 absolute overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md text-center" style="padding: 20px; max-width: 480px;">
      <iconify-icon class="text-2xl m-auto" icon="eos-icons:loading"></iconify-icon>
      <p class="mt-2 text-sm">Mohon tunggu...</p>
    </div>
  </div>
`;

export const listsSkeletonLoading = () => String.raw`
  <div role="status" class="p-4 space-y-4 max-w-md rounded border border-gray-200 divide-y divide-gray-200 shadow animate-pulse">
    <div class="flex justify-between items-center">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex justify-between items-center pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex justify-between items-center pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex justify-between items-center pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <div class="flex justify-between items-center pt-4">
      <div>
        <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full"></div>
      </div>
      <div class="h-2.5 bg-gray-300 rounded-full w-12"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
`;

export const createEmptyListTemplate = () => String.raw`
  <div class="w-full">
    <div class="flex flex-col items-center space-y-3 mx-auto text-center">
      <img src="images/empty.webp" class="w-64" alt="Empty Lists">
      <p>Whops, sepertinya belum ada data yang bisa ditampilkan.</p>
      <button @click="loadTransactions" class="text-sm py-2 px-4 rounded-md bg-pink-50 text-pink-600 border border-pink-600">Muat Ulang</button>
    </div>
  </div>
`;
export const createEmptyResultTemplate = (error = '') => String.raw`
  <div class="w-full">
    <div class="flex flex-col items-center space-y-3 mx-auto text-center">
      <img src="images/empty.webp" class="w-64" alt="Empty Lists">
      <p>Whops, data gagal dimuat.</p>
      ${(error) ? `<b>Kode : ${error}</b>` : ''}
    </div>
  </div>
`;
