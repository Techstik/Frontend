const firebase_functions = require('firebase-functions')
const cors = require('cors')({ origin: true })
let sendGrid = require('./sendgrid')

exports.send = firebase_functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    if (request.method !== 'POST')
      return response.status(403).send('Forbidden!')

    return sendGrid
      .sendEmail(request.body)
      .then(response => {
        return response.send(response)
      })
      .catch(error => {
        console.error(error)
        return response.end()
      })
  })
})
