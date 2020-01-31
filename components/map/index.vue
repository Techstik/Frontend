<template>
  <div>
    <div id="map"></div>
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import 'mapbox-gl/dist/mapbox-gl.css'
import Mapbox from 'mapbox-gl'

export default {
  data() {
    return {
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
  async mounted() {
    //TODO: move to env variable
    Mapbox.accessToken =
      'pk.eyJ1IjoibWF0dC1ncmVwcGwiLCJhIjoiY2s1ZTYxbHhvMXZvMzNqcmY0amtoMWg2YSJ9.9hJ2XBQZxFIoxhwbB1Pb4w'

    var location = await this.geolocate()

    this.geojson.features[0].geometry.coordinates = [location.lng, location.lat]

    this.map = new Mapbox.Map({
      container: 'map',
      style: 'mapbox://styles/matt-greppl/ck5s4wwut3c1p1ir8df8xwlcj',
      center: [location.lng, location.lat],
      zoom: 9
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
    })
  },
  methods: {
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
      var location = await this.reverseGeocode(coords)
      document.getElementById('coordinates').innerHTML = location
      document.getElementById('coordinates').style.display = 'block'
      this.$emit('location-updated', location)
    },
    async geolocate() {
      var API_key = 'AIzaSyDVa0vRTfMXY1qBXz1ctMDHZGpPhC6TRvU' //TODO: move to env variable

      var response = await this.$axios.$post(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${API_key}`
      )
      //TODO: check for errors here first

      return response.location
    },
    async reverseGeocode(coords) {
      var API_key = 'AIzaSyDVa0vRTfMXY1qBXz1ctMDHZGpPhC6TRvU' //TODO: move to env variable

      //limit this to 10 calls

      var response = await this.$axios.$get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${API_key}`
      )

      //TODO: change this to check for admin_level_1 fcity name
      switch (response.results.length) {
        case 0:
          return 'Unknown Location'
        case 1:
          return response.results[0].address_components[0].long_name
        default:
          return (
            response.results[response.results.length - 2].address_components[0]
              .long_name +
            ', ' +
            response.results[response.results.length - 2].address_components[1]
              .long_name
          )
      }
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
}
</style>
