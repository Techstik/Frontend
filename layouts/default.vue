<template>
  <div class="background">
    <header class="header">
      <div class="banner" hidden>
        <p class="flush"></p>
      </div>

      <nav id="top" class="top-nav" role="navigation">
        <nuxt-link
          class="top-nav__logo"
          to="/"
          aria-label="Techstik"
          @click.native="scrollToTop"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402.05 118.55">
            <defs>
              <style>
                .cls-1 {
                  font-size: 58px;
                  fill: #283c6c;
                  font-family: PantonDemo-Black, Panton;
                  font-weight: 800;
                }

                .cls-2 {
                  fill: none;
                  stroke: #283c6c;
                  stroke-miterlimit: 10;
                  stroke-width: 8px;
                }
              </style>
            </defs>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <text
                  class="cls-1"
                  transform="translate(110.66 91.8) scale(1.05 1)"
                >
                  Techstik
                </text>
                <g>
                  <text />
                  <path
                    class="cls-2"
                    d="M4.65,66.92c28.6-.63,57.37-1.25,85.66,2.73,1.43-3.61,1.46-7.57,1.47-11.42l0-18.67,0-14.78a1.15,1.15,0,0,0-.14-.69,1.32,1.32,0,0,0-.91-.39q-40-5.85-80.4-8.19A2,2,0,0,0,9,15.8a1.73,1.73,0,0,0-.43,1.12C7.91,22.08,2.09,66.92,4.65,66.92Z"
                  />
                  <path
                    class="cls-2"
                    d="M43.76,14.31A32.51,32.51,0,0,0,44,8.82,4.89,4.89,0,0,1,49.59,4q4.66.51,9.35.87a5.58,5.58,0,0,1,5.35,6,67.88,67.88,0,0,0,.35,7.53"
                  />
                  <path
                    class="cls-2"
                    d="M43.79,69.32q-3.1,19.41-5.14,38.94a5.92,5.92,0,0,0,6.5,6.28c2.72-.19,5.49-.68,8.07-.61a5.93,5.93,0,0,0,6.14-5.37q1.48-20.67,1.21-41.41"
                  />
                </g>
              </g>
            </g>
          </svg>
        </nuxt-link>
        <ul v-if="!isMobile" class="top-nav__list">
          <li class="top-nav__list-item">
            <nuxt-link to="/pricing">
              <a-button class="f-r" @click="logClick()">Post a job</a-button>
            </nuxt-link>
          </li>
          <li class="top-nav__list-item">
            <v-select
              v-if="currencies.length > 0"
              id="main-currency-select"
              v-model="selectedCurrency"
              :reduce="currency => currency.code"
              class="display-inline global-currency-select f-r"
              label="name"
              :clearable="!isMobile"
              placeholder="Preferred currency"
              :options="currencies"
            >
              <template
                v-slot:selected-option="option"
                v-bind="
                  typeof option === 'object' ? option : { [label]: option }
                "
              >
                <span
                  :class="
                    `currency-flag currency-flag-${option.code.toLowerCase()} mr-15`
                  "
                ></span>
                {{ isMobile ? '' : option.name }}
              </template>
              <template v-slot:option="option">
                <span
                  :class="[
                    { 'mr-15': !isMobile },
                    `currency-flag currency-flag-${option.code.toLowerCase()}`
                  ]"
                ></span>
                {{ isMobile ? '' : option.name }}
              </template>
            </v-select>
          </li>
        </ul>
        <Slide
          v-if="isMobile"
          right
          :width="windowWidth.toString()"
          :is-open="menuOpen"
          :class="[
            { 'fade-in-items': menuOpen },
            { 'fade-out-items': !menuOpen }
          ]"
          @openMenu="menuOpen = true"
          @closeMenu="menuOpen = false"
        >
          <v-select
            v-if="currencies.length > 0"
            id="main-currency-select"
            v-model="selectedCurrency"
            :reduce="currency => currency.code"
            class="display-inline global-currency-select"
            label="name"
            :clearable="!isMobile"
            placeholder="Preferred currency"
            :options="currencies"
          >
            <template
              v-slot:selected-option="option"
              v-bind="typeof option === 'object' ? option : { [label]: option }"
            >
              <span
                :class="
                  `currency-flag currency-flag-${option.code.toLowerCase()} mr-15`
                "
              ></span>
              {{ option.name }}
            </template>
            <template v-slot:option="option">
              <span
                :class="[
                  { 'mr-15': !isMobile },
                  `currency-flag currency-flag-${option.code.toLowerCase()}`
                ]"
              ></span>
              {{ option.name }}
            </template>
          </v-select>
          <div class="burger-items">
            <a @click="navigateFromSideMenu('/jobs')">
              <h3 class="subheading">Jobs</h3>
            </a>
            <div class="mb-35"></div>
            <a @click="navigateFromSideMenu('/post-a-job')">
              <h3 class="subheading">Post a Job</h3>
            </a>
            <a @click="navigateFromSideMenu('/pricing')">
              <h3 class="subheading">Pricing</h3>
            </a>
            <a @click="navigateFromSideMenu('/support')">
              <h3 class="subheading">Support</h3>
            </a>
          </div>
        </Slide>
      </nav>
    </header>
    <vuescroll
      ref="scroll_container"
      class="scroll-container"
      :ops="scrollOptions"
      @handle-scroll="handleScroll"
    >
      <div class="nuxt-container">
        <transition name="page" mode="out-in">
          <nuxt />
        </transition>
      </div>
      <div :class="[{ 'mobile-footer': isMobile }, 'footer']">
        <div v-if="!isMobile" class="sitelinks">
          <nuxt-link to="/jobs" @click.native="scrollToTop"
            ><b>Jobs</b></nuxt-link
          >
          <nuxt-link to="/post-a-job" @click.native="scrollToTop"
            ><b>Post a Job</b></nuxt-link
          >
          <nuxt-link to="/pricing" @click.native="scrollToTop"
            ><b>Pricing</b></nuxt-link
          >
          <nuxt-link to="/support" @click.native="scrollToTop"
            ><b>Support</b></nuxt-link
          >
        </div>
      </div>
    </vuescroll>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import vuescroll from 'vuescroll'
import { Slide } from 'vue-burger-menu'

export default {
  components: {
    vuescroll,
    Slide
  },
  data() {
    return {
      scrollOptions: {
        bar: { background: '#303c6c' },
        scrollPanel: { scrollingY: true }
      },
      selectedCurrency: null,
      menuOpen: false
    }
  },
  computed: {
    ...mapGetters({
      isMobile: ['isMobile']
    }),
    ...mapState({
      operatingAsAdmin: state => state.users.operatingAsAdmin,
      canPaginate: state => state.paging.canPaginate,
      scrollingMap: state => state.paging.scrollingMap,
      currencies: state => state.currencies.all,
      windowWidth: state => state.windowWidth
    })
  },
  watch: {
    scrollingMap(value) {
      this.scrollOptions.scrollPanel.scrollingY = !value
    },
    selectedCurrency(currencyCode) {
      this.setSpecified(currencyCode)
    }
  },
  created() {
    let preSelectedCurrency = this.$getFromLocalStorage('pc__tscom')
    if (
      preSelectedCurrency &&
      preSelectedCurrency != 'null' &&
      preSelectedCurrency != 'undefined'
    )
      this.selectedCurrency = preSelectedCurrency

    window.addEventListener('resize', this.handleWindowResize)
  },
  mounted() {
    this.$eventbus.$on('scroll-to', (height, duration = 500) => {
      this.$refs.scroll_container.scrollTo({ y: height }, duration)
    })
  },
  methods: {
    ...mapMutations({
      setPaginate: 'paging/setPaginate',
      setSpecified: 'currencies/setSpecified',
      setWindowWidth: 'setWindowWidth'
    }),
    handleScroll() {
      // eslint-disable-next-line no-unused-vars
      const { v, h } = this.$refs.scroll_container.getScrollProcess()

      if (v > 0.5 && !this.canPaginate) this.setPaginate(true)
    },
    handleWindowResize() {
      this.setWindowWidth(window.innerWidth)
    },
    logClick() {
      this.$logAnalytic('post-a-job')
    },
    navigateFromSideMenu(path) {
      this.$router.push(path)
      this.menuOpen = false
    },
    scrollToTop() {
      this.$refs.scroll_container.scrollTo({ y: 0 }, 0)
    }
  }
}
</script>
<style scoped>
.background {
  min-height: 100%;
  background: #161d2d;
}
@media (min-width: 57.5em) {
  .banner {
    display: block;
    width: 100%;
    padding: 0.5em;
    margin: 0;
    background-color: #5d2f86;
    color: #fff;
    text-align: center;
    font-size: 75%;
    line-height: 1.5;
    font-weight: 500;
  }
}

.top-nav {
  position: relative;
  z-index: 19000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 2rem 3rem;
  background: rgba(22, 29, 45, 0.96);
}

.top-nav__logo {
  display: block;
  width: 8.25em;
  height: 2em;
  margin: 0;
  padding: 0.1rem;
}
.top-nav__logo svg {
  width: 7.5em;
}
.top-nav__list {
  margin: 0;
  padding: 0;
  font-size: 75%;
  font-weight: bold;
  list-style-position: outside;
}
.top-nav__list-item {
  display: inline-block;
  margin: 0 0.25em;
  vertical-align: middle;
}

.header {
  position: fixed;
  top: 0;
  z-index: 19000;
  width: 100%;
}
.logo svg {
  width: 8.25em;
  margin-left: 45px;
  margin-top: 20px;
  position: absolute;
  z-index: 100000;
}
.logo .cls-1 {
  fill: #808080;
}
.logo .cls-2 {
  stroke: #fcd668;
}
.logo .lekker .cls-2 {
  stroke: #cf51fb;
}
.footer {
  background-color: #303c6c;
  color: white;
  padding: 1.25em;
  padding-right: 85px;
}
.footer.mobile-footer {
  background-color: #161d2d;
}
.nuxt-container {
  min-height: 100vh;
  min-width: 100vw;
  max-width: 100vw;
}
.scroll-container {
  height: 100vh !important;
}
.page-enter-active {
  animation: slide-in 0.3s ease-out forwards;
}

.page-leave-active {
  animation: slide-out 0.3s ease-out forwards;
}
.burger-items {
  width: 80%;
  font-size: 90%;
}
.burger-items .subheading {
  color: white;
  text-align: center;
}
.sitelinks {
  text-align: right;
}
.sitelinks a {
  margin-right: 1em;
  color: #161d2d !important;
  font-size: 90%;
}
.sitelinks a:hover {
  color: white !important;
}
.sitelinks a:last-child {
  margin-right: 0;
}
@keyframes slide-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}
@media (max-width: 750px) {
  .top-nav__logo .cls-1 {
    display: none;
  }
  .top-nav__logo {
    width: 3rem;
  }
}
</style>
<style>
.global-currency-select {
  margin-left: 15px;
}
.global-currency-select .vs__dropdown-toggle,
.global-currency-select .vs__search::placeholder {
  min-height: 38px;
  min-width: 250px;
  background: transparent !important;
  padding: 0 10px !important;
  border-radius: 5px !important;
}
.global-currency-select .vs__selected,
.global-currency-select .vs__search {
  color: white;
}
.global-currency-select .vs__open-indicator,
.global-currency-select .vs__clear {
  fill: white;
}
.global-currency-select .vs__selected,
.global-currency-select .vs__search {
  margin: 0px;
}
.global-currency-select.vs--open .vs__selected,
.global-currency-select.vs--open .vs__search {
  margin: 4px 2px 0;
}
.bm-menu {
  background-color: #161d2d;
}
.bm-burger-button {
  height: 22px;
  top: 2.5rem;
  width: 25px;
  right: 2rem !important;
}
.bm-cross-button {
  left: 20px;
  padding: 20px;
}
.bm-item-list > * {
  margin: 0.7em;
  padding: 0;
  display: inline-block;
}
.bm-item-list {
  opacity: 0;
  transition: 500ms;
}
.fade-in-items .bm-item-list {
  transition-delay: 400ms;
  opacity: 1;
}
.fade-out-items .bm-item-list {
  transition-delay: 0s;
  transition: 150ms;
}
@media (max-width: 750px) {
  .global-currency-select {
    width: 80%;
  }
  .ant-input:not(textarea) {
    height: 35px !important;
  }
}
</style>
