export const state = () => ({
  selected: null
})

export const mutations = {
  setSelected(state, { post }) {
    state.selected = post
  }
}
