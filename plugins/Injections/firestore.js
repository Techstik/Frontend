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

Vue.prototype.$readData = (collection, options) => {
  return new Promise((resolve, reject) => {
    var query = db.collection(collection)

    if (options.where)
      query = query.where(
        options.where.field,
        options.where.operation,
        options.where.value
      )

    if (options.order)
      query = query.orderBy(options.order.field, options.order.operation)

    if (options.limit) query = query.limit(options.limit)

    query
      .get()
      .then(querySnapshot => {
        var list = []

        querySnapshot.forEach(doc => {
          list.push({
            id: doc.id,
            ...doc.data()
          })
        })

        resolve(list)
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}

Vue.prototype.$readDocument = (collection, docId) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .doc(docId)
      .get()
      .then(doc => {
        if (doc.exists) {
          resolve({
            id: doc.id,
            ...doc.data()
          })
        } else {
          reject()
          //TODO: log with bugsnag
        }
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}

Vue.prototype.$readReference = reference => {
  return new Promise((resolve, reject) => {
    db.doc(reference)
      .get()
      .then(doc => {
        if (doc.exists) {
          resolve({
            id: doc.id,
            ...doc.data()
          })
        } else {
          reject()
          //TODO: log with bugsnag
        }
      })
      .catch(error => {
        reject(error)
        //TODO: log with bugsnag
      })
  })
}
