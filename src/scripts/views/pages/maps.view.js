import mapboxgl from 'mapbox-gl';
import config from '../../config/app.config';

class MapsView {
  async render() {
    return String.raw`
      <div class="relative w-full h-full">
        <div id="map" class="w-full h-full"></div>

        <div class="absolute top-3 right-3 flex flex-col gap-3">
          <button class="rounded-full w-12 h-12 bg-white shadow-mdl">
            <iconify-icon icon="mdi:compass" class="text-xl" inline></iconify-icon>
          </button>

          <button class="rounded-full p-3 bg-white shadow-mdl">
            <iconify-icon icon="mdi:home" class="text-xl" inline></iconify-icon>
          </button>
        </div>
      </div>
    `;
  }

  async afterRender() {
    mapboxgl.accessToken = config.mapbox.token;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [112.7509655, -7.2564168],
      zoom: 13,
    });

    map.on('load', () => {
      console.log('map loaded');
    });
  }
}

export default new MapsView();
