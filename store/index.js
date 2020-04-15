export const state = () => ({
  windowWidth: 0
})

export const getters = {
  isMobile: state => {
    return state.windowWidth < 750
  }
}

export const mutations = {
  setWindowWidth(state, width) {
    state.windowWidth = width
  }
}

export const strict = false
