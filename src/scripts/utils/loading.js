import { createLoadingOverlay } from '../views/templates/creator.template';

class LoadingIndicator {
  constructor() {
    this._container = document.getElementById('app');
  }

  start() {
    this._container.insertAdjacentHTML('beforeend', createLoadingOverlay());
  }

  stop() {
    this._container.querySelector('#overlay-loading').remove();
  }
}

export default LoadingIndicator;
