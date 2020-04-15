export const state = () => ({
  all: [],
  exchangerates: [],
  specified: null
})

export const getters = {
  getSelectedExchangeRates: state => {
    return state.exchangerates.find(rates => {
      return rates.base == state.specified
    })
  },
  getExchangeRatesForCurrency: state => currencyCode => {
    return state.exchangerates.find(rates => {
      return rates.base == currencyCode
    })
  },
  getSelectedCurrency: state => {
    if (!state.specified) return null
    return state.all.find(currency => {
      return currency.code == state.specified
    })
  }
}

export const mutations = {
  set(state, { currencies }) {
    state.all = currencies
  },
  setRates(state, exchangerates) {
    state.exchangerates = exchangerates
  },
  setSpecified(state, currencyCode) {
    state.specified = currencyCode
    localStorage.setItem('pc__tscom', currencyCode)
  }
}
