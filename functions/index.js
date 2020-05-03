const firebase_admin = require('firebase-admin')
var storage_service_account = require('./scripts/storage_service_account.json')

firebase_admin.initializeApp({
  // credential: firebase_admin.credential.applicationDefault()
  credential: firebase_admin.credential.cert(storage_service_account)
})

exports.stripe = require('./stripe')
exports.posts = require('./posts')
exports.backups = require('./backups')
exports.currencyrates = require('./currencyrates')
exports.email = require('./email')
exports.leads = require('./leads')
exports.jobscrapers = require('./jobscraper')
exports.support = require('./support')
