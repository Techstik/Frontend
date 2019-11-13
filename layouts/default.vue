<template>
  <div class="background">
    <div class="card">
      <Menu />
      <div class="nuxt-container">
        <nuxt />
      </div>
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
import Menu from '@/components/menu'
export default {
  components: {
    Menu
  }
}
</script>
<style scoped>
.background {
  padding: 50px;
  height: 100%;
}
.card {
  height: 100%;
  background-color: white;
  margin: auto;
  margin-bottom: 50px;
  border-radius: 10px;
  -webkit-box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
  box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
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
