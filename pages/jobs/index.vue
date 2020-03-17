<template>
  <listing />
</template>

<script>
import listing from '@/components/listings/listing'
import { mapState } from 'vuex'

export default {
  components: {
    listing
  },
  computed: {
    ...mapState({})
  }
}
</script>
