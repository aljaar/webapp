import { service } from '../../../sdk';
import { delay } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import { createPageHeader } from '../../templates/creator.template';

class ForgotPasswordView {
  renderHeader() {
    return createPageHeader({
      title: 'Lupa Password',
    });
  }

  render() {
    return String.raw`
      <div x-data="forgotPassword" class="p-4 flex flex-col gap-4">
        <div class="card-pink">
          <p>Jika kamu lupa password untuk masuk ke akun mu. Kamu bisa meminta mengatur ulang password dengan mengisi email akun kamu pada form dibawah ini.</p>
        </div>

        <form @submit.prevent="confirm" class="flex flex-col gap-4">
          <div>
            <label for="email" class="form-control-label">Email</label>
            <input type="email" id="email" name="email" class="form-control" placeholder="Masukkan email anda" x-model="email" required>
          </div>

          <button type="submit" class="w-full py-3 rounded-md shadow bg-green-600 text-white" aria-label="Reset Password">
            Reset Password
          </button>
        </form>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('forgotPassword', () => ({
      email: '',
      async confirm() {
        if (this.email === '') {
          toastHelpers.error('Whopss, email tidak boleh kosong.');
        }

        const loading = toastHelpers.loading();
        const { error, data } = await service.auth.resetPassword(this.email);
        console.log(error, data);
        await delay(300);
        toastHelpers.dismiss(loading);

        if (error) {
          toastHelpers.error('Whopss, gagal melakukan reset password atau email tidak ditemukan.');
        } else {
          toastHelpers.success('Berhasil, silahkan cek email anda.');
        }
      },
    }));
  }
}

export default new ForgotPasswordView();
