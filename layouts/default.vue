<template>
  <div class="background">
    <div class="card">
      <nuxt />
    </div>
  </div>
</template>
<style scoped>
.background {
  padding: 50px;
  height: 100%;
}
.card {
  height: 100%;
  background-color: white;
  width: 90%;
  margin: auto;
  border-radius: 10px;
  -webkit-box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
  box-shadow: 10px -1px 40px -17px rgba(0, 0, 0, 0.75);
}
</style>
