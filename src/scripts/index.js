import 'lazysizes';
import 'iconify-icon';
import 'regenerator-runtime';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import '../styles/tailwind.css';
import '../styles/main.css';
import 'notyf/notyf.min.css';

import App from './views/app';
import ServiceWorker from './utils/sw.register';

const app = new App({
  content: document.querySelector('main'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();

  ServiceWorker.register();
});
