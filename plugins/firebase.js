import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAOakhq1wIVzaNER4pF6uBV-MJ_zuBOpDo',
  authDomain: 'softserved-28b00.firebaseapp.com',
  databaseURL: 'https://softserved-28b00.firebaseio.com',
  projectId: 'softserved-28b00',
  storageBucket: 'softserved-28b00.appspot.com',
  messagingSenderId: '611344945626',
  appId: '1:611344945626:web:1f7fcb1408b24cc394f0e3',
  measurementId: 'G-W8XWFVGT7S'
}

let app = null

app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig)

app
  .firestore()
  .enablePersistence({ synchronizeTabs: true })
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      //TODO: bugsnag log here
      console.log('Firebase Persistance Failed: FAILED PRECONDITION - ' + err)
    } else if (err.code == 'unimplemented') {
      //TODO: bugsnag log here
      console.log('Firebase Persistance Failed: UNIMPLEMENTED - ' + err)
    }
  })

export const db = app.firestore()
export const storage = app.storage()
export const functions = app.functions()
export const auth = app.auth()
