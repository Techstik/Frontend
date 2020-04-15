export const state = () => ({
  all: null
})

export const mutations = {
  set(state, stats) {
    state.all = stats
  }
}
