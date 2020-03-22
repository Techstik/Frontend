export const state = () => ({
  canPaginate: false
})

export const mutations = {
  setPaginate(state, value) {
    state.canPaginate = value
  }
}
