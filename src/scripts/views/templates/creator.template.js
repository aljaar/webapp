export const createHomeHeader = () => String.raw`
  <div class="flex items-center gap-4">
    <a href="" class="header-logo">
      <img src="leaf-white.png" class="w-9 ml-4 rounded-full alt="">
    </a>
    <h1 class="text-xl font-semibold text-white">Aljaar</h1>  
  </div>
`;

export const createPageHeader = ({ title }) => String.raw`
  <div x-data="{}" class="flex items-center gap-4">
    <button @click="() => history.back()" class="header-logo">
      <iconify-icon class="text-xl" icon="ri:arrow-left-line" inline></iconify-icon>
    </button>
    <h1 class="text-xl font-semibold">${title}</h1>  
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
