<!--  eslint-disable vue/no-use-v-if-with-v-for -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :id="`__post_${post.id}`"
    ref="listing"
    :class="[
      {
        'fade-opacity':
          currentlyRevealedPost && currentlyRevealedPost != post.id,
        'stuck-post gold-post': stickToTop,
        'gold-shimmer': stickToTop && !revealing
      },
      'card listing post--content'
    ]"
    @mouseover="onHoverEnter"
    @mouseout="onHoverExit"
  >
    <div class="card-body">
      <div>
        <div class="summary" @click="onRevealRequest">
          <div>
            <div class="company-image">
              <img
                v-if="
                  (post.type.name == 'Premium' ||
                    post.type.name == 'Scraped') &&
                    post.company_logo
                "
                v-lazy="post.company_logo"
                :alt="post.company_name"
              />
              <img
                v-else-if="post.type.name == 'Premium' && preview && logoURL"
                v-lazy="logoURL"
                :alt="post.company_name"
              />
              <div v-else class="company-initials">{{ companyInitials }}</div>
            </div>
            <div class="content">
              <label class="position">
                {{ post.position }}
                <span v-if="!isMobile" class="float-right">
                  <div
                    :class="[
                      { 'stuck-post-tech': stickToTop && !isMobile },
                      'center-display'
                    ]"
                  >
                    <div
                      v-for="(tech, index) in post.tech"
                      :key="tech.id"
                      class="inline ms-2h no-line-height"
                    >
                      <techicon v-if="index < 3" :tech="tech" />
                      <techicon
                        v-else
                        v-show="
                          (hovering || revealing || isSearching) && !isMobile
                        "
                        :tech="tech"
                      />
                    </div>
                    <p
                      v-if="post.tech.length > 3"
                      v-show="
                        !hovering && !revealing && !isSearching && !isMobile
                      "
                      class="elipsis"
                    >
                      ...
                    </p>
                  </div>
                </span>
              </label>
              <p class="company">
                {{ post.company_name }}
                <span class="float-right exp-container">
                  <a-progress
                    v-for="(experience, index) in post.experience"
                    :key="experience.id"
                    :class="[
                      { 'progress-half': post.experience.length == 2 },
                      { 'progress-third': post.experience.length == 3 }
                    ]"
                    :percent="100"
                    :stroke-color="
                      experienceRequired(post.experience[index]).colour
                    "
                    :show-info="false"
                  />
                </span>
              </p>
            </div>
          </div>
          <div class="fs-12 mt-5 pt-5">
            <span :class="{ expiring: isExpiring }">
              {{
                (preview ? new Date() : post.date_created.toDate())
                  | moment('from', 'now')
              }}
            </span>
            <span v-if="post.location_based && !isMobile">
              <span>
                &nbsp; | &nbsp;
              </span>
              {{ post.location.city }}, {{ post.location.country }}
            </span>
            <span v-else-if="post.remote">
              <span v-if="!post.location_based || isMobile">
                &nbsp; | &nbsp;
              </span>
              <b>Remote</b></span
            >
            <span v-if="post.contract"
              >&nbsp; | &nbsp; Contract
              {{
                post.full_time ? (isMobile ? '/ Full' : 'or Full-Time') : ''
              }}</span
            >
            <span
              v-if="
                (post.type.name == 'Premium' || post.type.name == 'Scraped') &&
                  !isMobile
              "
            >
              <span>
                &nbsp; | &nbsp;
                {{ post.salary.currency.code }}
                <span v-if="!post.salary.set"
                  >{{ post.salary.minimum | moneyFormat }} -
                </span>
                {{ post.salary.maximum | moneyFormat }}</span
              >
              <span
                v-if="
                  selectedCurrency &&
                    selectedCurrency != post.salary.currency.code &&
                    !preview
                "
              >
                <b
                  >({{ selectedCurrency }}
                  <span v-if="!post.salary.set"
                    >{{ computedSalary.minimum | moneyClosestTenFormat }} -
                  </span>
                  {{ computedSalary.maximum | moneyClosestTenFormat }})</b
                ></span
              >
            </span>

            <span class="restriction-tags float-right">
              <span
                v-if="
                  (post.residing_restrictions.by_country.restricted ||
                    post.residing_restrictions.by_timezone.restricted) &&
                    !isMobile
                "
                >RESTRICTIONS</span
              >
              <span v-if="isMobile" class="mobile-tech-container">
                <div
                  :class="[
                    { 'stuck-post-tech': stickToTop && !isMobile },
                    'center-display'
                  ]"
                >
                  <div
                    v-for="(tech, index) in post.tech"
                    v-if="index < 3"
                    :key="tech.id"
                    class="inline ms-2h no-line-height"
                  >
                    <techicon :tech="tech" />
                  </div>
                </div>
              </span>
            </span>
          </div>
        </div>
        <a-collapse
          :active-key="revealing ? 1 : 0"
          :bordered="false"
          :class="[
            { 'content-margin-b': revealing },
            'trans-500 content-margin'
          ]"
        >
          <a-collapse-panel key="1" :show-arrow="false" header="">
            <Details
              ref="details_component"
              :post="post"
              :post-details="details"
              :gallary-u-r-ls="gallaryURLs"
              :preview="preview"
              :computed-salary="computedSalary"
              @apply-clicked="onApply()"
              @see-website-clicked="onWebsiteClicked()"
            />
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import globe from '@/assets/images/planet-earth.svg'
import techicon from '@/components/techicon'
import Details from './details'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { fullpackage } from '@/plugins/firebase'

export default {
  components: {
    techicon,
    Details
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    preview: {
      type: Boolean,
      default: false
    },
    postInfo: {
      type: Object,
      default: null
    },
    logoURL: {
      type: String,
      default: null
    },
    gallaryURLs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      thumbnailView: false,
      revealing: false,
      hovering: false,
      activeTabKey: '1',
      details: null,
      globe
    }
  },
  computed: {
    ...mapState({
      currentlyRevealedPost: state => state.posts.selected,
      isSearching: state => state.paging.isSearching,
      selectedCurrency: state => state.currencies.specified
    }),
    ...mapGetters({
      getSelectedExchangeRates: ['currencies/getSelectedExchangeRates'],
      isMobile: ['isMobile']
    }),
    companyInitials() {
      let pieces = this.post.company_name.split(' ')
      let initials = ''
      pieces.forEach(word => {
        initials += word.substring(0, 1)
      })
      return initials.substring(0, 2)
    },
    computedSalary() {
      if (
        !this.post ||
        !this.selectedCurrency ||
        !this.getSelectedExchangeRates
      )
        return {
          minimum: this.post.salary.minimum,
          maximum: this.post.salary.maximum
        }

      let rate = this.getSelectedExchangeRates.rates[
        this.post.salary.currency.code
      ]

      return {
        minimum: this.post.salary.minimum / rate,
        maximum: this.post.salary.maximum / rate
      }
    },
    isExpiring() {
      var validperiod = new Date()

      var dayspast = validperiod.getDate() - 25
      validperiod.setDate(dayspast)

      return (
        (this.preview ? new Date() : this.post.date_created.toDate()) <
        validperiod
      )
    },
    stickToTop() {
      if (
        this.post.type.extras &&
        this.post.type.extras.length &&
        (this.post.type.extras.includes('stick_1_week') ||
          this.post.type.extras.includes('stick_duration'))
      ) {
        if (this.post.type.extras.includes('stick_1_week') && !this.preview)
          return (
            this.post.date_created.toDate() >=
            this.$moment()
              .subtract(7, 'days')
              .startOf('day')
              .toDate()
          )
        return true
      }

      return false
    }
  },
  watch: {
    currentlyRevealedPost(post_id) {
      if (post_id != this.post.id) this.revealing = false
    },
    revealing(isRevealing) {
      if (isRevealing && !this.details) {
        if (this.preview) {
          this.details = this.postInfo
        } else {
          this.$readReference(this.post.postdetails_ref).then(details => {
            this.details = details
          })
        }
      } else if (!isRevealing) this.$refs.details_component.resetTabs()
    },
    isSearching(searching) {
      if (searching && this.revealing) this.toggleReveal()
    }
  },
  methods: {
    ...mapMutations({
      setCurrentlyRevealed: 'posts/setSelected'
    }),
    toggleReveal() {
      this.revealing = !this.revealing
      this.setCurrentlyRevealed(this.revealing ? this.post.id : null)
    },
    onRevealRequest() {
      if (!this.revealing && !this.preview) {
        this.$logAnalytic('view_item', { post_id: this.post.id })

        let postIdSub = this.post.id.substring(1, 6)
        let viewedPostsString = this.$getFromLocalStorage('vp__tscom')
        if (viewedPostsString) {
          let viewedPosts = viewedPostsString.split(',')
          if (!viewedPosts.includes(postIdSub)) {
            this.$setInLocalStorage(
              'vp__tscom',
              (viewedPostsString += `,${postIdSub}`)
            )

            this.$updateDocument(
              'posts',
              this.post.id,
              {
                opens: fullpackage.firestore.FieldValue.increment(1)
              },
              true
            )
          }
        } else {
          this.$setInLocalStorage('vp__tscom', postIdSub)

          this.$updateDocument(
            'posts',
            this.post.id,
            {
              opens: fullpackage.firestore.FieldValue.increment(1)
            },
            true
          )
        }
      }

      this.toggleReveal()
    },
    onHoverEnter() {
      this.hovering = true
    },
    onHoverExit() {
      this.hovering = false
    },
    experienceRequired(experience) {
      switch (experience.toLowerCase()) {
        case 'junior':
        default:
          return {
            percentage: 33,
            colour: '#b4dfe5'
          }
        case 'intermediate':
          return {
            percentage: 66,
            colour: 'orange'
          }
        case 'senior':
          return {
            percentage: 100,
            colour: 'black'
          }
      }
    },
    onApply() {
      this.$logAnalytic('apply-clicked')
      this.$updateDocument(
        'posts',
        this.post.id,
        {
          apply_clicks: fullpackage.firestore.FieldValue.increment(1)
        },
        true
      )
    },
    onWebsiteClicked() {
      this.$logAnalytic('website-clicked')
      this.$updateDocument(
        'posts',
        this.post.id,
        {
          site_clicks: fullpackage.firestore.FieldValue.increment(1)
        },
        true
      )
    }
  }
}
</script>
<style scoped>
.listing {
  text-align: left;
  transition: 300ms;
}
.fade-opacity {
  opacity: 0.1;
  transition: 300ms;
}
.title {
  margin-bottom: 10px;
}
.company-image {
  width: 55px;
  position: absolute;
  text-align: center;
  background-color: white;
  border-radius: 5px;
  min-height: 55px;
  max-height: 55px;
}
.company-image img {
  width: 55px;
  padding: 5px;
  border-radius: 8px;
  max-height: 55px;
}
.company {
  font-size: 13px;
}
.company-initials {
  display: inline-block;
  margin-top: 13px;
}
.content {
  display: inline-block;
  margin-left: 70px;
  width: calc(100% - 70px);
}
.content p {
  margin-bottom: 0px;
}
.position {
  color: black;
  font-weight: bold;
  cursor: pointer;
}
.elipsis {
  margin: 0;
  display: inline-block;
  font-size: 12px;
}
.card-body {
  padding: 0;
}
.summary {
  padding: 2rem 2.25rem;
  cursor: pointer;
}
.content-margin {
  margin: 0 2.25rem 0;
}
.content-margin-b {
  margin-bottom: 2.25rem;
  margin-top: -10px;
}
.ms-2h {
  margin: 0px 2.5px;
}

.progress-half {
  width: 50%;
  padding: 0px 2px;
}
.progress-half:last-child {
  padding: 0px 0px 0px 2px;
}
.progress-third {
  width: 33%;
  padding: 0px 2px;
}

.progress-half:first-child,
.progress-third:first-child {
  padding: 0px 2px 0px 0px;
}
.progress-half:last-child,
.progress-third:last-child {
  padding: 0px 0px 0px 2px;
}
.trans-500 {
  transition: 500ms;
}
.restriction-tags span {
  font-size: 12px;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
}
.info-bar.ant-row-flex {
  margin-left: inherit;
  margin-right: inherit;
}
.info-bar.ant-row-flex > [class*='ant-col-'] {
  padding-left: 15px;
  padding-right: 15px;
}
.info-bar [class*='ant-col-']:first-child {
  padding-left: 0px;
}
.info-bar [class*='ant-col-']:last-child {
  padding-right: 0px;
}
.exp-container {
  width: 200px;
  max-width: 150px;
}
.fs-40 {
  font-size: 40px;
}
.fs-12 {
  font-size: 12px;
}

.expiring {
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  color: red;
}
.stuck-post {
  background-color: #b5a264;
  transition: 300ms;
}
.stuck-post-tech {
  background: white;
  border-radius: 5px;
  padding: 3px 6px;
  margin-top: -5px;
}
.gold-post {
  background-color: #b5a264;
  border-color: #b5a264;
}
.company-image img[lazy='loading'] {
  border-radius: 5px !important;
}
@media (max-width: 750px) {
  .summary {
    padding: 1.25rem 1.25rem;
  }
  .content-margin {
    margin: 0 1.25rem 0;
  }
  .content-margin-b {
    margin-bottom: 1.25rem;
    /* margin-top: -10px; */
  }
  .mobile-tech-container {
    font-size: 145% !important;
  }
  .mobile-tech-container .center-display {
    margin-top: -3px;
  }
  .exp-container {
    max-width: 90px;
  }
  .exp-container .ant-progress {
    margin-top: -3px;
  }
  .company-image {
    width: 45px;
    min-height: 45px;
    max-height: 45px;
  }
  .company-image img {
    width: 45px;
  }
  .content {
    margin-left: 60px;
    width: calc(100% - 60px);
  }
  .company-initials {
    margin-top: 11px;
  }
}
</style>
<style>
.content-tabs .ant-tabs-bar {
  display: block !important;
}
</style>
