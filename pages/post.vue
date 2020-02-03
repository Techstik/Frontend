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
        <a-step title="The Role" />
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
            <div class="section">
              <div :class="{ error: $v.listing.company_name.$error }">
                <label class="mb-10 d-block">
                  Company Name
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <a-input v-model.trim="$v.listing.company_name.$model" />
              </div>
              <div :class="{ error: $v.listing_info.company_intro.$error }">
                <label class="d-block">
                  A quick intro
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small>Some text here (keep it short)</small>
                <ckeditor
                  v-model.trim="$v.listing_info.company_intro.$model"
                  :editor="editor"
                ></ckeditor>
              </div>
            </div>
            <div class="section">
              <div :class="{ error: $v.listing.company_website.$error }">
                <label class="mb-10 d-block">Website URL</label>
                <a-input
                  v-model.trim="$v.listing.company_website.$model"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div class="section">
              <label class="d-block">Where are you based?</label>
              <small>
                Your company HQ - it's nice to see, even if this is a remote
                position
              </small>
              <Map /></div
          ></a-tab-pane>
          <a-tab-pane key="1" tab="role">
            <div class="section">
              <div :class="{ error: $v.listing_info.role.$error }">
                <label class="d-block">
                  About the role
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small>Some text here (keep it short)</small>
                <ckeditor
                  v-model.trim="$v.listing_info.role.$model"
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
                  v-for="(v, index) in $v.listing_info.responsibilities.$each
                    .$iter"
                  :key="`req_${index}`"
                  :class="{ error: v.$error }"
                >
                  <a-input v-model.trim="v.responsibility.$model" />
                </div>
              </div>
            </div>
            <div class="section">
              <label class="mb-10 d-block">
                Salary
              </label>
              <a-radio-group name="radioGroup" :default-value="1">
                <a-row>
                  <a-col span="12">
                    <div class="salary-block">
                      <a-radio :value="1"><label>Set amount</label></a-radio>
                      <a-input-number
                        :default-value="1000"
                        class="full-width"
                        decimal-separator="."
                        :formatter="
                          value =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        "
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                      >
                        <a-select slot="addonBefore" default-value="https://">
                          <a-select-option value="http://"
                            >http://</a-select-option
                          >
                          <a-select-option value="https://"
                            >https://</a-select-option
                          >
                        </a-select>
                      </a-input-number>
                    </div>
                  </a-col>
                  <a-col span="12">
                    <div class="salary-block">
                      <a-radio :value="2"
                        ><label>Experience Dependent</label></a-radio
                      >
                      <a-input-group>
                        <a-row>
                          <a-col :span="11">
                            <a-input-number
                              :default-value="1000"
                              class="full-width"
                              :formatter="
                                value =>
                                  `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                              "
                              :parser="
                                value => value.replace(/\$\s?|(,*)/g, '')
                              "
                            />
                          </a-col>
                          <a-col span="2" class="align-center">
                            -
                          </a-col>
                          <a-col :span="11">
                            <a-input-number
                              :default-value="1000"
                              class="full-width"
                              :formatter="
                                value =>
                                  `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ','
                                  )
                              "
                              :parser="
                                value => value.replace(/\$\s?|(,*)/g, '')
                              "
                            />
                          </a-col>
                        </a-row>
                      </a-input-group>
                    </div>
                  </a-col>
                </a-row>
              </a-radio-group>
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
                    >--><a-icon type="info-circle"/></a-tooltip
                ></span>
                <a-badge
                  count="required"
                  :number-style="{ backgroundColor: '#f4976c' }"
                />
              </label>
              <div class="experience-level">
                <a-checkbox></a-checkbox>
                <a-progress
                  :stroke-width="15"
                  stroke-color="#b4dfe5"
                  :percent="33"
                  :show-info="false"
                />
              </div>
              <div class="experience-level">
                <a-checkbox></a-checkbox>
                <a-progress
                  :stroke-width="15"
                  stroke-color="#f3976b"
                  :percent="66"
                  :show-info="false"
                />
              </div>
              <div class="experience-level">
                <a-checkbox></a-checkbox>
                <a-progress
                  :stroke-width="15"
                  stroke-color="#161d2d"
                  :percent="100"
                  :show-info="false"
                />
              </div>
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
                  v-for="(v, index) in $v.listing_info.requirements.$each.$iter"
                  :key="`req_${index}`"
                  :class="{ error: v.$error }"
                >
                  <a-input v-model.trim="v.requirement.$model" />
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="application">
            <div class="section">
              <label class="d-block mb-10">
                Application URL
              </label>
              <a-input />
              <label class="d-block">
                Instructions
              </label>
              <small>Some text here (keep it short)</small>
              <ckeditor :editor="editor" class="h-200"></ckeditor>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="finalize"> </a-tab-pane>
        </a-tabs>
        <div class="navigation">
          <a-button
            v-if="activeStep > 0"
            v-scroll-to="'#container'"
            @click="previousStep"
          >
            <a-icon type="left" />
            Previous
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-inline'

import Map from '@/components/map'
import { required, requiredIf, minLength, url } from 'vuelidate/lib/validators'

export default {
  components: {
    ckeditor: CKEditor.component,
    Map
  },
  data() {
    return {
      editor: ClassicEditor,
      place: null,
      map: null,
      activeStep: 0,
      listing: {
        active: false,
        company_logo: '',
        company_name: '',
        company_website: '',
        date_listed: null,
        experience: [],
        location: {
          city: '',
          country: ''
        },
        location_based: true,
        remote: false,
        tech: []
      },
      listing_info: {
        company_intro: '',
        role: '',
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
      }
    }
  },
  validations: {
    listing: {
      company_name: {
        required
      },
      company_website: {
        required: requiredIf(website => {
          return website.length
        }),
        url
      }
    },
    listing_info: {
      company_intro: {
        required
      },
      role: {
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
    activeStepToString() {
      return this.activeStep.toString()
    }
  },
  methods: {
    nextStep() {
      this.$v.$touch()

      switch (this.activeStep) {
        case 0:
          if (
            this.$v.listing.company_name.$invalid ||
            this.$v.listing.company_website.$invalid ||
            this.$v.listing_info.company_intro.$invalid
          )
            return
          break
        case 1:
          if (
            this.$v.listing_info.responsibilities.$invalid ||
            this.$v.listing_info.role.$invalid
          )
            return
          break
        case 2:
          if (this.$v.listing_info.requirements.$invalid) return
          break
      }

      this.$v.$reset()
      ++this.activeStep
    },
    previousStep() {
      --this.activeStep
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
  padding: 25px;
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

.experience-level div {
  position: relative;
  width: calc(100% - 30px);
  font-size: 14px;
  float: right;
  margin-top: 5px;
}

.experience-level {
  margin-bottom: 10px;
}
.salary-block label {
  margin-bottom: 10px;
}
.salary-block h4 {
  display: inherit;
}
small {
  display: block;
  margin-bottom: 10px;
  font-size: 70%;
}
</style>
