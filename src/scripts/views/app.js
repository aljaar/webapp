import product from '../components/alpine/product';
import products from '../components/alpine/products';
import NavigationNavbar from '../components/navigation-navbar';
import routes from '../routes/routes';
import { service } from '../sdk';
import { delay } from '../utils/helpers';
import LoadingIndicator from '../utils/loading';
import toastHelpers from '../utils/toast.helpers';
import UrlParser from '../utils/url.parser';
import { createHomeHeader } from './templates/creator.template';

class App {
  constructor({
    header,
    content,
    alpine,
  }) {
    this._header = header;
    this._content = content;
    this._alpine = alpine;

    this._initialCustomElement();
    this._initialAlpine();
    this._initialListener();
  }

  _initialAlpine() {
    this._alpine.data('product', product);
    this._alpine.data('products', products);
    this._alpine.data('navbarMenu', () => ({
      async logout() {
        const loading = toastHelpers.loading();
        await service.auth.signOut();

        toastHelpers.success('Logout berhasil');
        await delay(500);
        toastHelpers.dismiss(loading);
        window.location.href = '/#/';
      },
    }));

    this._alpine.start();
  }

  _initialCustomElement() {
    customElements.define('navigation-navbar', NavigationNavbar);
  }

  _initialListener() {
    service.emitter.on('aljaar:auth:refreshed', () => {
      service.auth.user().then(() => 'User Data Refreshed');
    });
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

    try {
      const page = await routes[url];

      await this.beforeRenderPage(url);
      this._content.innerHTML = await page.render();

      if (page.renderHeader) {
        this._header.parentElement.classList.add('with-back');
        this._header.innerHTML = page.renderHeader();
      } else {
        if (!this._header.parentElement.classList.contains('with-back') && url !== '/') {
          this._header.parentElement.classList.add('with-back');
        } else if (this._header.parentElement.classList.contains('with-back') && url === '/') {
          this._header.parentElement.classList.remove('with-back');
        }

        this._header.innerHTML = createHomeHeader();
      }

      await page.afterRender(this._alpine);
    } catch (error) {
      console.error(error);

      this._content.innerHTML = this._renderErrorNotFound();
    }
  }

  async beforeRenderPage(url) {
    const { data: { session } } = await service.auth.session();

    if (!session) {
      if (!url.includes('/sign')) {
        toastHelpers.error('You need to login first');
        window.location.href = '/#/signin';
        throw new Error('unauthorized');
      }
    } else {
      if (localStorage.getItem('registered_user')) {
        localStorage.removeItem('registered_user');
      }

      if (!this._user) {
        const loading = new LoadingIndicator();

        loading.start();
        this._user = await service.auth.user();
        loading.stop();
      }

      console.info('passed');
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
