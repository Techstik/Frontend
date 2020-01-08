import firebase from 'firebase'

let app = null

const firebaseConfig = {
  apiKey: 'AIzaSyCYWaLYWK0aFoW-q5fmpV_c43l1mIF4iy4',
  authDomain: 'listing-site-78e6f.firebaseapp.com',
  databaseURL: 'https://listing-site-78e6f.firebaseio.com',
  projectId: 'listing-site-78e6f',
  storageBucket: 'listing-site-78e6f.appspot.com',
  messagingSenderId: '285346589326',
  appId: '1:285346589326:web:3aed48b952b6f0393237df',
  measurementId: 'G-8LZ9C769M2'
}

app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig)

export const db = app.firestore()
