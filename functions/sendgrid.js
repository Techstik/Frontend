const firebase_functions = require('firebase-functions')
const client = require('@sendgrid/client')

//setup
client.setApiKey(firebase_functions.config().sendgrid.api_key)
client.setDefaultRequest('baseUrl', 'https://api.sendgrid.com/')

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

  const requestBody = {
    subject: data.subject,
    from: {
      email: 'sam.smith@example.com',
      name: 'Sam Smith'
    },
    reply_to: {
      email: 'sam.smith@example.com',
      name: 'Sam Smith'
    },
    template_id: data.template_id,
    personalizations: [
      {
        subject: data.subject, //string
        to: data.to, //array of objects {name, email}
        dynamic_template_data: data.merge_content //object with all merge fields
      }
    ]
  }

  const request = {
    method: 'POST',
    url: '/v3/mail/send',
    body: requestBody
  }

  return client.request(request).then(([response, body]) => {
    return {
      status: response.statusCode,
      content: body
    }
  })
})
