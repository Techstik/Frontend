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
import vue from '@/assets/images/tech-icons/vue.svg'
import node from '@/assets/images/tech-icons/node.svg'
import mongo from '@/assets/images/tech-icons/mongo.svg'

export default {
  props: {
    tech: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      techicons: {
        vue,
        node,
        mongo
      }
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
