import SlimSelect from 'slim-select';
import fileUpload from 'file-upload-with-preview';

class NewProductView {
  async render() {
    return String.raw`
      <div id="create-product" x-data="createProduct" class="p-4 flex flex-col gap-3">
            
      <div>
          <label for="title" class="text-base text-emerald-600 mb-2">Title</label>
          <input type="text" id="title" class="w-full p-2 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
      </div>
      <div>
          <label for="description" class="text-base text-emerald-600 mb-2">Description</label>
          <input type="text" id="description" class="w-full p-6 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
      </div>
      <div class="category mb-2">
          <form action="">
              <label><h2 class="text-emerald-600">Category</h2></label>
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
      <div class="mb-4  ">
          <h2 class="text-emerald-600 ">Expired Date</h2>
          <input type="date">
      </div>
      <div>
          <label for="tags" class="text-base text-emerald-600 mb-3 pb-3">Tag</label>
          
          <select id="tags" multiple>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
      </div>
      <div class="custom-file-container" data-upload-id="myFirstImage">
      <div class="label-container">
        <label>Upload</label>
      </div>
      <label class="input-container">
        <input accept="*" aria-label="Choose File" class="input-hidden" id="file-upload-with-preview-myFirstImage" type="file">
      </label>

</div>
      
      <div>
          <label for="" class="text-base text-emerald-600">Titik Penjemputan</label>
          
          <div id="map" style="width: 400px; height: 300px;" class="mapboxgl-map"></div>
      </div>
      
      
      <div class="flex justify-center">
                <button class="mx-auto bg-centerborder p-3 bg-emerald-600 pt-3 hover:bg-emerald-700 rounded-full">
                    <h1 class="mr-3 ml-3 text-white mx-auto">Submit</h1>
                </button>
              </div>
  </div>
    `;
  }

  async afterRender(alpine) {
    const upload = new FileUploadWithPreview('file-upload-with-preview-myFirstImage');

    new SlimSelect({
      select: '#tags',
    });

    alpine.data('createProduct', () => ({

    }));
  }
}

export default new NewProductView();
