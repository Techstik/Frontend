<template> </template>

<script>
import listing from '@/components/listings/listing'
import { mapState } from 'vuex'

export default {
  components: {
    listing
  },
  computed: {
    ...mapState({})
  },
  mounted() {
    // this.$bugsnag.notify(new Error('Test error'))
  }
}
</script>
