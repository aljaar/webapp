import { Notyf } from 'notyf';

class ToastHelpers {
  constructor() {
    this.notyf = new Notyf({
      duration: 3000,
      position: {
        x: 'center',
        y: 'bottom',
      },
      types: [
        {
          type: 'info',
          background: '#0da8ee',
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
}

export default new ToastHelpers();
