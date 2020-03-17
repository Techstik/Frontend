import Vue from 'vue'
import { storage } from '@/plugins/firebase'

Vue.prototype.$uploadFile = (basepath, file) => {
  return new Promise((resolve, reject) => {
    if (!basepath || !file) return resolve(null)
    storage
      .ref(`/${basepath}/${file.name}`)
      .put(file)
      .then(snapshot => {
        snapshot.ref
          .getDownloadURL()
          .then(url => {
            resolve(url)
          })
          .catch(error => {
            reject(error)
          }) //TODO: log on bugsnag
      })
      .catch(error => {
        reject(error)
      }) //TODO: log on bugsnag
  })
}
