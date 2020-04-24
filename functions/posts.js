/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
const moment = require('moment')
let algolia = require('./algolia')
let pushNotifications = require('./pushNotifications')
let google = require('./google')
let sendGrid = require('./sendgrid')
let twitter = require('./twitter')
let flags = require('./scripts/country_flags.json')
let currency_symbols = require('./scripts/currency_symbols.json')

// exports.update_statistics = firebase_functions.https.onRequest(
//   async (request, response) => {
//     let last30days = moment()
//       .subtract(30, 'days')
//       .endOf('day')
//     let posts = []

//     await firebase_admin
//       .firestore()
//       .collection('posts')
//       .where(
//         'date_created',
//         '>=',
//         firebase_admin.firestore.Timestamp.fromDate(last30days.toDate())
//       )
//       .where('verified', '==', true)
//       .where('deleted', '==', false)
//       .get()
//       .then(querySnapshot => {
//         querySnapshot.forEach(doc => {
//           posts.push({
//             id: doc.id,
//             ...doc.data()
//           })
//         })
//       })
//       .catch(error => {
//         console.error(`Error getting posts: ${JSON.stringify(error)}`)
//         response.status(400).send(error)
//       })

//     console.log(`Number of posts: ${posts.length}`)

//     const stick_1_week =
//       4 -
//       posts.filter(post => {
//         return post.type.extras && post.type.extras.includes('stick_1_week')
//       }).length

//     const stick_duration =
//       4 -
//       posts.filter(post => {
//         return post.type.extras && post.type.extras.includes('stick_duration')
//       }).length

//     console.log(`Number of stick_1_week: ${stick_1_week}`)
//     console.log(`Number of stick_duration: ${stick_duration}`)

//     await firebase_admin
//       .firestore()
//       .collection('poststatistics')
//       .limit(1)
//       .get()
//       .then(querySnapshot => {
//         querySnapshot.forEach(doc => {
//           doc.ref
//             .update({
//               stick_1_week: stick_1_week,
//               stick_duration: stick_duration
//             })
//             .catch(error => {
//               console.error(
//                 `Error getting updating post statistics: ${JSON.stringify(
//                   error
//                 )}`
//               )
//               response.status(400).send(error)
//             })
//         })
//       })
//       .catch(error => {
//         console.error(
//           `Error getting fetching post statistics: ${JSON.stringify(error)}`
//         )
//         response.status(400).send(error)
//       })

//     response.status(200).send()
//   }
// )

exports.seed_algolia = firebase_functions.https.onRequest(
  async (request, response) => {
    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones.
    const algoliaRecords = []

    // Retrieve all documents from the COLLECTION collection.
    const querySnapshot = await firebase_admin
      .firestore()
      .collection('posts')
      .get()

    querySnapshot.docs.forEach(doc => {
      // Essentially, you want your records to contain any information that facilitates search,
      // display, filtering, or relevance. Otherwise, you can leave it out.
      algoliaRecords.push({
        objectID: doc.id,
        ...doc.data()
      })
    })

    await algolia.saveDocuments(algoliaRecords)

    response.status(200).send('Posts were indexed to Algolia successfully.')
  }
)

exports.on_created = firebase_functions.firestore
  .document('posts/{postId}')
  .onCreate((snap, context) => {
    const post = {
      id: snap.id,
      ...snap.data()
    }

    firebase_admin
      .firestore()
      .collection('postlogs')
      .add({
        date_created: firebase_admin.firestore.FieldValue.serverTimestamp(),
        ref: `posts/${post.id}`,
        title: post.type.name === 'Scraped' ? 'Scraped' : 'Created',
        severity: 'success'
      })
      .catch(error => {
        console.log(`Error adding post log: ${error}`)
      })

    if (post.payment_details.paid) {
      sendProcessingEmailNotification(post)

      if (post.type.extras && post.type.extras.length > 0) updateStatistics()

      return pushNotifications.send(
        `POST ADDED - ${post.position} @ ${post.company_name}`
      )
    }

    if (post.type.name !== 'Scraped')
      return pushNotifications.send(
        `New potential post added - ${post.position} @ ${post.company_name}`
      )

    return true
  })

exports.on_updated = firebase_functions.firestore
  .document('posts/{postId}')
  .onUpdate(async (change, context) => {
    const updatedPost = { id: change.after.id, ...change.after.data() }
    const originalPost = { id: change.before.id, ...change.before.data() }

    if (updatedPost.deleted && !originalPost.deleted) {
      await algolia.deleteDocument(updatedPost)

      if (firebase_functions.config().base.environment === 'production')
        google.index({
          delete: true,
          url: `https://techstik.com/jobs/${updatedPost.position
            .toLowerCase()
            .replace(
              / /g,
              '-'
            )}-at-${updatedPost.company_name.toLowerCase().replace(/ /g, '-')}`
        })
    } else {
      if (
        updatedPost.verified ||
        (!updatedPost.verified && originalPost.verified)
      )
        await algolia.saveDocument(updatedPost)

      if (
        updatedPost.verified &&
        firebase_functions.config().base.environment === 'production'
      )
        google.index({
          url: `https://techstik.com/jobs/${updatedPost.position
            .toLowerCase()
            .replace(
              / /g,
              '-'
            )}-at-${updatedPost.company_name.toLowerCase().replace(/ /g, '-')}`
        })

      if (
        !originalPost.payment_details.paid &&
        updatedPost.payment_details.paid
      ) {
        sendProcessingEmailNotification(updatedPost)
        pushNotifications.send(
          `${updatedPost.type.price === 0 ? 'POST ADDED' : 'PURCHASED'} - ${
            updatedPost.position
          } @ ${updatedPost.company_name}`
        )
      }

      if (
        updatedPost.verified &&
        !originalPost.verified &&
        updatedPost.type.name === 'Scraped'
      ) {
        const leadsSnapshot = await firebase_admin
          .firestore()
          .collection('leads')
          .where('post_ref', '==', `posts/${updatedPost.id}`)
          .get()

        if (leadsSnapshot.docs.length)
          leadsSnapshot.docs[0].ref.update({ setup: true })

        if (updatedPost.email) sendScrapedEmailNotification(updatedPost)
      }
    }

    if (!originalPost.verified && updatedPost.verified && !updatedPost.tweeted)
      tweetPost(updatedPost, change.after.ref)

    if (updatedPost.type.extras && updatedPost.type.extras.length)
      updateStatistics()
  })

async function sendProcessingEmailNotification(post) {
  const staffMember = await firebase_admin
    .firestore()
    .collection('staff')
    .doc(post.assignee.split('/')[1])
    .get()

  sendGrid
    .sendEmail({
      subject: 'We Have Received Your Post',
      to: [
        {
          name: post.company_name,
          email: post.email
        }
      ],
      merge_content: {
        company_name: post.company_name,
        position: post.position,
        staff_member_name: staffMember.data().name,
        staff_member_email: staffMember.data().email
      },
      cc: [
        {
          name: `${staffMember.data().name} | Techstik`,
          email: staffMember.data().email
        }
      ],
      template_id: 'd-168c32bad73a4b2384ab913b7db2cf2f'
    })
    .then(() => {
      firebase_admin
        .firestore()
        .collection('postlogs')
        .add({
          date_created: firebase_admin.firestore.FieldValue.serverTimestamp(),
          ref: `posts/${post.id}`,
          title: 'Processing Email Notification Sent',
          severity: 'success'
        })
        .catch(error => {
          console.log(`Error adding post log: ${error}`)
        })

      return true
    })
    .catch(error =>
      console.error(`Issue sending processing email notification: ${error}`)
    )
}

function sendScrapedEmailNotification(post) {
  sendGrid
    .sendEmail({
      subject: `Your Search for a ${post.position}`,
      to: [
        {
          name: post.company_name,
          email: post.email
        }
      ],
      merge_content: {
        company_name: post.company_name,
        position: post.position,
        staff_member_name: 'Matt',
        staff_member_email: 'matt@techstik.com',
        link_to_post: `https://techstik.com/jobs/${post.position
          .toLowerCase()
          .replace(/ /g, '-')}-at-${post.company_name
          .toLowerCase()
          .replace(/ /g, '-')}`
      },
      cc: [
        {
          name: 'Matt | Techstik',
          email: 'matt@techstik.com'
        }
      ],
      template_id: 'd-e5048e02895e4875bbac08c8727cedfc'
    })
    .then(() => {
      firebase_admin
        .firestore()
        .collection('postlogs')
        .add({
          date_created: firebase_admin.firestore.FieldValue.serverTimestamp(),
          ref: `posts/${post.id}`,
          title: 'Scrape Email Notification Sent',
          severity: 'success'
        })
        .catch(error => {
          console.log(`Error adding post log: ${error}`)
        })

      return true
    })
    .catch(error =>
      console.error(`Issue sending scrape email notification: ${error}`)
    )
}

function updateStatistics() {
  //eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let last30days = moment()
      .subtract(30, 'days')
      .endOf('day')
    let posts = []

    await firebase_admin
      .firestore()
      .collection('posts')
      .where(
        'date_created',
        '>=',
        firebase_admin.firestore.Timestamp.fromDate(last30days.toDate())
      )
      .where('verified', '==', true)
      .where('deleted', '==', false)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          posts.push({
            id: doc.id,
            ...doc.data()
          })
        })
      })
      .catch(error => {
        console.error(`Error getting posts: ${JSON.stringify(error)}`)
        reject(error)
      })

    console.log(`Number of posts: ${posts.length}`)

    const stick_1_week =
      4 -
      posts.filter(post => {
        return post.type.extras && post.type.extras.includes('stick_1_week')
      }).length

    const stick_duration =
      4 -
      posts.filter(post => {
        return post.type.extras && post.type.extras.includes('stick_duration')
      }).length

    console.log(`Number of stick_1_week: ${stick_1_week}`)
    console.log(`Number of stick_duration: ${stick_duration}`)

    await firebase_admin
      .firestore()
      .collection('poststatistics')
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref
            .update({
              stick_1_week: stick_1_week,
              stick_duration: stick_duration
            })
            .catch(error => {
              console.error(
                `Error getting updating post statistics: ${JSON.stringify(
                  error
                )}`
              )
              reject(error)
            })
        })
      })
      .catch(error => {
        console.error(
          `Error getting fetching post statistics: ${JSON.stringify(error)}`
        )
        reject(error)
      })
  })
}

function tweetPost(post, postRef) {
  let expString = post.experience
    .sort()
    .map(exp => {
      if (exp === 'entry-level') return 'Junior'
      return exp.charAt(0).toUpperCase() + exp.substring(1)
    })
    .join('/')

  let tag = post.remote ? '(remote)' : flags[post.location.country_code].emoji

  twitter
    .tweet(
      `${expString} ${post.position} at ${post.company_name} ${tag}. Offering ${
        currency_symbols[post.salary.currency.code].symbol
      }${
        post.salary.set
          ? `${post.salary.maximum / 1000}k`
          : `${post.salary.minimum / 1000}k - ${post.salary.maximum / 1000}k`
      }. Details here 👇 https://techstik.com/jobs/${post.position
        .toLowerCase()
        .replace(/ /g, '-')}-at-${post.company_name
        .toLowerCase()
        .replace(/ /g, '-')}`
    )
    .then(() => {
      return postRef.update({ tweeted: true })
    })
    .catch(error =>
      console.log(`Error sending tweet: ${JSON.stringify(error)}`)
    )
}
