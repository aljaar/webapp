class ProfileEditView {
  async render() {
    return String.raw`
      <!-- <h1>Profile Edit</h1> -->
        <div>
          <div class="p-3  top-48">
              <div class="foto pb-3">
                <img src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/avatars/public/avatar.default.webp" class="mx-auto w-24 rounded-full" alt="Profile Picture">
              </div>
              <div class="text-xs mx-auto pb-9 text-center">
                <a href="" class="mx-auto text-center left-50">Change Photo</a>
              </div>

              <div class="flex flex-col gap-3">
              <div>
                <label for="full-name" class="text-base text-emerald-600 mb-2">Full Name</label>
                <input type="text" id="full-name"
                      class="w-full p-2 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
              </div>
              <div>
                <label for="about" class="text-base text-emerald-600 mb-2">About</label>
                <input type="text" id="about"
                      class="w-full p-6 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
              </div>

              <div>
                  <label for="email" class="text-base text-emerald-600">Email</label>
                  <input type="text" id="tag"
                      class="w-full p-2 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
              </div>
              <div>
                  <label for="phone" class="text-base text-emerald-600">Phone</label>
                  <input type="text" id="tag"
                      class="w-full p-2 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
              </div>

              <br>
              <div class="flex justify-center">
                <button class="mx-auto bg-centerborder p-3 bg-emerald-600 pt-3 hover:bg-emerald-700 rounded-full">
                    <h1 class="mr-3 ml-3 text-white mx-auto">Save Changes</h1>
                </button>
              </div>
              </div>
              
          </div>
        </div>
    `
  }

  async afterRender(alpine) {
  }
}

export default new ProfileEditView();
