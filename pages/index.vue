<template>
  <div class="wrapper wrapper--intro">
    <div class="grid grid--centered grid--formatted">
      <h1
        ref="welcomeBackHeading"
        class="heading heading--x-large flush--top grid__item grid__item--large centered-medium"
      >
        {{
          firstVisit || visitedHomePage
            ? ' Find Tech-Related Jobs Around the World.'
            : 'Welcome Back!'
        }}
      </h1>
      <p class="push_half--bottom catch-phrase centered-medium mb-extra">
        A refined hub of opportunities in
        <strong>Software Development</strong>, <strong>DevOps</strong>,
        <strong>Design</strong> and everything in-between.
      </p>
      <div class="grid__item grid__item--medium push--bottom centered-medium">
        <div class="cta push--top">
          <nuxt-link to="/jobs">
            <a class="cover-button">Check Out Jobs</a>
          </nuxt-link>
        </div>
      </div>
      <div class="grid__item grid__item--large push--bottom">
        <div class="explanatory-text align-right">
          <small
            :class="[
              {
                'fade-out': !previewControls.showTech,
                'fade-in': previewControls.showTech
              }
            ]"
            >View the tech stack</small
          >
        </div>
        <div class="preview-post">
          <div class="company-image"></div>
          <div class="content">
            <div class="summary">
              <div class="inline position"></div>
              <div v-if="!isMobile" class="inline float-right">
                <Swiper
                  v-if="previewControls.showTech"
                  ref="techSwiper"
                  :options="techSwiperOptions"
                  style="width:110px; display:inline-block"
                >
                  <SwiperSlide v-for="tech in getRandomTech()" :key="tech.id"
                    ><techicon :tech="tech" class="preview-tech-icon"
                  /></SwiperSlide>
                </Swiper>
                <span v-else>
                  <div class="inline ms-2h icon"></div>
                  <div class="inline ms-2h icon"></div>
                  <div class="inline ms-2h icon"></div>
                </span>
              </div>
            </div>
            <div class="mt-7">
              <Swiper
                v-if="previewControls.showExp"
                ref="expSwiper"
                :options="expSwiperOptions"
                class="f-r"
                :style="
                  `width:${
                    isMobile ? 100 : 150
                  }px; display:inline-block; margin-top:-7px;line-height: 0`
                "
              >
                <SwiperSlide>
                  <a-progress
                    :percent="100"
                    :show-info="false"
                    stroke-color="#b4dfe5"
                /></SwiperSlide>
                <SwiperSlide>
                  <a-progress
                    :percent="100"
                    :show-info="false"
                    stroke-color="orange"
                /></SwiperSlide>
                <SwiperSlide>
                  <a-progress
                    :percent="100"
                    :show-info="false"
                    stroke-color="black"
                /></SwiperSlide>
              </Swiper>
              <div v-else>
                <div class="experience f-r"></div>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="inline"></div>
            <div class="inline"></div>
            <small v-if="previewControls.showSalary" class="salary"
              >EUR 30,000
              <span>
                <Swiper
                  ref="mySwiper"
                  :options="salarySwiperOptions"
                  style="display:inline-block; height: 17px; font-size:90%; margin-left:10px"
                >
                  <SwiperSlide
                    ><span
                      ><b>
                        <span
                          class="
                            currency-flag currency-flag-gbp
                          "
                        ></span>
                        {{
                          (30000 *
                            (getExchangeRatesForCurrency('EUR')
                              ? getExchangeRatesForCurrency('EUR').rates.GBP
                              : 1))
                            | moneyClosestTenFormat
                        }}</b
                      ></span
                    ></SwiperSlide
                  >
                  <SwiperSlide
                    ><span
                      ><b>
                        <span
                          class="
                            currency-flag currency-flag-usd
                          "
                        ></span>
                        {{
                          (30000 *
                            (getExchangeRatesForCurrency('EUR')
                              ? getExchangeRatesForCurrency('EUR').rates.USD
                              : 1))
                            | moneyClosestTenFormat
                        }}</b
                      ></span
                    ></SwiperSlide
                  >
                  <SwiperSlide
                    ><span
                      ><b>
                        <span
                          class="
                            currency-flag currency-flag-jpy
                          "
                        ></span>
                        {{
                          (30000 *
                            (getExchangeRatesForCurrency('EUR')
                              ? getExchangeRatesForCurrency('EUR').rates.JPY
                              : 1))
                            | moneyClosestTenFormat
                        }}</b
                      ></span
                    ></SwiperSlide
                  >
                  <SwiperSlide
                    ><span
                      ><b>
                        <span
                          class="
                            currency-flag currency-flag-aud
                          "
                        ></span>
                        {{
                          (30000 *
                            (getExchangeRatesForCurrency('EUR')
                              ? getExchangeRatesForCurrency('EUR').rates.AUD
                              : 1))
                            | moneyClosestTenFormat
                        }}</b
                      ></span
                    ></SwiperSlide
                  >
                  <SwiperSlide
                    ><span
                      ><b>
                        <span
                          class="
                            currency-flag currency-flag-zar
                          "
                        ></span>
                        {{
                          (30000 *
                            (getExchangeRatesForCurrency('EUR')
                              ? getExchangeRatesForCurrency('EUR').rates.ZAR
                              : 1))
                            | moneyClosestTenFormat
                        }}</b
                      ></span
                    ></SwiperSlide
                  >
                </Swiper></span
              ></small
            >
            <div v-else class="inline"></div>
            <span v-if="isMobile && !previewControls.showSalary" class="f-r">
              <Swiper
                v-if="previewControls.showTech"
                ref="techSwiper"
                :options="techSwiperOptions"
                style="width:110px; display:inline-block"
              >
                <SwiperSlide v-for="tech in getRandomTech()" :key="tech.id"
                  ><techicon :tech="tech" class="preview-tech-icon"
                /></SwiperSlide>
              </Swiper>
              <span v-else>
                <div class="inline ms-2h icon"></div>
                <div class="inline ms-2h icon"></div>
                <div class="inline ms-2h icon"></div>
              </span>
            </span>
          </div>
        </div>
        <div class="explanatory-text align-center">
          <small
            :class="[
              {
                'fade-out': !previewControls.showSalary,
                'fade-in': previewControls.showSalary
              }
            ]"
            >Real-time salary conversions</small
          >
          <small
            :class="[
              {
                'fade-out': !previewControls.showExp,
                'fade-in': previewControls.showExp
              },
              'f-r'
            ]"
            >See the experience level required</small
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { mapState, mapGetters, mapMutations } from 'vuex'
import techicon from '@/components/techicon'

export default {
  components: {
    Swiper,
    SwiperSlide,
    techicon
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      countries: [],
      posts: [],
      firstVisit: true,
      techSwiperOptions: {
        slidesPerView: 3,
        spaceBetween: 10,
        loop: true,
        freeMode: true,
        autoplay: {
          delay: 500
        }
      },
      salarySwiperOptions: {
        direction: 'vertical',
        loop: true,
        autoplay: {
          delay: 1500
        }
      },
      expSwiperOptions: {
        loop: true,
        autoplay: {
          delay: 1000
        }
      },
      previewControls: {
        showTech: false,
        showSalary: false,
        showExp: true
      },
      welcomeEffectTimer: null
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.currencies.all,
      tech: state => state.tech.all,
      visitedHomePage: state => state.paging.visitedHomePage
    }),
    ...mapGetters({
      getExchangeRatesForCurrency: ['currencies/getExchangeRatesForCurrency'],
      isMobile: ['isMobile']
    })
  },
  created() {
    if (this.$getFromLocalStorage('vp__tscom')) this.firstVisit = false
    this.$eventbus.$emit('scroll-to', 0, 0)
  },
  mounted() {
    setInterval(() => {
      if (this.previewControls.showTech) {
        this.previewControls.showTech = false
        this.previewControls.showSalary = true
        return
      }
      if (this.previewControls.showSalary) {
        this.previewControls.showSalary = false
        this.previewControls.showExp = true
        return
      }
      if (this.previewControls.showExp) {
        this.previewControls.showExp = false
        this.previewControls.showTech = true
        return
      }
    }, 5000)

    if (!this.firstVisit && !this.visitedHomePage)
      this.welcomeEffectTimer = setTimeout(() => {
        this.initiateWelcomeEffect()
      }, 3000)
  },
  destroyed() {
    if (this.welcomeEffectTimer) clearTimeout(this.welcomeEffectTimer)
  },
  methods: {
    ...mapMutations({
      setVisitedHomePage: 'paging/setVisitedHomePage'
    }),
    getRandomTech() {
      let tech = []
      let usedIndeces = []
      for (var x = 0; x < 80; x++) {
        let random
        do {
          random = Math.floor(Math.random() * 80) + 1
        } while (usedIndeces.includes(random))
        tech.push(this.tech[random])
        usedIndeces.push(random)
      }
      return tech
    },
    initiateWelcomeEffect() {
      this.$refs.welcomeBackHeading.innerHTML = `${this.$refs.welcomeBackHeading.innerText} <span class="typewriter-caret" aria-hidden="true"></span>`
      this.setVisitedHomePage(true)
      setTimeout(() => {
        this.reverseTypeWriter()
      }, 1000)
    },
    typeWriter(text, i) {
      if (i < text.length) {
        this.$refs.welcomeBackHeading.innerHTML = `${text.substring(
          0,
          i + 1
        )} <span class="typewriter-caret" aria-hidden="true"></span>`

        setTimeout(() => {
          this.typeWriter(text, i + 1)
        }, 100)
      } else {
        setTimeout(() => {
          this.$refs.welcomeBackHeading.classList.add('hide-caret')
        }, 3500)
      }
    },
    reverseTypeWriter() {
      if (this.$refs.welcomeBackHeading.innerText.length) {
        this.$refs.welcomeBackHeading.innerHTML = `${this.$refs.welcomeBackHeading.innerText.substring(
          0,
          this.$refs.welcomeBackHeading.innerText.length - 1
        )} <span class="typewriter-caret" aria-hidden="true"></span>`

        setTimeout(() => {
          this.reverseTypeWriter()
        }, 50)
      } else
        setTimeout(() => {
          this.typeWriter('Find Tech-Related Jobs Around the World.', 0)
        }, 700)
    }
  },
  head() {
    return {
      title: 'Techstik | Tech Jobs Around the World',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Explore remote and location-based tech opportunities around the world. A hub for Software Developers, Designers, DevOps and more. With upfront salary offers and tech stack transparency, your search ends here.'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            'Explore remote and location-based tech opportunities around the world. A hub for Software Developers, Designers, DevOps and more. With upfront salary offers and tech stack transparency, your search ends here.'
        }
      ]
    }
  }
}
</script>
<style scoped>
.preview-post {
  background: #303c6c;
  min-height: 100px;
  border-radius: 10px;
  padding: 15px;
  pointer-events: none;
}
.company-image {
  width: 45px;
  position: absolute;
  text-align: center;
  background-color: #161d2d;
  border-radius: 5px;
  min-height: 45px;
  max-height: 45px;
}
.content {
  display: inline-block;
  margin-left: 60px;
  width: calc(100% - 60px);
  min-height: 50px;
}
.preview-post .experience {
  background: #161d2d;
  border-radius: 5px;
  height: 8px;
  padding: 5px;
  width: 150px;
}
.preview-post .summary .icon,
.preview-post .summary .position,
.preview-post .info .icon,
.preview-post .info > div {
  background: #161d2d;
  border-radius: 5px;
  width: 1.3em;
  height: 1.3em;
}
.preview-tech-icon {
  background: white;
  padding: 2px;
  border-radius: 5px;
}
.preview-post .summary .position {
  width: 250px;
  height: 1.1em;
}
.preview-post .info > div {
  width: 120px;
  font-size: 80%;
  padding: 0.55em;
}
.info .salary {
  color: white;
}
.currency-flag {
  border-radius: 5px;
}
.experience .entry-level {
  background-color: blue;
}
.explanatory-text {
  color: white;
  font-family: 'Inconsolata', monospace;
}
.hide {
  visibility: hidden;
}
.mt-7 {
  margin-top: 7px;
}
.mb-extra {
  margin-bottom: 3em !important;
}
@media (max-width: 750px) {
  .preview-post .info > div {
    width: 45px;
    margin-top: 3px;
  }
  .preview-post .summary .position {
    width: 140px;
  }
  .preview-post .experience {
    width: 100px;
  }
  .preview-post {
    padding: 11px;
  }
  .mb-extra {
    margin-bottom: 1em !important;
  }
}
</style>
<style>
.typewriter-caret {
  border-right: 0.05em solid;
  animation: caret 1s steps(1) infinite;
}

.hide-caret .typewriter-caret {
  opacity: 0;
}

@keyframes caret {
  50% {
    border-color: transparent;
  }
}
</style>
