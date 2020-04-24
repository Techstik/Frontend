const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
const moment = require('moment')
const firestore = require('@google-cloud/firestore')
const client = new firestore.v1.FirestoreAdminClient()

exports.scheduled_firestore_export = firebase_functions.pubsub
  .schedule('every 24 hours')
  .onRun(() => {
    return cleanDatabase().then(() => {
      return backupDatabase()
    })
  })

function backupDatabase() {
  if (firebase_functions.config().base.environment !== 'production') return true

  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
  const databaseName = client.databasePath(projectId, '(default)')

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: `gs://${
        firebase_functions.config().base.storage_bucket
      }/Backups/Firestore/${moment().format('MMMM Do YYYY, HH:mm:ss')}`,

      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: []
    })
    .then(responses => {
      const response = responses[0]
      console.log(`Successful completion - Operation Name: ${response['name']}`)
      return true
    })
    .catch(error => {
      console.error(error)
      throw new Error('Export operation failed')
    })
}

function cleanDatabase() {
  //eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let last3days = moment()
      .subtract(3, 'days')
      .startOf('day')

    let postDetailsRefs = []

    await firebase_admin
      .firestore()
      .collection('posts')
      .where(
        'date_created',
        '<=',
        firebase_admin.firestore.Timestamp.fromDate(last3days.toDate())
      )
      .where('verified', '==', false)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async doc => {
          postDetailsRefs.push(doc.data().postdetails_ref.split('/')[1])
          await doc.ref.delete()
        })
        return
      })
      .catch(error => {
        console.error(`Error getting posts: ${JSON.stringify(error)}`)
        reject(error)
      })

    postDetailsRefs.forEach(async ref => {
      await firebase_admin
        .firestore()
        .collection('postsdetails')
        .doc(ref)
        .delete()
    })

    firebase_admin
      .firestore()
      .collection('leads')
      .where(
        'date_created',
        '<=',
        firebase_admin.firestore.Timestamp.fromDate(last3days.toDate())
      )
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async doc => {
          await doc.ref.delete()
        })
        return resolve()
      })
      .catch(error => {
        console.error(`Error getting leads: ${JSON.stringify(error)}`)
        reject(error)
      })
  })
}
