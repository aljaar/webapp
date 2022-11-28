class EditProductView {
  async render() {
    return String.raw`
      <div id="product-edit" x-data="editProduct">
      <div class="border rounded-lg-shadow-lg p-10 top-48">
            
      <div>
          <label for="title" class="text-base text-emerald-600 mb-2">Title</label>
          <input type="text" id="title" class="w-full p-2 border rounded-md focus:outline-none focus:ring-emerald-600 focus:ring-1 focus:border-neutral-900">
      </div>
      <div>
          <label for="description" class="text-base text-emerald-600 mb-2">Description</label>
          <input type="text" id="description" class="w-full p-6 border rounded-md focus:outline-none focus:ring-emerald-600 focus:ring-1 focus:border-neutral-900">
      </div>
      <div class="category mb-2">
          <form action="">
              <label><h2 class="text-emerald-600">Category</h2></label>
              <label for="food">
                  <input type="radio" name="radio">
                  <span>Food</span>
              </label>
              <label for="non-food">
                  <input type="radio" name="radio">
                 <span>Non Food</span>
              </label>
          </form>
      </div>
      <div class="mb-4  ">
          <h2 class="text-emerald-600 ">Expired Date</h2>
          <input type="date">
      </div>
      <div>
          <label for="tag" class="text-base text-emerald-600 mb-3 pb-3">Tag</label>
          
          <select id="tags" multiple="" class="" tabindex="-1" aria-hidden="true" style="display: none;">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
        
      </div>
      <div class="custom-file-container" data-upload-id="myFirstImage">
<div class="label-container">
  <label>Upload</label>
  <a class="clear-button" href="javascript:void(0)" title="Clear Image">
    ×
  </a>
</div>
<label class="input-container">
  <input accept="*" aria-label="Choose File" class="input-hidden" id="file-upload-with-preview-myFirstImage" type="file">
  <span class="input-visible">Choose file...<span class="browse-button">Browse</span></span>
</label>

</div>
      
      <div>
          <label for="" class="text-base text-emerald-600">Titik Penjemputan</label>
          
          <div id="maps"></div>

      </div>
      
      <input type="datetime" name="" id="">
      <!-- Listings Offered -->
      <div>
          <h2 class=" font-center text-base text-emerald-600 py-10">Listings Offered</h2>
      </div>
      
      <button class="mx-auto bg-centerborder p-3 bg-emerald-600 ">
          <h1 class="mr-3 ml-3 text-white focus:ring-emerald-600">Save Changes</h1>
      </button>
  </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('editProduct', () => ({

    }));
  }
}

export default new EditProductView();
