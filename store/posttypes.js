export const state = () => ({
  all: []
})

export const getters = {
  getByName: state => name => {
    return state.all.find(type => {
      return type.name == name
    })
  }
}

export const mutations = {
  set(state, type) {
    state.all.push(type)
  }
}
