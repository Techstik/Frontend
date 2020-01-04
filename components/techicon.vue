<template>
  <a-tooltip placement="top">
    <template slot="title">
      <span>{{ tech }}</span>
    </template>
    <img :src="techicons[tech]" :style="style" />
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
      },
      style: {
        width: `${this.width}px`
      }
    }
  }
}
</script>
