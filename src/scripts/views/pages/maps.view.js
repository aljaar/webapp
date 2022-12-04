import circle from '@turf/circle';
import { point } from '@turf/helpers';
import Mapbox from 'mapbox-gl';
import config from '../../config/app.config';
import { service } from '../../sdk';
import { createPageHeader } from '../templates/creator.template';

class MapsView {
  renderHeader() {
    return createPageHeader({
      title: 'Maps',
    });
  }

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
            <div class="flex items-center rounded-lg bg-white shadow-mdl h-24 gap-4">
              <img class="lazyload lazypreload w-32 h-24 object-cover rounded" x-bind:data-src="image(product.image)" src="images/loading.gif" x-bind:alt="product.title">
              
              <div class="h-24 flex flex-col flex-1 justify-between py-3 text-left">
                <a x-bind:href="'/#/product/' + product.product_id">
                  <h3 x-text="product.title" class="font-semibold"></h3>
                </a>
                <div class="flex gap-2 text-xs items-center">
                  <img x-bind:data-src="product.profile.avatar_url" referrerpolicy="no-referrer" class="lazyload rounded-full w-4" alt="">
                  <span x-text="product.profile.full_name"></span>
                </div>
                <div class="flex gap-4">
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:map-pin-2-line"></iconify-icon>
                    <span x-text="(product.distance).toFixed(2) + 'm'"></span>
                  </div>
                  <div class="flex gap-2 text-xs items-center">
                    <iconify-icon icon="ri:eye-line"></iconify-icon>
                    <span x-text="product.view"></span>
                  </div>
                </div>
              </div>

              <a x-bind:href="'/#/product/' + product.product_id" class="flex items-center justify-center rounded-full hover:bg-gray-100 w-12 h-12">
                <iconify-icon icon="heroicons-outline:arrow-right" inline></iconify-icon>
              </a>
            </div>
          </section>
        </template>
      </div>
    `;
  }

  async afterRender(alpine) {
    Mapbox.accessToken = config.mapbox.token;

    const user = service.user.me();

    const createMarker = (type, coordinate) => {
      const markerElement = document.createElement('iconify-icon');
      markerElement.classList.add('text-3xl');

      switch (type) {
        case 'home':
          markerElement.setAttribute('icon', 'mdi:home-map-marker');
          markerElement.classList.add('text-blue-600');
          break;
        case 'food':
          markerElement.setAttribute('icon', 'mdi:food');
          markerElement.classList.add('text-red-600');
          break;
        case 'non-food':
          markerElement.setAttribute('icon', 'ri:shopping-bag-3-line');
          markerElement.classList.add('text-yellow-600');
          break;
        default:
          break;
      }

      return new Mapbox.Marker(markerElement).setLngLat(coordinate);
    };

    alpine.data('maps', () => ({
      map: null,
      geolocate: null,
      product: null,
      async init() {
        this.map = new Mapbox.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [user.location.lon, user.location.lat],
          zoom: 16.4,
        });
        const { data: points } = await service.lists.nearMap(200);

        const circleDataSource = circle(
          point([user.location.lon, user.location.lat]),
          200,
          {
            steps: 50,
            units: 'meters',
          },
        );

        this.map.on('load', () => {
          this.map.addControl(new Mapbox.NavigationControl(), 'top-left');

          this.geolocate = new Mapbox.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          });

          this.map.addControl(this.geolocate, 'top-left');

          const home = createMarker('home', [user.location.lon, user.location.lat]).addTo(this.map);

          this.map.addSource('points', {
            type: 'geojson',
            cluster: true,
            clusterRadius: 80,
            data: points,
          });

          // create a circle radius
          this.map.addSource('radius', {
            type: 'geojson',
            data: circleDataSource,
          });

          // Menampilkan circle pada cluster
          this.map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'points',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': '#16a34a',
              'circle-radius': 18,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            },
          });

          // Menampilkan layer jumlah cluster
          this.map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'points',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-size': 12,
            },
          });

          this.map.addLayer({
            id: 'unclustered-point-shadow',
            type: 'circle',
            source: 'points',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-radius': 12,
              'circle-color': '#000',
              'circle-blur': 0.7,
            },
          });

          this.map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'points',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#16a34a',
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            },
          });

          this.map.addLayer({
            id: 'radius-circle',
            type: 'fill',
            source: 'radius',
            paint: {
              'fill-color': 'blue',
              'fill-opacity': 0.1,
            },
          });

          this.map.on('click', 'clusters', (e) => {
            const features = this.map.queryRenderedFeatures(e.point, {
              layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;

            this.map.getSource('points').getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              this.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom,
              });
            });
          });

          this.map.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // console.log(e.features[0].properties, coordinates);

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
        this.geolocate.trigger();
      },
      homePositionHandler() {
        this.map.flyTo({
          center: [user.location.lon, user.location.lat],
          essential: true,
          zoom: 16.4,
        });
      },
    }));
  }
}

export default new MapsView();
