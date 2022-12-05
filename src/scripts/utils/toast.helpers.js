import { Notyf } from 'notyf';
import { delay } from './helpers';

class Toast {
  constructor() {
    this.notyf = new Notyf({
      duration: 3000,
      position: {
        x: 'center',
        y: 'top',
      },
      types: [
        {
          type: 'info',
          background: '#0da8ee',
        },
        {
          type: 'cofirm',
          className: 'notyf-loading',
          icon: String.raw`
            <iconify-icon icon="ri:question-line" inline></iconify-icon>
          `,
        },
        {
          type: 'loading',
          className: 'notyf-loading',
          icon: String.raw`
            <iconify-icon icon="eos-icons:loading" inline></iconify-icon>
          `,
        },
      ],
    });
  }

  withError(error) {
    this.errorDetail = error;
    return this;
  }

  success(message) {
    this.notyf.success(message);
  }

  info(message) {
    this.notyf.open({
      type: 'info',
      duration: 4000,
      message,
    });
  }

  error(message = 'Something wrong, please try again later.') {
    this.notyf.error(message);

    if (this.errorDetail) {
      console.info(`${message}, see: ${this.errorDetail}`);

      this.errorDetail = null;
    }
  }

  confirm(message) {
    return this.notyf.open({
      type: 'cofirm',
      message,
      duration: 5000,
      dismissible: true,
    });
  }

  loading(message = 'Harap tunggu...') {
    return this.notyf.open({
      type: 'loading',
      message,
      duration: 0,
    });
  }

  async dismiss(item) {
    await delay(300);
    this.notyf.dismiss(item);
  }

  dismissAll() {
    this.notyf.dismissAll();
  }
}

export default new Toast();
