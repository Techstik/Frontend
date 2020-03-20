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
                label="Drop logo here"
                @files-updated="
                  (...args) => onFilesUpdated(...args, 'post_logo')
                "
              />
            </div>
            <div class="section">
              <div
                id="id_company_name"
                :class="{ validation_error: $v.post.company_name.$error }"
              >
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
                  id="id_company_intro"
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
                  <small
                    >Tell us about what you do, but keep it short and
                    precise!</small
                  >
                  <ckeditor
                    v-model="$v.post_info.company_intro.$model"
                    :editor="editor"
                    placeholder="Some text here (keep it short)"
                  ></ckeditor>
                </div>
              </div>
              <div class="section">
                <label class="d-block mb-10">
                  Number of people
                </label>
                <v-select
                  v-model="post.size"
                  :clearable="false"
                  :options="[
                    '1-10',
                    '11-50',
                    '51-200',
                    '201-500',
                    '501-1,000',
                    '1,001-5,000',
                    '5,001-10,000',
                    '10,001+'
                  ]"
                />
              </div>
            </div>
            <div>
              <div
                id="id_company_website"
                :class="{ validation_error: $v.post.company_website.$error }"
              >
                <label class="mb-10 d-block">Website URL</label>
                <a-input
                  placeholder="https://yourwebsite.com"
                  @blur="post.company_website = $event.target.value"
                  @blur.native="$v.post.company_website.$touch()"
                />
              </div>
            </div>
            <div class="section">
              <div>
                <label class="d-block"
                  >Gallery
                  <a-badge
                    count="PREMIUM FEATURE"
                    :number-style="{
                      backgroundColor: '#161d2e',
                      color: '#fcd669'
                    }"
                  />
                </label>
                <small>
                  Upload some pictures of your team, work space or anything
                  awesome
                </small>
                <FilePond
                  label="Drop images here"
                  :allow-multiple-files="true"
                  :max-file-size="500"
                  @files-updated="
                    (...args) => onFilesUpdated(...args, 'post_gallery')
                  "
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
                Your comapny HQ - If you'd prefer not to show it, drop the pin
                somewhere in the city it's located
              </small>
              <Map @location-updated="onLocationUpdated" />
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="role">
            <div class="section">
              <div
                id="id_position"
                :class="{ validation_error: $v.post.position.$error }"
              >
                <label class="d-block">
                  Position
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small>
                  e.g. 'Frontend React Developer' or 'Digital Marketer' or 'UX
                  Designer'
                </small>
                <a-input v-model="$v.post.position.$model"></a-input>
              </div>
              <div class="align-center pos-type">
                <a-checkbox
                  :checked="post.full_time"
                  @change="post.full_time = !post.full_time"
                /><span>Full-time</span>
                <a-checkbox
                  :checked="post.contract"
                  @change="post.contract = !post.contract"
                /><span>Contract</span>
              </div>
              <div
                id="id_position_about"
                :class="{
                  validation_error: $v.post_info.about_position.$error
                }"
              >
                <label class="d-block">
                  About the position
                  <a-badge
                    count="required"
                    :number-style="{ backgroundColor: '#f4976c' }"
                  />
                </label>
                <small
                  >A bit of information such as what they'll be working on, who
                  they'll be working with, hours etc.</small
                >
                <ckeditor
                  v-model="$v.post_info.about_position.$model"
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
                  id="id_responsibilities"
                  :key="`req_${index}`"
                  :class="{ validation_error: v.$error }"
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
                  v-if="post_info.responsibilities.length < 8"
                  class="btn-sm btn-outline-dark"
                  @click="addResponsibility"
                >
                  <a-icon type="plus" />Add
                </a-button>
              </div>
            </div>
            <div class="mtb-25">
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
                      <small>per year</small>
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
                      <h5>Salary Range</h5>
                      <small>per year</small>
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
                      :clearable="false"
                    >
                      <template
                        v-slot:selected-option="option"
                        v-bind="
                          typeof option === 'object'
                            ? option
                            : { [label]: option }
                        "
                      >
                        <span
                          :class="
                            `currency-flag currency-flag-${option.code.toLowerCase()} mr-15`
                          "
                        ></span>
                        {{ option.name }}
                      </template>
                      <template v-slot:option="option">
                        <span
                          :class="
                            `currency-flag currency-flag-${option.code.toLowerCase()} mr-15`
                          "
                        ></span>
                        {{ option.name }}
                      </template>
                    </v-select>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div v-show="post.salary.set">
                    <div
                      id="id_salary_max_1"
                      :class="{
                        validation_error: $v.post.salary.maximum.$error
                      }"
                    >
                      <input
                        v-model="$v.post.salary.maximum.$model"
                        v-currency="{
                          precision: 0
                        }"
                        class="ant-input"
                      />
                    </div>
                  </div>
                  <div v-show="!post.salary.set">
                    <a-input-group>
                      <a-row type="flex" align="middle">
                        <a-col :span="10">
                          <div
                            id="id_salary_min"
                            :class="{
                              validation_error: $v.post.salary.minimum.$error
                            }"
                          >
                            <input
                              v-model="$v.post.salary.minimum.$model"
                              v-currency="{
                                precision: 0
                              }"
                              class="ant-input"
                            />
                          </div>
                        </a-col>
                        <a-col span="4" class="align-center"><b>to</b></a-col>
                        <a-col :span="10">
                          <div
                            id="id_salary_max_2"
                            :class="{
                              validation_error: $v.post.salary.maximum.$error
                            }"
                          >
                            <input
                              v-model="$v.post.salary.maximum.$model"
                              v-currency="{
                                precision: 0
                              }"
                              class="ant-input"
                            />
                          </div>
                        </a-col>
                      </a-row>
                    </a-input-group>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="section">
              <label class="d-block">
                Perks/Benefits
              </label>
              <small>
                Any cool extras you provide? Things like 'a gym membership' or
                'life insurance'
              </small>
              <div class="requirements">
                <div
                  v-for="(v, index) in $v.post_info.benefits.$each.$iter"
                  :key="`benefit_${index}`"
                  :class="{ validation_error: v.$error }"
                >
                  <a-input v-model="v.benefit.$model">
                    <a-icon
                      v-if="index >= 1"
                      slot="suffix"
                      type="delete"
                      @click="removeBenefit(index)"
                    />
                  </a-input>
                </div>
                <a-button
                  v-if="post_info.benefits.length < 8"
                  class="btn-sm btn-outline-dark"
                  @click="addBenefit"
                >
                  <a-icon type="plus" />Add
                </a-button>
              </div>
            </div>
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
                  Select a few technologies that will be used and
                  <b>rank them (drag-and-drop)</b> from most important
                </small>
                <div
                  id="id_tech"
                  :class="{
                    validation_error: $v.post.tech.$error
                  }"
                >
                  <TechStack v-model="$v.post.tech.$model" />
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="requirements">
            <div class="section">
              <label class="mb-10 d-block">
                Experience Level(s) Required
                <span class="cursor-pointer">
                  <a-tooltip>
                    <template slot="title">
                      <p>
                        These titles differ from company to company - however,
                        we use the following traits to identify each:
                      </p>

                      <b>Entry-level</b>
                      <ul>
                        <li>Learning on the job</li>
                        <li>Basic knowledge - expect risks</li>
                        <li>Requires teaching and mentorship</li>
                      </ul>
                      <b>Intermediate</b>
                      <ul>
                        <li>Works independently on tasks</li>
                        <li>Proficient in one or more areas</li>
                        <li>Can be assigned more complex tasks</li>
                      </ul>
                      <b>Senior</b>
                      <ul>
                        <li>Works autonomously</li>
                        <li>Experts in their area</li>
                        <li>Mentors others</li>
                        <li>
                          Easily identifies issues / has solved them before
                        </li>
                      </ul>
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
                <a-badge
                  count="1+ required"
                  :number-style="{ backgroundColor: '#f4976c' }"
                />
              </label>
              <div
                id="id_experience"
                :class="{
                  validation_error: $v.post.experience.$error
                }"
              >
                <ExperienceSelect v-model="$v.post.experience.$model" />
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
              <small
                >e.g. 'Great self-discipline' or '2+ years Go experience'</small
              >
              <div class="requirements">
                <div
                  v-for="(v, index) in $v.post_info.requirements.$each.$iter"
                  id="id_requirements"
                  :key="`req_${index}`"
                  :class="{ validation_error: v.$error }"
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
                  v-if="post_info.requirements.length < 8"
                  class="btn-sm btn-outline-dark"
                  @click="addRequirement"
                >
                  <a-icon type="plus" />Add
                </a-button>
              </div>
            </div>
            <div class="section">
              <label class="d-block">Residing Restrictions</label>
              <small>
                If applicants should reside in close proximity, certain
                countries or timezones, select them here
              </small>
              <a-row type="flex" align="middle">
                <a-col :span="8">
                  <div
                    :class="[
                      {
                        'selection-block-active':
                          !post.residing_restrictions.by_country.restricted &&
                          !post.residing_restrictions.by_timezone.restricted
                      },
                      'selection-block'
                    ]"
                    @click="setResidingRestriction('none')"
                  >
                    <h5>No Restrictions</h5>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div
                    :class="[
                      {
                        'selection-block-active':
                          post.residing_restrictions.by_country.restricted
                      },
                      'selection-block'
                    ]"
                    @click="setResidingRestriction('country')"
                  >
                    <h5>Certain Countries</h5>
                  </div>
                </a-col>
                <a-col :span="8">
                  <div
                    :class="[
                      {
                        'selection-block-active':
                          post.residing_restrictions.by_timezone.restricted
                      },
                      'selection-block'
                    ]"
                    @click="setResidingRestriction('timezone')"
                  >
                    <h5>Certain Timezones</h5>
                  </div>
                </a-col>
              </a-row>
              <div
                v-show="post.residing_restrictions.by_country.restricted"
                id="id_restrict_country"
                :class="[
                  {
                    validation_error:
                      $v.post.residing_restrictions.by_country.countries.$error
                  },
                  'mt-15'
                ]"
              >
                <v-select
                  v-model="
                    $v.post.residing_restrictions.by_country.countries.$model
                  "
                  class="vs-multiple"
                  label="name"
                  placeholder="Select countries here"
                  multiple
                  :close-on-select="false"
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
              </div>
              <div
                v-show="post.residing_restrictions.by_timezone.restricted"
                id="id_restrict_timezone"
                :class="[
                  {
                    validation_error:
                      $v.post.residing_restrictions.by_timezone.timezones.$error
                  },
                  'mt-15'
                ]"
              >
                <v-select
                  v-model="
                    $v.post.residing_restrictions.by_timezone.timezones.$model
                  "
                  class="vs-multiple"
                  label="name"
                  placeholder="Select timezone(s) here"
                  multiple
                  :close-on-select="false"
                  :options="[
                    'UTC -11',
                    'UTC -10',
                    'UTC -9',
                    'UTC -8',
                    'UTC -7',
                    'UTC -6',
                    'UTC -5',
                    'UTC -4',
                    'UTC -3',
                    'UTC -2',
                    'UTC -1',
                    'UTC +0',
                    'UTC +1',
                    'UTC +2',
                    'UTC +3',
                    'UTC +4',
                    'UTC +5',
                    'UTC +6',
                    'UTC +7',
                    'UTC +8',
                    'UTC +9',
                    'UTC +10',
                    'UTC +11'
                  ]"
                ></v-select>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="application">
            <div class="section">
              <div
                id="id_application_url"
                :class="[
                  {
                    validation_error: $v.post_info.application_url.$error
                  },
                  'mt-15'
                ]"
              >
                <label class="d-block mb-10">Application URL</label>
                <a-input
                  @blur="post_info.application_url = $event.target.value"
                  @blur.native="$v.post_info.application_url.$touch()"
                />
              </div>
              <div class="align-center mtb-10">
                <label>AND / OR</label>
              </div>
              <div
                id="id_application_instr"
                :class="[
                  {
                    validation_error: $v.post_info.application_instr.$error
                  },
                  'mt-15'
                ]"
              >
                <label class="d-block">Instructions</label>
                <small
                  >Maybe you'd like applicants to send their resume to an email
                  address or you want to outline your interview process</small
                >
                <ckeditor
                  v-model="$v.post_info.application_instr.$model"
                  :editor="editor"
                  class="h-200"
                ></ckeditor>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="finalize">
            <div v-show="!displayCheckout && !displayUploader">
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
                <label class="d-block">Preview</label>
                <small
                  >Check out how your post will be displayed to the
                  community!</small
                >
                <div class="preview-container"></div>
              </div>
            </div>
            <div v-if="displayUploader">
              <MultipleFileUpload
                heading="Quickly preparing your gallery..."
                :files="post_gallery.files"
                :base-path="`Companies/Galleries/${post.company_name}`"
                @uploadComplete="onGalleryUploadComplete"
              />
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
          <a-button v-if="activeStep > 0 && !hideButtons" @click="previousStep">
            <a-icon type="left" />
            {{ displayCheckout ? 'Back' : 'Previous' }}
          </a-button>
          <a-button v-if="activeStep < 4" class="f-r" @click="nextStep">
            Next
            <a-icon type="right" />
          </a-button>
          <a-button
            v-show="activeStep == 4 && !displayCheckout && !displayUploader"
            id="proceed_to_payment"
            class="f-r"
            :loading="proceedingToPayment"
            @click="proceedingToPayment = true"
            >Proceed to payment</a-button
          >
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
import Checkout from '@/components/cardcheckout'
import MultipleFileUpload from '@/components/multifileupload'
import { required, requiredIf, minLength, url } from 'vuelidate/lib/validators'
// eslint-disable-next-line no-unused-vars
import { auth, db } from '@/plugins/firebase'
import firebase from 'firebase'
import { mapState } from 'vuex'

const currencyValidator = value =>
  parseInt(!value || !(typeof value == String) ? '1' : value.replace(',', '')) >
  0

export default {
  components: {
    ckeditor: CKEditor.component,
    Map,
    FilePond,
    TechStack,
    ExperienceSelect,
    Checkout,
    MultipleFileUpload
  },
  data() {
    return {
      editor: ClassicEditor,
      place: null,
      map: null,
      activeStep: 0,
      post_doc_id: null,
      postinfo_doc_id: null,
      post: {
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
        full_time: true,
        contract: false,
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
        size: '1-10',
        payment_details: {
          stripe_payment_intent_id: '',
          paid: false
        },
        residing_restrictions: {
          by_country: {
            restricted: false,
            countries: []
          },
          by_timezone: {
            restricted: false,
            timezones: []
          }
        }
      },
      post_info: {
        company_intro: '',
        about_position: '',
        benefits: [
          {
            benefit: ''
          }
        ],
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
        ],
        application_url: '',
        application_instr: ''
      },
      post_logo: {
        files: [],
        updated: false
      },
      post_gallery: {
        files: [],
        updated: false
      },
      displayCheckout: false,
      displayUploader: false,
      hideButtons: false,
      proceedingToPayment: false
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
      },
      salary: {
        maximum: {
          required,
          currencyValidator
        },
        minimum: {
          required: requiredIf(function() {
            return !this.post.salary.set
          }),
          currencyValidator
        }
      },
      tech: {
        required,
        minLength: minLength(2)
      },
      experience: {
        required,
        minLength: minLength(1)
      },
      residing_restrictions: {
        by_country: {
          countries: {
            required: requiredIf(function() {
              return this.post.residing_restrictions.by_country.restricted
            }),
            minLength: minLength(1)
          }
        },
        by_timezone: {
          timezones: {
            required: requiredIf(function() {
              return this.post.residing_restrictions.by_timezone.restricted
            }),
            minLength: minLength(1)
          }
        }
      }
    },
    post_info: {
      company_intro: {
        required
      },
      about_position: {
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
      benefits: {
        required,
        minLength: minLength(1),
        $each: {
          benefit: {
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
      },
      application_url: {
        required: requiredIf(function() {
          return !this.post_info.application_instr.length
        }),
        url
      },
      application_instr: {
        required: requiredIf(function() {
          return !this.post_info.application_url.length
        })
      }
    }
  },
  computed: {
    ...mapState({
      currencies: state => state.currencies.all,
      countries: state => state.countries.all
    }),
    activeStepToString() {
      return this.activeStep.toString()
    },
    fullTime() {
      return this.post.full_time
    },
    contract() {
      return this.post.contract
    }
  },
  watch: {
    fullTime(value) {
      if (!value && !this.contract) this.post.contract = true
    },
    contract(value) {
      if (!value && !this.fullTime) this.post.full_time = true
    }
  },
  mounted() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'proceed_to_payment',
      {
        size: 'invisible',
        // eslint-disable-next-line no-unused-vars
        callback: response => {
          if (
            this.post.type == 'professional' &&
            this.post_gallery.files.length
          ) {
            if (!this.post_gallery.updated) return (this.displayCheckout = true)
            return (this.displayUploader = true)
          }

          if (this.post_info.gallery) this.post_info.gallery = []

          this.displayCheckout = true
        }
      }
    )
    window.recaptchaVerifier.render()
  },
  methods: {
    nextStep() {
      this.$v.$touch()

      // let error_detected = false
      // switch (this.activeStep) {
      //   case 0:
      //     if (
      //       this.$v.post.company_name.$invalid ||
      //       this.$v.post_info.company_intro.$invalid ||
      //       this.$v.post.company_website.$invalid
      //     )
      //       error_detected = true
      //     break
      //   case 1:
      //     if (
      //       this.$v.post.position.$invalid ||
      //       this.$v.post_info.about_position.$invalid ||
      //       this.$v.post_info.responsibilities.$invalid ||
      //       this.$v.post.salary.maximum.$invalid ||
      //       this.$v.post.salary.minimum.$invalid ||
      //       this.$v.post_info.benefits.$invalid ||
      //       this.$v.post.tech.$invalid
      //     )
      //       error_detected = true
      //     break
      //   case 2:
      //     if (
      //       this.$v.post.experience.$invalid ||
      //       this.$v.post_info.requirements.$invalid ||
      //       this.$v.post.residing_restrictions.by_country.countries.$invalid ||
      //       this.$v.post.residing_restrictions.by_timezone.timezones.$invalid
      //     )
      //       error_detected = true
      //     break
      //   case 3:
      //     if (
      //       this.$v.post_info.application_url.$invalid ||
      //       this.$v.post_info.application_instr.$invalid
      //     )
      //       error_detected = true
      //     break
      // }

      // if (error_detected) {
      //   return this.$nextTick(() => {
      //     var element = document.getElementsByClassName('validation_error')[0]
      //     this.$scrollTo(`#${element.id}`)
      //   })
      // }

      this.$v.$reset()
      ++this.activeStep
      this.$scrollTo('#container')
    },
    previousStep() {
      if (this.displayCheckout) {
        this.displayCheckout = false
        this.proceedingToPayment = false
        window.recaptchaVerifier.reset()
      } else {
        --this.activeStep
        this.$scrollTo('#container')
      }
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
    addBenefit() {
      this.post_info.benefits.push({ benefit: '' })
    },
    removeBenefit(index) {
      this.post_info.benefits.splice(index, 1)
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
    setResidingRestriction(restr) {
      this.post.residing_restrictions.by_country.restricted = false
      this.post.residing_restrictions.by_timezone.restricted = false
      switch (restr) {
        case 'country':
          this.post.residing_restrictions.by_country.restricted = true
          break
        case 'timezone':
          this.post.residing_restrictions.by_timezone.restricted = true
          break
      }
    },
    onFilesUpdated(files, target) {
      this[target]['files'] = files
      this[target]['updated'] = true
    },
    async addPost() {
      this.$toast.info('Saving post...')

      if (this.post_logo.files.length) {
        this.post.company_logo = await this.$uploadFile(
          `Companies/Logos/${this.post.company_name}`,
          this.post_logo.files[0]
        )
        this.post_logo.updated = false
      }

      this.$addDocument('postdetails', this.post_info)
        .then(postinfoRef => {
          this.postinfo_doc_id = postinfoRef.id
          this.post.postdetails_ref = `postdetails/${postinfoRef.id}`

          this.$addDocument('posts', this.post).then(postRef => {
            this.post_doc_id = postRef.id
          })
        })
        .catch(error => {
          this.$toast.error(`Error: ${JSON.stringify(error)}`)
        })
    },
    async updatePost() {
      this.$toast.info('Updating post...')

      if (this.post_logo.updated) {
        this.post.company_logo = this.post_logo.files.length
          ? await this.$uploadFile('Companies/Logos', this.post_logo.files[0])
          : null
        this.post_logo.updated = false
      }

      this.$updateDocument(
        'postdetails',
        this.postinfo_doc_id,
        this.post_info,
        true
      )
        .then(() => {
          this.$updateDocument('posts', this.post_doc_id, this.post, true)
        })
        .catch(error => {
          this.$toast.error(`Error: ${JSON.stringify(error)}`)
        })
    },
    onGalleryUploadComplete(downloadURLs) {
      this.post_info.gallery = downloadURLs
      this.displayUploader = false
      this.displayCheckout = true
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
  border-radius: 15px;
  display: inline-block;
  margin: 0 25px;
  text-align: center;
  background-color: white;
  transition: all 0.2s;
}
.selection-block h5,
.selection-block small {
  margin: 0;
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
.salary-block input {
  text-align: right;
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
  border-radius: 15px;
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
.pos-type span {
  font-size: 14px;
  font-family: Graphik-Bold;
}
</style>

<style>
.navigation div:first-of-type {
  display: inline-block;
}
</style>
