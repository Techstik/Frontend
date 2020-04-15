const firebase_functions = require('firebase-functions')
const algoliasearch = require('algoliasearch')

const algoliaClient = algoliasearch(
  firebase_functions.config().algolia.appid,
  firebase_functions.config().algolia.apikey
)

const collectionIndexName =
  firebase_functions.config().base.project_id === 'techstik-production'
    ? 'posts_prod'
    : 'posts_dev'
const collectionIndex = algoliaClient.initIndex(collectionIndexName)

async function saveDocument(post) {
  await collectionIndex.saveObject({
    objectID: post.id,
    ...post
  })
}

async function saveDocuments(posts) {
  await collectionIndex.saveObjects(posts)
}

async function deleteDocument(post) {
  await collectionIndex.deleteObject(post.id)
}

module.exports = {
  saveDocument,
  deleteDocument,
  saveDocuments
}
