<template>
  <div class="card listing">
    <div class="card-body">
      <a-row>
        <a-col :span="24">
          <img class="company-image" :src="google" />
          <div class="content">
            <p class="position">Full Stack Web Developer</p>
            <p class="company">
              <span class="location"><img :src="globe" /> REMOTE</span>
              World Wide Technology
            </p>
          </div>
        </a-col>
      </a-row>
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
.company-image {
  width: 50px;
}
.company {
  font-size: 13px;
}
.content {
  display: inline-block;
  margin-left: 30px;
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
</style>
