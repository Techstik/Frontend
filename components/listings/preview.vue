<template>
  <div @click="reveal">
    <Listing
      ref="listing"
      v-model="value"
      class="unselected"
      @collapsing="reset"
    />
  </div>
</template>
<script>
import Listing from './listing'
export default {
  components: {
    Listing
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      revealed: false
    }
  },
  methods: {
    reveal() {
      if (this.revealed) return

      this.revealed = true

      this.$refs.listing.$el.classList.toggle('selected')
      setTimeout(() => {
        this.$refs.listing.setReveal(true)
      }, 300)
    },
    reset() {
      this.revealed = false

      this.$refs.listing.$el.classList.toggle('selected')
    }
  }
}
</script>
<style scoped>
.unselected {
  max-width: 425px;
  margin: auto;
}
.selected {
  max-width: 100%;
}
* {
  transition: all 0.3s ease 0s;
}
</style>
