// import { db } from '@/plugins/firebase'
import currencies from '@/assets/scripts/currencies.json'
import countries from '@/assets/scripts/countries.json'
import tech from '@/assets/scripts/tech.json'

export default ({ store }) => {
  store.commit('currencies/set', { currencies })

  store.commit('tech/set', { tech })

  store.commit('countries/set', { countries })
}
