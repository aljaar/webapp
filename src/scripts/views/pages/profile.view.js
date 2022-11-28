class ProfileView {
  async render () {
    return String.raw`
      <div class="profile">
        <!-- Header End -->
        <div class="border rounded-lg-shadow-lg p-10 top-48">
          <div class="flex flex-row mx-auto mb-4">
            <div>
              <img src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/avatars/public/avatar.default.webp" alt="aljaar" class="rounded-full w-24">
            </div>
            <div class="flex flex-col gap-2 text-emerald-600 self-center ml-4">
              <div class="basis-1/4 uppercase text-2xl">
                <h1>Aljaar's Profile</h1>
              </div>
              <p>📌 2m away</p>
              <p> 🧑🏻‍🤝‍🧑🏻 shared with 12 people</p>
            </div>
          </div>
          <div class="mb-3">
            <label for="phone" class="text-base text-emerald-600">Phone</label>
            <input type="text" id="phone" class="w-full p-2 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900 mb-3">
          </div>
          <div>
            <label for="about" class="text-base text-emerald-600 ">About</label>
            <input type="text" id="about" class="w-full p-6 border rounded-md focus:outline-none focus:ring-slate-900 focus:ring-1 focus:border-neutral-900">
          </div>
          <!-- Listings Offered -->
          <div>
            <h2 class="text-base text-emerald-600 py-10 mx-auto text-center">Listings Offered</h2>
          </div>
          <div class="flex flex-row justify-evenly">
            <div class="w-full">
              <div class="border bg-white p-8">
                <h2></h2>
              </div>
            </div>
            <div class="w-full">
              <div class="border bg-white p-8">
                <h2></h2>
              </div>
            </div>
          </div>
          <div>
            <h2 class="text-base text-emerald-600 py-5 mx-auto text-center">Listings</h2>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender () {

  }
}

export default new ProfileView();
