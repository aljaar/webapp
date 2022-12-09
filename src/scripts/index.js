import 'lazysizes';
import 'iconify-icon';
import 'regenerator-runtime';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/attrchange/ls.attrchange';

import '../styles/tailwind.css';
import '../styles/main.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'notyf/notyf.min.css';

import Alpine from 'alpinejs';
import App from './views/app';
import ServiceWorker from './utils/sw.register';

window.Alpine = Alpine;

const app = new App({
  header: document.querySelector('#header-content'),
  content: document.querySelector('#main-content'),
  alpine: Alpine,
});

window.refreshRender = () => {
  app.renderPage();
};

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
  ServiceWorker.register();
});
