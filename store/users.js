export const state = () => ({
  current: null,
  operatingAsAdmin: false
})

export const mutations = {
  setCurrent(state, user) {
    state.current = user
  },
  setOperatingAsAdmin(state, value) {
    state.operatingAsAdmin = value
  }
}
