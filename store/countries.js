export const state = () => ({
  all: []
})

export const mutations = {
  set(state, { countries }) {
    state.all = countries
  }
}
