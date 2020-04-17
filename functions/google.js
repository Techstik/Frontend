const axios = require('axios')
var { google } = require('googleapis')
const firebase_functions = require('firebase-functions')
var request = require('request')
var key = require('./scripts/service_account.json')
//NOTE: Google keys are stored in live env config only

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
)

function index(_request) {
  return new Promise((resolve, reject) => {
    console.info(
      `Received request to index with data ${JSON.stringify(_request)}...`
    )

    jwtClient.authorize((err, tokens) => {
      if (err) {
        console.error(`Error at JWT Authorize: ${err}`)
        return reject(err)
      }

      let options = {
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        method: 'POST',
        // Your options, which must include the Content-Type and auth headers
        headers: {
          'Content-Type': 'application/json'
        },
        auth: { bearer: tokens.access_token },
        // Define contents here. The structure of the content is described in the next step.
        json: {
          url: _request.url,
          type: _request.delete ? 'URL_DELETED' : 'URL_UPDATED'
        }
      }

      return request(options, (error, response, body) => {
        resolve(body)
        console.log(body)
      })

      // return requestInstance
      //   .post('/v3/urlNotifications:publish', {
      //     url: _request.url,
      //     type: _request.delete ? 'URL_DELETED' : 'URL_UPDATED'
      //   })
      //   .then(() => {
      //     console.log(body)
      //     return resolve()
      //   })
      //   .catch(error => {
      //     console.error(
      //       `Error sending request to google indexer: ${JSON.stringify(error)}`
      //     )
      //     return reject(error)
      //   })
    })
  })
}

module.exports = {
  index
}

// exports.request_index = firebase_functions.https.onRequest(
//   async (request, response) => {
//     console.info(
//       `Received request with data ${JSON.stringify(request.body)}...`
//     )

//     jwtClient.authorize((err, tokens) => {
//       if (err) {
//         console.error(err)
//         return response.sendStatus(400)
//       }

//       const requestInstance = axios.create({
//         baseURL: 'https://indexing.googleapis.com/',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${tokens.access_token}`
//         }
//       })

//       return requestInstance
//         .post(
//           '/v3/urlNotifications:publish',
//           {
//             url: request.body.url,
//             type: request.body.delete ? 'URL_DELETED' : 'URL_UPDATED'
//           },
//           config
//         )
//         .then(() => {
//           console.log(body)
//           return response.sendStatus(200)
//         })
//         .catch(error => {
//           console.error(
//             `Error sending request to google indexer: ${JSON.stringify(error)}`
//           )
//           return response.sendStatus(400)
//         })
//     })
//   }
// )
