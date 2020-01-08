export const state = () => ({
  all: []
})

export const mutations = {
  set(state, { listings }) {
    state.all = listings
  }
}
