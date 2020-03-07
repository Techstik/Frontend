<template>
  <VueRecaptcha
    ref="invisibleRecaptcha"
    :sitekey="site_key"
    size="invisible"
    @verify="onVerify"
    @expired="onExpired"
  ></VueRecaptcha>
</template>
<script>
import VueRecaptcha from 'vue-recaptcha'
import { functions } from '@/plugins/firebase'

export default {
  components: {
    VueRecaptcha
  },
  props: {
    callback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      site_key: process.env.reCAPTCHA_SITE_KEY
    }
  },
  methods: {
    execute() {
      this.$refs.invisibleRecaptcha.execute()
    },
    async onVerify(response) {
      var verify_reCAPTCHA = functions.httpsCallable('verify_reCAPTCHA')

      verify_reCAPTCHA({ token: response }).then(result => {
        console.log(result)

        if (!result || !result.data.success)
          return this.$emit('errorOnVerification')

        this.callback()
      })
    },
    onExpired() {
      this.$refs.invisibleRecaptcha.reset()
    }
  }
}
</script>
