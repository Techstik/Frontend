export const state = () => ({
  canPaginate: false,
  isSearching: false
})

export const mutations = {
  setPaginate(state, value) {
    state.canPaginate = value
  },
  setSearching(state, value) {
    state.isSearching = value
  }
}
