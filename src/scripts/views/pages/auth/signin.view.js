import { service } from '../../../sdk';
import { delay, redirect } from '../../../utils/helpers';
import toastHelpers from '../../../utils/toast.helpers';
import { createPageHeader } from '../../templates/creator.template';

class SignInView {
  renderHeader() {
    return createPageHeader({
      title: 'Sign In',
    });
  }

  async render() {
    return String.raw`
      <section x-data="signin" class="forms px-6 pt-4 space-y-4 text-center">
        <div class="space-y-4">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-xl md:text-3xl font-bold">Hello Again!</h2>
            <p class="text-md md:text-base">Welcome Back you've been missed</p>
          </div>

          <template x-if="new_user">
            <div class="p-3 rounded-md bg-green-50 border border-green-500 text-green-900">
              <p>Terima kasih sudah mendaftar. Silahkan cek email <b x-text="new_user.email"></b> untuk mengkonfirmasi akun anda.</p>
            </div>
          </template>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input x-model="credential.email" type="email" placeholder="Input Your Email" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none">
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300 relative" x-data="{ show: false }">
            <input x-bind:type="!show ? 'password' : 'text'" x-model="credential.password" placeholder="Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none">

            <iconify-icon x-show="show" @click="show = false" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye-off" inline></iconify-icon>
            <iconify-icon x-show="!show" @click="show = true" class="text-lg absolute top-[16px] right-5 cursor-pointer" icon="heroicons-outline:eye" inline></iconify-icon>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300" required="">
              </div>
              <div class="ml-3 text-sm">
                <label for="remember" class="text-black">Remember me</label>
              </div>
            </div>
            <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot Password?</a>
          </div>

          <button @click="signIn" class="links w-full rounded-md bg-green-600 shadow-md py-3 font-semibold text-white">
            Sign In
          </button>
        </div>

        <div class="flex justify-center items-center text-sm">
          <span class="w-20 border border-gray-400"></span>
          <span class="px-4 text-gray-600">or Continue with</span>
          <span class="w-20 border border-gray-400"></span>
        </div>

        <footer>
          <button @click="signInWithGoogle" class="w-full flex relative items-center justify-center flex-none py-2.5 px-2 rounded-md bg-blue-600 text-white shadow-mdl">
            <span class="absolute left-2 bg-white rounded-md px-2 py-1">
              <iconify-icon icon="logos:google-icon" inline></iconify-icon>
            </span>
            <span>Sign In with Google</span>
          </button>
          <div class="mt-8 text-sm text-gray-400">
            Not a Member?
            <a href="/#/signup" class="font-medium text-gray-500">Register Now</a>.
          </div>
        </footer>
      </section>
    `;
  }

  async afterRender(alpine) {
    alpine.data('signin', () => ({
      new_user: null,
      credential: {
        email: null,
        password: null,
      },
      init() {
        const registeredUser = localStorage.getItem('registered_user');

        if (registeredUser) {
          this.new_user = JSON.parse(registeredUser);
        }
      },
      async signIn() {
        const loading = toastHelpers.loading();
        const { error } = await service.auth.signInWith({
          type: 'email',
          credential: {
            email: this.credential.email,
            password: this.credential.password,
          },
        });
        toastHelpers.dismiss(loading);
        if (error) {
          toastHelpers.error('Whopss, login gagal.');
        } else {
          toastHelpers.success('Login berhasil');

          await delay(1000);

          redirect('#/');
        }
      },
      async signInWithGoogle() {
        await service.auth.signInWith({
          type: 'google',
        });
      },
    }));
  }
}

export default new SignInView();
