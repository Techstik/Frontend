<template>
  <div>
    <div class="top-bar"></div>
    <h1 class="title heading heading--x-large">
      Find tech jobs around the world
    </h1>
  </div>
</template>
<script>
import { functions } from '@/plugins/firebase'

export default {
  data() {
    return {
      countries: []
    }
  },

  mounted() {
    // this.countries.forEach(country => {
    //   db.collection('countries')
    //     .add(country)
    //     .then(function() {})
    //     .catch(function(error) {
    //       console.error('Error adding document: ', error)
    //     })
    // })
  }
}
</script>
