export const state = () => ({
  canPaginate: false,
  isSearching: false,
  scrollingMap: false,
  visitedHomePage: false
})

export const mutations = {
  setPaginate(state, value) {
    state.canPaginate = value
  },
  setSearching(state, value) {
    state.isSearching = value
  },
  setScrollingMap(state, value) {
    state.scrollingMap = value
  },
  setVisitedHomePage(state, value) {
    state.visitedHomePage = value
  }
}
