import Mapbox from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import config from '../../config/app.config';
import { service } from '../../sdk';
import toastHelpers from '../../utils/toast.helpers';
import { createPageHeader } from '../templates/creator.template';
import { redirect } from '../../utils/helpers';

class UserLocationView {
  renderHeader() {
    return createPageHeader({
      title: 'Lokasi Saya',
    });
  }

  render() {
    return String.raw`
      <div x-data="currentLocation" class="relative w-full h-full">
        <div id="map" class="w-full h-full"></div>

        <button @click="setLocation" class="absolute bottom-6 left-4 w-[calc(100%-32px)] py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow">
          Update Lokasi Saya
        </button>
      </div>
    `;
  }

  async afterRender(alpine) {
    Mapbox.accessToken = config.mapbox.token;

    const user = service.user.me();

    alpine.data('currentLocation', () => ({
      map: null,
      async init() {
        if (!user.location) {
          const { data: location } = await service.auth.updateWithCurrentLocation();

          user.location = {
            lat: location.latitude,
            lon: location.longitude,
          };
        }

        this.map = new Mapbox.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [user.location.lon, user.location.lat],
          zoom: 16,
        });

        const geocoder = new MapboxGeocoder({
          accessToken: Mapbox.accessToken,
          countries: 'id',
          mapboxgl: Mapbox,
        });

        this.map.addControl(geocoder, 'top-left');
        this.map.addControl(
          new Mapbox.NavigationControl(),
        );
        this.map.addControl(
          new Mapbox.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
        );
        this.map.addControl(new Mapbox.FullscreenControl());

        const icon = document.createElement('iconify-icon');
        icon.setAttribute('icon', 'mdi:map-marker');
        icon.classList.add('text-5xl', 'text-green-600');

        const marker = new Mapbox.Marker(icon).setLngLat(this.map.getCenter()).addTo(this.map);

        this.map.on('move', () => {
          marker.setLngLat(this.map.getCenter());
        });
      },
      async setLocation() {
        const center = this.map.getCenter();

        const loading = toastHelpers.loading();
        await service.user.updateLocation({
          lat: center.lat,
          lng: center.lng,
        });
        await service.user.getAddress({
          location: {
            lat: center.lat,
            lon: center.lon,
          },
          profile: {
            address: null,
          },
        }, true);
        await service.auth.user();

        toastHelpers.dismiss(loading);
        toastHelpers.success('Lokasi anda berhasil diupdate.');

        redirect('#/profile');
      },
    }));
  }
}

export default new UserLocationView();
