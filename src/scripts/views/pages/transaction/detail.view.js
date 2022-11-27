import { service } from "../../../sdk";
import { format } from "../../../utils/date";
import UrlParser from "../../../utils/url.parser";

class TransactionDetailView {
  async render () {
    return String.raw`
      <div x-data="transaction" class="transaction-detail p-3 md:p-4">
        <template x-if="transaction">
          <div class="transaction-detail--content">
            <div class="flex flex-col justify-center items-center mb-3">
              <h2 class="text-sm font-bold mb-2">Permintaan Barang</h2>
              <span class="capitalize text-sm px-2 py-[2px] rounded-lg" x-bind:class="useStatusClass(transaction.status)" x-text="transaction.status"></span>
            </div>

            <section class="flex gap-3 items-center rounded-lg border border-gray-300">
              <img class="w-[94px] h-[84px] object-cover rounded-l lazyload" x-bind:data-src="transaction.products.product_images" alt="">
              <div class="flex flex-col">
                <h3 class="text-md font-semibold" x-text="transaction.products.title"></h3>
                <span class="text-sm text-gray-800">1 item</span>
              </div>
            </section>

            <div class="flex flex-col gap-2 divide-y my-4">
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
            </div>

            <h3 class="text-sm font-bold text-emerald-700">Detail Timeline</h3>

            <section id="timeline" class="p-3">
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
            </section>
          </div>
        </template>
      </div>
    `
  }

  async afterRender (alpine) {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();

    alpine.data('transaction', () => ({
      transaction: null,
      googleMapsLink: null,
      async init () {
        const { data: tx } = await service.transaction.detail(id);

        this.transaction = tx;
        this.getGoogleMapsLink();
      },
      async getGoogleMapsLink () {
        const location = service.user.me().profile.location;
        const [ start, stop ] = await Promise.all([
          service.helpers.getLocation(location),
          service.helpers.getLocation(this.transaction.products.drop_point),
        ])

        const googleMaps = service.helpers.googleMaps({
          start: [ start.lat, start.lon ], 
          stop: [ stop.lat, stop.lon ]
        });
        
        this.googleMapsLink = googleMaps.link;
      },
      useStatusClass (status) {
        return {
          'bg-yellow-100 text-yellow-600': (status === 'waiting'),
          'bg-blue-100 text-blue-600': (status === 'approved'),
          'bg-red-100 text-red-600': (status === 'rejected'),
          'bg-emerald-100 text-green-600': (status === 'success')
        }
      },
      useLogStatusText (status) {
        switch (status) {
          case 'waiting':
            return 'Menunggu konfirmasi pemilik barang informasi lokasi penjemputan akan di informasikan setelah ini.';
          case 'approved':
            return 'Permintaan barang telah disetujui oleh pemilik. Silahkan ambil sesuai dengan lokasi dan waktu yang sudah kami informasikan.';
          case 'rejected':
            return 'Permintaan barang ditolak oleh pemilik.';
          case 'success':
            return 'Permintaan barang berhasil. Selesai.';
          default:
            break;
        }
      },
      formatDate (date) {
        return format(date);
      }
    }));
  }
}

export default new TransactionDetailView();
