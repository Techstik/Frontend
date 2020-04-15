<template>
  <div>
    <div
      :class="`${shimmerColour}-shimmer`"
      :style="{ height: `${height}` }"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    shimmerColour: {
      type: String,
      default: 'blue'
    },
    height: {
      type: String,
      default: '100px'
    }
  }
}
</script>
<style scoped>
.big-block {
  height: 110px;
}
</style>
