import Vue from 'vue'
import { analytics } from '@/plugins/firebase'

Vue.prototype.$logAnalytic = (eventName, data) => {
  if (data) analytics.logEvent(eventName, data)
  else analytics.logEvent(eventName)
}
