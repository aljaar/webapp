import routes from '../routes/routes';
import UrlParser from '../utils/url.parser';

class App {
  constructor({
    content,
  }) {
    this._content = content;

    this._initialCustomElement();
    this._initialAppShell();
  }

  _initialAppShell() {
  }

  _initialCustomElement() {
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

    try {
      const page = await routes[url];
      this._content.innerHTML = await page.render();

      await page.afterRender();
    } catch (err) {
      console.error(err);
      main.innerHTML = this._renderErrorNotFound();
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
