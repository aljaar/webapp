import Mapbox from 'mapbox-gl';
import config from '../../config/app.config';
import { service } from '../../sdk';

class MapsView {
  async render() {
    return String.raw`
      <div x-data="maps" class="relative w-full h-full">
        <div class="absolute w-72 text-center z-10 top-3 left-1/2 transform -translate-x-1/2">
          <span class="text-[11px] rounded-lg px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-600">
            dalam radius <b>200m</b>.
          </span>
        </div>

        <div id="map" class="w-full h-full"></div>

        <div class="absolute z-10 top-3 right-3 flex flex-col gap-3">
          <button @click="currentPositionHandler()" class="rounded-full w-12 h-12 bg-white shadow-mdl">
            <iconify-icon icon="mdi:compass" class="text-xl" inline></iconify-icon>
          </button>

          <button @click="homePositionHandler()" class="rounded-full p-3 bg-white shadow-mdl">
            <iconify-icon icon="mdi:home" class="text-xl" inline></iconify-icon>
          </button>
        </div>

        <template x-if="product">
          <section id="product" class="absolute w-[calc(100%-1.5em)] text-center z-10 bottom-12 left-3">
            <div class="flex rounded-lg bg-white shadow-mdl h-24">
              <img class="lazyload w-32 h-24 object-cover rounded" x-bind:data-src="image(product.image)" x-bind:alt="product.title">
              
              <div class="flex flex-col gap-2 p-3">
                <a x-bind:href="'/#/product/' + product.product_id">
                  <h3 x-text="product.title" class="font-bold"></h3>
                </a>
                <div class="flex gap-2 text-xs items-center">
                  <img x-bind:data-src="product.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload rounded-full w-4" alt="">
                  <span x-text="product.profile.full_name"></span>
                </div>
                <div class="flex gap-4">
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:map-pin-2-line"></iconify-icon>
                    <span x-text="(product.distance * 100).toFixed(2) + 'm'"></span>
                  </div>
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:eye-line"></iconify-icon>
                    <span>99</span>
                  </div>
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:hand-heart-line"></iconify-icon>
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>
      </div>
    `;
  }

  async afterRender(alpine) {
    Mapbox.accessToken = config.mapbox.token;

    const map = new Mapbox.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [112.7509655, -7.2564168],
      zoom: 14,
    });

    alpine.data('maps', () => ({
      product: null,
      async init() {
        const { data: points } = await service.lists.nearMap(200);

        map.on('load', () => {
          map.addControl(new Mapbox.NavigationControl(), 'top-left');

          map.addSource('points', {
            type: 'geojson',
            cluster: true,
            clusterRadius: 80,
            data: points,
          });
          // Menampilkan circle pada cluster
          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'points',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 18,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // Menampilkan layer jumlah cluster
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'points',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            },
          });

          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'points',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#11b4da',
              'circle-radius': 12,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;

            map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom,
              });
            });
          });

          map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            console.log(e.features[0].properties, coordinates);

            this.product = e.features[0].properties;
            this.product.profile = JSON.parse(this.product.profile);
          });
        });
      },
      image(item) {
        const { data: { publicUrl } } = service.helpers.usePublicUrl(item);
        return publicUrl;
      },
      currentPositionHandler() {

      },
      homePositionHandler() {

      },
    }));
  }
}

export default new MapsView();
