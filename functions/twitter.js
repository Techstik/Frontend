const firebase_functions = require('firebase-functions')
const Twitter = require('twitter-lite')

const client = new Twitter({
  consumer_key: firebase_functions.config().twitter.consumer_key,
  consumer_secret: firebase_functions.config().twitter.consumer_secret,
  access_token_key: firebase_functions.config().twitter.access_token,
  access_token_secret: firebase_functions.config().twitter.access_token_secret
})

function tweet(status) {
  return new Promise((resolve, reject) => {
    client
      .post('statuses/update', {
        status: status
      })
      .then(() => resolve())
      .catch(error => reject(error))
  })
}

module.exports = {
  tweet
}
