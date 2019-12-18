<template>
  <div class="background">
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
<style scoped>
.background {
  height: 100%;
  background-image: url(/_nuxt/assets/images/MoonBackground-01.svg);
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-size: cover;
}
.footer {
  background-color: #161d2d;
  color: white;
  padding: 50px;
}
.nuxt-container {
  min-height: 100%;
  padding: 50px;
}
</style>
