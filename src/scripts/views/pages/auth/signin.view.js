import { service } from "../../../sdk";
import toastHelpers from "../../../utils/toast.helpers";

const SignInView = {
  async render () {
    return String.raw`
      <section x-data="signin" class="forms px-6 pt-4 space-y-4 text-center">
        <div class="space-y-4">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-xl md:text-3xl font-bold">Hello Again!</h2>
            <p class="text-md md:text-base">Welcome Back you've been missed</p>
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input type="email" placeholder="Input Your Email" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none">
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300 relative" x-data="{ show: false }">
            <input x-bind:type="!show ? 'password' : 'text'" placeholder="Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none">

            <iconify-icon x-show="show" @click="show = false" class="text-lg absolute top-[16px] right-5 translate-y-1/2" icon="heroicons-outline:eye-off" inline></iconify-icon>
            <iconify-icon x-show="!show" @click="show = true" class="text-lg absolute top-[16px] right-5" icon="heroicons-outline:eye" inline></iconify-icon>
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

          <button @click="signIn" class="links w-full rounded-md bg-emerald-500 shadow-md py-3 font-bold text-white hover:bg- active:translate-y-[0.125rem] active:border-b-white">
            Sign In
          </button>
        </div>

        <div class="flex justify-center items-center text-sm">
          <span class="w-20 border border-gray-400"></span>
          <span class="px-4 text-gray-600">Or Continue with</span>
          <span class="w-20 border border-gray-400"></span>
        </div>

        <footer>
          <button class="w-full flex relative items-center justify-center flex-none py-2.5 px-2 rounded-md shadow-mdl">
            <span class="absolute left-4">
              <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path fill="#EA4335 " d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"></path>
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"></path>
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"></path>
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"></path>
              </svg>
            </span>
            <span>Sign In with Google</span>
          </button>
          <div class="mt-8 text-sm text-gray-400">
            Not a Member?
            <a href="/#/signup" class="font-medium text-gray-500">Register Now</a>.
          </div>
        </footer>
      </section>
    `
  },
  async afterRender (alpine) {
    alpine.data('signin', () => ({
      credential: {
        email: null,
        password: null
      },
      async signIn () {
        const { data, error } = await service.auth.signInWith({
          type: 'email',
          credential: {
            email: 'nyanhashmail@gmail.com',
            password: 'testpassword'
          }
        })

        if (error) {
          toastHelpers.error('Whopss, login gagal.')
        } else {
          toastHelpers.success('Login berhasil');
        }
      },
      signInWithGoogle () {

      }
    }));
  }
}

export default SignInView;
