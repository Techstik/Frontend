import Vue from 'vue'

Vue.prototype.$requestLocationPermission = function() {
  this.$store.commit('location/setRequested', true)

  this.$toast.info('May we use your current location?', {
    duration: null,
    className: 'pulse',
    action: [
      {
        text: 'Sure',
        onClick: (e, toastObject) => {
          this.$store.commit('location/setAnswered', true)
          this.$store.commit('location/setGranted', true)
          toastObject.goAway(0)
        }
      },
      {
        text: 'Nope',
        onClick: (e, toastObject) => {
          this.$store.commit('location/setAnswered', true)
          this.$store.commit('location/setGranted', false)
          toastObject.goAway(0)
        }
      }
    ]
  })
}
