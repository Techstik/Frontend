<template>
  <div class="align-center">
    <h1 class="heading heading--x-large flush--top title">
      Success!
    </h1>
    <img class="avatar" :src="avatar" />
    <h2 class="subheading">
      Your post has been assigned to post-fectionist
      <span class="underline">Matt</span>, and will be verified shortly.
    </h2>
    <div class="label">
      <label>How did you find that?!</label>
    </div>
    <Feedback v-model="feedback" class="align-center" />
  </div>
</template>

<script>
import Feedback from '@/components/feedback'
import avatar from '@/assets/images/matt.png'
import { db } from '@/plugins/firebase'

export default {
  components: {
    Feedback
  },
  validate({ params }) {
    if (!params.id) return false
    return true
  },
  data() {
    return {
      avatar,
      feedback: 0,
      loading: true
    }
  },
  watch: {
    feedback: {
      handler() {
        this.updateFeedback()
      }
    }
  },
  created() {
    return db
      .collection('posts')
      .doc(this.$route.params.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          db.collection('posts')
            .doc(this.$route.params.id)
            .update({
              status: 'completed'
            })
            .catch(error => {
              //TODO: report to bugsnag
            })
          return true
        } else return false
      })
      .catch(error => {
        //TODO: report to bugsnag
        //TODO: reditect to 404
        throw new Error(error)
      })
  },
  methods: {
    updateFeedback() {
      db.collection('posts')
        .doc(this.$route.params.id)
        .update({
          feedback: this.feedback
        })
        .catch(error => {
          //TODO: report to bugsnag
        })
    }
  }
}
</script>

<style scoped>
.subheading {
  margin-bottom: 50px;
}
.subheading,
.label label {
  color: white;
}

.avatar {
  width: 125px;
}
.label {
  margin-bottom: 15px;
}
</style>
