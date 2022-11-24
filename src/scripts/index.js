import 'lazysizes';
import 'iconify-icon';
import 'regenerator-runtime';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

import '../styles/tailwind.css';
import '../styles/main.css';
import 'notyf/notyf.min.css';

import Alpine from 'alpinejs';
import App from './views/app';
// import ServiceWorker from './utils/sw.register';

window.alpine = Alpine;

const app = new App({
  content: document.querySelector('#main-content'),
  alpine: Alpine
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
});
