<template>
  <div @mouseenter="setMapScrolling(true)" @mouseleave="setMapScrolling(false)">
    <Skeleton v-if="loading" :height="height" />
    <div
      :id="id"
      ref="map_container"
      :style="{ height: `${height}px` }"
      class="map_container loading"
    ></div>
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import Mapbox from 'mapbox-gl'
import Skeleton from './skeleton'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    Skeleton
  },
  props: {
    coords: {
      type: Object,
      default: null
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      loading: true,
      id: `map_${Math.floor(Math.random() * 100000 + 1)}`,
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0, 0]
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      locationRequestAnswered: state => state.location.requestAnswered,
      countries: state => state.countries.all
    })
  },
  watch: {
    locationRequestAnswered(answered) {
      if (answered) this.initialize()
    }
  },
  mounted() {
    if (!this.coords && !this.$getFromLocalStorage('lp'))
      this.$requestLocationPermission()
    else this.initialize()
  },
  methods: {
    ...mapMutations({
      setMapScrolling: 'paging/setScrollingMap'
    }),
    async initialize() {
      Mapbox.accessToken = process.env.MAPBOX_ACCESS_TOKEN

      let location

      if (this.$getFromLocalStorage('lp') === 'true' && !this.coords)
        location = await this.geolocate()
      else if (this.coords)
        location = {
          lat: this.coords.lat,
          lng: this.coords.lng
        }
      else
        location = {
          lat: 37,
          lng: -122
        }

      this.geojson.features[0].geometry.coordinates = [
        location.lng,
        location.lat
      ]

      this.map = new Mapbox.Map({
        container: this.id,
        style: 'mapbox://styles/matt-greppl/ck5s4wwut3c1p1ir8df8xwlcj',
        center: [location.lng, location.lat],
        zoom: 9,
        minZoom: 1,
        maxZoom: 15
      })

      this.displaySelectedLocation(location)

      var canvas = this.map.getCanvasContainer()

      this.map.on('load', () => {
        // Add a single point to the map
        this.map.addSource('point', {
          type: 'geojson',
          data: this.geojson
        })

        this.map.addLayer({
          id: 'point',
          type: 'circle',
          source: 'point',
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
          }
        })

        if (!this.coords) {
          // When the cursor enters a feature in the point layer, prepare for dragging.
          this.map.on('mouseenter', 'point', () => {
            this.map.setPaintProperty('point', 'circle-color', '#3bb2d0')
            canvas.style.cursor = 'move'
          })

          this.map.on('mouseleave', 'point', () => {
            this.map.setPaintProperty('point', 'circle-color', '#3887be')
            canvas.style.cursor = ''
          })

          this.map.on('mousedown', 'point', e => {
            // Prevent the default map drag behavior.
            e.preventDefault()

            canvas.style.cursor = 'grab'

            this.map.on('mousemove', this.onMapMove)
            this.map.once('mouseup', this.onMapUp)
          })

          this.map.on('touchstart', 'point', e => {
            if (e.points.length !== 1) return

            // Prevent the default map drag behavior.
            e.preventDefault()

            this.map.on('touchmove', this.onMapMove)
            this.map.once('touchend', this.onMapUp)
          })
        }

        this.$refs.map_container.classList.remove('loading')
        this.loading = false
      })
    },
    onMapMove(e) {
      var coords = e.lngLat

      // Set a UI indicator for dragging.
      this.map.getCanvasContainer().style.cursor = 'grabbing'

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      this.geojson.features[0].geometry.coordinates = [coords.lng, coords.lat]
      this.map.getSource('point').setData(this.geojson)
    },
    onMapUp(e) {
      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      this.displaySelectedLocation(e.lngLat)
      this.map.getCanvasContainer().style.cursor = ''

      // Unbind mouse/touch events
      this.map.off('mousemove', this.onMapMove)
      this.map.off('touchmove', this.onMapMove)
    },
    async displaySelectedLocation(coords) {
      if (this.coords) return
      var physical = await this.reverseGeocode(coords)
      document.getElementById(
        'coordinates'
      ).innerHTML = `${physical[0]}, ${physical[1]}`
      document.getElementById('coordinates').style.display = 'block'

      let country = this.countries.find(country => {
        return (
          country.name == physical[1] || country.alternate_name == physical[1]
        )
      })

      let location = {
        physical: physical,
        coords: { lat: coords.lat.toString(), lng: coords.lng.toString() },
        countryCode: country ? country.code : physical[1]
      }

      this.$emit('location-updated', location)

      if (!country)
        this.$bugsnag.notify(
          new Error(`Alternate country name required! See custom tab`),
          {
            severity: 'info',
            metaData: {
              explanation:
                'The country mapbox returned after dropping the pin cannot be found in our list of countries. Add an alternate name for this country.',
              destination: 'components/map/index.vue',
              city: physical[0],
              country: physical[1]
            }
          }
        )
    },
    async geolocate() {
      var response = await this.$axios.$post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_API_KEY}`
      )
      //TODO: check for errors here first

      return response.location
    },
    async reverseGeocode(coords) {
      //TODO: limit this to 10 calls

      var response = await this.$axios.$get(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATION_IQ_API_KEY}&lat=${coords.lat}&lon=${coords.lng}&format=json`
      )

      let city = response.address.city
        ? response.address.city
        : response.address.state
        ? response.address.state
        : response.address.region
        ? response.address.region
        : ''

      return [city, response.address.country]
    }
  }
}
</script>
<style scoped>
.coordinates {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 40px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  display: none;
  font-family: 'Graphik', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
}
.loading {
  opacity: 0;
  position: absolute;
  width: 100%;
}
.loading-text {
  text-align: center;
  padding: 45px 0px;
}
</style>
<style>
.mapboxgl-map {
  height: 100vh;
  max-height: 300px;
  border-radius: 10px;
}

canvas.mapboxgl-canvas:focus {
  outline: none;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib {
  background-color: transparent !important;
  font-family: 'Graphik', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
}

.mapboxgl-ctrl-attrib .mapbox-improve-map {
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
}
</style>
