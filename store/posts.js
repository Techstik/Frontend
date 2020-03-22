export const state = () => ({
  all: [],
  all_loaded: false,
  user_selected: null
})

export const mutations = {
  set(state, post) {
    state.all.push(post)
  },
  setUserSelected(state, post_id) {
    state.user_selected = post_id
  },
  setAllLoaded(state, value) {
    state.all_loaded = value
  }
}
