const firebase_functions = require('firebase-functions')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(firebase_functions.config().sendgrid.api_key)

exports.send_email = firebase_functions.https.onCall((data, context) => {
  //   console.info(
  //     `Received payment intent request with data: ${JSON.stringify(data)}`
  //   )

  //   if (
  //     !(typeof data.amount === 'number') ||
  //     !(typeof data.currency === 'string')
  //   ) {
  //     throw new firebase_functions.https.HttpsError(
  //       'invalid-argument',
  //       'The function has not been called with the required parameters.'
  //     )
  //   }

  const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  }
  sgMail.send(msg)
})
