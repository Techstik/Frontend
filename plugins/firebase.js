import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import 'firebase/auth'
import 'firebase/analytics'

const firebaseConfig = process.env.DEVELOPMENT
  ? {
      apiKey: 'AIzaSyAOakhq1wIVzaNER4pF6uBV-MJ_zuBOpDo',
      authDomain: 'softserved-28b00.firebaseapp.com',
      databaseURL: 'https://softserved-28b00.firebaseio.com',
      projectId: 'softserved-28b00',
      storageBucket: 'softserved-28b00.appspot.com',
      messagingSenderId: '611344945626',
      appId: '1:611344945626:web:1f7fcb1408b24cc394f0e3',
      measurementId: 'G-W8XWFVGT7S'
    }
  : {
      apiKey: 'AIzaSyBJ4pXc0O6YQzcNq9cEA-JI7i8CzfB-dT8',
      authDomain: 'techstik-production.firebaseapp.com',
      databaseURL: 'https://techstik-production.firebaseio.com',
      projectId: 'techstik-production',
      storageBucket: 'techstik-production.appspot.com',
      messagingSenderId: '47750782482',
      appId: '1:47750782482:web:50ed5616a3290a294542cb',
      measurementId: 'G-ZKFCVKY45V'
    }

let app = null

app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig)

app
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .catch(function(error) {
    this.$bugsnag.notify(error, {
      severity: 'info',
      metaData: {
        explanation:
          'Error setting auth session persistance in firebase initialization module.',
        destination: 'plugins/firebase.js'
      }
    })
  })

export const db = app.firestore()
export const storage = app.storage()
export const functions = app.functions()
export const auth = app.auth()
export const analytics = app.analytics()
