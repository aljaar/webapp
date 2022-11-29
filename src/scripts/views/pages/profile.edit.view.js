import { createPageHeader } from '../templates/creator.template';

class ProfileEditView {
  renderHeader() {
    return createPageHeader({
      title: 'Edit Profile',
    });
  }

  async render() {
    return String.raw`
      <div x-data="profileEdit" class="p-3 top-48">
        <div class="flex flex-col justify-center items-center mb-4">
          <div class="relative mb-2">
            <img src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/avatars/public/avatar.default.webp" class="w-24 rounded-full" alt="Profile Picture">

            <button @click="changeAvatar" class="absolute bottom-1 right-1 shadow-mdl w-6 h-6 bg-white rounded-full">
              <iconify-icon icon="ri:camera-switch-line" class="text-[14px]" inline></iconify-icon>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div>
            <label for="full-name" class="form-control-label">Full Name</label>
            <input type="text" id="full-name" class="form-control">
          </div>
          <div>
            <label for="about" class="form-control-label">About</label>
            <input type="text" id="about" class="form-control">
          </div>
          <div>
            <label for="email" class="form-control-label">Email</label>
            <input type="text" id="tag" class="form-control">
          </div>
          <div>
            <label for="phone" class="form-control-label">Phone</label>
            <input type="text" id="tag" class="form-control">
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et libero eligendi atque deserunt facilis quos praesentium reprehenderit consequatur eum mollitia temporibus, quidem doloribus ipsam labore? Adipisci deleniti sequi fugit vel!</p>
          <div class="flex justify-center my-6">
            <button class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-600 text-white hover:bg-emerald-700">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    alpine.data('profileEdit', () => ({

    }));
  }
}

export default new ProfileEditView();
