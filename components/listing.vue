<template>
  <div class="card listing">
    <div class="card-body">
      <div class="title">
        <img class="company-image" :src="google" />
        <div class="content">
          <p class="position">Full Stack Web Developer</p>
          <p class="company">
            World Wide Technology
          </p>
        </div>
      </div>
      <a-progress :percent="30" :format="() => 'Junior'" />
      <p>$90-100k p/a</p>
      <a-divider> <img class="divider" :src="globe"/></a-divider>
    </div>
  </div>
</template>
<script>
import google from '@/assets/images/google.png'
import globe from '@/assets/images/planet-earth.svg'

export default {
  data() {
    return {
      google,
      globe
    }
  }
}
</script>
<style scoped>
.listing {
  text-align: left;
  margin: 15px;
  height: 250px;
}
.title {
  margin-bottom: 10px;
}
.company-image {
  width: 50px;
  position: absolute;
}
.company {
  font-size: 13px;
}
.content {
  display: inline-block;
  margin-left: 60px;
}
.content p {
  margin-bottom: 0px;
}
.position {
  font-size: 23px;
}
.location {
  border: 1px solid;
  width: fit-content;
  padding: 4px;
  border-radius: 20px;
  font-size: 10px;
}
.location img {
  width: 16px;
}
.divider {
  width: 20px;
}
</style>
