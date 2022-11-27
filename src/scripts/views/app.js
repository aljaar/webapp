import product from '../components/alpine/product';
import products from '../components/alpine/products';
import transactions from '../components/alpine/transactions';
import NavigationNavbar from '../components/navigation-navbar';
import routes from '../routes/routes';
import { service } from '../sdk';
import toastHelpers from '../utils/toast.helpers';
import UrlParser from '../utils/url.parser';

class App {
  constructor({
    content,
    alpine,
  }) {
    this._content = content;
    this._alpine = alpine;

    this._initialCustomElement();
    this._initialAlpine();
  }

  _initialAlpine() {
    this._alpine.data('product', product);
    this._alpine.data('products', products);
    this._alpine.data('transactions', transactions);
    this._alpine.start();
  }

  _initialCustomElement() {
    customElements.define('navigation-navbar', NavigationNavbar);
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

    try {
      const page = await routes[url];
      
      await this.beforeRenderPage();
      this._content.innerHTML = await page.render();

      await page.afterRender(this._alpine);
    } catch (error) {
      if (error.message === 'unauthorized') {
        console.info(`Redirect ke halaman login`)
      }

      this._content.innerHTML = this._renderErrorNotFound();
    }
  }

  async beforeRenderPage () {
    const { data: { session } } = await service.auth.session();

    if (!session) {
      //throw new Error('unauthorized')
      toastHelpers.error('You need to login first');
      window.location.href = '/#/signin';
    } else {
      console.info(`passed`)
    }
  }

  _renderErrorNotFound() {
    return String.raw`
      <section class="restaurant restaurant_favorite">
        <div class="wrapper_container">
          <div class="restaurant_contents">
            <div class="restaurant__empty_result active">
              <random-emoji></random-emoji>
              <span>Whopss! we can't found the page your are requested.</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

export default App;
