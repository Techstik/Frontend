export const state = () => ({
  all: []
})

export const mutations = {
  set(state, { currencies }) {
    state.all = currencies
  }
}
