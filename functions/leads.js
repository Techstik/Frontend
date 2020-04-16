const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
let pushNotifications = require('./pushNotifications')

exports.on_created = firebase_functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snap, context) => {
    const lead = snap.data()

    if (lead.scraped)
      return pushNotifications.send(`Lead Scraped - ${lead.position}`)

    return true
  })

exports.on_updated = firebase_functions.firestore
  .document('leads/{leadId}')
  .onUpdate(async (change, context) => {
    const updatedLead = { id: change.after.id, ...change.after.data() }
    const originalLead = { id: change.before.id, ...change.before.data() }

    if (updatedLead.approved && !originalLead.approved)
      return pushNotifications.send(
        `Lead Approved - ${updatedLead.position} @ ${updatedLead.company_name}`
      )

    return true
  })
