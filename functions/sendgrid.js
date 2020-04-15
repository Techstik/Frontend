const firebase_functions = require('firebase-functions')
const client = require('@sendgrid/client')

client.setApiKey(firebase_functions.config().sendgrid.api_key)
client.setDefaultRequest('baseUrl', 'https://api.sendgrid.com/')

async function sendEmail(params) {
  return new Promise((resolve, reject) => {
    console.info(
      `Received send email request with data: ${JSON.stringify(params)}`
    )

    const requestBody = {
      subject: params.subject,
      from: {
        email: 'team@techstik.com',
        name: 'Team | Techstik'
      },
      reply_to: {
        email: 'team@techstik.com',
        name: 'Team | Techstik'
      },
      template_id: params.template_id,
      personalizations: [
        {
          to: params.to, //array of objects {name, email}
          dynamic_template_data: params.merge_content //object with all merge fields
        }
      ]
    }

    if (params.cc) requestBody.personalizations[0].cc = params.cc
    if (params.bcc) requestBody.personalizations[0].bcc = params.bcc

    const sendgrid_request = {
      method: 'POST',
      url: '/v3/mail/send',
      body: requestBody
    }

    return client
      .request(sendgrid_request)
      .then(([_response, body]) => {
        return resolve({
          status: _response.statusCode,
          content: body
        })
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = {
  sendEmail
}
