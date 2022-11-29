export const createHomeHeader = () => String.raw`
  <a href="" class="header-logo">
    <iconify-icon class="p-2 bg-white text-emerald-600 rounded-full text-xl" icon="mdi:home-group"></iconify-icon>
  </a>
`;

export const createPageHeader = ({ title }) => String.raw`
  <div x-data="{}" class="flex items-center gap-4">
    <button @click="() => history.back()" class="header-logo">
      <iconify-icon class="text-xl" icon="ri:arrow-left-line" inline></iconify-icon>
    </button>
    <h1 class="text-xl font-semibold">${title}</h1>  
  </div>
`;

