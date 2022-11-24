import { service } from '../../../sdk';
import UrlParser from '../../../utils/url.parser';

class ProductDetailView {
  async render() {
    return String.raw`
      <div x-data="product" class="py-3">
        <img x-bind:data-src="product.images[0]" class="lazyload rounded-md" alt="">

        <!-- Judul -->
        <!-- User (Avatar Nama) -->
        <!-- Deskripsi -->
        <!-- Qty -->
        <!-- Category dan Tag -->
        <!-- Drop Time -->

        <!-- Button Request -->
        <!-- Button Contact WA -->

      </div>
    `;
  }

  async afterRender() {
    
  }
}

export default new ProductDetailView();
