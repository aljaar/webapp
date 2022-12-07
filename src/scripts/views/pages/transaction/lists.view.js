import { service } from '../../../sdk';
import { delay } from '../../../utils/helpers';
import { createEmptyListTemplate, createPageHeader, listsSkeletonLoading } from '../../templates/creator.template';

class TransactionListsView {
  renderHeader() {
    return createPageHeader({
      title: 'Daftar Permintaan',
    });
  }

  async render() {
    return String.raw`
      <div x-data="transactionLists" class="transactions">
        <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          <ul class="flex -mb-px">
            <li class="flex-1">
              <a href="#" class="w-full inline-block p-4 rounded-t-lg border-b-2" @click.prevent="tab = 'request'" x-bind:class="{'text-green-700 border-green-600': (tab === 'request'), 'border-transparent': (tab !== 'request')}">
                Permintaan
                <template x-if="transaction.request_count > 0">
                  <span class="text-sm px-1 rounded-full bg-green-600 text-white" x-text="transaction.request_count"></span>
                </template>
              </a>
            </li>
            <li class="flex-1">
              <a href="#" class="w-full inline-block p-4 rounded-t-lg border-b-2" @click.prevent="tab = 'history'" x-bind:class="{'text-green-700 border-green-600': (tab === 'history'), 'border-transparent': (tab !== 'history')}">Riwayat</a>
            </li>
          </ul>
        </div>

        <template x-if="isLoading">
          <div class="p-3">
            ${listsSkeletonLoading()}
          </div>
        </template>

        <div x-show="tab === 'request'" x-transition class="p-3 flex flex-col gap-3">
          <template x-if="!isLoading">
            <div class="flex flex-col space-y-2">
              <template x-if="transaction.request.length > 0">
                <div class="text-sm rounded-md p-2 bg-pink-50 border border-pink-600 text-pink-600">
                  <p>Beberapa daftar permintaan yang perlu anda response untuk di setujui atau tidak.</p>
                </div>
              </template>
              <template x-for="transaction in transaction.request" :key="transaction.id">
              <a x-bind:href="'/#/request/' + transaction.id" class="p-2 rounded-md shadow-mdl">
                  <div class="flex pb-1 items-center justify-between border-b border-b-gray-200">
                    <div class="flex items-center space-x-2">
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
                  <div class="flex gap-3 items-center pt-2">
                    <img class="w-[64px] h-[54px] object-cover rounded-md border border-green-600 lazyload lazypreload" x-bind:data-src="transaction.products.product_images" src="images/loading.gif" x-bind:alt="transaction.products.title">
                    <div class="flex flex-col">
                      <h3 class="text-md font-semibold" x-text="transaction.products.title"></h3>
                      <span class="text-sm text-gray-800">1 item</span>
                    </div>
                  </div>
                </a>
              </template>
            </div>
          </template>

          <template x-if="!isLoading && transaction.request.length === 0">
            ${createEmptyListTemplate()}
          </template>
        </div>
        <div x-show="tab === 'history'" x-transition class="p-3 flex flex-col gap-3">
          <template x-if="!isLoading">
            <template x-for="transaction in transaction.history" :key="transaction.id">
              <a x-bind:href="'/#/transactions/' + transaction.id" class="p-2 rounded-md shadow-mdl">
                <div class="flex pb-1 items-center justify-between border-b border-b-gray-200">
                  <div class="flex items-center space-x-2">
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
                <div class="flex gap-3 items-center pt-2">
                  <img class="w-[64px] h-[54px] object-cover rounded-md border border-green-600 lazyload lazypreload" x-bind:data-src="transaction.products.product_images" src="images/loading.gif" x-bind:alt="transaction.products.title">
                  <div class="flex flex-col">
                    <h3 class="text-md font-semibold" x-text="transaction.products.title"></h3>
                    <span class="text-sm text-gray-800">1 item</span>
                  </div>
                </div>
              </a>
            </template>
          </template>

          <template x-if="!isLoading && transaction.history.length === 0">
            ${createEmptyListTemplate()}
          </template>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('transactionLists', () => ({
      tab: 'request',
      transaction: {
        request_count: 0,
        request: [],
        history: [],
      },
      isLoading: true,
      async init() {
        this.loadTransactions().then();

        this.$watch('tab', () => {
          this.loadTransactions().then();
        });
      },
      async loadTransactions() {
        this.isLoading = true;

        if (this.tab === 'request') {
          // TODO: ganti
          const { data: transactions } = await service.transaction.waiting();
          this.transaction.request = transactions;
          this.transaction.request_count = transactions.filter((tx) => tx.status === 'waiting').length;
        } else if (this.tab === 'history') {
          const { data: transactions } = await service.transaction.lists();
          this.transaction.history = transactions;
        }
        await delay(300);

        this.isLoading = false;
      },
      isCategory(tx, category) {
        return (tx.products.category === category);
      },
      useStatusClass(status) {
        return {
          'bg-yellow-100 text-yellow-600': (status === 'waiting'),
          'bg-blue-100 text-blue-600': (status === 'approved'),
          'bg-red-100 text-red-600': (status === 'rejected'),
          'bg-emerald-100 text-green-600': (status === 'success'),
        };
      },
    }));
  }
}

export default new TransactionListsView();
