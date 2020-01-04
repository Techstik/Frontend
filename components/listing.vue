<template>
  <div class="card listing" @mouseover="onHoverEnter" @mouseout="onHoverExit">
    <div class="card-body">
      <div v-if="thumbnailView" class="thumbnail">
        <p class="position">{{ value.position }}</p>
        <p class="company">
          {{ value.company }}
        </p>
      </div>
      <div v-else>
        <div class="title">
          <img class="company-image" :src="google" />
          <div class="content">
            <p class="position">{{ value.position }}</p>
            <p class="company">
              {{ value.company }}
            </p>
          </div>
        </div>
        <a-progress
          v-for="(experience, index) in value.experience"
          :key="experience.id"
          :percent="experienceRequired(value.experience[index]).percentage"
          :format="() => value.experience[index]"
          :stroke-color="experienceRequired(value.experience[index]).colour"
        />
        <div class="tech-icons">
          <a-collapse default-active-key="1" :bordered="false">
            <a-collapse-panel key="1">
              <div
                v-for="(tech, index) in value.tech"
                :key="tech.id"
                class="inline"
              >
                <techicon v-if="index < 3" :tech="tech" />
                <techicon v-else v-show="hovering" :tech="tech" />
              </div>
              <p
                v-if="value.tech.length > 3"
                v-show="!hovering"
                class="elipsis"
              >
                ...
              </p>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="value.locationbased && value.remote ? 4 : 2">
            <a-tooltip v-if="value.locationbased" placement="top">
              <template slot="title">
                <span>{{ value.location }}</span>
              </template>
              <img class="location" :src="pin" />
            </a-tooltip>
            <a-tooltip v-if="value.remote" placement="top">
              <template slot="title">
                <span>remote</span>
              </template>
              <img
                :class="[
                  { 'ml-25': value.locationbased && value.remote },
                  'location'
                ]"
                :src="globe"
              />
            </a-tooltip>
          </a-col>
          <a-col :span="value.locationbased && value.remote ? 20 : 22">
            <a-divider class="date-posted" orientation="right">
              2 days ago
            </a-divider>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import google from '@/assets/images/google.png'
import globe from '@/assets/images/planet-earth.svg'
import pin from '@/assets/images/pin.svg'
import techicon from '@/components/techicon'

export default {
  components: {
    techicon
  },
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      thumbnailView: false,
      hovering: false,
      google,
      globe,
      pin
    }
  },
  methods: {
    setThumbnail(value) {
      this.thumbnailView = value
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
}
.company {
  font-size: 13px;
}
.content {
  display: inline-block;
  margin-left: 60px;
}
.content p {
  margin-bottom: 0px;
}
.position {
  font-size: 21px;
  color: black;
  font-weight: bold;
}
.location {
  position: absolute;
  width: 20px;
  z-index: 1;
}
.divider {
  width: 20px;
}
.tech-icons {
  text-align: center;
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
</style>
