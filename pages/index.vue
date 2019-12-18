<template>
  <div class="container">
    <div class="top-bar">
      <a-button type="danger">Post a job</a-button>
    </div>
    <h1 class="title">Find tech jobs around the world</h1>
    <div class="locations">
      <div class="location">
        <img :src="globe" />
        <p>Remote</p>
      </div>
      <div class="location">
        <img :src="pin" />
        <p>Location-based</p>
      </div>
    </div>
    <div class="filters">
      <a-button type="default">more filters</a-button>
    </div>
    <div class="listings">
      <listing />
    </div>
  </div>
</template>
<script>
import listing from '@/components/listing'
import backgroundShape from '@/assets/images/MoonBackground-01.svg'
import globe from '@/assets/images/planet-earth.svg'
import pin from '@/assets/images/pin.svg'

export default {
  components: {
    listing
  },
  data() {
    return {
      backgroundShape,
      globe,
      pin
    }
  }
}
</script>
<style scoped>
.background-shape {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
.title {
  text-align: center;
  padding: 10% 0;
  color: white;
  margin: 0;
}
.top-bar {
  text-align: right;
  position: fixed;
  top: 0;
  right: 0;
  margin: 30px;
}
.locations {
  text-align: center;
}
.location {
  display: inline-block;
  border: 2px solid #c5c5c5;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 0px 15px;
  min-width: 175px;
  cursor: pointer;
  background: white;
  -webkit-box-shadow: 0px 20px 30px 0px rgba(121, 128, 150, 0.22);
  box-shadow: 0px 20px 30px 0px rgba(121, 128, 150, 0.22);
}
.location img {
  width: 40px;
}
.location p {
  margin-bottom: 0;
}
.filters {
  text-align: center;
  margin-top: 15px;
}
.listings {
  margin-top: 30px;
  text-align: center;
}
</style>
