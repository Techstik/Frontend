<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    ref="listing"
    :class="[
      {
        'fade-opacity':
          currentlyRevealedPost && currentlyRevealedPost != post.id
      },
      'card listing'
    ]"
    @mouseover="onHoverEnter"
    @mouseout="onHoverExit"
  >
    <div class="card-body">
      <div>
        <div @click="toggleReveal">
          <div>
            <div class="company-image">
              <img v-if="post.company_logo" :src="post.company_logo" />
              <span v-else>{{ companyInitials }}</span>
            </div>
            <div class="content">
              <label class="position">
                {{ post.position }}
                <span class="float-right">
                  <div class="inline">
                    <div
                      v-for="(tech, index) in post.tech"
                      :key="tech.id"
                      class="inline ms-2h"
                    >
                      <techicon
                        v-if="index < 3"
                        :tech="tech"
                        :width="revealing ? 50 : 20"
                      />
                      <techicon
                        v-else
                        v-show="hovering || revealing"
                        :tech="tech"
                        :width="revealing ? 50 : 20"
                      />
                    </div>
                    <p
                      v-if="post.tech.length > 3"
                      v-show="!hovering && !revealing"
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
          <div class="fs-12 mt-5">
            <span :class="{ expiring: isExpiring }">
              {{ post.date_created.toDate() | moment('from', 'now') }}
            </span>
            &nbsp; | &nbsp;
            <span v-if="post.location_based"
              >{{ post.location.city }}, {{ post.location.country }}
            </span>
            <span v-else><b>Remote</b></span>
            <span v-if="post.contract"
              >&nbsp; | &nbsp; Contract
              {{ post.full_time ? 'or Full-Time' : '' }}</span
            >

            <span class="restriction-tags float-right">
              <!-- <img v-if="post.remote" :src="globe" width="20" /> -->
              <span
                v-if="
                  post.residing_restrictions.by_country.restricted ||
                    post.residing_restrictions.by_timezone.restricted
                "
                >RESTRICTIONS</span
              >
            </span>
          </div>
        </div>
        <a-collapse
          :active-key="revealing ? 1 : 0"
          :bordered="false"
          :class="[{ 'mt-10': revealing }, 'trans-500']"
        >
          <a-collapse-panel key="1" :show-arrow="false" header="">
            <div class="collapse-container">
              <div v-if="details.loading">
                <Skeleton />
              </div>
              <div v-else>
                <a-tabs
                  v-model="activeTabKey"
                  tab-position="left"
                  class="mtb-15"
                >
                  <a-tab-pane key="1" tab="Job">
                    <h3 class="subheading">The Role</h3>
                    <p v-html="details.data.about_position"></p>
                    <h3 class="subheading">
                      Technologies
                    </h3>
                    <div class="align-center fs-40">
                      <div
                        v-for="tech in post.tech"
                        :key="tech.id"
                        class="inline ms-2h"
                      >
                        <techicon :tech="tech" :width="50" />
                      </div>
                    </div>
                    <h3 class="subheading">
                      Our Requirements
                    </h3>
                    <p
                      v-for="value in details.data.requirements.filter(req => {
                        return req.requirement
                      })"
                      :key="value.id"
                    >
                      {{ value.requirement }}
                    </p>
                    <h3 class="subheading">What You'll Be Doing</h3>
                    <p
                      v-for="value in details.data.responsibilities.filter(
                        res => {
                          return res.responsibility
                        }
                      )"
                      :key="value.id"
                    >
                      {{ value.responsibility }}
                    </p>
                    <h3 class="subheading">Salary</h3>
                    <a-tooltip placement="top" arrow-point-at-center>
                      <template slot="title">
                        <span>{{ post.salary.currency.name }}</span>
                      </template>
                      <span>{{ post.salary.currency.code }}</span>
                    </a-tooltip>
                    <h3 class="subheading">
                      <span v-if="!post.salary.set"
                        >{{ post.salary.minimum }} -
                      </span>
                      {{ post.salary.maximum }}
                    </h3>
                  </a-tab-pane>
                  <a-tab-pane key="2" tab="Company">
                    <a-row align="middle" type="flex" justify="space-around">
                      <a-col span="18">
                        <h3 class="subheading">About Us</h3>
                        <p v-html="details.data.company_intro"></p>
                      </a-col>
                      <a-col span="6" class="align-center location">
                        <div v-if="post.location_based">
                          <span
                            :class="
                              `flag-icon flag-icon-${post.location.country_code.toLowerCase()}`
                            "
                          ></span>
                          <h4>
                            {{ post.location.city }},
                            {{ post.location.country }}
                          </h4>
                        </div>
                        <div v-else>
                          <img :src="globe" width="60" />
                          <h4>Worldwide</h4>
                        </div>
                      </a-col>
                    </a-row>
                    <Map
                      v-if="post.location_based"
                      :coords="{ lat: 37, lng: -122 }"
                      :height="200"
                      class="mb-15"
                    />
                    <h3 class="subheading">Size</h3>
                    <p>
                      <b> {{ post.size }} people </b>
                    </p>
                    <div
                      v-if="post.type == 'professional' && details.data.gallery"
                    >
                      <h3 class="subheading">A Few Images</h3>
                      <Gallery :images="details.data.gallery" />
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="3" tab="Perks">
                    <h3 class="subheading">Perks/Benefits We Offer</h3>
                    <p
                      v-for="value in details.data.benefits.filter(benf => {
                        return benf.benefit
                      })"
                      :key="value.id"
                    >
                      {{ value.benefit }}
                    </p>
                  </a-tab-pane>
                </a-tabs>

                <div
                  v-if="
                    post.residing_restrictions.by_country.restricted ||
                      post.residing_restrictions.by_timezone.restricted
                  "
                  class="restrictions"
                >
                  This position is restrcited to applicants residing in the
                  following
                  {{
                    post.residing_restrictions.by_country.restricted
                      ? 'countries'
                      : 'timezones'
                  }}:
                  <div
                    v-if="post.residing_restrictions.by_country.restricted"
                    class="flags"
                  >
                    <a-tooltip
                      v-for="country in post.residing_restrictions.by_country
                        .countries"
                      :key="country.id"
                      placement="top"
                    >
                      <template slot="title">
                        <span>{{ country.name }}</span>
                      </template>
                      <span
                        :class="
                          `flag-icon flag-icon-${country.code.toLowerCase()} mr-15`
                        "
                      ></span>
                    </a-tooltip>
                  </div>
                  <div v-else class="timezones">
                    <span
                      v-for="timezone in post.residing_restrictions.by_timezone
                        .timezones"
                      :key="timezone.id"
                      ><b>{{ timezone }}</b></span
                    >
                  </div>
                </div>
                <div
                  v-if="details.data.application_instr"
                  class="apply-container"
                >
                  <h3 class="subheading">How to apply</h3>
                  <p v-html="details.data.application_instr"></p>
                </div>
                <div class="align-center mt-10">
                  <a-button
                    v-if="details.data.application_url"
                    shape="round"
                    :href="details.data.application_url"
                    target="_blank"
                    >Apply For This Position</a-button
                  >
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import google from '@/assets/images/google.png'
import globe from '@/assets/images/planet-earth.svg'
import pin from '@/assets/images/pin.svg'
import techicon from '@/components/techicon'
import Map from '@/components/map'
import Gallery from '@/components/gallery'
import Skeleton from './skeleton'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    techicon,
    Skeleton,
    Map,
    Gallery
  },
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      thumbnailView: false,
      revealing: false,
      hovering: false,
      activeTabKey: '1',
      details: {
        loading: true,
        data: null
      },
      google,
      globe,
      pin
    }
  },
  computed: {
    ...mapState({
      currentlyRevealedPost: state => state.posts.user_selected
    }),
    companyInitials() {
      let pieces = this.post.company_name.split(' ')
      let initials = ''
      pieces.forEach(word => {
        initials += word.substring(0, 1)
      })
      return initials
    },
    isExpiring() {
      var validperiod = new Date()

      var dayspast = validperiod.getDate() - 25
      validperiod.setDate(dayspast)

      return this.post.date_created.toDate() < validperiod
    }
  },
  watch: {
    currentlyRevealedPost(post_id) {
      if (post_id != this.post.id) this.revealing = false
    },
    revealing(isRevealing) {
      if (isRevealing && !this.details.data) {
        this.details.loading = true
        this.$readReference(this.post.postdetails_ref).then(details => {
          this.details.data = details
          this.details.loading = false
        })
      } else if (!isRevealing)
        setTimeout(() => {
          this.activeTabKey = '1'
        }, 1000)
    }
  },
  methods: {
    ...mapMutations({
      setCurrentlyRevealed: 'posts/setUserSelected'
    }),
    // setThumbnail(value) {
    //   this.thumbnailView = value
    //   if (value) this.revealing = false
    // },
    toggleReveal() {
      this.revealing = !this.revealing
      this.setCurrentlyRevealed(this.revealing ? this.post.id : null)
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
            colour: '#1890ff'
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
    }
  }
}
</script>
<style scoped>
.listing {
  text-align: left;
  margin: 15px;
  cursor: pointer;
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
  width: 45px;
  position: absolute;
  text-align: center;
}
.company-image img {
  width: 45px;
}
.company {
  font-size: 13px;
}
.content {
  display: inline-block;
  margin-left: 60px;
  width: calc(100% - 60px);
}
.content p {
  margin-bottom: 0px;
}
.position {
  color: black;
  font-weight: bold;
}
.position-thumb {
  font-size: 85%;
}
.location .flag-icon,
.location img {
  font-size: 60px;
  margin-bottom: 10px;
}
.divider {
  width: 20px;
}
.elipsis {
  margin: 0;
  display: inline-block;
  font-size: 12px;
}
.ml-25 {
  margin-left: 25px;
}
.thumbnail p {
  font-size: 12px;
  overflow-wrap: normal;
}
.checkbox_icon {
  width: 25px;
}
.location-image {
  max-width: 100px;
}
.collapse-container {
  padding: 15px;
}
.mt-13 {
  margin-top: 13px;
}
.mt-5 {
  margin-top: 5px;
}
.card-body {
  padding: 2.25rem;
}
.date {
  font-size: 12px;
}
.ms-2h {
  margin: 0px 2.5px;
}
.mt-10 {
  margin-top: 10px;
  transition: 500ms;
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
  font-family: Graphik-Bold;
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
.apply-container {
  background-color: #fcd669;
  padding: 15px;
  border-radius: 6px;
}
.apply-container p {
  margin-bottom: 0px;
}
.restrictions {
  border: 2px solid #fa755a;
  padding: 10px;
  border-radius: 6px;
  background-color: #fa755a;
  text-align: center;
  color: white;
  margin-bottom: 10px;
}
.restrictions .flags {
  margin-top: 5px;
}
.flag-icon {
  font-size: 30px;
  border-radius: 5px;
}
.timezones span {
  margin: 0px 5px;
}
.timezones span:first-child {
  margin-left: 0px;
}
.timezones span:last-child {
  margin-right: 0px;
}
.salary p,
.salary .subheading {
  margin-bottom: 0;
}
.exp-container {
  width: 200px;
  max-width: 150px;
}
.mtb-15 {
  margin: 15px 0px;
}
.fs-40 {
  font-size: 40px;
}
.fs-12 {
  font-size: 12px;
}
.mb-15 {
  margin-bottom: 15px;
}
.expiring {
  font-family: Graphik-Bold;
  color: red;
}
</style>
