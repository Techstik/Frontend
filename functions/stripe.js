/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
const stripe = require('stripe')(firebase_functions.config().stripe.secret_key)

exports.create_payment_intent = firebase_functions.https.onCall(
  (data, context) => {
    console.info(
      `Received payment intent request with data: ${JSON.stringify(data)}`
    )

    if (
      !(typeof data.amount === 'number') ||
      !(typeof data.currency === 'string')
    ) {
      throw new firebase_functions.https.HttpsError(
        'invalid-argument',
        'The function has not been called with the required parameters.'
      )
    }

    return stripe.paymentIntents
      .create(
        data.description
          ? {
              amount: data.amount,
              currency: data.currency,
              description: data.description
            }
          : {
              amount: data.amount,
              currency: data.currency
            }
      )
      .then(response => {
        console.info(`Successfull`)
        return {
          success: true,
          data: {
            paymentIntentId: response.id,
            clientSecret: response.client_secret,
            publishableKey: firebase_functions.config().stripe.publishable_key //TODO: Remember to switch to your live secret key in production!
          }
        }
      })
      .catch(error => {
        console.error(
          `Error whilst creating a payment intent: ${JSON.stringify(error)}`
        )
        return {
          success: false,
          data: {
            ...error
          }
        }
      })
  }
)

exports.update_payment_intent = firebase_functions.https.onCall(
  (data, context) => {
    console.info(
      `Received request to update payment intent with data: ${JSON.stringify(
        data
      )}`
    )

    if (!(typeof data.id === 'string') || data.data === undefined) {
      throw new firebase_functions.https.HttpsError(
        'invalid-argument',
        'The function has not been called with the required parameters.'
      )
    }

    return stripe.paymentIntents
      .update(data.id, {
        ...data.data
      })
      .then(paymentIntent => {
        console.info(`Successfull`)
        return {
          success: true
        }
      })
      .catch(error => {
        console.error(
          `Error whilst updating a payment intent: ${JSON.stringify(error)}`
        )
        return {
          success: false,
          data: {
            ...error
          }
        }
      })
  }
)

exports.get_payment_intent = firebase_functions.https.onCall(
  (data, context) => {
    console.info(
      `Received request to retrieve payment intent with data: ${JSON.stringify(
        data
      )}`
    )

    if (!(typeof data.id === 'string')) {
      throw new firebase_functions.https.HttpsError(
        'invalid-argument',
        'The function has not been called with the required parameters.'
      )
    }

    return stripe.paymentIntents
      .retrieve(data.id)
      .then(paymentIntent => {
        console.info(`Successful`)
        return {
          success: true,
          data: {
            ...paymentIntent
          }
        }
      })
      .catch(error => {
        console.error(
          `Error whilst retrieving payment intent: ${JSON.stringify(error)}`
        )
        return {
          success: false,
          data: {
            ...error
          }
        }
      })
  }
)

exports.create_customer = firebase_functions.https.onCall((data, context) => {
  console.info(
    `Received request to create a customer with data: ${JSON.stringify(data)}`
  )

  if (!(typeof data.email === 'string')) {
    throw new firebase_functions.https.HttpsError(
      'invalid-argument',
      'The function has not been called with the required parameters.'
    )
  }

  return stripe.customers
    .create(data)
    .then(customer => {
      console.info(`Successfull`)
      return {
        success: true,
        data: {
          ...customer
        }
      }
    })
    .catch(error => {
      console.error(
        `The following error was received whilst creating a customer: ${JSON.stringify(
          error
        )}`
      )
      return {
        success: false,
        data: {
          ...error
        }
      }
    })
})

exports.update_customer = firebase_functions.https.onCall((data, context) => {
  console.info(
    `Received request to update a customer with data: ${JSON.stringify(data)}`
  )

  if (!data.id || !(typeof data.id === 'string')) {
    throw new firebase_functions.https.HttpsError(
      'invalid-argument',
      'The function has not been called with the required parameters.'
    )
  }

  return stripe.customers
    .update(data.id, data.data)
    .then(customer => {
      console.info(`Successfull`)
      return {
        success: true,
        data: {
          ...customer
        }
      }
    })
    .catch(error => {
      console.error(
        `The following error was received whilst updating a customer: ${JSON.stringify(
          error
        )}`
      )
      return {
        success: false,
        data: {
          ...error
        }
      }
    })
})

exports.list_customers = firebase_functions.https.onCall((data, context) => {
  console.info(
    `Received request to list customers with data: ${JSON.stringify(data)}`
  )

  let paramter_error = false

  if (data) {
    if (data.email) {
      if (!(typeof data.email === 'string')) paramter_error = true
    }

    if (data.limit) {
      if (!(typeof data.limit === 'number')) paramter_error = true
    }

    if (paramter_error)
      throw new firebase_functions.https.HttpsError(
        'invalid-argument',
        'The function has been called with incorrect parameters.'
      )
  }

  return stripe.customers
    .list({ ...data })
    .then(customers => {
      console.info(`Successfull`)
      return {
        success: true,
        data: {
          ...customers
        }
      }
    })
    .catch(error => {
      console.error(
        `The following error was received whilst listing customers: ${JSON.stringify(
          error
        )}`
      )
      return {
        success: false,
        data: {
          ...error
        }
      }
    })
})

exports.payment_hook = firebase_functions.https.onRequest(
  async (request, response) => {
    console.info(
      `Received request with data ${JSON.stringify(request.body)}...`
    )

    let event

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        request.headers['stripe-signature'],
        firebase_functions.config().stripe.signing_secret_key
      )

      const paymentIntent = event.data.object

      let customer = await stripe.customers.retrieve(paymentIntent.customer)

      await firebase_admin
        .firestore()
        .collection('posts')
        .where('stripe_payment_intent_id', '==', paymentIntent.id)
        .get()
        // eslint-disable-next-line promise/always-return
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            switch (event.type) {
              case 'payment_intent.succeeded':
              case 'charge.succeeded':
                doc.ref
                  .update({
                    'payment_details.paid': true,
                    email: customer.email
                  })
                  .catch(error => {
                    console.error(
                      `Error getting updating post: ${JSON.stringify(error)}`
                    )
                  })
                break
              case 'payment_intent.payment_failed':
                doc.ref
                  .update({
                    'payment_details.paid': false,
                    email: customer.email,
                    'payment_details.failure_reasons': firebase_admin.firestore.FieldValue.arrayUnion(
                      paymentIntent.last_payment_error
                        ? paymentIntent.last_payment_error.message
                        : 'Failed'
                    ),
                    'payment_details.last_failure': firebase_admin.firestore.FieldValue.serverTimestamp()
                  })
                  .catch(error => {
                    console.error(
                      `Error getting updating post: ${JSON.stringify(error)}`
                    )
                  })
                break
              case 'payment_intent.canceled':
                doc.ref
                  .update({
                    'payment_details.paid': false,
                    email: customer.email,
                    'payment_details.failure_reasons': firebase_admin.firestore.FieldValue.arrayUnion(
                      'Canceled'
                    ),
                    'payment_details.last_failure': firebase_admin.firestore.FieldValue.serverTimestamp()
                  })
                  .catch(error => {
                    console.error(
                      `Error getting updating post: ${JSON.stringify(error)}`
                    )
                  })
                break
            }
          })
        })
        .catch(error => {
          console.error(
            `Error fetching/updating the post: ${JSON.stringify(error)}`
          )
        })
    } catch (error) {
      console.error(
        `Error processing webhook request: ${JSON.stringify(error)}`
      )
    }

    return response.sendStatus(200)
  }
)
