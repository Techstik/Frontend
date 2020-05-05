const firebase_admin = require('firebase-admin')

firebase_admin.initializeApp({
  credential: firebase_admin.credential.applicationDefault()
})

exports.stripe = require('./stripe')
exports.posts = require('./posts')
exports.backups = require('./backups')
exports.currencyrates = require('./currencyrates')
exports.email = require('./email')
exports.leads = require('./leads')
exports.jobscrapers = require('./jobscraper')
exports.support = require('./support')
