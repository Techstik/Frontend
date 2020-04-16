<template>
  <div class="wrapper wrapper--intro">
    <div class="grid grid--centered grid--formatted">
      <h1
        class="heading heading--x-large grid__item grid__item--large centered-medium"
      >
        Straightforward pricing.
      </h1>
      <div class="grid__item grid__item--large push--bottom promises">
        <h4>
          Your post is:
        </h4>
        <div class="inclusions">
          <div class="subheading">
            <span><div class="dot"></div></span>Assigned to one of our team
            members for it's longivity
          </div>
          <div class="subheading">
            <span><div class="dot"></div></span>Shaped for
            <strong>quality and clarity</strong> after submission
          </div>
          <div class="subheading">
            <span><div class="dot"></div></span>Listed in the
            <strong>Google Job Index</strong>
          </div>
        </div>
      </div>
      <div
        class="grid__item grid__item--medium push--bottom-extra centered-medium"
      >
        <div class="cta push--top">
          <nuxt-link to="/post-a-job">
            <a class="cover-button">Lets Get Started</a>
          </nuxt-link>
        </div>
      </div>
      <ul class="plan-features grid__item grid__item--large centered">
        <li class="plan-features__item">
          <h3 class="medium flush">Standard</h3>
          <p class="small flush">
            All the neccesities.
          </p>
          <h2 class="subheading flush top-space">
            <span v-if="getType('Standard')">
              <span v-if="getType('Standard').discount_active">
                <span class="old-price">${{ getType('Standard').price }}</span>
                <br />
                {{
                  getType('Standard').discount_price == 0
                    ? 'FREE'
                    : `$${getType('Standard').discount_price}`
                }}
              </span>
              <span v-else> ${{ getType('Standard').price }} </span>
            </span>
            <a-icon v-else slot="indicator" type="loading" spin />
          </h2>
        </li>
        <li class="plan-features__item">
          <h3 class="medium flush">Premium</h3>
          <p class="small flush">
            A more professional look.
          </p>
          <ul class="x-small align-left features">
            <li>Display your logo</li>
            <li>Add a gallery of images</li>
            <li>Show your offered salary on the cover of the post</li>
          </ul>
          <h2 class="subheading flush">
            <span v-if="getType('Premium')">
              <span v-if="getType('Premium').discount_active">
                <span class="old-price">${{ getType('Premium').price }}</span>
                <br />
                ${{ getType('Premium').discount_price }}
              </span>
              <span v-else> ${{ getType('Premium').price }} </span>
            </span>
            <a-icon v-else slot="indicator" type="loading" spin />
          </h2>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getType: ['posttypes/getByName']
    })
  },
  created() {
    this.$eventbus.$emit('scroll-to', 0, 0)
  },
  head() {
    return {
      title: 'Techstik | Job Post Pricing',
      meta: [
        {
          hid: 'post-a-job-description',
          name: 'description',
          content:
            'Transparent pricing at a fraction of the going rate. Allow your search to get the maximum reach.'
        }
      ]
    }
  }
}
</script>
<style scoped>
.heading {
  margin-bottom: 0.75em;
}
.plan-features {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.plan-features h3,
.plan-features h2 {
  color: black;
}
h4,
.inclusions {
  color: white;
}
.subheading {
  font-size: 130%;
}
.promises div {
  margin-bottom: 0.25em;
}
.promises div:last-child {
  margin-bottom: 0;
}
.promises .dot {
  width: 15px;
  height: 15px;
  background: orange;
  border-radius: 50%;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 5px !important;
}
.features {
  margin: 0.7em 0;
}
.top-space {
  margin-top: 0.25em !important;
}
.plan-features--disabled {
  position: relative;
}
.plan-features--disabled:before {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  margin: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.7)
    url(/assets/general/x-yellow-bdd6f8b51eb8b7e5f38eb09865e903376eddad8e560cbf52a3c9705a97ee9cec.svg)
    center/100% 100% no-repeat;
}

.plan-features--disabled-button {
  display: block;
  position: absolute;
  width: 24em;
  left: 50%;
  top: 50%;
  margin: -1.25em 0 0 -12em;
  padding: 0.5em 1em;
  z-index: 2;
  font-size: 85%;
  font-weight: bold;
  border-radius: 2em;
  background-color: #ffe000;
  text-decoration-color: #ffe000;
}
.plan-features--disabled-button:hover {
  text-decoration-color: #1d2d35;
}

.plan-features__item {
  position: relative;
  width: 100%;
  margin: 0.5rem;
  padding: 2rem;
  background-color: #fbf7f0;
  border-radius: 1rem;
}
@media (min-width: 37.6em) {
  .plan-features__item {
    width: 48%;
  }
}
@media (min-width: 57.5em) {
  .plan-features__item {
    width: 32%;
  }
}
.plan-features__item:before {
  content: '';
  display: block;
  position: absolute;
  width: 2rem;
  height: 2rem;
  left: 50%;
  top: -0.5rem;
  margin: 0 0 0 -1rem;
  border-radius: 100%;
  background: orange;
}

.highlight-positive {
  border-radius: 0.5em;
  background-color: #fbf7f0;
}

.highlight-negative {
  border-radius: 0.5em;
  background-color: #fbf7f0;
}

.push--bottom-extra {
  margin-bottom: 2em;
}
.old-price {
  text-decoration: line-through;
  color: #a7a7a7;
}
@media (max-width: 750px) {
  .subheading {
    font-size: 115%;
  }
  .promises .dot {
    margin-bottom: 0 !important;
    margin-right: 10px;
  }
}
</style>
<style>
a.cover-button:hover {
  color: #1d2d35 !important;
}
</style>
