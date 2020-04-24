import Vue from 'vue'

import Input from 'ant-design-vue/lib/input'
// import 'ant-design-vue/lib/input/style/index.css'
import Row from 'ant-design-vue/lib/row'
import Col from 'ant-design-vue/lib/col'
import Button from 'ant-design-vue/lib/button'
// import 'ant-design-vue/lib/button/style/index.css'
import Checkbox from 'ant-design-vue/lib/checkbox'
// import 'ant-design-vue/lib/checkbox/style/index.css'
import Progress from 'ant-design-vue/lib/progress'
// import 'ant-design-vue/lib/progress/style/index.css'
import DatePicker from 'ant-design-vue/lib/date-picker'
// import 'ant-design-vue/lib/date-picker/style/index.css'
import Spin from 'ant-design-vue/lib/spin'
// import 'ant-design-vue/lib/spin/style/index.css'
import Icon from 'ant-design-vue/lib/icon'
// import 'ant-design-vue/lib/icon/style/index.css'
import Collapse from 'ant-design-vue/lib/collapse'
// import 'ant-design-vue/lib/collapse/style/index.css'
import Tabs from 'ant-design-vue/lib/tabs'
// import 'ant-design-vue/lib/tabs/style/index.css'
import Tooltip from 'ant-design-vue/lib/tooltip'
// import 'ant-design-vue/lib/tooltip/style/index.css'
import Badge from 'ant-design-vue/lib/badge'
// import 'ant-design-vue/lib/badge/style/index.css'
import Steps from 'ant-design-vue/lib/steps'
// import 'ant-design-vue/lib/steps/style/index.css'

Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Progress)
Vue.use(DatePicker)
Vue.use(Spin)
Vue.use(Icon)
Vue.use(Collapse)
Vue.use(Tabs)
Vue.use(Tooltip)
Vue.use(Badge)
Vue.use(Steps)

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
