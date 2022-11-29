import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

import { FileUploadWithPreview } from 'file-upload-with-preview/dist/file-upload-with-preview.esm';
import { createPageHeader } from '../../templates/creator.template';

class NewProductView {
  renderHeader() {
    return createPageHeader({
      title: 'Item Baru',
    });
  }

  async render() {
    return String.raw`
      <div id="create-product" x-data="createProduct" class="p-4 flex flex-col gap-3">
        <div>
          <label for="title" class="form-control-label">Title</label>
          <input type="text" id="title" class="form-control">
        </div>
        <div>
          <label for="description" class="form-control-label">Description</label>
          <input type="text" id="description" class="form-control">
        </div>
        <div class="category mb-2">
          <form action="">
            <label class="form-control-label">Kategori</label>
            <div class="flex gap-5">
              <label for="food">
                <input type="radio" name="radio">
                <span>Food</span>
              </label>
              <label for="non-food">
                <input type="radio" name="radio">
                <span>Non Food</span>
              </label>
            </div>
          </form>
        </div>
        <div>
          <h2 class="form-control-label">Expired Date</h2>
          <input type="date" class="form-control">
        </div>
        <div>
          <h2 class="form-control-label">Used Since</h2>
          <input type="text" class="form-control" placeholder="Berapa lama barang dipakai atau kapan belinya">
        </div>

        <div>
          <label for="tags" class="form-control-label">Tag</label>
          <select id="tags" class="form-control" multiple>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div class="custom-file-container" data-upload-id="productImages">
        </div>
        <div>
          <label for="" class="form-control-label">Titik Lokasi Penjemputan</label>
          <div id="map" style="width: 400px; height: 128px;" class="mapboxgl-map"></div>
        </div>
        <div class="flex justify-center mb-6">
          <button class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-600 text-white hover:bg-emerald-700">Simpan</button>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    const upload = new FileUploadWithPreview('productImages', {
      maxFileCount: 5,
      multiple: true,
      text: {
        browse: 'Choose',
        chooseFile: 'Take your pick...',
        label: 'Choose Files to Upload',
      },
    });

    const choices = new Choices('#tags', {
      removeItemButton: true,
      classNames: {
        containerInner: 'choices__inner form-control',
      },
    });

    alpine.data('createProduct', () => ({

    }));
  }
}

export default new NewProductView();
