import Vue from 'vue'
import { fullpackage, db } from '@/plugins/firebase'

Vue.prototype.$addDocument = (collection, data) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .add({
        date_created: fullpackage.firestore.FieldValue.serverTimestamp(),
        last_edited: fullpackage.firestore.FieldValue.serverTimestamp(),
        deleted: false,
        ...data
      })
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}

Vue.prototype.$setDocument = (collection, docId, data, merge = false) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .doc(docId)
      .set(
        {
          last_edited: fullpackage.firestore.FieldValue.serverTimestamp(),
          ...data
        },
        { merge: merge }
      )
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}

Vue.prototype.$updateDocument = (collection, docId, data) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .doc(docId)
      .update({
        last_edited: fullpackage.firestore.FieldValue.serverTimestamp(),
        ...data
      })
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}
