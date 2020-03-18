export const state = () => ({
  user_selected: null
})

export const mutations = {
  setUserSelected(state, post_id) {
    state.user_selected = post_id
  }
}
