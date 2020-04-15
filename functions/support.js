const firebase_functions = require('firebase-functions')
let pushNotifications = require('./pushNotifications')

exports.on_created = firebase_functions.firestore
  .document('supportqueries/{queryId}')
  .onCreate((snap, context) => {
    const supportQuery = {
      id: snap.id,
      ...snap.data()
    }

    return pushNotifications.send(`SUPPORT QUERY - ${supportQuery.subject}`)
  })
