<template>
  <div>
    <h1 class="title heading heading--x-large pb-0">
      Welcome to the world's opportunities
    </h1>
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
      <listingSet
        v-for="chunk in chunkedListings"
        :key="chunk.id"
        :listings="chunk"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import listingSet from '@/components/listings/set'
import globe from '@/assets/images/planet-earth.svg'
import pin from '@/assets/images/pin.svg'

export default {
  components: {
    listingSet
  },
  data() {
    return {
      globe,
      pin
    }
  },
  computed: {
    ...mapState({
      listings: state => state.listings.all
    }),
    chunkedListings() {
      return this.lodash.chunk(this.listings, 3)
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
.title {
  margin-bottom: 100px;
}
</style>
