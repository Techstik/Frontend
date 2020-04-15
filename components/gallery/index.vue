<template>
  <div class="gallery-container">
    <gallery :images="images" :index="index" @close="index = null" />
    <img
      v-for="(image, imageIndex) in images"
      :key="imageIndex"
      v-lazy="image"
      :alt="altTag"
      class="gallery-image"
      @click="index = imageIndex"
    />
  </div>
</template>
<script>
import VueGallery from 'vue-gallery'

export default {
  components: {
    gallery: VueGallery
  },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    altTag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      index: null
    }
  }
}
</script>
<style scoped>
.gallery-image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 2px solid #ebebeb;
  border-radius: 6px;
  margin: 5px;
  cursor: pointer;
  max-width: 20%;
  height: auto;
  padding: 0.8em;
}
img[lazy='loading'] {
  border-color: #303c6c;
}
@media (max-width: 750px) {
  .gallery-image {
    max-width: 30%;
  }
}
</style>
