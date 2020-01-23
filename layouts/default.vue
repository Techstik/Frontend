<template>
  <div class="background">
    <div class="header">
      <nuxt-link to="/">
        <img :src="whiteLogo" />
      </nuxt-link>
      <nuxt-link to="/post">
        <a-button type="danger" class="btn-sm f-r btn-outline"
          >Post a job</a-button
        >
      </nuxt-link>
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
  background: #161d2d;
}
.header {
  padding: 30px 40px 20px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: rgba(22, 29, 45, 0.96);
  opacity: 0.95;
}
.header img {
  width: 150px;
}
.footer {
  background-color: #f49c73;
  color: #171e2d;
  padding: 50px;
}
.nuxt-container {
  min-height: 100vh;
  padding: 100px;
}

.btn-outline {
  background-color: transparent !important;
  color: #f3976b !important;
  border-color: #f3976b !important;
}
</style>
