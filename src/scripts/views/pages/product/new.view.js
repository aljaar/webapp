import Choices from 'choices.js';
import { FileUploadWithPreview } from 'file-upload-with-preview/dist/file-upload-with-preview.esm';
import Mapbox from 'mapbox-gl';
import config from '../../../config/app.config';
import { service } from '../../../sdk';
import toastHelpers from '../../../utils/toast.helpers';
import { createPageHeader } from '../../templates/creator.template';

class NewProductView {
  renderHeader() {
    return createPageHeader({
      title: 'Item Baru',
      menu: [
        String.raw`
          <button id="saveItem" class="cursor-pointer font-medium px-3 py-1 rounded-md bg-pink-50 border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white">
            <iconify-icon icon="mdi:content-save" inline></iconify-icon>
            Simpan
          </button>
        `,
      ],
    });
  }

  async render() {
    return String.raw`
      <div id="create-product" x-data="createProduct" class="p-4 flex flex-col gap-3">
        <template x-if="error">
          <div class="p-3 rounded-md bg-pink-50 border border-pink-600 text-pink-600">
            <p x-text="error"></p>
          </div>
        </template>

        <div>
          <label for="title" class="form-control-label">Title</label>
          <input type="text" id="title" name="title" class="form-control" x-model="data.title">
        </div>
        <div>
          <label for="description" class="form-control-label">Description</label>
          <textarea id="description" name="description" class="form-control" x-model="data.description"></textarea>
        </div>
        <div class="category mb-2">
          <form action="">
            <label class="form-control-label">Kategori</label>
            <div class="flex gap-5">
              <label for="food">
                <input id="category-food" type="radio" name="category" value="food" x-model="data.category">
                <label for="category-food">Food</label>
              </label>
              <label for="non-food">
                <input id="category-non-food" type="radio" name="category" value="non-food" x-model="data.category">
                <label for="category-non-food">Non Food</label>
              </label>
            </div>
          </form>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <template x-if="data.category === 'food'">
            <div>
              <h2 class="form-control-label">Expired Date</h2>
              <input type="date" name="expired_at" class="form-control" x-model="data.expired_at">
            </div>
          </template>
          <template x-if="data.category === 'non-food'">
            <div>
              <h2 class="form-control-label">Used Since</h2>
              <input type="text" name="used_since" class="form-control" placeholder="Berapa lama barang dipakai atau kapan belinya" x-model="data.used_since">
            </div>
          </template>
  
          <div>
            <label for="qty" class="form-control-label">Qty</label>
            <input type="number" id="qty" name="qty" class="form-control" placeholder="Jumlah yang tersedia" x-model="data.qty">
          </div>
        </div>
        <div>
          <label for="tags" class="form-control-label">Tag</label>
          <select id="tags" class="form-control" name="tags" multiple></select>
        </div>
        <div>
          <div class="flex items-end justify-between">
            <label class="form-control-label" style="margin-bottom:0;">Waktu Ambil</label>
            <button @click="data.drop_time.push('')" class="add rounded-md border bg-pink-50 text-pink-600 border-pink-600 py-1 px-3 text-sm">
              Add
            </button>
          </div>

          <div class="flex flex-col space-y-2">
            <template x-for="(time, index) in data.drop_time">
              <div class="relative">
                <input type="text" class="form-control pr-8" placeholder="08:00-10:00" x-model="data.drop_time[index]">

                <button x-show="data.drop_time.length > 1" class="absolute right-3 top-2 text-red-500" @click="data.drop_time.splice(index, 1)">
                  <iconify-icon icon="mdi:trash-can-outline" inline></iconify-icon>
                </button>
              </div>
            </template>
          </div>
        </div>

        <div class="custom-file-container" data-upload-id="productImages">
        </div>
        <div>
          <label for="" class="form-control-label">Titik Lokasi Penjemputan</label>
          <p class="text-gray-600 mb-2 text-sm">Pastikan menandai lokasi penjemputan dengan akurat sesuai titik yang dimaksud.</p>
          <div id="map" class="w-full h-64"></div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    Mapbox.accessToken = config.mapbox.token;
    const user = service.user.me();
    const tagsElement = document.querySelector('#tags');

    const upload = new FileUploadWithPreview('productImages', {
      maxFileCount: 5,
      multiple: true,
      text: {
        browse: 'Choose',
        chooseFile: 'Take your pick...',
        label: 'Choose Files to Upload',
      },
      accept: '.jpg,.jpeg,.png,.gif',
    });

    window.upload = upload;

    alpine.data('createProduct', () => ({
      map: null,
      error: null,
      data: {
        title: '',
        description: '',
        category: 'food',
        drop_time: [],
      },
      async init() {
        await this.initializeTags();
        this.initializeMaps();

        this.data.drop_time.push('');

        const submit = document.querySelector('#saveItem');
        submit.addEventListener('click', () => {
          this.saveItem();
        });
      },
      async initializeTags() {
        const { data: tags } = await service.tags.all();

        const optionElements = tags.map((tag) => new Option(tag.name, tag.id));
        optionElements.forEach((option) => tagsElement.appendChild(option));

        this.choices = new Choices('#tags', {
          removeItemButton: true,
          classNames: {
            containerInner: 'choices__inner form-control',
          },
        });
      },
      initializeMaps() {
        this.map = new Mapbox.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [user.location.lon, user.location.lat],
          zoom: 18,
          cooperativeGestures: true,
        });

        this.data.drop_point = [user.location.lat, user.location.lon];

        this.map.addControl(new Mapbox.NavigationControl(), 'top-left');
        this.map.addControl(new Mapbox.FullscreenControl());
        this.map.addControl(
          new Mapbox.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
        );

        const icon = document.createElement('iconify-icon');
        icon.setAttribute('icon', 'mdi:map-marker');
        icon.classList.add('text-5xl', 'text-green-600');

        const marker = new Mapbox.Marker(icon).setLngLat(this.map.getCenter()).addTo(this.map);

        this.map.on('move', () => {
          const center = this.map.getCenter();
          marker.setLngLat(center);
          this.data.drop_point = [center.lat, center.lng];
        });
      },
      async saveItem() {
        const files = upload.cachedFileArray;
        const tags = this.choices.getValue().map((i) => parseInt(i.value, 10));
        const data = JSON.parse(JSON.stringify(this.data));

        const loading = toastHelpers.loading();
        const result = await service.product.create({
          data: {
            ...data,
            qty: parseInt(data.qty, 10),
            tags,
          },
          images: files,
        });

        if (result.error) {
          this.error = result.error.message;
          toastHelpers.error('Whops, ada kesalahan.');
        } else {
          toastHelpers.success('Item berhasil disimpan');

          if (result.data) {
            const [product] = result.data;

            window.location.hash = `#/product/${product.id}`;
          }
        }

        toastHelpers.dismiss(loading);
      },
    }));
  }
}

export default new NewProductView();
