import Vue from 'vue'

Vue.prototype.$setInLocalStorage = (name, value) => {
  if (typeof Storage === 'undefined') return

  localStorage.setItem(name, value)
}

Vue.prototype.$getFromLocalStorage = name => {
  if (typeof Storage === 'undefined') return null

  return localStorage.getItem(name)
}

Vue.prototype.$removeFromLocalStorage = name => {
  if (typeof Storage === 'undefined') return

  localStorage.removeItem(name)
}
