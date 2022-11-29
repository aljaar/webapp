import { createPageHeader, listsSkeletonLoading } from '../../templates/creator.template';

class TransactionListsView {
  renderHeader() {
    return createPageHeader({
      title: 'Daftar Permintaan',
    });
  }

  async render() {
    return String.raw`
      <div x-data="transactions" class="transactions">
        <div class="p-3 flex flex-col gap-3">
          <template x-for="transaction in transactions" :key="transaction.id">
            <a x-bind:href="'/#/transactions/' + transaction.id" class="p-3 rounded-md shadow-mdl">
              <div class="flex pb-3 items-center justify-between border-b border-b-gray-200">
                <div class="flex items-center gap-3">
                  <template x-if="isCategory(transaction, 'food')">
                    <iconify-icon icon="mdi:food-turkey" class="text-xl text-emerald-700" inline></iconify-icon>
                  </template>
                  <template x-if="isCategory(transaction, 'non-food')">
                    <iconify-icon icon="ri:shopping-bag-3-line" class="text-xl text-emerald-700" inline></iconify-icon>
                  </template>
                  <div class="flex flex-col">
                    <span class="text-[12px] font-bold capitalize" x-text="transaction.products.category === 'food' ? 'Food' : 'Non Food'"></span>
                    <span class="text-[11px] text-gray-800">11 Oktober 2022</span>
                  </div>
                </div>

                <div class="status text-[12px] py-1 px-2 rounded-lg capitalize" x-bind:class="useStatusClass(transaction.status)" x-text="transaction.status"></div>
              </div>
              <div class="flex gap-3 items-center py-3">
                <img class="w-[54px] h-[54px] object-cover rounded-md lazyload" x-bind:data-src="transaction.products.product_images" alt="">
                <div class="flex flex-col">
                  <h3 class="text-md font-semibold" x-text="transaction.products.title"></h3>
                  <span class="text-sm text-gray-800">1 item</span>
                </div>
              </div>
              <!-- <div class="flex justify-end">
                <button class="text-[14px] py-2 px-6 rounded-lg bg-green-600 text-white">Detail</button>
              </div> -->
            </a>
          </template>

          <template x-if="isLoading">
            ${listsSkeletonLoading()}
          </template>
        </div>
      </div>
    `;
  }

  async afterRender() {

  }
}

export default new TransactionListsView();
