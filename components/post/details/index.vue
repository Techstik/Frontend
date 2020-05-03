<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="reduced-font">
    <Skeleton v-if="!postDetails" :shimmer-colour="skeletonColour" />
    <div v-else>
      <div class="details-container">
        <div>
          <a-tabs
            v-model="activeTabKey"
            :tab-position="windowWidth < 1000 ? 'top' : 'left'"
            class="mt-15 content-tabs"
          >
            <a-tab-pane key="1" tab="Job">
              <h3 class="subheading">The Role</h3>
              <div
                class="p-m-0 mb-15"
                v-html="postDetails.about_position"
              ></div>
              <h3 class="subheading">
                Technologies
              </h3>
              <div class="tech-container center-display">
                <div
                  v-for="tech in post.tech"
                  :key="tech.id"
                  class="inline ms-2h no-line-height"
                >
                  <techicon :tech="tech" :width="50" />
                </div>
              </div>
              <h3 class="subheading">
                Experience Level{{ post.experience.length > 1 ? 's' : '' }}
                <span class="cursor-pointer">
                  <a-tooltip placement="right">
                    <template slot="title">
                      <p>
                        These titles differ from company to company - however,
                        we use the following traits to identify each:
                      </p>

                      <b>Entry-level</b>
                      <ul>
                        <li>Learning on the job</li>
                        <li>Basic knowledge - expect risks</li>
                        <li>Requires teaching and mentorship</li>
                      </ul>
                      <b>Intermediate</b>
                      <ul>
                        <li>Works independently on tasks</li>
                        <li>Proficient in one or more areas</li>
                        <li>Can be assigned more complex tasks</li>
                      </ul>
                      <b>Senior</b>
                      <ul>
                        <li>Works autonomously</li>
                        <li>Experts in their area</li>
                        <li>Mentors others</li>
                        <li>
                          Easily identifies issues / has solved them before
                        </li>
                      </ul>
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </h3>
              <ExperienceSelect
                :selections="post.experience"
                :preview="true"
                class="epxerience-container"
              />
              <h3 class="subheading">
                Our Requirements
              </h3>
              <ul>
                <li
                  v-for="value in postDetails.requirements.filter(req => {
                    return req.requirement
                  })"
                  :key="value.id"
                >
                  {{ value.requirement }}
                </li>
              </ul>
              <h3 class="subheading">What You'll Be Doing</h3>
              <ul>
                <li
                  v-for="value in postDetails.responsibilities.filter(res => {
                    return res.responsibility
                  })"
                  :key="value.id"
                >
                  {{ value.responsibility }}
                </li>
              </ul>
              <div class="salary">
                <h3 class="subheading">Salary</h3>
                <span
                  >{{ post.salary.currency.code }}
                  <small>({{ post.salary.currency.name }})</small></span
                >
                <h3 class="subheading figure">
                  <span
                    :class="
                      `currency-flag currency-flag-${post.salary.currency.code.toLowerCase()} mr-10`
                    "
                  ></span>
                  <span v-if="!post.salary.set"
                    >{{ post.salary.minimum | moneyFormat }} -
                  </span>
                  {{ post.salary.maximum | moneyFormat }} <small>/year</small>
                </h3>
                <div
                  v-if="
                    selectedCurrency &&
                      !preview &&
                      selectedCurrency != post.salary.currency.code
                  "
                >
                  <p class="ml-10"><i>equivalent to around</i></p>
                  <span
                    >{{ selectedCurrency }}
                    <small>({{ getSelectedCurrency.name }})</small></span
                  >
                  <h3 class="subheading figure">
                    <span
                      :class="
                        `currency-flag currency-flag-${selectedCurrency.toLowerCase()} mr-10`
                      "
                    ></span>
                    <span v-if="!post.salary.set"
                      >{{ computedSalary.minimum | moneyClosestTenFormat }} -
                    </span>
                    {{ computedSalary.maximum | moneyClosestTenFormat }}
                    <small>/year</small>
                  </h3>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Company">
              <a-row align="middle" type="flex" justify="space-around">
                <a-col :span="!isMobile && !post.remote ? 18 : 24">
                  <h3 class="subheading">{{ post.company_name }}</h3>
                  <div
                    class="p-m-0 mb-15"
                    v-html="postDetails.company_intro"
                  ></div>
                  <a-button
                    v-if="post.company_website"
                    :href="post.company_website"
                    target="_blank"
                    class="mb-15"
                    @click="$emit('see-website-clicked')"
                    >See our website</a-button
                  >
                </a-col>
                <a-col
                  v-if="!isMobile && !post.remote"
                  span="6"
                  class="align-center location"
                >
                  <div>
                    <CountryFlag :country-code="post.location.country_code" />
                    <!-- <span
                      v-if="post.location.country_code"
                      :class="
                        `flag-icon flag-icon-${post.location.country_code.toLowerCase()}`
                      "
                    ></span> -->
                    <h4>
                      {{ post.location.city }},
                      {{ post.location.country }}
                    </h4>
                  </div>
                </a-col>
              </a-row>
              <Map
                v-if="
                  post.location_based &&
                    post.location.coords &&
                    post.location.coords.lat
                "
                :coords="post.location.coords"
                :height="isMobile ? 150 : 200"
                class="mb-15"
              />
              <div v-if="post.size != 'Do Not Show'">
                <h3 class="subheading">
                  Size
                </h3>
                <p>{{ post.size }} people</p>
              </div>
              <div
                v-if="
                  (post.type.name == 'Premium' ||
                    post.type.name == 'Scraped') &&
                    (postDetails.gallery || gallaryURLs.length)
                "
              >
                <h3 class="subheading">A Few Images</h3>
                <Gallery
                  :images="preview ? gallaryURLs : postDetails.gallery"
                  :alt-tags="`An image from ${post.company_name}`"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="Perks">
              <h3 class="subheading">Perks/Benefits We Offer</h3>
              <p
                v-for="value in postDetails.benefits.filter(benf => {
                  return benf.benefit
                })"
                :key="value.id"
              >
                {{ value.benefit }}
              </p>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>

      <div
        v-if="
          post.residing_restrictions.by_country.restricted ||
            post.residing_restrictions.by_timezone.restricted
        "
        class="restrictions"
      >
        This position is restrcited to applicants residing/authorized to work in
        the following
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
            v-for="country in post.residing_restrictions.by_country.countries"
            :key="country.id"
            placement="top"
          >
            <template slot="title">
              <span>{{ country.name }}</span>
            </template>
            <CountryFlag :country-code="country.code" :classes="['mr-15']" />
            <!-- <span
              :class="`flag-icon flag-icon-${country.code.toLowerCase()} mr-15`"
            ></span> -->
          </a-tooltip>
        </div>
        <div v-else class="timezones">
          <span
            v-for="timezone in post.residing_restrictions.by_timezone.timezones"
            :key="timezone.id"
            ><b>{{ timezone }}</b></span
          >
        </div>
      </div>
      <div v-if="postDetails.application_instr" class="apply-container">
        <h3 class="subheading">Application notes</h3>
        <div class="p-m-0" v-html="postDetails.application_instr"></div>
      </div>
      <div class="align-center mt-10">
        <a-button
          v-if="postDetails.application_url || postDetails.application_email"
          class="full-font"
          shape="round"
          :href="
            postDetails.application_url
              ? postDetails.application_url
              : `mailto:${postDetails.application_email}?subject=Application: ${post.position}&body=Hi there%0D%0A%0D%0AI'd like to apply to your post on Techstik.com as a ${post.position}. %0D%0A%0D%0A...`
          "
          :target="postDetails.application_url ? '_blank' : '_self'"
          @click="$emit('apply-clicked')"
          >Apply For This Position</a-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import techicon from '@/components/techicon'
import CountryFlag from '@/components/countryflag'
import Map from '@/components/map'
import Gallery from '@/components/gallery'
import ExperienceSelect from '@/components/experienceselect'
import Skeleton from './skeleton'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    techicon,
    Map,
    Gallery,
    ExperienceSelect,
    Skeleton,
    CountryFlag
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    postDetails: {
      type: Object,
      default: null
    },
    gallaryURLs: {
      type: Array,
      default: () => []
    },
    skeletonColour: {
      type: String,
      default: 'blue'
    },
    preview: {
      type: Boolean,
      deafult: false
    },
    computedSalary: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeTabKey: '1'
    }
  },
  computed: {
    ...mapState({
      selectedCurrency: state => state.currencies.specified,
      windowWidth: state => state.windowWidth
    }),
    ...mapGetters({
      getSelectedCurrency: ['currencies/getSelectedCurrency'],
      isMobile: ['isMobile']
    })
  },
  methods: {
    resetTabs() {
      setTimeout(() => {
        this.activeTabKey = '1'
      }, 1000)
    }
  }
}
</script>
<style scoped>
.details-container {
  padding: 1em 2em;
  background: white;
  color: black;
  border-radius: 6px;
  margin-bottom: 10px;
}
.reduced-font {
  font-size: 70%;
}
.full-font {
  font-size: 100%;
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
.apply-container {
  background-color: white;
  padding: 15px;
  border-radius: 6px;
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
.tech-container {
  font-size: 250%;
  width: fit-content;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
}
.tech-container .unknown {
  padding: 12px 6px;
}
.ms-2h {
  margin: 0px 2.5px;
}
.location .flag-icon,
.location img {
  font-size: 60px;
  margin-bottom: 10px;
}
.epxerience-container {
  margin: 30px 0;
}
.salary .subheading.figure {
  font-size: 130%;
}
.flag-icon {
  font-size: 1.7em;
  border-radius: 5px;
}
@media (max-width: 750px) {
  .subheading {
    font-size: 130%;
  }
  .tech-container {
    font-size: 200%;
  }
  .tech-container .unknown {
    padding: 10px 4px !important;
  }
  .details-container {
    padding: 0.5em 1em;
  }
  .epxerience-container {
    margin: 0;
    padding-bottom: 20px;
  }
  .reduced-font {
    font-size: 80%;
  }
}
</style>

<style>
.apply-container div p:last-child {
  margin-bottom: 0;
}
.details-container .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
  padding-left: 0px;
}
.details-container .ant-tabs-nav .ant-tabs-tab {
  padding-top: 0px;
}

@media (max-width: 750px) {
  .details-container .ant-tabs-nav .ant-tabs-tab {
    margin: 0px;
  }
  .details-container .ant-tabs-nav-scroll {
    text-align: center;
  }
}
</style>
