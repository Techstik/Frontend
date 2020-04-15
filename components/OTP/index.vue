<template>
  <div>
    <div v-if="!displayCodeInput">
      <div class="container">
        <VuePhoneNumberInput
          v-model="number"
          :error="error"
          class="container"
          size="sm"
          color="#f3976b"
          error-color="white"
          default-country-code="US"
          :preferred-countries="['US', 'GB']"
          @update="onUpdate"
        />
      </div>
      <p class="align-center">
        We'll quickly need to send you a once-off pin for security reasons.
        <br />
        <small>Standard rates apply</small>
      </p>
      <div class="align-center mtb-15">
        <a-button :loading="loading" @click="sendOTP">Send code</a-button>
      </div>
    </div>

    <div v-else>
      <div v-if="verifyingCode" class="align-center spinner">
        <a-spin>
          <a-icon slot="indicator" type="loading" spin />
        </a-spin>
      </div>
      <div v-else>
        <OtpInput
          ref="otpInput"
          input-classes="otp-input"
          separator="-"
          :num-inputs="6"
          :should-auto-focus="true"
          :is-input-num="true"
          class="otp-input-container mbt-30"
          @on-complete="verifyCode"
        />
        <p class="align-center mb-15">
          Please enter the code we sent to the cell number ending in
          <b>{{ number.substr(number.length - 4) }}</b>
        </p>
        <div class="align-center mb-15">
          <a-button class="btn-sm" @click="resendOTP">Resend code</a-button>
          <a-button class="btn-sm" @click="displayCodeInput = false"
            >Change phone number</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VuePhoneNumberInput from 'vue-phone-number-input'
import OtpInput from '@bachdgvn/vue-otp-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
import { auth } from '@/plugins/firebase'
import { mapState } from 'vuex'

export default {
  components: {
    VuePhoneNumberInput,
    OtpInput
  },
  props: {
    recaptchaVerfifier: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      number: null,
      formattedNumber: null,
      loading: false,
      valid: false,
      error: false,
      displayCodeInput: false,
      verifyingCode: false
    }
  },
  computed: {
    ...mapState({
      userSignedIn: state => state.users.current != null
    })
  },
  watch: {
    userSignedIn(signedIn) {
      if (signedIn) this.$emit('success')
    }
  },
  mounted() {
    this.$logAnalytic(`begin-OTP`)
  },
  methods: {
    onUpdate(event) {
      this.formattedNumber = event.formattedNumber
      this.valid = event.isValid
      if (this.error) this.error = !event.isValid
    },
    sendOTP() {
      if (!this.valid) return (this.error = true)

      this.$logAnalytic(`OTP-sending`)

      this.loading = true

      auth
        .signInWithPhoneNumber(this.formattedNumber, window.recaptchaVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult
          this.verifyingCode = false
          this.displayCodeInput = true
          this.loading = false
          this.$logAnalytic(`OTP-sent`)
        })
        .catch(error => {
          window.recaptchaVerifier.reset()
          this.$toast.info(
            'Mmmm, there was an issue sending your code. Please try again.'
          )
          this.loading = false
          this.$bugsnag.notify(error, {
            severity: 'info',
            metaData: {
              explanation: 'Error whilst sending OTP/signInWithPhoneNumber.',
              destination: 'components/OTP/index.vue'
            }
          })
        })
    },
    verifyCode(code) {
      this.verifyingCode = true
      this.$logAnalytic(`OTP-verifying`)
      window.confirmationResult
        .confirm(code)
        .then(() => {
          this.$logAnalytic(`OTP-verified`)
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-verification-code':
              this.$toast.error(
                `The code entered does not match the one that was sent. We have sent a new code, please try again.`
              )
              break
            default:
              this.$toast.error(
                `There was an issue in the validation process. We have sent a new code, please try again.`
              )
              break
          }
          this.sendOTP()
        })
    },
    resendOTP() {
      this.sendOTP()
      this.$toast.info('Sent a new OTP')
      this.$logAnalytic(`OTP-resending`)
    }
  }
}
</script>
<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  margin-bottom: 30px;
  margin-top: 30px;
}
p {
  margin: 0;
}
.otp-input-container {
  width: fit-content;
  margin: auto;
}
.mbt-30 {
  margin-bottom: 30px;
  margin-top: 30px;
}
.spinner {
  padding: 10px;
}
.spinner i {
  font-size: 45px;
}
.mb-15 {
  margin-bottom: 15px;
}
</style>
<style>
.spinner .ant-spin {
  color: #fdd669;
}
.otp-input {
  width: 47.5px;
  height: 47.5px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 10px;
  border: 2px solid white;
  text-align: center;
}
.input-phone-number input,
.input-country-selector input {
  border: 2px solid white !important;
  margin-bottom: 10px;
  height: 47.5px !important;
  border-radius: 10px !important;
  color: black;
  padding: 0 35px 0 35px !important;
  font-family: 'Graphik', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  font-size: 16px !important;
}
.input-tel__label {
  padding-left: 25px;
}
.input-tel__input:hover,
.input-tel__input:focus,
.country-selector__input:hover,
.country-selector__input:focus,
.otp-input:hover,
.otp-input:focus {
  border-color: #e4e4e4 !important;
  box-shadow: none !important;
  outline: none;
}
.input-tel__input:focus,
.country-selector__input:focus,
.otp-input:focus {
  border-color: #f3976b !important;
}
.select-country-container {
  margin-right: 10px;
}
.input-phone-number.has-error input {
  background-color: #fa755a;
  border-color: #fa755a !important;
  color: white;
}
.otp-input.error {
  border: 1px solid red !important;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
@media (max-width: 750px) {
  .container {
    margin-left: -15px;
    margin-right: -15px;
  }
  .input-phone-number input {
    padding: 0 15px !important;
  }
  .input-phone-number label {
    padding: 0 5px !important;
  }
}
</style>
<style>
@media (max-width: 750px) {
  .vue-phone-number-input {
    padding: 0 !important;
  }
  .otp-input {
    width: 35.5px;
    height: 35.5px;
    margin: 2px;
  }
}
</style>
