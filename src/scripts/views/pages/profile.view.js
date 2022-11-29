import { createPageHeader } from '../templates/creator.template';

class ProfileView {
  renderHeader() {
    return createPageHeader({
      title: 'Profile',
    });
  }

  async render() {
    return String.raw`
      <div class="profile">
        <!-- Header End -->
        <div class="p-4">
          <div class="flex flex-row mx-auto mb-6">
            <div>
              <img src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/avatars/public/avatar.default.webp" alt="aljaar" class="rounded-full w-24">
            </div>
            <div class="flex flex-col gap-2 self-center ml-4">
              <h1 class="capitalize text-xl text-gray-900 font-semibold">Shohibul Aljaar</h1>
              <p class="text-gray-700 text-sm">Sudah <b>18</b> orang terbantu.</p>
            </div>
          </div>

          <div class="mb-6">
            <label for="about" class="form-control-label">About</label>
            <p class="leading-6 text-sm text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic laboriosam libero suscipit vitae optio voluptatem sequi perspiciatis quod id, explicabo doloribus iure, et laborum, praesentium impedit aperiam! Nihil, laudantium alias.</p>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between mb-3">
              <label for="phone" class="text-base text-emerald-600">Email</label>
              <span>shohibulaljaar@admin.id</span>
            </div>

            <div class="flex justify-between mb-3">
              <label for="phone" class="text-base text-emerald-600">Phone</label>
              <span>+62857565665656</span>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="basis-1/2">
              <div class="bg-white rounded-md border border-gray-300 p-3 text-center">
                <h1 class="text-2xl font-semibold text-gray-900">12</h1>
                <span class="text-sm text-gray-700">30 hari terakhir</span>
              </div>
            </div>
            <div class="basis-1/2">
              <div class="bg-white rounded-md border border-gray-300 p-3 text-center">
                <h1 class="text-2xl font-semibold text-gray-900">12</h1>
                <span class="text-sm text-gray-700">30 hari terakhir</span>
              </div>
            </div>

          </div>
          <div x-data="{tab: 'food'}">
            <h2 class="form-control-label">Daftar Item</h2>

            <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
              <ul class="flex flex-wrap -mb-px">
                <li class="mr-2">
                  <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-transparent" @click.prevent="tab = 'food'" x-bind:class="{'text-green-700 border-green-600': (tab === 'food')}">Food</a>

                </li>
                <li class="mr-2">
                  <a href="#" class="inline-block p-4 rounded-t-lg border-b-2 border-transparent" @click.prevent="tab = 'non-food'" x-bind:class="{'text-green-700 border-green-600': (tab === 'non-food')}">Non Food</a>
                </li>
              </ul>
            </div>

            <div x-show="tab === 'food'">
              <div class="flex flex-col gap-2 divide-y">
                <div class="flex pt-2 pb-1 gap-4">
                  <div class="">
                    <img class="w-32 h-24 object-cover rounded lazyloaded" x-bind:data-src="image(item.image)" x-bind:alt="item.title" data-src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/products/09a93ad3-1313-4198-a0dd-3082a68f9fd8/e2a27baa-9377-43e4-ab34-de29dc25c0ec.png" alt="Small Fresh Cheese" src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/products/09a93ad3-1313-4198-a0dd-3082a68f9fd8/e2a27baa-9377-43e4-ab34-de29dc25c0ec.png">
                  </div>
                  <div class="flex flex-col gap-2">
                    <a href="/#/product/14">
                      <h3 class="font-bold">Small Fresh Cheese</h3>
                    </a>
                    <div class="flex gap-2 text-xs items-center">
                      <img referrerpolicy="no-referrer" class="rounded-full w-4 lazyloaded" alt="" data-src="https://lh3.googleusercontent.com/a/ALm5wu3jNDyOO1klRc5hvaS1ol48tRiiumEFhW9zZBwrvjk=s96-c" src="https://lh3.googleusercontent.com/a/ALm5wu3jNDyOO1klRc5hvaS1ol48tRiiumEFhW9zZBwrvjk=s96-c">
                      <span>Ryan Aunur Rassyid</span>
                    </div>
                    <div class="flex gap-4">
                      <div class="flex gap-2 text-xs items-center">
                        <iconify-icon icon="ri:map-pin-2-line"></iconify-icon>
                        <span>0.12m</span>
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
              </div>
            </div>
            <div x-show="tab === 'non-food'">
              Non Food
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {

  }
}

export default new ProfileView();
