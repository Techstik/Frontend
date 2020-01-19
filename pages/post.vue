<template>
  <div>
    <h1 class="title heading heading--x-large pb-0">
      Make your search available to the tech world
    </h1>
    <div class="container">
      <p class="align-center sub-title">Add some text here</p>
      <a-steps :current="activeStep" class="mb-30">
        <a-step title="Your Company" />
        <a-step title="The Role" />
        <a-step title="Requirements" />
        <a-step title="How To Apply" />
        <a-step title="finalize" />
      </a-steps>
      <div class="card">
        <a-tabs
          v-model="activeStepToString"
          tab-position="top"
          class="add-listing-tabs"
        >
          <a-tab-pane key="0" tab="company-info">
            <div class="section">
              <h4 class="mb-0">
                A quick intro of your company
                <a-badge
                  count="required"
                  :number-style="{ backgroundColor: '#52c41a' }"
                />
              </h4>
              <p>Some text here (keep it short)</p>
              <ckeditor :editor="editor"></ckeditor>
            </div>
            <div class="section">
              <h4>Website URL</h4>
              <a-input default-value="mysite">
                <a-select slot="addonBefore" default-value="https://">
                  <a-select-option value="http://">http://</a-select-option>
                  <a-select-option value="https://">https://</a-select-option>
                </a-select>
              </a-input>
            </div>
            <div class="section">
              <h4 class="mb-0">Where are you based?</h4>
              <p>
                Your company HQ - it's nice to see, even if this is a remote
                position
              </p>
              <div id="map"></div>
              <pre id="coordinates" class="coordinates"></pre></div
          ></a-tab-pane>
          <a-tab-pane key="1" tab="role">
            <div class="section">
              <h4 class="mb-0">
                About the role
              </h4>
              <p>Some text here (keep it short)</p>
              <ckeditor :editor="editor" class="h-200 "></ckeditor>
            </div>
            <div class="section">
              <h4>
                Responsibilities
              </h4>
              <div class="requirements">
                <a-input v-for="n in 3" :key="n" />
              </div>
            </div>
            <div class="section">
              <h4>
                Salary
              </h4>
              <a-radio-group name="radioGroup" :default-value="1">
                <a-row>
                  <a-col span="12">
                    <div class="salary-block">
                      <a-radio :value="1"><h4>Set amount</h4></a-radio>
                      <a-input placeholder="Basic usage">
                        <span slot="prefix">USD </span>
                      </a-input>
                    </div>
                  </a-col>
                  <a-col span="12">
                    <div class="salary-block">
                      <a-radio :value="2"
                        ><h4>Experience Dependent</h4></a-radio
                      >
                      <a-input-group>
                        <a-row>
                          <a-col :span="11">
                            <a-input placeholder="From">
                              <span slot="prefix">USD </span>
                            </a-input>
                          </a-col>
                          <a-col span="2" class="align-center">
                            -
                          </a-col>
                          <a-col :span="11">
                            <a-input placeholder="To">
                              <span slot="prefix">USD </span>
                            </a-input>
                          </a-col>
                        </a-row>
                      </a-input-group>
                    </div>
                  </a-col>
                </a-row>
              </a-radio-group>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="requirements">
            <div class="section">
              <h4>
                Experience Level(s) Required
              </h4>
              <div class="experience-level">
                <a-checkbox @change="onChange"></a-checkbox>
                <a-progress
                  stroke-width="15"
                  :percent="33"
                  :show-info="false"
                />
              </div>
              <div class="experience-level">
                <a-checkbox @change="onChange"></a-checkbox>
                <a-progress
                  stroke-width="15"
                  stroke-color="orange"
                  :percent="66"
                  :show-info="false"
                />
              </div>
              <div class="experience-level">
                <a-checkbox @change="onChange"></a-checkbox>
                <a-progress
                  stroke-width="15"
                  stroke-color="black"
                  :percent="100"
                  :show-info="false"
                />
              </div>
            </div>
            <div class="section">
              <h4 class="mb-0">
                Requirements
              </h4>
              <p>Some text here (keep it short)</p>
              <div class="requirements">
                <a-input v-for="n in 3" :key="n" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="application"> </a-tab-pane>
          <a-tab-pane key="2" tab="finalize"> </a-tab-pane>
        </a-tabs>
        <div class="navigation">
          <a-button v-if="activeStep > 0" @click="previousStep">
            <a-icon type="left" />
            Previous
          </a-button>
          <a-button v-if="activeStep < 4" class="f-r" @click="nextStep">
            Next
            <a-icon type="right" />
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-inline'

import 'mapbox-gl/dist/mapbox-gl.css'
import Mapbox from 'mapbox-gl'

export default {
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: ClassicEditor,
      place: null,
      map: null,
      activeStep: 0,
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
    activeStepToString() {
      return this.activeStep.toString()
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
      style: 'mapbox://styles/matt-greppl/ck5e63lvc11ir1io1nvyeewxr',
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
    nextStep() {
      ++this.activeStep
    },
    previousStep() {
      --this.activeStep
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
      document.getElementById(
        'coordinates'
      ).innerHTML = await this.reverseGeocode(coords)
      document.getElementById('coordinates').style.display = 'block'
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
.container {
  max-width: 1500px;
}
.card {
  padding: 25px;
}
.section {
  margin-bottom: 15px;
}
.mb-30 {
  margin-bottom: 30px;
}
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

.requirements input {
  border: 2px solid black;
  margin-bottom: 10px;
  height: 45px;
  border-radius: 2px;
}

.requirements input:last-child {
  margin-bottom: 0px;
}

.experience-level div {
  position: relative;
  width: calc(100% - 30px);
  font-size: 14px;
  float: right;
}

.experience-level {
  margin-bottom: 10px;
}
.salary-block {
  padding: 15px;
  border: 2px solid black;
  border-radius: 2px;
}
.salary-block label {
  margin-bottom: 10px;
}
.salary-block h4 {
  display: inherit;
}
</style>
