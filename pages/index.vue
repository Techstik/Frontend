<template>
  <div class="container">
    <div
      class="background-shape"
      :style="{
        background: `url(${backgroundShape}) no-repeat scroll top left`
      }"
    ></div>
  </div>
</template>
<script>
import backgroundShape from '@/assets/images/background-shape.png'
export default {
  data() {
    return {
      backgroundShape
    }
  }
}
</script>
<style scoped>
.background-shape {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
</style>
