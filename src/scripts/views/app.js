import NavigationNavbar from '../components/navigation-navbar';
import routes from '../routes/routes';
import { service } from '../sdk';
import { delay, redirect } from '../utils/helpers';
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
    this._alpine.data('navbarMenu', () => ({
      async logout() {
        const loading = toastHelpers.loading();
        await service.auth.signOut();

        toastHelpers.success('Logout berhasil');
        await delay(500);
        toastHelpers.dismiss(loading);
        window.location.hash = '#/signin';
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
      let page = await routes[url]();
      if (page.default) page = page.default;

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
      if (error.message === 'Unauthorized') return;
      this._content.innerHTML = this._renderErrorNotFound(error);
    }
  }

  async beforeRenderPage(url) {
    const { data: { session } } = await service.auth.session();

    if (!session) {
      if (!url.includes('/sign') && !url.includes('password')) {
        toastHelpers.error('You need to login first');
        redirect('#/signin');
        throw new Error('Unauthorized');
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
    }
  }

  _renderErrorNotFound(error) {
    return String.raw`
      <section id="error-page-notfound" class="px-4 py-8">
        <div class="w-full">
          <div class="flex flex-col items-center space-y-3 mx-auto text-center">
            <img src="images/empty.webp" class="w-64" alt="Empty Lists">
            <p>Whops, ada kesalahan yang terjadi.</p>
            <p class="text-sm text-gray-700">${error}</p>
          </div>
        </div>
      </section>
    `;
  }
}

export default App;
