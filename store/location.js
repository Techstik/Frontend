export const state = () => ({
  askedPermission: false,
  permissionGranted: false
})

export const mutations = {
  setAsked(state, { value }) {
    state.askedPermission = value
  },
  setGranted(state, { value }) {
    state.permissionGranted = value
  }
}
