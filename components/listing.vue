<template>
  <div class="card listing" @mouseover="onHoverEnter" @mouseout="onHoverExit">
    <div class="card-body">
      <div class="title">
        <img class="company-image" :src="google" />
        <div class="content">
          <p class="position">Full Stack Web Developer</p>
          <p class="company">
            World Wide Technology
          </p>
        </div>
      </div>
      <a-progress :percent="30" :format="() => 'Junior'" />
      <div class="tech-icons">
        <techicon tech="vue" />
        <techicon tech="node" />
        <techicon tech="mongo" />
        <p v-show="!hovering" class="elipsis">...</p>
        <techicon v-show="hovering" tech="mongo" />
      </div>
      <a-row type="flex" justify="space-around" align="middle">
        <a-col span="2">
          <a-tooltip placement="top">
            <template slot="title">
              <span>location shown here</span>
            </template>
            <img class="location" :src="globe" />
          </a-tooltip>
        </a-col>
        <a-col span="22">
          <a-divider class="date-posted" orientation="right">
            2 days ago
          </a-divider>
        </a-col>
      </a-row>
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
  data() {
    return {
      hovering: false,
      google,
      globe,
      pin
    }
  },
  methods: {
    onHoverEnter() {
      this.hovering = true
    },
    onHoverExit() {
      this.hovering = false
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
  margin-top: 16px;
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
</style>
