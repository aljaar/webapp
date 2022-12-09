import { service } from '../../../sdk';
import { delay, redirect } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import { createPageHeader } from '../../templates/creator.template';

class SignUpView {
  renderHeader() {
    return createPageHeader({
      title: 'Sign Up',
    });
  }

  async render() {
    return String.raw`
      <section x-data="signup" class="forms px-6 pt-4 space-y-4 text-center">
        <!-- Register Content -->
        <div class="space-y-4">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-xl md:text-2xl font-bold">Sign up to your Account</h2>
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.full_name" type="text" placeholder="Full Name" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.email" type="email" placeholder="Email" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>
          </div>
          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.phone" type="text" placeholder="Phone Number (ex. +6281XXX)" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>
          </div>

          <div class="relative w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.password" x-bind:type="(show.password) ? 'text' : 'password'" placeholder="Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>

            <iconify-icon x-show="show.password" @click="show.password = false" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye-off" inline></iconify-icon>
            <iconify-icon x-show="!show.password" @click="show.password = true" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye" inline></iconify-icon>
          </div>
          <div class="relative w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.repeat_password" x-bind:type="(show.repeat_password) ? 'text' : 'password'" placeholder="Repeat Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none" required>

            <iconify-icon x-show="show.repeat_password" @click="show.repeat_password = false" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye-off" inline></iconify-icon>
            <iconify-icon x-show="!show.repeat_password" @click="show.repeat_password = true" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye" inline></iconify-icon>
          </div>
          <template x-if="((credential.repeat_password !== '') && (credential.password !== credential.repeat_password))">
            <p class="text-left text-sm text-red-500">Password tidak cocok!</p>
          </template>
          <button @click="signUp" class="links w-full rounded-md bg-green-600 shadow-md py-3 font-semibold text-white">
            Sign Up
          </button>
        </div>

        <div class="flex justify-center items-center text-sm">
          <span class="w-20 border border-gray-400"></span>
          <span class="px-4 text-gray-600">or Continue with</span>
          <span class="w-20 border border-gray-400"></span>
        </div>

        <footer>
          <button @click="signUpWithGoogle" class="w-full flex relative items-center justify-center flex-none py-2.5 px-2 rounded-md bg-blue-600 text-white shadow-mdl">
            <span class="absolute left-2 bg-white rounded-md px-2 py-1">
              <iconify-icon icon="logos:google-icon" inline></iconify-icon>
            </span>
            <span>Sign Up with Google</span>
          </button>
          <div class="mt-8 text-sm text-gray-400">
            Already have an Account? <a href="/#/signin" class="font-medium text-gray-500">Sign in
          </div>
        </footer>
      </section>
    `;
  }

  async afterRender(alpine) {
    alpine.data('signup', () => ({
      show: {
        password: false,
        repeat_password: false,
      },
      credential: {
        full_name: '',
        email: '',
        phone: '',
        password: '',
        repeat_password: '',
      },
      async signUp() {
        const loading = toastHelpers.loading();
        const { error } = await service.auth.signUp({
          full_name: this.credential.full_name,
          email: this.credential.email,
          phone: this.credential.phone,
          password: this.credential.password,
          repeat_password: this.credential.repeat_password,
        });

        toastHelpers.dismiss(loading);
        if (error) {
          toastHelpers.error('Whopss, daftar gagal.');
        } else {
          toastHelpers.success('Proses daftar berhasil');
          await delay(300);

          localStorage.setItem('registered_user', JSON.stringify({
            full_name: this.credential.full_name,
            email: this.credential.email,
          }));

          redirect('#/signin');
        }
      },
      async signUpWithGoogle() {
        await service.auth.signInWith({
          type: 'google',
        });
      },
    }));
  }
}

export default new SignUpView();
