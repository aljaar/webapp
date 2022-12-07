import { service } from '../../../sdk';
import { format } from '../../../utils/date';
import { delay } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import UrlParser from '../../../utils/url.parser';
import { createEmptyResultTemplate, createPageHeader } from '../../templates/creator.template';

class TransactionDetailView {
  renderHeader() {
    return createPageHeader({
      title: 'Detail Permintaan',
    });
  }

  async render() {
    return String.raw`
      <div x-data="transaction" class="transaction-detail p-3 md:p-4">
        <template x-if="!isLoading && transaction">
          <div class="transaction-detail--content">
            <div class="flex flex-col justify-center items-center mb-3">
              <h2 class="text-base font-semibold mb-2">Permintaan Barang</h2>
              <span class="capitalize text-sm px-2 py-[2px] rounded-lg" x-bind:class="useStatusClass(transaction.status)" x-text="transaction.status"></span>
            </div>

            <section class="flex gap-3 items-center rounded-lg border border-gray-300">
              <img class="w-[94px] h-[84px] object-cover rounded-l-lg border-r border-gray-300 lazyload lazypreload" x-bind:data-src="transaction.products.product_images" src="images/loading.gif" alt="">
              <div class="flex flex-col flex-1">
                <h3 class="text-md font-semibold" x-text="transaction.products.title"></h3>
                <span class="text-sm text-gray-800">1 item</span>
              </div>
              <a x-bind:href="'/#/product/' + transaction.products.id" class="flex items-center justify-center rounded-full hover:bg-gray-100 w-12 h-12">
                <iconify-icon icon="heroicons-outline:arrow-right" inline></iconify-icon>
              </a>
            </section>

            <div class="flex flex-col gap-2 divide-y mt-4">
              <div class="pt-2 flex items-center justify-between text-sm">
                <h4 class="text-emerald-600 font-semibold" x-text="(isRequest) ? 'Requester' : 'Owner'">-</h4>
                <span class="space-x-2">
                  <a x-bind:href="'/#/profile/' + transaction.profile.id" x-text="transaction.profile.full_name"></a>
                  <a href="">
                    <iconify-icon class="text-base text-green-600" icon="ri:whatsapp-line" inline></iconify-icon>
                  </a>
                </span>
              </div>
              <div class="pt-2 flex justify-between text-sm">
                <h4 class="text-emerald-600 font-semibold">Waktu Pengambilan</h4>
                <span x-text="transaction.products.drop_time.join(', ')"></span>
              </div>
              <div class="pt-2 flex justify-between text-sm">
                <h4 class="text-emerald-600 font-semibold">Lokasi Pengambilan</h4>
                <a x-bind:href="googleMapsLink" target="_blank">
                  Google Maps 
                  <iconify-icon icon="logos:google-maps" inline></iconify-icon>
                </a>
              </div>
              <div></div>
            </div>

            <template x-if="!isRequest && transaction.status === 'approved'">
              <div class="flex flex-col py-4">
                <p class="text-center text-sm text-gray-800">Hi <b x-text="full_name"></b>, silahkan berikan rating dan komentar kamu tentang barang atau layanan ini ketika kamu sudah mengambil makanan/ barangnya ya!</p>

                <div
                  class="flex flex-col items-center justify-center space-y-2"
                >
                  <div class="flex space-x-0">
                    <template x-for="(star, index) in ratings" :key="index">
                      <button
                        @click="rate(star.amount)"
                        @mouseover="hoverRating = star.amount"
                        @mouseleave="hoverRating = rating"
                        aria-hidden="true"
                        :title="star.label"
                        class="rounded-sm text-gray-400 fill-current focus:outline-none focus:shadow-outline p-1 w-12 m-0 cursor-pointer"
                      >
                        <!-- <svg class="w-15 transition duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg> -->
                        <iconify-icon 
                          icon="mdi:star" 
                          class="text-3xl transition duration-150 drop-shadow"
                          :class="{'text-gray-600': hoverRating >= star.amount, 'text-yellow-400': rating >= star.amount && hoverRating >= star.amount}"
                        ></iconify-icon>
                      </button>
                    </template>
                  </div>
                  <div class="w-full relative">
                    <textarea x-model="comment" class="form-control" rows="3" placeholder="Komentar (optional)"></textarea>

                    <button @click="submitReview" class="absolute right-2 bottom-2 py-1 px-4 bg-green-600 text-white text-sm rounded-md">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Star and Review -->
            <template x-if="transaction.status === 'success'">
              <div class="flex flex-col items-center justify-center space-y-2 my-4">
                <div class="flex space-x-0">
                  <template x-for="(star, index) in ratings" :key="index">
                    <div
                      aria-hidden="true"
                      :title="star.label"
                      class="rounded-sm text-gray-400 fill-current focus:outline-none focus:shadow-outline p-1 w-12 m-0"
                    >
                      <iconify-icon 
                        icon="mdi:star" 
                        class="text-3xl transition duration-150 drop-shadow"
                        :class="{'text-yellow-400': rating >= star.amount}"
                      ></iconify-icon>
                    </div>
                  </template>
                </div>
                <template x-if="comment">
                  <p class="text-sm text-center text-gray-900" x-text="comment"></p>
                </template>
              </div>
            </template>

            <!-- Timeline -->
            <section id="timeline" class="mb-4">
              <div class="flex items-center justify-between">
                <h4 class="text-emerald-600 font-semibold text-sm">Timeline Status</h4>

                <button @click="timeline = !timeline" class="flex items-center justify-center rounded-full hover:bg-gray-100 w-8 h-8">
                  <iconify-icon class="text-xl" icon="mdi:chevron-down" inline></iconify-icon>
                </button>
              </div>

              <div class="px-3" x-show="timeline" x-transition>
                <ol class="relative text-[12px] border-l border-gray-200">                  
                  <template x-for="(log, index) in transaction.transaction_logs">
                    <li x-bind:class="{'mb-8': !(transaction.transaction_logs.length === (index-1)) }" class="ml-4">
                      <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                        <time class="mb-1 font-normal leading-none text-gray-400" x-text="formatDate(log.created_at)"></time>
                      <h3 class="font-bold my-1 text-black capitalize" x-text="log.status"></h3>
                      <p class="text-gray-600" x-text="useLogStatusText(log.status)"></p>
                    </li>
                  </template>
                </ol>
              </div>
            </section>

            <!-- Response Approve and Reject -->
            <template x-if="isRequest && transaction && transaction.status === 'waiting'">
              <section id="response" class="flex flex-col gap-3">
                <textarea x-model="confirm.rejectedReason" class="w-full form-control" rows="4" placeholder="Jika kamu menolak permintaan ini, pastikan untuk mengisi alasan kamu disini."></textarea>

                <div class="flex gap-3">
                  <button @click="approveThis" class="w-full py-2 text-white bg-green-600 hover:bg-green-700 rounded-md">
                    <span x-ref="approved_button">Approved</span>
                  </button>
                  <button @click="rejectThis" class="w-full py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-md">
                    <span x-ref="rejected_button">Rejected</span>
                  </button>
                </div>
              </section>
            </template>
          </div>
        </template>

        <!-- Loading -->
        <template x-if="isLoading">
          <div role="status" class="w-full animate-pulse">
            <div class="h-2.5 bg-gray-200 rounded-full w-48 mb-2.5 mx-auto"></div>
            <div class="h-2.5 bg-gray-200 rounded-full w-32 mb-8 mx-auto"></div>
            
            <div class="flex gap-4 mb-8">
              <div class="h-20 bg-gray-200 rounded-lg w-20 mb-4"></div>
              <div class="flex flex-col">
                <div class="h-2.5 bg-gray-200 rounded-lg w-36 mb-4"></div>
                <div class="h-2.5 bg-gray-200 rounded-lg w-20 mb-4"></div>
              </div>
            </div>

            <div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full max-w-[330px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full max-w-[300px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full max-w-[360px]"></div>
            <span class="sr-only">Loading...</span>
          </div>
        </template>

        <template x-if="!isLoading && !transaction">
          ${createEmptyResultTemplate()}
        </template>
      </div>
    `;
  }

  async afterRender(alpine) {
    const { id, resource } = UrlParser.parseActiveUrlWithoutCombiner();
    const user = service.user.me();

    alpine.data('transaction', () => ({
      full_name: user.profile.full_name,
      rating: 0,
      hoverRating: 0,
      comment: null,
      ratings: [{ amount: 1, label: 'Terrible' }, { amount: 2, label: 'Bad' }, { amount: 3, label: 'Okay' }, { amount: 4, label: 'Good' }, { amount: 5, label: 'Great' }],
      isRequest: false,
      timeline: false,
      isLoading: true,
      transaction: null,
      googleMapsLink: null,
      confirm: {
        approved: 'init',
        approvedBtn: null,
        approvedTimeout: null,
        rejected: 'init',
        rejectedBtn: null,
        rejectedTimeout: null,
        rejectedReason: null,
      },
      async init() {
        try {
          this.isRequest = (resource === 'request');
          const { data: tx, error } = await service.transaction.detail(id, this.isRequest);
          if (error) throw new Error(error);

          this.transaction = tx;
          this.timeline = !this.isRequest;

          if (this.transaction.status === 'success') {
            this.rating = this.transaction.rating;
            this.comment = this.transaction.comment;
          }

          this.getGoogleMapsLink();
          this.isLoading = false;
        } catch (err) {
          toastHelpers.error('Opps, informasi detail untuk transaksi ini gagal dimuat.');
          this.isLoading = false;
        }
      },
      async getGoogleMapsLink() {
        const { location } = service.user.me().profile;
        const [start, stop] = await Promise.all([
          service.helpers.getLocation(location),
          service.helpers.getLocation(this.transaction.products.drop_point),
        ]);

        const googleMaps = service.helpers.googleMaps({
          start: [start.lat, start.lon],
          stop: [stop.lat, stop.lon],
        });

        this.googleMapsLink = googleMaps.link;
      },
      rate(amount) {
        if (this.rating === amount) {
          this.rating = 0;
        } else this.rating = amount;
      },
      currentLabel() {
        let r = this.rating;
        if (this.hoverRating !== this.rating) r = this.hoverRating;
        const i = this.ratings.findIndex((e) => e.amount === r);
        if (i >= 0) { return this.ratings[i].label; } return '';
      },
      async approveThis() {
        switch (this.confirm.approved) {
          case 'init':
            this.confirm.approved = 'confirm';
            this.$refs.approved_button.innerHTML = String.raw`
              <iconify-icon icon="ri:error-warning-line" inline></iconify-icon>
              Click to confirm
            `;

            this.confirm.approvedTimeout = setTimeout(() => {
              this.confirm.approved = 'init';
              this.$refs.approved_button.innerHTML = 'Approved';
            }, 5000);
            break;
          case 'confirm': {
            if (this.confirm.approvedTimeout) {
              clearTimeout(this.confirm.approvedTimeout);
              this.confirm.approvedTimeout = null;
            }

            this.confirm.approved = 'processed';
            this.$refs.approved_button.innerHTML = String.raw`
              <iconify-icon icon="eos-icons:loading" inline></iconify-icon>
              Mohon tunggu...
            `;

            const { data } = await service.transaction.approve(id);

            if (!data) {
              toastHelpers.error('Whops, gagal menyetujui permintaan ini.');
            } else {
              toastHelpers.success('Permintaan berhasil disetujui.');
            }

            await delay(300);
            window.location = '/#/transactions';
            break;
          }
          default:
            break;
        }
      },
      async rejectThis() {
        switch (this.confirm.rejected) {
          case 'init':
            this.confirm.rejected = 'confirm';
            this.$refs.rejected_button.innerHTML = String.raw`
              <iconify-icon icon="ri:error-warning-line" inline></iconify-icon>
              Click to confirm
            `;

            this.confirm.rejectedTimeout = setTimeout(() => {
              this.confirm.rejected = 'init';
              this.$refs.rejected_button.innerHTML = 'Rejected';
            }, 5000);
            break;
          case 'confirm': {
            if (this.confirm.rejectedTimeout) {
              clearTimeout(this.confirm.rejectedTimeout);
              this.confirm.rejectedTimeout = null;
            }

            this.confirm.rejected = 'processed';
            this.$refs.rejected_button.innerHTML = String.raw`
              <iconify-icon icon="eos-icons:loading" inline></iconify-icon>
              Mohon tunggu...
            `;

            const { data } = await service.transaction.reject(id, this.confirm.rejectedReason);

            if (!data) {
              toastHelpers.error('Whops, gagal menolak permintaan ini.');
            } else {
              toastHelpers.success('Permintaan berhasil ditolak.');
            }

            await delay(300);
            window.location = '/#/transactions';
            break;
          }
          default:
            break;
        }
      },
      async submitReview() {
        if (this.rating <= 0 && this.rating > 5) {
          toastHelpers.error('Whopss, kamu belum memasukan bintang.');
        }
        const loading = toastHelpers.loading();
        const { data } = await service.transaction.review(id, {
          rating: this.rating,
          comment: this.comment,
        });

        toastHelpers.dismiss(loading);
        console.log(data);
      },
      useStatusClass(status) {
        return {
          'bg-yellow-100 text-yellow-600': (status === 'waiting'),
          'bg-blue-100 text-blue-600': (status === 'approved'),
          'bg-red-100 text-red-600': (status === 'rejected'),
          'bg-emerald-100 text-green-600': (status === 'success'),
        };
      },
      useLogStatusText(status) {
        switch (status) {
          case 'waiting':
            return 'Menunggu konfirmasi pemilik barang informasi lokasi penjemputan akan di informasikan setelah ini.';
          case 'approved':
            return 'Permintaan barang telah disetujui oleh pemilik. Silahkan ambil sesuai dengan lokasi dan waktu yang sudah kami informasikan.';
          case 'rejected': {
            let text = 'Permintaan barang ditolak oleh pemilik.';

            if (this.transaction.reason) {
              text += ` Dengan alasan "${this.transaction.reason}".`;
            }

            return text;
          }
          case 'success':
            return 'Permintaan barang berhasil. Selesai.';
          default:
            return '-';
        }
      },
      formatDate(date) {
        return format(date);
      },
    }));
  }
}

export default new TransactionDetailView();
