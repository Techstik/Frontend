export const state = () => ({
  all: []
})

export const getters = {
  getRandom: state => {
    return state.all[Math.floor(Math.random() * state.all.length)]
  }
}

export const mutations = {
  set(state, member) {
    state.all.push(member)
  }
}
