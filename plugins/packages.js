import Vue from 'vue'

import Antd from 'ant-design-vue/lib'
Vue.use(Antd)

import 'devicon/devicon.css'
import 'devicon/devicon-colors.css'

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

import VueLodash from 'vue-lodash'
Vue.use(VueLodash, { name: 'lodash' })

import VueMoment from 'vue-moment'
Vue.use(VueMoment)

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
