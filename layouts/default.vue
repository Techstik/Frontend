<template>
  <div class="background">
    <nuxt-link to="/">
      <img :src="whiteLogo" />
    </nuxt-link>
    <div class="header">
      <nuxt-link to="/post">
        <a-button class="btn-sm f-r btn-outline-orange">Post a job</a-button>
      </nuxt-link>
    </div>
    <vuescroll
      ref="scroll_container"
      class="scroll-container"
      @handle-scroll="handleScroll"
    >
      <div class="nuxt-container">
        <nuxt />
      </div>
      <div class="footer">
        <a-row>
          <a-col :span="12">accepted cards</a-col>
          <a-col :span="12">col-6</a-col>
        </a-row>
      </div>
    </vuescroll>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import whiteLogo from '@/assets/images/logos/SmallWhiteSplashSolid.svg'
import vuescroll from 'vuescroll'

export default {
  components: {
    vuescroll
  },
  data() {
    return {
      whiteLogo
    }
  },
  computed: {
    ...mapState({
      canPaginate: state => state.paging.canPaginate
    })
  },
  methods: {
    ...mapMutations({
      setPaginate: 'paging/setPaginate'
    }),
    handleScroll() {
      // eslint-disable-next-line no-unused-vars
      const { v, h } = this.$refs.scroll_container.getScrollProcess()

      if (v > 0.5 && !this.canPaginate) this.setPaginate(true)
    }
  }
}
</script>
<style scoped>
.background {
  min-height: 100%;
  /* background-image: url(/_nuxt/assets/images/MoonBackground-01.svg);
  background-attachment: scroll;
  background-repeat: no-repeat;
  background-size: cover; */
  background: #161d2d;
}
.header {
  padding: 30px 40px 20px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: rgba(22, 29, 45, 0.96);
  opacity: 0.95;
}
img {
  width: 75px;
  margin-left: 45px;
  margin-top: 30px;
  position: absolute;
  z-index: 100000;
}
.footer {
  background-color: #303c6c;
  color: white;
  padding: 50px;
}
.nuxt-container {
  min-height: 100vh;
  padding: 100px;
}
.scroll-container {
  height: 100vh !important;
}
</style>
