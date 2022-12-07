import Choices from 'choices.js';
import { service } from '../../../sdk';
import { compareArrays, compareObjects, delay } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import UrlParser from '../../../utils/url.parser';
import { createPageHeader } from '../../templates/creator.template';

class EditProductView {
  renderHeader() {
    return createPageHeader({
      title: 'Edit Item',
      menu: [
        String.raw`
          <button id="saveItem" class="cursor-pointer font-medium px-3 py-1 rounded-md bg-pink-50 border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white">
            <iconify-icon icon="mdi:content-save" inline></iconify-icon>
            Simpan Perubahan
          </button>
        `,
      ],
    });
  }

  async render() {
    return String.raw`
      <div id="product-edit" x-data="editProduct" class="p-4 flex flex-col gap-3">
        <template x-if="error">
          <div class="p-3 rounded-md bg-pink-50 border border-pink-600 text-pink-600">
            <p x-text="error"></p>
          </div>
        </template>

        <div>
          <label for="title" class="form-control-label">Title</label>
          <input type="text" id="title" class="form-control" x-model="data.title">
        </div>
        <div>
          <label for="description" class="form-control-label">Description</label>
          <textarea id="description" class="form-control" x-model="data.description"></textarea>
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
              <input type="date" class="form-control" x-model="data.expired_at">
            </div>
          </template>
          <template x-if="data.category === 'non-food'">
            <div>
              <h2 class="form-control-label">Used Since</h2>
              <input type="text" class="form-control" placeholder="Berapa lama barang dipakai atau kapan belinya" x-model="data.used_since">
            </div>
          </template>
  
          <div>
            <label for="qty" class="form-control-label">Qty</label>
            <input type="number" id="qty" class="form-control" placeholder="Jumlah yang tersedia" x-model="data.qty">
          </div>
        </div>
        <div>
          <label for="tags" class="form-control-label">Tag</label>
          <select id="tags" class="form-control" multiple></select>
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
      </div>
    `;
  }

  async afterRender(alpine) {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();
    const tagsElement = document.querySelector('#tags');

    alpine.data('editProduct', () => ({
      error: null,
      data: {
        title: '',
        description: '',
        category: 'food',
        drop_time: [],
      },
      product: null,
      async init() {
        await this.initializeProduct();
        await this.initializeTags();

        const submit = document.querySelector('#saveItem');
        submit.addEventListener('click', () => {
          this.saveItem();
        });
      },
      async initializeProduct() {
        const product = await service.product.detail(id);

        this.data.title = product.title;
        this.data.description = product.description;
        this.data.category = product.category;
        this.data.qty = product.qty;
        this.data.drop_time = product.drop_time;

        if (this.data.category === 'food') {
          this.data.expired_at = product.expired_at;
        } else if (this.data.category === 'non-food') {
          this.data.used_since = product.used_since;
        }

        this.product = JSON.parse(JSON.stringify(product));
      },
      async initializeTags() {
        const { data: tags } = await service.tags.all();

        // const optionElements = tags.map((tag) => new Option(tag.name, tag.id));
        // optionElements.forEach((option) => tagsElement.appendChild(option));

        this.choices = new Choices('#tags', {
          removeItemButton: true,
          classNames: {
            containerInner: 'choices__inner form-control',
          },
          choices: tags.map((tag) => ({
            id: tag.id,
            label: tag.name,
            value: tag.id,
            selected: this.product.tags.find((x) => x.id === tag.id),
          })),
        });

        window.choices = this.choices;
      },
      async saveItem() {
        const tagsRaw = this.product.tags;
        const tags = this.choices.getValue().map((i) => ({
          id: i.value,
          name: i.label,
        }));

        const tagChanged = compareArrays(tagsRaw, tags);
        const originalData = {
          title: this.product.title,
          description: this.product.description,
          category: this.product.category,
          qty: this.product.qty,
          drop_time: this.product.drop_time,
        };

        if (this.product.category === 'food') {
          originalData.expired_at = this.product.expired_at;
        } else if (this.product.category === 'non-food') {
          originalData.used_since = this.product.used_since;
        }

        const data = compareObjects(originalData, this.data);

        if (!data.isChanged && !tagChanged.isChanged) {
          toastHelpers.error('Whopss, tidak ada yang diubah.');
          return;
        }

        const loading = toastHelpers.loading();
        const { error } = await service.product.update(id, {
          data: data.updated,
          tags: tagChanged,
        });

        await delay(300);
        toastHelpers.dismiss(loading);

        if (!error) {
          toastHelpers.success('Perubahan berhasil disimpan.');
        } else {
          this.error = error.message;
          toastHelpers.error('Whops, gagal melakukan perubahan.');
        }
      },
    }));
  }
}

export default new EditProductView();
