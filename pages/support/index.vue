<template>
  <div class="wrapper wrapper--intro">
    <div class="grid grid--centered grid--formatted">
      <h1
        class="heading heading--x-large grid__item grid__item--large centered-medium"
      >
        Reach out.
      </h1>
      <p class="grid__item grid__item--medium flush--bottom centered-medium">
        Our team-mates are assembled around the globe, ready to answer your
        questions at <b>any time of the day.</b>
      </p>
      <h2
        class="subheading grid__item grid__item--large push--top centered-medium"
      >
        <a href="mailto:team@techstik.com">team@techstik.com</a>
      </h2>
      <div class="grid__item grid__item--large">
        <div :class="{ validation_error: $v.email.$error }">
          <a-input
            v-model="$v.email.$model"
            placeholder="Your email address"
          ></a-input>
        </div>
        <div :class="{ validation_error: $v.subject.$error }">
          <a-input
            v-model="$v.subject.$model"
            placeholder="Area of help required"
          ></a-input>
        </div>
        <div :class="{ validation_error: $v.request.$error }">
          <a-textarea
            v-model="$v.request.$model"
            placeholder="How can we help"
            :rows="4"
          />
        </div>
        <a-button id="submit-btn" class="f-r" :loading="loading"
          >Submit request</a-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
import { auth } from 'firebase/app'

export default {
  data() {
    return {
      loading: false,
      email: '',
      subject: '',
      request: ''
    }
  },
  validations: {
    email: {
      required,
      email
    },
    subject: {
      required
    },
    request: {
      required
    }
  },
  mounted() {
    window.recaptchaVerifier = new auth.RecaptchaVerifier('submit-btn', {
      size: 'invisible',
      callback: () => {
        this.loading = true
        if (!this.validate()) {
          this.loading = false
          return window.recaptchaVerifier.reset()
        }

        this.submit()
      }
    })
    window.recaptchaVerifier.render()
  },
  methods: {
    validate() {
      this.$v.$touch()
      if (
        this.$v.email.$invalid ||
        this.$v.subject.$invalid ||
        this.$v.request.$invalid
      )
        return false
      return true
    },
    submit() {
      this.$addDocument(
        'supportqueries',
        {
          email: this.email,
          subject: this.subject,
          request: this.request
        },
        true
      )
        .then(() => {
          this.loading = false
          this.$toast.success(
            "Thanks - We'll get back to you in a couple of minutes!"
          )
          this.$v.$reset()
          this.email = ''
          this.subject = ''
          this.request = ''
        })
        .catch(error => {
          this.loading = false
          this.$toast.error(
            'There was an issue capturing your request. Please try again shortly.'
          )
          this.$bugsnag.notify(error, {
            severity: 'error',
            metaData: {
              explanation: 'Error logging a support query',
              destination: 'pages/support/index.vue'
            }
          })
        })
    }
  },
  head() {
    return {
      title: 'Reach Out | Our team is available 24/7 to assist you',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            "Send us a message to get detailed assistance with the issue you're facing."
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:
            "Send us a message to get detailed assistance with the issue you're facing."
        }
      ]
    }
  }
}
</script>
<style scoped>
p {
  color: white;
}
</style>
