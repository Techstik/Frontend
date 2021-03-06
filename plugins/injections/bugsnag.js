import Vue from 'vue'
import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'

const bugsnagClient = bugsnag(process.env.BUGSNAG_KEY)
bugsnagClient.use(bugsnagVue, Vue)

// eslint-disable-next-line no-unused-vars
export default ({ app }, inject) => {
  inject('bugsnag', bugsnagClient)
}
