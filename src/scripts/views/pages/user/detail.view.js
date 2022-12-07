import { service } from '../../../sdk';
import { fromNow } from '../../../utils/date';
import UrlParser from '../../../utils/url.parser';
import { createPageHeader } from '../../templates/creator.template';

class UserDetailView {
  renderHeader() {
    return createPageHeader({
      title: 'Profile',
    });
  }

  async render() {
    return String.raw`
      <div x-data="userDetail">
        <template x-if="profile && !isLoading">
          <div class="p-4">
            <div class="flex flex-row mx-auto mb-6">
              <div>
                <img x-bind:data-src="profile.avatar_url" alt="Profile Picture" class="lazyload lazypreload rounded-full w-24" referrerpolicy="no-referrer" src="images/loading.gif">
              </div>
              <div class="flex flex-col gap-2 self-center ml-4">
                <h1 class="capitalize text-xl text-gray-900 font-semibold" x-text="profile.full_name"></h1>
                <p class="text-gray-700 text-sm">Bergabung <b x-text="fromNow(profile.created_at)"></b> yang lalu.</p>
              </div>
            </div>

            <div class="mb-6">
              <label for="about" class="form-control-label">About</label>
              <p class="leading-6 text-sm text-gray-700 break-all" x-text="profile.description"></p>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex justify-between mb-3">
                <label class="form-control-label">Email</label>
                <span x-text="profile.email"></span>
              </div>

              <div class="flex justify-between mb-3">
                <label class="form-control-label">Phone</label>
                <span x-text="profile.phone || '-'"></span>
              </div>
            </div>
              
            <div class="mb-6">
              <label class="form-control-label">Alamat</label>
              <p class="leading-6 text-sm text-gray-700 break-all" x-text="profile.address || '-'"></p>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  async afterRender(alpine) {
    const { id } = UrlParser.parseActiveUrlWithoutCombiner();

    alpine.data('userDetail', () => ({
      profile: null,
      registeredAt: 'baru saya',
      isLoading: true,
      async init() {
        const profile = await service.user.profile(id);

        console.log(profile);
        this.profile = profile;
        this.isLoading = false;
      },
      fromNow(date) {
        return fromNow(date);
      },
    }));
  }
}

export default new UserDetailView();
