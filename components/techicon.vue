<template>
  <a-tooltip placement="top">
    <template slot="title">
      <span>{{ tech.name }}</span>
    </template>
    <i
      :class="[
        `devicon-${
          tech.iconname
            ? tech.iconname
            : `${tech.name.toLowerCase().replace(/ /g, '')}-plain`
        }`,
        'colored'
      ]"
    ></i>
  </a-tooltip>
</template>
<script>
export default {
  props: {
    tech: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      default: 30
    }
  },
  computed: {
    style() {
      return {
        width: `${this.width}px`
      }
    }
  }
}
</script>
