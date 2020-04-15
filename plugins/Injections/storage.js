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
            this.$bugsnag.notify(error, {
              severity: 'info',
              metaData: {
                explanation: 'Error whilst getting the download URL.',
                destination: 'plugins/injections/storage.js',
                snapshotRef: snapshot.ref
              }
            })
          })
      })
      .catch(error => {
        reject(error)
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst uploading a file to firebase storage.',
            destination: 'plugins/injections/storage.js',
            basepath: basepath
          }
        })
      })
  })
}
