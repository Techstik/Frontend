<template>
  <div>
    <gallery :images="images" :index="index" @close="index = null" />
    <div
      v-for="(image, imageIndex) in images"
      :key="imageIndex"
      class="gallery-image"
      :style="{
        backgroundImage: 'url(' + image + ')',
        width: '33%',
        height: '150px'
      }"
      @click="index = imageIndex"
    ></div>
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
}
</style>
