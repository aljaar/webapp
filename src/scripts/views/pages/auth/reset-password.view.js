import { service } from '../../../sdk';
import { delay, redirect } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import { createPageHeader } from '../../templates/creator.template';

class ResetPasswordView {
  renderHeader() {
    return createPageHeader({
      title: 'Reset Password',
    });
  }

  render() {
    return String.raw`
      <div x-data="resetPassword" class="p-4 flex flex-col gap-4">
        <div class="card-pink">
          <template x-if="isEligible">
            <p>Selamat, sekarang kamu tinggal membuat password baru kamu.</p>
          </template>
          <template x-if="!isEligible">
            <p>Maaf, kamu belum mengirim permintaan lupa password.</p>
          </template>
        </div>

        <form @submit.prevent="confirm" class="flex flex-col gap-4">
          <div>
            <label for="password" class="form-control-label">Password</label>
            <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300 relative" x-data="{ show: false }">
              <input id="password" x-bind:type="!show ? 'password' : 'text'" x-model="password" placeholder="Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>

              <iconify-icon x-show="show" @click="show = false" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye-off" inline></iconify-icon>
              <iconify-icon x-show="!show" @click="show = true" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye" inline></iconify-icon>
            </div>
          </div>

          <div>
            <label for="password_confirm" class="form-control-label">Konfirmasi Password</label>
            <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300 relative" x-data="{ show: false }">
              <input id="password_confirm" x-bind:type="!show ? 'password' : 'text'" x-model="password_confirm" placeholder="Konfirmasi Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>

              <iconify-icon x-show="show" @click="show = false" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye-off" inline></iconify-icon>
              <iconify-icon x-show="!show" @click="show = true" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye" inline></iconify-icon>
            </div>
          </div>

          <template x-if="!isPasswordMatch()">
            <p class="text-left text-sm text-red-500">Password tidak cocok!</p>
          </template>

          <button type="submit" class="w-full py-3 rounded-md shadow" :class="{'bg-green-600 text-white': isEligible,'bg-gray-300 text-gray-900': !isEligible}" :disabled="!isEligible" aria-label="Reset Password">
            Reset Password
          </button>
        </form>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('resetPassword', () => ({
      password: '',
      password_confirm: '',
      isEligible: false,
      init() {
        const user = service.user.me();
        const recovery = localStorage.getItem('recovery-email');

        if (recovery === user.email) {
          this.isEligible = true;
        }
      },
      isPasswordMatch() {
        return !((this.password_confirm !== '') && (this.password !== this.password_confirm));
      },
      async confirm() {
        if (!this.isPasswordMatch()) {
          toastHelpers.error('Whopss, password tidak cocok.');
        }

        const loading = toastHelpers.loading();
        const { error, data } = await service.auth.updatePassword(this.password);
        console.log(error, data);

        await delay(300);
        toastHelpers.dismiss(loading);
        localStorage.removeItem('recovery-email');

        if (error) {
          toastHelpers.error('Whopss, terdapat kesalahan ketika mengubah password.');
        } else {
          toastHelpers.success('Password berhasil diubah.');
          redirect('#/profile');
        }
      },
    }));
  }
}

export default new ResetPasswordView();
