const axios = require('axios')
var { google } = require('googleapis')
const firebase_functions = require('firebase-functions')
//NOTE: Google keys are stored in live env config only

const jwtClient =
  firebase_functions.config().base.environment === 'production'
    ? new google.auth.JWT(
        firebase_functions.config().google.client_email,
        null,
        firebase_functions.config().google.private_key,
        ['https://www.googleapis.com/auth/indexing'],
        null
      )
    : null

exports.request_index = firebase_functions.https.onRequest(
  async (request, response) => {
    console.info(
      `Received request with data ${JSON.stringify(request.body)}...`
    )

    jwtClient.authorize((err, tokens) => {
      if (err) {
        console.error(err)
        return response.sendStatus(400)
      }

      const requestInstance = axios.create({
        baseURL: 'https://indexing.googleapis.com/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.access_token}`
        }
      })

      return requestInstance
        .post(
          '/v3/urlNotifications:publish',
          {
            url: request.body.url,
            type: request.body.delete ? 'URL_DELETED' : 'URL_UPDATED'
          },
          config
        )
        .then(() => {
          console.log(body)
          return response.sendStatus(200)
        })
        .catch(error => {
          console.error(
            `Error sending request to google indexer: ${JSON.stringify(error)}`
          )
          return response.sendStatus(400)
        })
    })
  }
)
