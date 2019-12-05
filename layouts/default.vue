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
  padding: 50px;
  height: 100%;
}
.nuxt-container {
  margin: 30px;
}
.footer {
  background-color: #161d2d;
  margin: 0px -50px;
  color: white;
  padding: 50px;
}
</style>
