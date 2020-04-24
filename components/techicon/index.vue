<template>
  <div v-if="tech.custom" class="unknown">{{ tech.name.toLowerCase() }}</div>
  <a-tooltip v-else placement="top">
    <template slot="title">
      <span>{{ tech.name }}</span>
    </template>
    <svg v-if="tech.name == 'Vue js'" viewBox="0 0 128 128" :style="svgstyle">
      <path
        d="m-2.3125e-8 8.9337 49.854 0.1586 14.167 24.47 14.432-24.47 49.547-0.1577-63.834 110.14zm126.98 0.6374-24.36 0.0207-38.476 66.052-38.453-66.052-24.749-0.0194 63.211 107.89zm-25.149-0.008-22.745 0.16758l-15.053 24.647-14.817-24.647-22.794-0.1679 37.731 64.476zM25.997 9.3929l23.002 0.0087M25.997 9.3929l23.002 0.0087"
        fill="none"
      ></path>
      <path
        d="m25.997 9.3929 23.002 0.0087l15.036 24.958 14.983-24.956 22.982-0.0057-37.85 65.655z"
        fill="#35495e"
      ></path>
      <path
        d="m0.91068 9.5686 25.066-0.1711 38.151 65.658 37.852-65.654 25.11 0.0263-62.966 108.06z"
        fill="#41b883"
      ></path>
    </svg>
    <i
      v-else
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
import 'devicon/devicon.css'
import 'devicon/devicon-colors.css'

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
    },
    svgstyle() {
      return {
        width: `1.1em`
      }
    }
  }
}
</script>
<style scoped>
.unknown {
  font-size: 55%;
  padding: 9px 5px;
  border-radius: 5px;
  border: 2px solid grey;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  display: inline-block;
}
@media (max-width: 750px) {
  .unknown {
    padding: 7px 5px !important;
  }
}
</style>
