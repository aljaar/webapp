import * as WebpackWindow from 'workbox-window';

class ServiceWorker {
  static async register() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported in the browser');
      return;
    }

    try {
      const workbox = new WebpackWindow.Workbox('./sw.bundle.js');

      await workbox.register();
      console.log('Service worker registered');
    } catch (error) {
      console.log('Failed to register service worker', error);
    }
  }
}

export default ServiceWorker;
