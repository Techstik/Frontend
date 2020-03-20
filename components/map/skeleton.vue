<template>
  <div>
    <div
      :style="{ height: `${height}px` }"
      class="big-block blue-shimmer"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: Number,
      default: 300
    }
  }
}
</script>
<style scoped>
.big-block {
  height: 300px;
}
</style>
