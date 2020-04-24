<template>
  <span
    :class="
      `flag-icon flag-icon-${countryCode.toLowerCase()} ${classes.join(' ')}`
    "
  ></span>
</template>
<script>
import '@/node_modules/flag-icon-css/css/flag-icon.min.css'
export default {
  props: {
    countryCode: {
      type: String,
      default: null
    },
    classes: {
      type: Array,
      default: () => []
    }
  }
}
</script>
