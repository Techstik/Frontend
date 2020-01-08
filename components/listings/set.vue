<template>
  <div>
    <a-row
      type="flex"
      justify="space-around"
      :align="listingRevealed ? 'top' : 'middle'"
      class="_row"
    >
      <a-col id="column_for_listing_8797" :span="8" class="_column">
        <listing
          ref="_listing_8797"
          v-model="testlisting"
          @collapsing="resetColumns"
        />
      </a-col>
      <a-col id="column_for_listing_8798" :span="8" class="_column">
        <listing
          ref="_listing_8798"
          v-model="testlisting"
          @revealing="onListingReveal"
          @collapsing="resetColumns"
        />
      </a-col>
      <a-col id="column_for_listing_8799" :span="8" class="_column">
        <listing
          ref="_listing_8799"
          v-model="testlisting"
          @collapsing="resetColumns"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script>
import listing from './listing'

export default {
  components: {
    listing
  },
  props: {
    listings: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      listingRevealed: false,
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
  },
  methods: {
    onListingReveal(listingId) {
      if (this.listingRevealed) return

      this.listingRevealed = true

      //TODO: loop through the listings prop instead

      var columns = document.getElementsByClassName('_column')
      for (let index = 0; index < 3; index++) {
        //TODO: set this count to the length of the prop array
        columns[index].classList.remove('_column_selected')

        if (columns[index].id == `column_for_listing_${listingId}`) {
          this.$refs[columns[index].id].setThumbnail(false)
          columns[index].classList.add('_column_selected')
        } else {
          this.$refs[columns[index].id].setThumbnail(true)
          columns[index].classList.add('column_unselected')
        }
      }
    },
    resetColumns() {
      console.log('hit')
      this.listingRevealed = false

      var columns = document.getElementsByClassName('_column')
      for (let index = 0; index < 3; index++) {
        //TODO: set this count to the length of the prop array
        columns[index].classList.remove('_column_selected', 'column_unselected')
        this.$refs[columns[index].id].setThumbnail(false)
      }
    }
  }
}
</script>
<style scoped>
.column_unselected {
  width: 15%;
}

._column_selected {
  width: 70%;
}
* {
  transition: all 0.3s ease 0s;
}
</style>
