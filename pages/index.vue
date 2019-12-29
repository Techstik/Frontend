<template>
  <div class="container">
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
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
      </a-row>
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
        <a-col :span="8"> <listing v-model="testlisting" /> </a-col>
      </a-row>
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
      pin,
      testlisting: {
        position: 'Full Stack Developer',
        company: 'World Wide Technology',
        website: '',
        logo: '',
        experience: ['Senior'],
        tech: ['vue', 'node', 'mongo', 'mongo'],
        remote: true,
        locationbased: false,
        location: '',
        dateposted: null
      }
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
  margin: auto;
  max-width: 1500px;
}
</style>
