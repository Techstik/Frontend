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
        <a-step title="Responsibilities" />
        <a-step title="Salary" />
        <a-step title="Finalise" />
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
              <div id="map"></div></div
          ></a-tab-pane>
          <a-tab-pane key="1" tab="role">Content of Tab 2</a-tab-pane>
        </a-tabs>
        <div class="navigation">
          <a-button v-if="activeStep > 0" type="primary" @click="previousStep">
            <a-icon type="left" />
            Previous
          </a-button>
          <a-button
            v-if="activeStep < 4"
            type="primary"
            class="f-r"
            @click="nextStep"
          >
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
      activeStep: 0
    }
  },
  computed: {
    activeStepToString() {
      return this.activeStep.toString()
    }
  },
  mounted() {
    Mapbox.accessToken =
      'pk.eyJ1IjoibWF0dC1ncmVwcGwiLCJhIjoiY2s1ZTYxbHhvMXZvMzNqcmY0amtoMWg2YSJ9.9hJ2XBQZxFIoxhwbB1Pb4w'
    this.map = new Mapbox.Map({
      container: 'map',
      style: 'mapbox://styles/matt-greppl/ck5e63lvc11ir1io1nvyeewxr'
    })
  },
  methods: {
    nextStep() {
      ++this.activeStep
    },
    previousStep() {
      --this.activeStep
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
</style>
