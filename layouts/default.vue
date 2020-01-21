<template>
  <div class="background">
    <div class="header">
      <img :src="whiteLogo" />
    </div>
    <div class="nuxt-container">
      <nuxt />
    </div>
    <div class="footer">
      <a-row>
        <a-col :span="12">accepted cards</a-col>
        <a-col :span="12">col-6</a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import whiteLogo from '@/assets/images/logos/yellow-background.svg'
export default {
  data() {
    return {
      whiteLogo
    }
  }
}
</script>
<style scoped>
.background {
  min-height: 100%;
  /* background-image: url(/_nuxt/assets/images/MoonBackground-01.svg);
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-size: cover; */
  background: #303c6c;
}
.header {
  padding: 30px 40px 20px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: #303c6c;
  opacity: 0.95;
}
.header img {
  width: 150px;
}
.footer {
  background-color: #161d2d;
  color: white;
  padding: 50px;
}
.nuxt-container {
  min-height: 100vh;
  padding: 100px;
}
</style>
