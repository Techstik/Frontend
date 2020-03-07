<template>
  <div class="container">
    <VueFeedbackReaction
      v-model="feedback"
      :labels="labels"
      label-class="feedback-label"
    />
  </div>
</template>

<script>
import { VueFeedbackReaction } from 'vue-feedback-reaction'

export default {
  components: {
    VueFeedbackReaction
  },
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    feedback: '0',
    labels: ['sucks', 'not good', 'average', 'good', 'awesome']
  }),
  watch: {
    feedback: {
      handler() {
        this.update()
      }
    }
  },
  methods: {
    update() {
      this.$emit('input', parseInt(this.feedback))
      this.$toast.success('Got it, thanks!', {
        position: 'top-center',
        duration: 3000,
        keepOnHover: true,
        className: 'toast'
      })
    }
  }
}
</script>
<style scoped>
.container {
  width: fit-content;
  background: white;
  border-radius: 10px;
  padding: 15px 25px;
  margin: auto;
}
</style>
<style>
.feedback-label {
  font-size: 16px;
}
</style>
