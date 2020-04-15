const firebase_functions = require('firebase-functions')
const moment = require('moment')
const firestore = require('@google-cloud/firestore')
const client = new firestore.v1.FirestoreAdminClient()

exports.scheduled_firestore_export = firebase_functions.pubsub
  .schedule('every 24 hours')
  .onRun(() => {
    if (firebase_functions.config().base.environment !== 'production')
      return true

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
        console.log(
          `Successful completion - Operation Name: ${response['name']}`
        )
        return true
      })
      .catch(error => {
        console.error(error)
        throw new Error('Export operation failed')
      })
  })
