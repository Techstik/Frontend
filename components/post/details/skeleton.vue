<template>
  <div>
    <div :class="`big-block ${shimmerColour}-shimmer`"></div>
  </div>
</template>
<script>
export default {
  props: {
    shimmerColour: {
      type: String,
      default: 'blue'
    }
  }
}
</script>
<style scoped>
.big-block {
  height: 110px;
}
</style>
