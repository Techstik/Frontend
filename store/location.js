export const state = () => ({
  requestedPermission: false,
  permissionGranted: false
})

export const mutations = {
  setRequested(state, value) {
    state.requestedPermission = value
  },
  setGranted(state, value) {
    state.permissionGranted = value
  }
}
