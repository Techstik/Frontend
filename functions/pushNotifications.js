const firebase_functions = require('firebase-functions')
const axios = require('axios')
const querystring = require('querystring')

function send(message) {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const requestBody = {
      app_key: firebase_functions.config().pushed.app_key,
      app_secret: firebase_functions.config().pushed.app_secret,
      target_type: 'app',
      content: message
    }

    return axios
      .post(
        'https://api.pushed.co/1/push',
        querystring.stringify(requestBody),
        config
      )
      .then(() => {
        return resolve()
      })
      .catch(error => {
        console.error(
          `Error sending request to Pushed API: ${JSON.stringify(error)}`
        )
        reject(error)
      })
  })
}

module.exports = {
  send
}
