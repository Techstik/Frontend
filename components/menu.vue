<template>
  <div class="menu-container">
    <h4>Jobs</h4>
    <h4>Your Portfolio</h4>
    <h4>API</h4>
    <a-button type="danger">Post a Job</a-button>
  </div>
</template>
<style scoped>
h4 {
  display: inline-block;
  margin-bottom: 0;
  margin-right: 30px;
  cursor: pointer;
}
h4:last-child {
  margin-right: 0px !important;
}

.menu-container {
  float: right;
  margin: 50px;
}
</style>
