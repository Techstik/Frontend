import Vue from 'vue'

const eventBus = {}

eventBus.install = function(Vue) {
  Vue.prototype.$eventbus = new Vue()
}

Vue.use(eventBus)
