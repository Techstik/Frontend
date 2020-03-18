<template>
  <div
    ref="listing"
    class="card listing"
    @mouseover="onHoverEnter"
    @mouseout="onHoverExit"
  >
    <div class="card-body">
      <div v-if="thumbnailView" class="thumbnail">
        <label class="position position-thumb">{{ post.position }}</label>
        <p class="company">
          {{ post.company_name }}
        </p>
        <a-progress
          v-for="(experience, index) in post.experience"
          :key="experience.id"
          :percent="100"
          :stroke-color="experienceRequired(post.experience[index]).colour"
          :show-info="false"
        />
      </div>
      <div v-else>
        <div @click="revealing = !revealing">
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
              </p>
            </div>
          </div>
          <a-row>
            <a-col :span="8">
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
            </a-col>
            <a-col :span="16" class="date">
              {{ post.date_created.toDate() | moment('from', 'now') }}
            </a-col>
          </a-row>
        </div>
        <a-collapse
          :active-key="revealing ? 1 : 0"
          :bordered="false"
          :class="[{ 'mt-10': revealing }, 'trans-500']"
        >
          <a-collapse-panel key="1" :show-arrow="false" header="">
            <div class="collapse-container">
              <div v-if="details.loading"></div>
              <div v-else>
                <div class="align-center">
                  <a-button type="success" shape="round"
                    >Apply For This Position</a-button
                  >
                </div>
                <a-row align="middle" type="flex" justify="space-around">
                  <a-col span="18">
                    <h3 class="subheading">About Us</h3>
                    <p>
                      With almost 3,000 credit repair companies powered by
                      Credit Repair Cloud, our customers have helped hundreds of
                      thousands of consumers clean their credit, improved over
                      1,900,000 credit report items, and collected over
                      $50,000,000 in revenue. Our mission to help entrepreneurs
                      to start, run and grow profitable credit repair businesses
                      began in early 2002 as a bootstrapped startup. Today we're
                      a stable yet fast-growing (INC 5,000) company with over 50
                      team members around the globe and products that the
                      industry loves. Why What We Do Matters At Credit Repair
                      Cloud, we create products that help Credit Heroes™
                      (entrepreneurs) to help their clients with their credit,
                      to truly change lives, and make a great living in the
                      process. We help them by creating the software, the
                      systems, and the strategies, to grow multi-million dollar
                      credit repair businesses from nothing.
                    </p>
                  </a-col>
                  <a-col span="4" class="align-center">
                    <img :src="germany" class="location-image" />
                    <h4>Munich</h4>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col span="12">
                    <h3 class="subheading">The Role</h3>
                    <p>
                      We are looking for an assertive, friendly, highly
                      organized Customer Support Rep. Our professional support
                      team serves almost 3,000 companies on our platform (and
                      growing) and is on the front lines of our organization. In
                      this role, you will help, encourage and support our
                      customers via email, chat and phone. Results Understand
                      our industry and product Resolve all customer issues,
                      questions, or concerns in a timely manner Work with your
                      Sr. Agent to improve your numbers Help support other team
                      members as needed Work together with the team to improve
                      our processes Maintain positive survey results for all
                      customer interactions Benefits Full-time position in a
                      stable yet fast-growing, self-funded company (we make
                      investments for the long term, as we don’t plan on selling
                      our company. Ever.) Freedom to work from anywhere. Though
                      we do ask that you’ll be around for PST meetings, you will
                      have flexibility with your schedule and of course your
                      location. 20 calendar days of paid time off a year, plus
                      US holidays. A highly supportive environment, an
                      outstanding, smart and caring team and a real chance to
                      learn and grow. Work at a SaaS company whose mission is to
                      change the lives of our customers, their clients, and our
                      team. Join a company early and have a voice in a future
                      hundred million dollar company. We hire for talent and
                      drive, and it doesn’t matter what your gender, religion,
                      race, or language are, who you date or who you spend your
                      life or time with. What we care about is people who
                      believe in our company’s mission to change lives, who help
                      each other and the company grow and move forward.
                      Additional Info Start Date: 1-2 weeks from today Credit
                      Repair Cloud Homepage: https://www.creditrepaircloud.com/
                      Online Training / Webinar explaining what we do, why we do
                      it & what we sell:
                      https://w.creditrepaircloud.com/free-training Customer
                      Reviews:
                      https://www.trustpilot.com/review/creditrepaircloud.com &
                      https://tinyurl.com/CRC-Google-Reviews *** We strive to
                      create an inclusive environment, empower employees and
                      embrace diversity. We encourage every talented and
                      qualified person to respond. **
                    </p>
                  </a-col>
                  <a-col span="12">
                    <h3 class="subheading">
                      Our Requirements
                    </h3>
                    <p>
                      <span><img class="checkbox_icon" :src="ok"/></span>
                      You are an accountable, punctual, responsible, mature
                      professional that has the discipline and requires little
                      supervision post-training period
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="ok"/></span>
                      You have strong interpersonal, written and oral
                      communication skills. You genuinely care about your work
                      and about the team
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="ok"/></span>
                      You genuinely care about your work and about the team You
                      are self-motivated You are an inquisitive person, you
                      always want to learn new things
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="ok"/></span>
                      You are an inquisitive person, you always want to learn
                      new things
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="ok"/></span>
                      You have excellent verbal and written English skills
                    </p>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col span="18">
                    <h3 class="subheading">What You'll Be Doing</h3>
                  </a-col>
                  <a-col span="4"> <h3 class="subheading">Salary</h3> </a-col>
                </a-row>
                <a-row align="middle" type="flex" justify="space-around">
                  <a-col span="18">
                    <p>
                      <span><img class="checkbox_icon" :src="asterisk"/></span>
                      Provide customer support over email and possibly phone,
                      with unparalleled attention to detail.
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="asterisk"/></span>
                      Be a positive and encouraging voice for our team,
                      according to our Company Performance Culture Statement.
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="asterisk"/></span>
                      Resolve problems for human beings, not bots.
                    </p>
                    <p>
                      <span><img class="checkbox_icon" :src="asterisk"/></span>
                      Though we’re a tech company, we really emphasize the
                      importance of making our users’ professional lives easier
                      and treating one another with kindness.
                    </p>
                  </a-col>
                  <a-col span="4"> <h2>$90,000</h2> </a-col>
                </a-row>
                <div class="align-center">
                  <a-button type="success" shape="round" class="btn-sucess"
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
import ok from '@/assets/images/icons/ok.svg'
import asterisk from '@/assets/images/icons/asterisk.png'
import germany from '@/assets/images/flags/germany.svg'

export default {
  components: {
    techicon
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
      details: {
        loading: true,
        data: null
      },
      google,
      globe,
      pin,
      ok,
      asterisk,
      germany
    }
  },
  computed: {
    companyInitials() {
      let pieces = this.post.company_name.split(' ')
      let initials = ''
      pieces.forEach(word => {
        initials += word.substring(0, 1)
      })
      return initials
    }
  },
  watch: {
    revealing(isRevealing) {
      // if (isRevealing && !this.details.data) {
      //   this.details.loading = true
      //   this.$readData('postdetails', {
      //     where: {
      //       field: 'post_ref',
      //       operation: '==',
      //       value: `posts/${this.post.id}`
      //     },
      //     limit: 1
      //   }).then(details => {
      //     this.details.data = details[0]
      //     this.details.loading = false
      //   })
      // }
    }
  },
  methods: {
    setThumbnail(value) {
      this.thumbnailView = value
      if (value) this.revealing = false
    },
    setReveal(value) {
      this.revealing = value

      if (!value)
        setTimeout(() => {
          this.$emit('collapsing')
        }, 300)
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
.location {
  width: 20px;
  z-index: 1;
}
.divider {
  width: 20px;
}
.date-posted {
  margin-bottom: 0px;
  font-size: 12px;
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
  margin-top: 15px;
}
.mt-13 {
  margin-top: 13px;
}
.card-body {
  padding: 2.25rem;
}
.date {
  text-align: right;
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
</style>
