import Vue from 'vue'
import numeral from 'numeral'

Vue.filter('moneyFormat', val => numeral(val).format('0,0'))
Vue.filter('moneyClosestTenFormat', val =>
  numeral(Math.round(val / 10) * 10).format('0,0')
)
