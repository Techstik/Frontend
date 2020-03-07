import { db } from '@/plugins/firebase'

export default ({ store }) => {
  db.collection('currencies')
    .orderBy('name')
    .get()
    .then(querySnapshot => {
      var currencies = []
      querySnapshot.forEach(doc => {
        currencies.push({ ...doc.data(), id: doc.id })
      })
      store.commit('currencies/set', {
        currencies
      })
    })
    .catch(error => {
      //TODO: wrtie to bugsnag
      console.log(error)
    })

  db.collection('tech')
    .orderBy('name')
    .get()
    .then(querySnapshot => {
      var tech = []
      querySnapshot.forEach(doc => {
        tech.push({ ...doc.data(), id: doc.id })
      })
      store.commit('tech/set', {
        tech
      })
    })
    .catch(error => {
      //TODO: wrtie to bugsnag
      console.log(error)
    })
}
