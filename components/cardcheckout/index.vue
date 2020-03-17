<template>
  <div>
    <div id="container" ref="container" class="container">
      <div class="card_block">
        <div :class="[{ visible: confirm.failed }, 'error_repsonse']">
          <p>{{ confirm.failure_message }}</p>
          <p>Please try again.</p>
        </div>
        <div :class="{ validation_error: $v.email_address.$error }">
          <a-input
            ref="email"
            v-model="$v.email_address.$model"
            class="field"
            placeholder="Email Address"
            type="email"
          />
        </div>
        <div class="address-container">
          <a-collapse :bordered="false" @change="onCollapseChange">
            <a-collapse-panel
              key="0"
              header="Want to see your address on the receipt?"
              :show-arrow="false"
            >
              <div :class="{ validation_error: $v.address.line1.$error }">
                <a-input
                  ref="address_line_1"
                  v-model="$v.address.line1.$model"
                  class="field"
                  placeholder="Address Line 1"
                />
              </div>
              <a-input
                v-model="address.line2"
                class="field mt-6"
                placeholder="Address Line 2"
              />
              <a-input
                v-model="address.city"
                class="field"
                placeholder="City"
              />
              <a-input
                v-model="address.state"
                class="field"
                placeholder="State/Province"
              />
              <v-select
                v-model="address.country"
                class="vs-multiple"
                label="name"
                placeholder="Country"
                :reduce="country => country.code"
                :options="countries"
              >
                <template
                  v-slot:selected-option="option"
                  v-bind="
                    typeof option === 'object' ? option : { [label]: option }
                  "
                >
                  <span
                    :class="
                      `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                    "
                  ></span>
                  {{ option.name }}
                </template>
                <template v-slot:option="option">
                  <span
                    :class="
                      `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                    "
                  ></span>
                  {{ option.name }}
                </template>
              </v-select>
              <a-input
                v-model="address.postal_code"
                class="field"
                placeholder="Postal Code"
              />
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div ref="card_number" class="ant-input field"></div>
        <a-row>
          <a-col span="12">
            <div ref="expiry" class="ant-input field"></div>
          </a-col>
          <a-col span="12">
            <div ref="cvv" class="ant-input field"></div>
          </a-col>
        </a-row>
        <a-button @click="submitPayment">
          Pay $25.00
        </a-button>
        <a target="_blank" href="https://stripe.com/"
          ><img class="logo" :src="stripelogo"
        /></a>
      </div>
      <div ref="error_block" class="error" role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 17 17"
        >
          <path
            class="base"
            fill="#000"
            d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
          ></path>
          <path
            class="glyph"
            fill="#FFF"
            d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
          ></path>
        </svg>
        <span ref="error_message" class="message"></span>
      </div>
      <div class="success">
        <div class="icon">
          <svg
            width="84px"
            height="84px"
            viewBox="0 0 84 84"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <circle
              class="border"
              cx="42"
              cy="42"
              r="40"
              stroke-linecap="round"
              stroke-width="4"
              stroke="#000"
              fill="none"
            ></circle>
            <path
              class="checkmark"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338"
              stroke-width="4"
              stroke="#000"
              fill="none"
            ></path>
          </svg>
        </div>
        <h2 class="subheading" data-tid="elements_examples.success.title">
          Payment Successful
        </h2>
        <p class="message">
          Your post has been assigned to post-fectionist <b>Matt</b>, and will
          be verified shortly.
        </p>
        <p class="message">
          Contact him at
          <b><a href="mailto:matt@magicdiv.com">matt@magicdiv.com</a></b> if you
          have any questions in the mean time.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { functions } from '@/plugins/firebase'
import { required, requiredIf, email } from 'vuelidate/lib/validators'
import stripelogo from '@/assets/images/logos/stripe/solid_dark.svg'
import { mapState } from 'vuex'

export default {
  props: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'usd'
    }
  },
  data() {
    return {
      stripe: null,
      clientSecret: null,
      payment_intent_id: null,
      form_elements: [],
      form_errors: {},
      email_address: '',
      include_address: false,
      address: {
        line1: '',
        line2: '',
        city: '',
        country: '',
        postal_code: '',
        state: ''
      },
      confirm: {
        failed: false,
        failure_message: ''
      },
      stripelogo
    }
  },
  validations: {
    email_address: {
      required,
      email
    },
    address: {
      line1: {
        required: requiredIf(function() {
          return this.include_address
        })
      }
    }
  },
  computed: {
    ...mapState({
      countries: state => state.countries.all
    })
  },
  mounted() {
    this.$refs.container.classList.add('submitting')
    var create_payment_intent = functions.httpsCallable(
      'stripe-create_payment_intent'
    )
    create_payment_intent({
      amount: this.amount,
      currency: this.currency
    })
      .then(response => {
        this.payment_intent_id = response.data.data.paymentIntentId
        this.$emit('paymentIntentCreated', response.data.data.paymentIntentId)
        this.clientSecret = response.data.data.clientSecret
        this.initializeComponents(response.data.data.publishableKey)
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    onCollapseChange(key) {
      this.include_address = key.length > 0
    },
    initializeComponents(publishableKey) {
      // eslint-disable-next-line no-undef
      this.stripe = Stripe(publishableKey)

      let elements = this.stripe.elements({
        locale: 'auto'
      })

      var elementStyles = {
        base: {
          color: 'black',
          fontWeight: 600,
          fontFamily: 'Graphik-Bold',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':focus': {
            color: 'black'
          },

          '::placeholder': {
            color: 'silver'
          },

          ':focus::placeholder': {
            color: 'silver'
          }
        },
        invalid: {
          color: '#fff',
          '::placeholder': {
            color: '#FFCCA5'
          }
        }
      }

      var elementClasses = {
        focus: 'focus',
        empty: 'empty',
        invalid: 'invalid'
      }

      this.form_elements[0] = elements.create('cardNumber', {
        style: elementStyles,
        classes: elementClasses
      })
      this.form_elements[0].mount(this.$refs.card_number)

      this.form_elements[1] = elements.create('cardExpiry', {
        style: elementStyles,
        classes: elementClasses
      })
      this.form_elements[1].mount(this.$refs.expiry)

      this.form_elements[2] = elements.create('cardCvc', {
        style: elementStyles,
        classes: elementClasses
      })
      this.form_elements[2].mount(this.$refs.cvv)
      this.form_elements[2].on('ready', () => {
        this.$refs.container.classList.remove('submitting')
      })

      this.form_elements.forEach((element, idx) => {
        element.on('change', event => {
          if (event.error) {
            this.$refs.error_block.classList.add('visible')
            this.form_errors[idx] = event.error.message
            this.$refs.error_message.innerText = event.error.message
          } else {
            this.form_errors[idx] = null

            // Loop over the saved errors and find the first one, if any.
            var nextError = Object.keys(this.form_errors)
              .sort()
              .reduce((maybeFoundError, key) => {
                return maybeFoundError || this.form_errors[key]
              }, null)

            if (nextError) {
              // Now that they've fixed the current error, show another one.
              this.$refs.error_message.innerText = nextError
            } else {
              // The user fixed the last error; no more errors.
              this.$refs.error_block.classList.remove('visible')
              this.confirm.failed = false
            }
          }
        })
      })
    },
    clearToSubmit() {
      this.$v.$touch()

      if (this.$v.email_address.$invalid || this.$v.address.line1.$invalid)
        return false

      let form_error = Object.keys(this.form_errors)
        .sort()
        .reduce((maybeFoundError, key) => {
          return maybeFoundError || this.form_errors[key]
        }, null)

      if (form_error) return false

      var refs = ['card_number', 'expiry', 'cvv']
      for (var i = 0; i < refs.length; i++) {
        if (
          !this.$refs[refs[i]] ||
          this.$refs[refs[i]].classList.contains('empty')
        ) {
          this.confirm.failure_message = 'All fields are required.'
          this.confirm.failed = true
          return false
        }
      }

      return true
    },
    async submitPayment() {
      if (!this.clearToSubmit()) return this.$scrollTo('#container')

      this.$refs.container.classList.add('submitting')
      this.$emit('submitting')

      var list_customers = functions.httpsCallable('stripe-list_customers')

      const customers = await list_customers({ email: this.email_address })
      let customer

      if (customers.data.data.data.length) {
        if (this.include_address) {
          var update_customer = functions.httpsCallable(
            'stripe-update_customer'
          )
          customer = (
            await update_customer({
              id: customers.data.data.data[0].id,
              data: {
                address: this.address
              }
            })
          ).data.data
        } else customer = customers.data.data.data[0]
      } else {
        var create_customer = functions.httpsCallable('stripe-create_customer')
        customer = (
          await create_customer(
            this.include_address
              ? { email: this.email_address, address: this.address }
              : { email: this.email_address }
          )
        ).data.data
      }

      var update_payment_intent = functions.httpsCallable(
        'stripe-update_payment_intent'
      )

      await update_payment_intent({
        id: this.payment_intent_id,
        data: {
          receipt_email: this.email_address,
          customer: customer.id
        }
      })

      this.stripe
        .confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.form_elements[0]
          },
          setup_future_usage: 'off_session'
        })
        .then(result => {
          this.$refs.container.classList.remove('submitting')

          if (result.error) {
            this.$emit('onError', result.error.message)
            this.confirm.failure_message = result.error.message
            this.confirm.failed = true
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              this.$refs.container.classList.add('submitted')
              this.$emit('onSuccess')
            }
          }
        })
    }
  }
}
</script>
<style scoped>
.logo {
  margin-top: 10px;
}
.container {
  max-width: 400px;
  margin: auto;
  padding: 30px 0px;
  text-align: center;
}

.field {
  padding: 10px 20px 11px;
  width: 100%;
}

.field + .field {
  margin-top: 6px;
}

/* .field.focus,
.field:focus,
.field:hover {
  border-color: #f3976b !important;
} */

.field.invalid,
.field.invalid:focus {
  background-color: #fa755a;
  border-color: #fa755a !important;
}

.validation_error .field::placeholder,
.validation_error .field:focus::placeholder {
  color: white;
}

.field.focus::-webkit-input-placeholder,
.field:focus::-webkit-input-placeholder {
  color: silver;
}

.field.focus::-moz-placeholder,
.field:focus::-moz-placeholder {
  color: silver;
}

.field.focus:-ms-input-placeholder,
.field:focus:-ms-input-placeholder {
  color: silver;
}

input,
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border-style: none;
}

input {
  color: black;
  border: 2px solid white;
}

input::-webkit-input-placeholder {
  color: silver;
}

input::-moz-placeholder {
  color: silver;
}

input:-ms-input-placeholder {
  color: silver;
}

button {
  display: block;
  width: 100%;
  height: 40px;
  background-color: #fcd669;
  border-radius: 10px;
  color: black;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
}

button:active {
  background-color: #f5be58;
}

.error {
  justify-content: center;
  display: flex;
  padding: 0 15px;
  margin-top: 15px;
  font-size: 13px;
  opacity: 0;
  transform: translateY(10px);
  transition-property: opacity, transform;
  transition-duration: 0.35s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
}

.error.visible {
  opacity: 1;
  transform: none;
}

.error svg {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  margin-top: -1px;
  margin-right: 10px;
}

.error svg .base {
  fill: #fa755a;
}

.error svg .glyph {
  fill: #fff;
}

.error .message {
  color: black;
  font-size: 13px;
}

.submitted .card_block,
.submitting .card_block {
  opacity: 0;
  transform: scale(0.9);
  pointer-events: none;
}

.submitted .success,
.submitting .success {
  pointer-events: all;
}

.submitting .success .icon {
  opacity: 1;
}

.submitted .success > * {
  opacity: 1;
  transform: none !important;
}

.submitted .success > :nth-child(2) {
  transition-delay: 0.1s;
}

.submitted .success > :nth-child(3) {
  transition-delay: 0.2s;
}

.submitted .success > :nth-child(4) {
  transition-delay: 0.3s;
}

.submitted .success .icon .border,
.submitted .success .icon .checkmark {
  opacity: 1;
  stroke-dashoffset: 0 !important;
}

.success {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 10px;
  text-align: center;
  pointer-events: none;
  overflow: hidden;
}

@media (min-width: 670px) {
  .success {
    padding: 40px;
  }
}

.success > * {
  transition-property: opacity, transform;
  transition-duration: 0.35s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: 0;
  transform: translateY(50px);
}

.success .icon {
  margin: 15px 0 30px;
  transform: translateY(70px) scale(0.75);
}

.success .icon svg {
  will-change: transform;
}

.success .icon .border {
  stroke-dasharray: 251;
  stroke-dashoffset: 62.75;
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation: spin 1s linear infinite;
}

.success .icon .checkmark {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  transition: stroke-dashoffset 0.35s cubic-bezier(0.165, 0.84, 0.44, 1) 0.35s;
}

.success .title {
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 8px;
}

.success .message {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.6em;
  margin-bottom: 0px;
}

.success .reset:active {
  transition-duration: 0.15s;
  transition-delay: 0s;
  opacity: 0.65;
}

.success .reset svg {
  will-change: transform;
}

.success .icon .border {
  stroke: #fcd669;
}

.success .icon .checkmark {
  stroke: black;
}

.success .title {
  color: black;
}

.success .message {
  color: black;
}
.error_repsonse {
  margin-bottom: 15px;
  opacity: 0;
  transform: translateY(10px);
  transition-property: opacity, transform;
  transition-duration: 0.35s;
  transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
}
.error_repsonse.visible {
  opacity: 1;
  transform: none;
}
.error_repsonse p {
  margin: 0px;
  color: red;
  font-family: 'Graphik-Bold';
}
.error_repsonse p:last-child {
  color: black;
}
.address-container {
  margin-bottom: 15px;
}
.address-container .ant-collapse-borderless {
  background: transparent !important;
}
.vs-multiple {
  margin-top: 6px;
  margin-bottom: 15px;
}
.mt-6 {
  margin-top: 6px;
}
</style>
<style>
.address-container .ant-collapse-header {
  margin-bottom: 10px;
}
.address-container .vs__dropdown-toggle {
  padding: 0 10px !important;
}
.address-container .ant-collapse-content-box > .field:last-child {
  margin-bottom: 0px;
}
</style>
