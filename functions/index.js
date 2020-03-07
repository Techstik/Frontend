const functions = require('firebase-functions')
const axios = require('axios')

exports.verify_reCAPTCHA = functions.https.onCall(async (data, context) => {
  console.info(`Received data ${JSON.stringify(data)}`)

  if (!(typeof data.token === 'string') || data.token.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with one arguments "token".'
    )
  }

  console.info(`Posting to Google...`)

  axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LcuONkUAAAAAK2Rej6Gr7AvR9B2ZjUYMPQC9N8r&response=${data.token}`
    )
    .then(response => {
      console.info(`Received verification response ${JSON.stringify(response)}`)
      return response
    })
    .catch(error => {
      console.info(`Received error response ${error}`)
      return error
    })
})
