export const state = () => ({
  requestedPermission: false,
  requestAnswered: false,
  permissionGranted: undefined
})

export const mutations = {
  setRequested(state, value) {
    state.requestedPermission = value
  },
  setAnswered(state, value) {
    state.requestAnswered = value
  },
  setGranted(state, value) {
    state.permissionGranted = value
  }
}
