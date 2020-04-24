/* eslint-disable no-async-promise-executor */
import Vue from 'vue'
import { analytics, db, auth, storage } from '@/plugins/firebase'
import { firestore } from 'firebase/app'

//analytics
Vue.prototype.$logAnalytic = (eventName, data) => {
  if (data) analytics.logEvent(eventName, data)
  else analytics.logEvent(eventName)
}

//firestore

Vue.prototype.$addDocument = (
  collection,
  data, // eslint-disable-next-line no-unused-vars
  anonymous = false
) => {
  return new Promise(async (resolve, reject) => {
    if (anonymous && !auth.currentUser) {
      await auth.signInAnonymously()
    }

    db.collection(collection)
      .add({
        date_created: firestore.FieldValue.serverTimestamp(),
        last_edited: firestore.FieldValue.serverTimestamp(),
        deleted: false,
        ...data
      })
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)

        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst adding a document to firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            data: data
          }
        })
      })
  })
}

Vue.prototype.$setDocument = (collection, docId, data, merge = false) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .doc(docId)
      .set(
        {
          last_edited: firestore.FieldValue.serverTimestamp(),
          ...data
        },
        { merge: merge }
      )
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)

        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst setting a document in firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            documentId: docId,
            data: data,
            merge: merge
          }
        })
      })
  })
}

Vue.prototype.$updateDocument = async (
  collection,
  docId,
  data,
  // eslint-disable-next-line no-unused-vars
  anonymous = false
) => {
  return new Promise(async (resolve, reject) => {
    if (anonymous && !auth.currentUser) {
      await auth.signInAnonymously()
    }

    db.collection(collection)
      .doc(docId)
      .update({
        last_edited: firestore.FieldValue.serverTimestamp(),
        ...data
      })
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)

        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst updating a document in firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            documentId: docId,
            data: data
          }
        })
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
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst reading data from firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            options: options
          }
        })
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
          this.$bugsnag.notify(new Error('Document does not exist.'), {
            severity: 'info',
            metaData: {
              explanation: 'Error whilst reading document from firestore.',
              destination: 'plugins/injections/firestore.js',
              collection: collection,
              documentId: docId
            }
          })
        }
      })
      .catch(error => {
        reject(error)
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst reading document from firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            documentId: docId
          }
        })
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
          this.$bugsnag.notify(new Error('Document does not exist.'), {
            severity: 'info',
            metaData: {
              explanation:
                'Error whilst reading document via its reference from firestore.',
              destination: 'plugins/injections/firestore.js',
              reference: reference
            }
          })
        }
      })
      .catch(error => {
        reject(error)
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation:
              'Error whilst reading document via its reference from firestore.',
            destination: 'plugins/injections/firestore.js',
            reference: reference
          }
        })
      })
  })
}

// eslint-disable-next-line no-unused-vars
Vue.prototype.$createLog = (collection, docRef, data, anonymous = false) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (anonymous && !auth.currentUser) {
      await auth.signInAnonymously()
    }
    db.collection(collection)
      .add({
        date_created: firestore.FieldValue.serverTimestamp(),
        ref: docRef,
        ...data
      })
      .then(docRef => {
        resolve(docRef)
      })
      .catch(error => {
        reject(error)
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error whilst adding a log to firestore.',
            destination: 'plugins/injections/firestore.js',
            collection: collection,
            id: docRef,
            data: data
          }
        })
      })
  })
}

//storage
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
