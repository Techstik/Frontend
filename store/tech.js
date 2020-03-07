export const state = () => ({
  all: []
})

export const mutations = {
  set(state, { tech }) {
    state.all = tech
  }
}
