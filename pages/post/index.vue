<template>
  <div>
    <div>
      <h1 class="heading heading--x-large flush--top title">
        Make your search available to the tech world
      </h1>
      <p class="align-center sub-title">Add some text here</p>
    </div>
    <div id="container" class="container">
      <a-steps :current="activeStep" class="mb-30">
        <a-step title="Your Company" />
        <a-step title="The Position" />
        <a-step title="Requirements" />
        <a-step title="How To Apply" />
        <a-step title="Finalize" />
      </a-steps>
      <div class="card">
        <a-tabs
          v-model="activeStepToString"
          tab-position="top"
          class="add-listing-tabs"
        >
          <a-tab-pane key="0" tab="company-info">
            <div class="section logo-upload">
              <FilePond
                @file-added="onFileUpdated"
                @file-removed="onFileUpdated"
              />
            </div>
            <div class="section">
              <div :class="{ validation_error: $v.post.company_name.$error }">
                <label class="mb-10 d-block">
                  Company Name
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <a-input v-model="$v.post.company_name.$model" />
              </div>
              <div class="section">
                <div
                  :class="{
                    validation_error: $v.post_info.company_intro.$error
                  }"
                >
                  <label class="d-block">
                    A quick intro
                    <a-badge
                      count="required"
                      :number-style="{ backgroundColor: '#f4976c' }"
                    />
                  </label>
                  <small>Some text here (keep it short)</small>
                  <ckeditor
                    v-model="$v.post_info.company_intro.$model"
                    :editor="editor"
                    placeholder="Some text here (keep it short)"
                  ></ckeditor>
                </div>
              </div>
            </div>
            <div class="section">
              <div
                :class="{ validation_error: $v.post.company_website.$error }"
              >
                <label class="mb-10 d-block">Website URL</label>
                <a-input
                  v-model="$v.post.company_website.$model"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div class="section">
              <a-row type="flex" align="middle">
                <a-col :span="12">
                  <div
                    :class="[
                      { 'selection-block-active': !post.location_based },
                      'selection-block f-r'
                    ]"
                    @click="setLocationRemote(true)"
                  >
                    <h5>Remote</h5>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div
                    :class="[
                      { 'selection-block-active': post.location_based },
                      'selection-block'
                    ]"
                    @click="setLocationRemote(false)"
                  >
                    <h5>Location-based</h5>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div v-if="post.location_based" class="section">
              <label class="d-block">Where are you based?</label>
              <small>
                Your company HQ - it's nice to see, even if this is a remote
                position
              </small>
              <Map @location-updated="onLocationUpdated" />
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="role">
            <div class="section">
              <div :class="{ validation_error: $v.post.position.$error }">
                <label class="mb-10 d-block">
                  Position
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <a-input v-model="$v.post.position.$model"></a-input>
              </div>
              <div :class="{ validation_error: $v.post_info.position.$error }">
                <label class="d-block">
                  About the position
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small>Some text here (keep it short)</small>
                <ckeditor
                  v-model="$v.post_info.position.$model"
                  :editor="editor"
                  class="h-200"
                ></ckeditor>
              </div>
            </div>
            <div class="section">
              <label class="mb-10 d-block">
                Responsibilities
                <a-badge
                  count="3+ required"
                  :number-style="{ backgroundColor: '#f4976c' }"
                />
              </label>
              <div class="requirements">
                <div
                  v-for="(v, index) in $v.post_info.responsibilities.$each
                    .$iter"
                  :key="`req_${index}`"
                  :class="{ validation_error: v.$error && index < 3 }"
                >
                  <a-input v-model="v.responsibility.$model">
                    <a-icon
                      v-if="index >= 3"
                      slot="suffix"
                      type="delete"
                      @click="removeResponsibility(index)"
                    />
                  </a-input>
                </div>
                <a-button
                  class="btn-sm btn-outline-dark"
                  @click="addResponsibility"
                >
                  <a-icon type="plus" />Add
                </a-button>
              </div>
            </div>
            <div class="section">
              <a-row type="flex" align="middle">
                <a-col :span="12">
                  <div
                    :class="[
                      { 'selection-block-active': post.salary.set },
                      'selection-block f-r'
                    ]"
                    @click="setSalary(true)"
                  >
                    <h5>Set Salary</h5>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div
                    :class="[
                      { 'selection-block-active': !post.salary.set },
                      'selection-block'
                    ]"
                    @click="setSalary(false)"
                  >
                    <h5>Experience Dependent</h5>
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-row class="salary-block">
              <a-col :span="12">
                <div class="currency-select">
                  <v-select
                    v-model="post.salary.currency"
                    label="name"
                    :options="currencies"
                  ></v-select>
                </div>
              </a-col>
              <a-col :span="12">
                <div v-show="post.salary.set">
                  <input
                    v-model="post.salary.maximum"
                    v-currency="{
                      precision: 0
                    }"
                    class="ant-input"
                  />
                </div>
                <div v-show="!post.salary.set">
                  <a-input-group>
                    <a-row>
                      <a-col :span="11">
                        <input
                          v-model="post.salary.minimum"
                          v-currency="{
                            precision: 0
                          }"
                          class="ant-input"
                        />
                      </a-col>
                      <a-col span="2" class="align-center">-</a-col>
                      <a-col :span="11">
                        <input
                          v-model="post.salary.maximum"
                          v-currency="{
                            precision: 0
                          }"
                          class="ant-input"
                        />
                      </a-col>
                    </a-row>
                  </a-input-group>
                </div>
              </a-col>
            </a-row>
            <div class="section">
              <div>
                <label class="d-block">
                  Tech Stack
                  <a-badge
                    count="2+ required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small>
                  Select a few technologies you use and rank them from most
                  used.
                </small>
                <TechStack v-model="post.tech" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="requirements">
            <div class="section">
              <label class="mb-10 d-block">
                Experience Level(s) Required
                <span class="cursor-pointer">
                  <a-tooltip>
                    <!-- <template slot="title">
                      Add some text here explaing how we got to these
                      values</template
                    >-->
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
                <a-badge
                  count="1+ required"
                  :number-style="{ backgroundColor: '#f4976c' }"
                />
              </label>
              <ExperienceSelect v-model="post.experience" />
            </div>
            <div class="section">
              <label class="d-block">
                Requirements
                <a-badge
                  count="2+ required"
                  :number-style="{ backgroundColor: '#f4976c' }"
                />
              </label>
              <small>Some text here (keep it short)</small>
              <div class="requirements">
                <div
                  v-for="(v, index) in $v.post_info.requirements.$each.$iter"
                  :key="`req_${index}`"
                  :class="{ validation_error: v.$error && index < 2 }"
                >
                  <a-input v-model="v.requirement.$model">
                    <a-icon
                      v-if="index >= 2"
                      slot="suffix"
                      type="delete"
                      @click="removeRequirement(index)"
                    />
                  </a-input>
                </div>
                <a-button
                  class="btn-sm btn-outline-dark"
                  @click="addRequirement"
                >
                  <a-icon type="plus" />Add
                </a-button>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="application">
            <div class="section">
              <label class="d-block mb-10">Application URL</label>
              <a-input />
              <label class="d-block">Instructions</label>
              <small>Some text here (keep it short)</small>
              <ckeditor :editor="editor" class="h-200"></ckeditor>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="finalize">
            <div v-show="!displayCheckout">
              <div class="section">
                <label class="mb-10 d-block">Select an option</label>
                <a-row class="price-blocks">
                  <a-col :span="12">
                    <div
                      :class="[
                        { active: post.type == 'standard' },
                        'price-block'
                      ]"
                      @click="post.type = 'standard'"
                    >
                      <h2 class="subheading">Standard</h2>
                      <div class="features small">
                        <p>Feature 1</p>
                        <p>Feature 2</p>
                      </div>
                      <p class="price">$0.00</p>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div
                      :class="[
                        { active: post.type == 'professional' },
                        'price-block'
                      ]"
                      @click="post.type = 'professional'"
                    >
                      <h2 class="subheading">Professional</h2>
                      <div class="features small">
                        <p>Feature 1</p>
                        <p>Feature 2</p>
                      </div>
                      <p class="price">$0.00</p>
                    </div>
                  </a-col>
                </a-row>
              </div>
              <div class="section">
                <label class="mb-10 d-block">Preview</label>
                <div class="preview-container">
                  <ListingPreview v-model="post" />
                </div>
              </div>
            </div>
            <div v-if="displayCheckout">
              <Checkout
                :amount="200"
                currency="usd"
                @submitting="hideButtons = true"
                @paymentIntentCreated="onPaymentInitiated"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
        <div class="navigation">
          <a-button
            v-if="activeStep > 0 && !hideButtons"
            v-scroll-to="'#container'"
            @click="previousStep"
          >
            <a-icon type="left" />{{ displayCheckout ? 'Back' : 'Previous' }}
          </a-button>
          <a-button
            v-if="activeStep < 4"
            v-scroll-to="'#container'"
            class="f-r"
            @click="nextStep"
          >
            Next
            <a-icon type="right" />
          </a-button>
          <a-button
            v-show="activeStep == 4 && !displayCheckout"
            id="proceed_to_payment"
            class="f-r"
          >
            Proceed to payment
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-inline'
import FilePond from '@/components/filepond'
import Map from '@/components/map'
import TechStack from '@/components/techstack'
import ExperienceSelect from '@/components/experienceselect'
import ListingPreview from '@/components/listings/preview'
import Checkout from '@/components/cardcheckout'
import { required, requiredIf, minLength, url } from 'vuelidate/lib/validators'
// eslint-disable-next-line no-unused-vars
import { auth, db } from '@/plugins/firebase'
import firebase from 'firebase'
import { mapState } from 'vuex'

export default {
  components: {
    ckeditor: CKEditor.component,
    Map,
    FilePond,
    TechStack,
    ExperienceSelect,
    ListingPreview,
    Checkout
  },
  data() {
    return {
      editor: ClassicEditor,
      place: null,
      map: null,
      activeStep: 3,
      post_doc_id: null,
      postinfo_doc_id: null,
      post: {
        active: false,
        type: 'standard',
        position: '',
        company_logo: '',
        company_name: '',
        company_website: '',
        experience: [],
        location: {
          city: '',
          country: ''
        },
        location_based: false,
        remote: true,
        tech: [],
        salary: {
          set: true,
          minimum: 1000,
          maximum: 1000,
          currency: {
            name: 'United States Dollar',
            code: 'USD'
          }
        },
        payment_details: {
          stripe_payment_intent_id: '',
          paid: false
        }
      },
      post_info: {
        company_intro: '',
        position: '',
        requirements: [
          {
            requirement: ''
          },
          {
            requirement: ''
          }
        ],
        responsibilities: [
          {
            responsibility: ''
          },
          {
            responsibility: ''
          },
          {
            responsibility: ''
          }
        ]
      },
      post_logo: {
        file: null,
        updated: false
      },
      post_gallery: [],
      displayCheckout: false,
      hideButtons: false
    }
  },
  validations: {
    post: {
      company_name: {
        required
      },
      position: {
        required
      },
      company_website: {
        required: requiredIf(website => {
          return website.length
        }),
        url
      }
    },
    post_info: {
      company_intro: {
        required
      },
      position: {
        required
      },
      requirements: {
        required,
        minLength: minLength(2),
        $each: {
          requirement: {
            required
          }
        }
      },
      responsibilities: {
        required,
        minLength: minLength(3),
        $each: {
          responsibility: {
            required
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.currencies.all
    }),
    activeStepToString() {
      return this.activeStep.toString()
    }
  },
  mounted() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'proceed_to_payment',
      {
        size: 'invisible',
        // eslint-disable-next-line no-unused-vars
        callback: response => {
          this.displayCheckout = true
        }
      }
    )
    window.recaptchaVerifier.render()
  },
  methods: {
    nextStep() {
      this.$v.$touch()

      switch (this.activeStep) {
        case 0:
          // if (
          //   this.$v.post.company_name.$invalid ||
          //   this.$v.post.company_website.$invalid ||
          //   this.$v.post_info.company_intro.$invalid
          // )
          //   return
          break
        case 1:
          // if (
          //   this.$v.post_info.responsibilities.$invalid ||
          //   this.$v.post_info.role.$invalid
          // )
          //   return
          break
        case 2:
          // if (this.$v.post_info.requirements.$invalid) return
          break
      }

      this.$v.$reset()
      ++this.activeStep
    },
    previousStep() {
      if (this.displayCheckout) {
        this.displayCheckout = false
        window.recaptchaVerifier.reset()
      } else --this.activeStep
    },
    addResponsibility() {
      this.post_info.responsibilities.push({ responsibility: '' })
    },
    removeResponsibility(index) {
      this.post_info.responsibilities.splice(index, 1)
    },
    addRequirement() {
      this.post_info.requirements.push({ requirement: '' })
    },
    removeRequirement(index) {
      this.post_info.requirements.splice(index, 1)
    },
    onLocationUpdated(location) {
      this.post.location.city = location[0]
      this.post.location.country = location[1]
    },
    setLocationRemote(value) {
      this.post.remote = value
      this.post.location_based = !value
    },
    setSalary(value) {
      this.post.salary.set = value
    },
    onFileUpdated(file) {
      this.post_logo.file = file ? file : null
      this.post_logo.updated = true
    },
    async addPost() {
      this.$toast.info('Saving post...')

      if (this.post_logo.file) {
        this.post.company_logo = await this.$uploadFile(
          'Companies/Logos',
          this.post_logo.file
        )
        this.post_logo.updated = false
      }

      this.$addDocument('posts', this.post)
        .then(postRef => {
          this.post_doc_id = postRef.id
          this.post_info.post_ref = postRef

          this.$addDocument('postdetails', this.post_info).then(postinfoRef => {
            this.postinfo_doc_id = postinfoRef.id
          })
        })
        .catch(error => {
          this.$toast.error(`Error: ${JSON.stringify(error)}`)
        })
    },
    async updatePost() {
      this.$toast.info('Updating post...')

      if (this.post_logo.updated) {
        this.post.company_logo = this.post_logo.file
          ? await this.$uploadFile('Companies/Logos', this.post_logo.file)
          : null
      }

      this.$updateDocument('posts', this.post_doc_id, this.post, true)
        .then(() => {
          this.$updateDocument(
            'postdetails',
            this.postinfo_doc_id,
            this.post_info,
            true
          )
        })
        .catch(error => {
          this.$toast.error(`Error: ${JSON.stringify(error)}`)
        })
    },
    onPaymentInitiated(payment_intent_id) {
      this.post.payment_details.stripe_payment_intent_id = payment_intent_id
      if (this.post_doc_id) this.updatePost()
      else this.addPost()
    }
  }
}
</script>
<style scoped>
.container {
  max-width: 1500px;
  margin: auto;
}
.card {
  padding: 30px 40px;
}
.section {
  margin-bottom: 15px;
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-30 {
  margin-bottom: 30px;
}

.requirements input {
  margin-bottom: 10px;
}

.requirements div:last-child input {
  margin-bottom: 0px;
}
small {
  display: block;
  margin-bottom: 10px;
  font-size: 70%;
}
.selection-block {
  width: 20vw;
  padding: 25px;
  border: 2px solid white;
  border-radius: 4px;
  display: inline-block;
  margin: 0 25px;
  text-align: center;
  background-color: white;
  transition: all 0.2s;
}
.selection-block:hover {
  cursor: pointer;
}
.selection-block:hover,
.selection-block-active {
  border-width: 2px;
  background-color: #fcd669;
  border-color: #fcd669;
  width: 22vw;
}
.logo-upload {
  max-width: 300px;
  margin: auto;
}
.salary-block {
  max-width: 800px;
  margin: auto;
}
.preview-container {
  padding: 30px;
  background: #161d2d;
  border-radius: 10px;
  margin-bottom: 15px;
}
.price-block {
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
}
.price-block.active,
.price-block:hover {
  background: #fcd669;
}
.price-block h2 {
  text-align: center;
  font-family: Graphik-Bold;
}
.price-block .features {
  text-align: center;
  margin-bottom: 10px;
}
.price-block .features p {
  margin: 0px;
}
.price-block .price {
  text-align: center;
  font-family: Graphik-Bold;
  color: black;
  margin: 0px;
}
.price-blocks {
  max-width: 750px;
  margin: auto;
}
</style>
