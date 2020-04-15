import { auth, db } from '@/plugins/firebase'
import currencies from '@/assets/scripts/currencies.json'
import countries from '@/assets/scripts/countries.json'
import tech from '@/assets/scripts/tech.json'

export default ({ store }) => {
  store.commit('currencies/set', { currencies })

  store.commit('tech/set', { tech })

  store.commit('countries/set', { countries })

  db.collection('currencyrates')
    .get()
    .then(querySnapshot => {
      store.commit(
        'currencies/setRates',
        querySnapshot.docs.map(doc => {
          return {
            ...doc.data()
          }
        })
      )
    })

  db.collection('posttypes')
    .orderBy('name', 'desc')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        store.commit('posttypes/set', {
          id: doc.id,
          ...doc.data()
        })
      })
    })

  db.collection('poststatistics').onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      store.commit('poststatistics/set', {
        id: doc.id,
        ...doc.data()
      })
    })
  })

  db.collection('staff')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        store.commit('staff/set', {
          id: doc.id,
          ...doc.data()
        })
      })
    })

  auth.onAuthStateChanged(user => {
    if (user) {
      store.commit('users/setCurrent', user)
    }
  })

  store.commit('setWindowWidth', window.innerWidth)
}
