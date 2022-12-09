import { service } from '../../sdk';
import toastHelpers from '../../utils/toast.helpers';
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
            <img id="profile" src="https://iifjmhhbusjlypxbpniy.supabase.co/storage/v1/object/public/avatars/public/avatar.default.webp" class="w-24 h-24 object-cover rounded-full" alt="Profile Picture">

            <button @click="changeAvatar" class="absolute bottom-1 right-1 shadow-mdl w-6 h-6 bg-gray-800 rounded-full">
              <iconify-icon icon="mdi:camera" class="text-[14px] text-white" inline></iconify-icon>
            </button>

            <input type="file" accept=".jpg,.jpeg,.png,.gif" class="hidden" id="avatar" @change="onNewAvatar">
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <div>
            <label for="full-name" class="form-control-label">Full Name</label>
            <input type="text" id="full-name" class="form-control" x-model="full_name">
          </div>
          <div>
            <label for="email" class="form-control-label">Email</label>
            <input type="email" id="email" class="form-control" disabled>
          </div>
          <div>
            <label for="phone" class="form-control-label">Phone</label>
            <input type="text" id="tag" class="form-control" x-model="phone">
          </div>
          <div>
            <label for="about" class="form-control-label">Bio Singkat</label>
            <textarea id="about" class="form-control" x-model="about"></textarea>
          </div>
          <div class="flex justify-center my-6">
            <button @click="saveChanges" class="w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-emerald-600 text-white hover:bg-emerald-700">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender(alpine) {
    const user = service.user.me();

    document.querySelector('#email').value = user.email;
    document.querySelector('#profile').src = user.profile.avatar_url;

    alpine.data('profileEdit', () => ({
      full_name: user.profile.full_name,
      phone: user.profile.phone,
      about: user.profile.description,
      avatar: null,
      changeAvatar() {
        document.querySelector('#avatar').click();
      },
      onNewAvatar(event) {
        const [file] = event.target.files;
        if (file) {
          this.avatar = file;

          document.querySelector('#profile').src = URL.createObjectURL(file);
        }
      },
      async saveChanges() {
        const data = {
          full_name: this.full_name,
          phone: this.phone,
          description: this.about,
        };

        if (this.avatar) {
          data.avatar = this.avatar;
        }

        const loading = toastHelpers.loading();
        const result = await service.user.update(data);

        await service.auth.user();

        toastHelpers.dismiss(loading);

        if (!result.error) {
          toastHelpers.success('Profil berhasil di update');
        } else {
          toastHelpers.error('Profil gagal di update');
        }
      },
    }));
  }
}

export default new ProfileEditView();
