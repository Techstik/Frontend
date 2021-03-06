export const state = () => ({
  all: [],
  all_loaded: false,
  selected: null,
  newestSubscription: null
})

export const mutations = {
  set(state, post) {
    state.all.push(post)
  },
  setSelected(state, post_id) {
    state.selected = post_id
  },
  setAllLoaded(state, value) {
    state.all_loaded = value
  },
  setNewestSubscription(state, value) {
    state.newestSubscription = value
  }
}
