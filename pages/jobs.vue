<template>
  <div class="container">
    <a-row class="search-bar">
      <a-col :span="6">filter dropdown here</a-col>
      <a-col :span="12"> <a-input placeholder="Basic usage"/></a-col>
    </a-row>
    <a-row>
      <a-col :span="4">jop types</a-col>
      <a-col :span="16">
        <div class="posting-container">
          <div class="posting">
            <p>test</p>
            <p>post</p>
          </div>
          <div class="posting">
            <p>test</p>
            <p>post</p>
          </div>
        </div>
      </a-col>
      <a-col :span="4">alerts</a-col>
    </a-row>
  </div>
</template>
<style scoped>
.posting-container {
  background-color: #d8d8d8;
  padding: 20px;
  border-radius: 25px;
}
.posting {
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.posting:last-child {
  margin-bottom: 0px;
}
.search-bar {
  margin-bottom: 20px;
}
.search-bar input {
  border-width: 10px;
  padding: 13px;
  border-color: #a8d0e6;
}
</style>
