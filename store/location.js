export const state = () => ({
  requestAnswered: false
})

export const mutations = {
  setAnswered(state, value) {
    state.requestAnswered = value
  }
}
