/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
const moment = require('moment')
const allListedTech = require('./scripts/tech.json')
let Parser = require('rss-parser')

exports.scrape = firebase_functions.pubsub
  .schedule('every 1 hours')
  .onRun(async () => {
    let leadStats

    if (firebase_functions.config().base.environment !== 'production') return

    await firebase_admin
      .firestore()
      .collection('leadstatistics')
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          leadStats = {
            ...doc.data()
          }
        })
        return
      })
      .catch(error => {
        return console.error(
          `Error getting leadstatistics: ${JSON.stringify(error)}`
        )
      })

    await stackoverflow(leadStats)
    await indeed_UK(leadStats)
    await landing_jobs(leadStats)
  })

async function stackoverflow(leadStats) {
  let parser = new Parser({
    customFields: {
      item: ['location', ['a10:author', 'author'], ['a10:name', 'name']]
    }
  })
  let feed = await parser.parseURL('https://stackoverflow.com/jobs/feed')

  let freshSyncList = []
  let statUpdateRequired = false

  feed.items.forEach(item => {
    let publishDate = moment(item.pubDate)
    if (
      publishDate.startOf('day') <
      moment()
        .subtract(1, 'days')
        .startOf('day')
    )
      return

    freshSyncList.push(item.guid)

    if (leadStats.stackoverflow_scraped_guids.includes(item.guid)) return
    if (['india', 'japan'].some(val => item.title.toLowerCase().includes(val)))
      return

    let lead = {
      scraped: true,
      URL: item.link,
      approved: true,
      company_name: '',
      email: item.guid,
      position: item.title,
      date_created: firebase_admin.firestore.Timestamp.fromDate(new Date()),
      deleted: false
    }

    let post = {
      type: {
        name: 'Scraped',
        price: 0
      },
      date_created: firebase_admin.firestore.Timestamp.fromDate(
        moment(item.pubDate).toDate()
      ),
      verified: false,
      deleted: false,
      position: item.title.split(' at ')[0],
      company_logo: '',
      company_name: item.author['a10:name'][0],
      company_website: '',
      experience: [],
      full_time: true,
      contract: false,
      location_based: item.location ? true : false,
      remote: item.location ? false : true,
      tech: !item.categories
        ? []
        : item.categories.map(tech => {
            let match = allListedTech.find(_tech => {
              return _tech.name.toLowerCase() === tech.toLowerCase()
            })
            return match
              ? {
                  name: match.name
                }
              : {
                  name: tech,
                  custom: true
                }
          }),
      salary: {
        set: true,
        minimum: 1000,
        maximum: 1000,
        currency: {
          name: 'United States Dollar',
          code: 'USD'
        }
      },
      size: '1-10',
      payment_details: {
        paid: false
      },
      residing_restrictions: {
        by_country: {
          restricted: false,
          countries: []
        },
        by_timezone: {
          restricted: false,
          timezones: []
        }
      }
    }

    if (item.location)
      post.location = {
        city: item.location.split(',')[0],
        country: item.location.split(',')[1]
      }

    if (['senior', 'lead'].some(val => item.title.toLowerCase().includes(val)))
      post.experience.push('senior')

    if (
      ['intermediate', 'mid-level'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('intermediate')

    if (
      ['junior', 'entry-level', 'graduate', 'beginner'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('entry-level')

    let post_info = {
      company_intro: '',
      about_position: item.content,
      benefits: [
        {
          benefit: ''
        }
      ],
      requirements: [
        {
          requirement: ''
        },
        {
          requirement: ''
        }
      ],
      responsibilities: [
        {
          responsibility: ''
        },
        {
          responsibility: ''
        },
        {
          responsibility: ''
        }
      ],
      application_url: item.link,
      application_instr: '',
      application_email: ''
    }

    firebase_admin
      .firestore()
      .collection('postdetails')
      .add(post_info)
      .then(post_details_doc => {
        post.postdetails_ref = `postdetails/${post_details_doc.id}`

        return firebase_admin
          .firestore()
          .collection('posts')
          .add(post)
          .then(post_doc => {
            lead.post_ref = `posts/${post_doc.id}`

            return firebase_admin
              .firestore()
              .collection('leads')
              .add(lead)
              .catch(error => console.log(`Error adding lead: ${error}`))
          })
          .catch(error => console.log(`Error adding post: ${error}`))
      })
      .catch(error => console.log(`Error adding postdetails: ${error}`))
  })

  if (statUpdateRequired)
    firebase_admin
      .firestore()
      .collection('leadstatistics')
      .doc('3PZW2KyTYobELMpg9SSq')
      .update({
        stackoverflow_scraped_guids: freshSyncList
      })
}

async function indeed_UK(leadStats) {
  let parser = new Parser({
    customFields: {
      item: ['source', 'description', ['georss:point', 'coords']]
    }
  })

  let feed = await parser.parseURL(
    'https://www.indeed.co.uk/rss?q=UX&sort=date'
  )

  let freshSyncList = []
  let statUpdateRequired = false

  feed.items.forEach(item => {
    let publishDate = moment(item.pubDate)
    if (
      publishDate.startOf('day') <
      moment()
        .subtract(1, 'days')
        .startOf('day')
    )
      return

    freshSyncList.push(item.guid)

    if (leadStats.indeed_UK_scraped_guids.includes(item.guid)) return

    //Add filters here
    if (
      !['ux', 'test', 'product', 'design'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      return

    statUpdateRequired = true

    let lead = {
      scraped: true,
      URL: item.link,
      approved: true,
      company_name: item.source,
      email: item.guid,
      position: item.title,
      date_created: firebase_admin.firestore.Timestamp.fromDate(new Date()),
      deleted: false
    }

    let post = {
      type: {
        name: 'Scraped',
        price: 0
      },
      date_created: firebase_admin.firestore.Timestamp.fromDate(
        moment(item.pubDate).toDate()
      ),
      verified: false,
      deleted: false,
      position: item.title.split(' - ')[0],
      company_logo: '',
      company_name: item.source,
      company_website: '',
      experience: [],
      full_time: true,
      contract: false,
      remote:
        item.title.toLowerCase().includes('remote') ||
        item.description.includes('remote'),
      location: {
        city: '',
        country: 'United Kingdom',
        country_code: 'GB',
        coords: {
          lat: item.coords.split(' ')[0],
          lng: item.coords.split(' ')[1]
        }
      },
      tech: [],
      salary: {
        set: true,
        minimum: 1000,
        maximum: 1000,
        currency: {
          name: 'British Pound',
          code: 'GBP'
        }
      },
      size: '1-10',
      payment_details: {
        paid: false
      },
      residing_restrictions: {
        by_country: {
          restricted: false,
          countries: []
        },
        by_timezone: {
          restricted: false,
          timezones: []
        }
      }
    }

    post.location_based = !post.remote

    if (['senior', 'lead'].some(val => item.title.toLowerCase().includes(val)))
      post.experience.push('senior')

    if (
      ['intermediate', 'mid-level'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('intermediate')

    if (
      ['junior', 'entry-level', 'graduate', 'beginner'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('entry-level')

    let post_info = {
      company_intro: '',
      about_position: item.description,
      benefits: [
        {
          benefit: ''
        }
      ],
      requirements: [
        {
          requirement: ''
        },
        {
          requirement: ''
        }
      ],
      responsibilities: [
        {
          responsibility: ''
        },
        {
          responsibility: ''
        },
        {
          responsibility: ''
        }
      ],
      application_url: item.link,
      application_instr: '',
      application_email: ''
    }

    firebase_admin
      .firestore()
      .collection('postdetails')
      .add(post_info)
      .then(post_details_doc => {
        post.postdetails_ref = `postdetails/${post_details_doc.id}`

        return firebase_admin
          .firestore()
          .collection('posts')
          .add(post)
          .then(post_doc => {
            lead.post_ref = `posts/${post_doc.id}`

            return firebase_admin
              .firestore()
              .collection('leads')
              .add(lead)
              .catch(error => console.log(`Error adding lead: ${error}`))
          })
          .catch(error => console.log(`Error adding post: ${error}`))
      })
      .catch(error => console.log(`Error adding postdetails: ${error}`))
  })

  if (statUpdateRequired)
    firebase_admin
      .firestore()
      .collection('leadstatistics')
      .doc('3PZW2KyTYobELMpg9SSq')
      .update({
        indeed_UK_scraped_guids: freshSyncList
      })
}

async function landing_jobs(leadStats) {
  let parser = new Parser({
    customFields: {
      item: ['published', 'content', 'id', ['entry', 'item']]
    }
  })

  let feed = await parser.parseURL('https://landing.jobs/feed')

  let freshSyncList = []
  let statUpdateRequired = false

  feed.items.forEach(item => {
    let publishDate = moment(item.published)
    if (
      publishDate.startOf('day') <
      moment()
        .subtract(1, 'days')
        .startOf('day')
    )
      return

    freshSyncList.push(item.id)

    if (leadStats.landing_jobs_scraped_guids.includes(item.id)) return

    statUpdateRequired = true

    let lead = {
      scraped: true,
      URL: item.id,
      approved: true,
      company_name: '',
      email: '',
      position: item.title,
      date_created: firebase_admin.firestore.Timestamp.fromDate(new Date()),
      deleted: false
    }

    let post = {
      type: {
        name: 'Scraped',
        price: 0
      },
      date_created: firebase_admin.firestore.Timestamp.fromDate(
        moment(item.published).toDate()
      ),
      verified: false,
      deleted: false,
      position: item.title,
      company_logo: '',
      company_name: '',
      company_website: '',
      experience: [],
      full_time: true,
      contract: false,
      remote:
        item.title.toLowerCase().includes('remote') ||
        item.content.toLowerCase().includes('remote'),
      location: {
        city: '',
        country: 'United Kingdom',
        country_code: 'GB'
      },
      tech: [],
      salary: {
        set: true,
        minimum: 1000,
        maximum: 1000,
        currency: {
          name: 'British Pound',
          code: 'GBP'
        }
      },
      size: '1-10',
      payment_details: {
        paid: false
      },
      residing_restrictions: {
        by_country: {
          restricted: false,
          countries: []
        },
        by_timezone: {
          restricted: false,
          timezones: []
        }
      }
    }

    post.location_based = !post.remote

    if (['senior', 'lead'].some(val => item.title.toLowerCase().includes(val)))
      post.experience.push('senior')

    if (
      ['intermediate', 'mid-level'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('intermediate')

    if (
      ['junior', 'entry-level', 'graduate', 'beginner'].some(val =>
        item.title.toLowerCase().includes(val)
      )
    )
      post.experience.push('entry-level')

    let post_info = {
      company_intro: '',
      about_position: item.content,
      benefits: [
        {
          benefit: ''
        }
      ],
      requirements: [
        {
          requirement: ''
        },
        {
          requirement: ''
        }
      ],
      responsibilities: [
        {
          responsibility: ''
        },
        {
          responsibility: ''
        },
        {
          responsibility: ''
        }
      ],
      application_url: item.id,
      application_instr: '',
      application_email: ''
    }

    firebase_admin
      .firestore()
      .collection('postdetails')
      .add(post_info)
      .then(post_details_doc => {
        post.postdetails_ref = `postdetails/${post_details_doc.id}`

        return firebase_admin
          .firestore()
          .collection('posts')
          .add(post)
          .then(post_doc => {
            lead.post_ref = `posts/${post_doc.id}`

            return firebase_admin
              .firestore()
              .collection('leads')
              .add(lead)
              .catch(error => console.log(`Error adding lead: ${error}`))
          })
          .catch(error => console.log(`Error adding post: ${error}`))
      })
      .catch(error => console.log(`Error adding postdetails: ${error}`))
  })

  if (statUpdateRequired)
    firebase_admin
      .firestore()
      .collection('leadstatistics')
      .doc('3PZW2KyTYobELMpg9SSq')
      .update({
        landing_jobs_scraped_guids: freshSyncList
      })
}
