const SignUpView = {
  async render() {
    return String.raw`
      <section class="forms px-6 pt-4 space-y-4 text-center">
        <!-- Register Content -->
        <div class="space-y-4">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-xl md:text-2xl font-bold">Sign up to your Account</h2>
            <p class="text-md md:text-base">Already have an Account? <a href="/#/signin" class="font-medium text-gray-500">Sign in</a></p>
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input type="text" placeholder="Full Name" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none">
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input type="number" placeholder="Number Phone" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none">
          </div>

          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input type="text" placeholder="Email" class="my-3 w-full border-none bg-transparent outline-none focus:outline-none">
          </div>
          <div class="w-full rounded-lg bg-gray-50 px-4 border border-gray-300">
            <input type="password" placeholder="Password" class="password my-3 w-full border-none bg-transparent outline-none focus:outline-none">
            <i class="eye-icon bx bx-hide text-lg text-[#8b8b8b] absolute top-50% right-5 translate-y-2/4"></i>
          </div>
          <button class="links w-full rounded-md bg-emerald-500 shadow-md py-3 font-bold text-white hover:bg- active:translate-y-[0.125rem] active:border-b-white">
            Sign Up
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
            <span>Sign Up with Google</span>
          </button>
          <div class="mt-8 text-sm text-gray-400">
            By sign up, you agree to out
            <a href="#" class="font-medium text-gray-500">Terms</a> and
            <a href="#" class="font-medium text-gray-500">Privacy Policy</a>.
          </div>
        </footer>
      </section>
    `;
  },
  async afterRender() {},
};

export default SignUpView;
