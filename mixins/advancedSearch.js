import { firestore } from 'firebase/app'
import algoliasearch from 'algoliasearch'
var algolia_client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_KEY
)
var algolia_post_index = algolia_client.initIndex(
  `posts_${process.env.DEVELOPMENT ? 'dev' : 'prod'}`
)

export default {
  methods: {
    async performSearch(searchWord, filters, page, pageSize) {
      return new Promise(resolve => {
        let results = []

        let similarQuery = []
        let al_facet_filters = ['verified:true', 'deleted:false']
        let al_filters = []
        let searchableAttributes = []

        //add all of our filters to the applicable sections
        if (this.filters && this.filters.length) {
          this.filters.forEach(filter => {
            switch (filter.name) {
              case 'experience':
                if (filter.values.length == 1)
                  al_filters.push(`experience:${filter.values[0]}`)
                else {
                  var exp_mapped = this.lodash.map(filter.values, exp => {
                    return `experience:${exp}`
                  })
                  al_filters.push(`(${this.lodash.join(exp_mapped, ' OR ')})`)
                }
                break
              case 'tech stack':
                var technames = filter.values.map(value => {
                  return this.lodash
                    .remove(value.name.split(' '), word => {
                      return word != 'js'
                    })
                    .join(' ')
                })
                similarQuery.push(this.lodash.join(technames, ' '))
                break
              case 'contract':
                al_facet_filters.push('contract:true')
                break
              case 'full-time':
                al_facet_filters.push('full_time:true')
                break
              case 'city':
                similarQuery.push(filter.values.toLowerCase().trim())
                break
              case 'country':
                if (filter.values.length == 1)
                  al_filters.push(`location.country:'${filter.values[0].name}'`)
                else {
                  var coun_mapped = this.lodash.map(filter.values, country => {
                    return `location.country:'${country.name}'`
                  })
                  al_filters.push(`(${this.lodash.join(coun_mapped, ' OR ')})`)
                }
                break
              case 'salary currency':
                if (filter.values.length == 1)
                  al_filters.push(
                    `salary.currency.code:${filter.values[0].code}`
                  )
                else {
                  var cur_mapped = this.lodash.map(filter.values, currency => {
                    return `salary.currency.code:${currency.code}`
                  })
                  al_filters.push(`(${this.lodash.join(cur_mapped, ' OR ')})`)
                }
                break
              case 'salary amount (p.a.)':
                al_filters.push(
                  `salary.maximum ${
                    filter.condition == 'more than' ? '>' : '<'
                  } ${filter.values.toString().replace(/,/g, '')}`
                )
                break
              case 'company size':
                if (filter.values.length == 1)
                  al_filters.push(`size:'${filter.values[0]}'`)
                else {
                  var size_mapped = this.lodash.map(filter.values, size => {
                    return `size:'${size}'`
                  })
                  al_filters.push(`(${this.lodash.join(size_mapped, ' OR ')})`)
                }
                break
              case 'date posted':
                if (filter.condition == 'before')
                  al_filters.push(
                    `date_created._seconds < ${filter.values
                      .startOf('day')
                      .toDate()
                      .getTime() / 1000}`
                  )
                else if (filter.condition == 'after')
                  al_filters.push(
                    `date_created._seconds > ${filter.values
                      .endOf('day')
                      .toDate()
                      .getTime() / 1000}`
                  )
                else
                  al_filters.push(
                    `(date_created._seconds >= ${filter.values
                      .startOf('day')
                      .toDate()
                      .getTime() /
                      1000} AND  date_created._seconds <= ${filter.values
                      .endOf('day')
                      .toDate()
                      .getTime() / 1000})`
                  )
                break
            }
          })
        }

        //add only the filled fields in the search
        let searchOptions = {
          page: page,
          hitsPerPage: pageSize
        }

        if (similarQuery.length)
          searchOptions.similarQuery = this.lodash.join(similarQuery, ' ') //this is a combination of all the search terms/words
        if (searchableAttributes.length)
          searchOptions.searchableAttributes = searchableAttributes //these are the fields to look at
        if (al_facet_filters.length)
          searchOptions.facetFilters = al_facet_filters //any exact values (currency, contract, salary) go here
        if (al_filters.length)
          searchOptions.filters = this.lodash.join(al_filters, ' ') //any exact values (currency, contract, salary) go here

        console.log(searchOptions.similarQuery)

        algolia_post_index
          .search(searchWord ? searchWord : '', searchOptions)
          .then(response => {
            response.hits.forEach(post => {
              post.date_created = new firestore.Timestamp(
                post.date_created._seconds,
                post.date_created._nanoseconds
              )
              post.id = post.objectID
              results.push(
                this.lodash.omit(post, ['objectID', '_highlightResult'])
              )
            })
            resolve(results)
          })
          .catch(error => {
            this.$bugsnag.notify(error, {
              severity: 'error',
              metaData: {
                explanation: 'Error searching algolia.',
                destination: 'mixins/advancedSearch.js',
                saerchWord: searchWord,
                filters: JSON.stringify(filters),
                page: page,
                pageSize: pageSize
              }
            })
            resolve(results)
          })
      })
    },
    async stickyPosts() {
      return new Promise(resolve => {
        let results = []

        const weekAgo = this.$moment()
          .subtract(7, 'days')
          .startOf('day')
          .toDate()

        const monthAgo = this.$moment()
          .subtract(30, 'days')
          .startOf('day')
          .toDate()

        algolia_post_index
          .search('', {
            filters:
              "type.extras:'stick_1_week' OR type.extras:'stick_duration'",
            facetFilters: ['verified:true', 'deleted:false']
          })
          .then(response => {
            response.hits.forEach(post => {
              post.date_created = new firestore.Timestamp(
                post.date_created._seconds,
                post.date_created._nanoseconds
              )

              if (
                post.type.extras.includes('stick_1_week') &&
                post.date_created.toDate() < weekAgo
              )
                return
              if (
                post.type.extras.includes('stick_duration') &&
                post.date_created.toDate() < monthAgo
              )
                return

              post.id = post.objectID
              results.push(
                this.lodash.omit(post, ['objectID', '_highlightResult'])
              )
            })
            resolve(results)
          })
          .catch(error => {
            this.$bugsnag.notify(error, {
              severity: 'error',
              metaData: {
                explanation: 'Error fetching sticky posts from algolia.',
                destination: 'mixins/advancedSearch.js'
              }
            })
            resolve(results)
          })
      })
    },
    async findPost(position, company_name) {
      return new Promise(resolve => {
        const monthAgo = this.$moment()
          .subtract(30, 'days')
          .startOf('day')
          .toDate()

        algolia_post_index
          .search(`${position} ${company_name}`, {
            filters: `date_created._seconds > ${monthAgo.getTime() / 1000}`,
            facetFilters: ['verified:true', 'deleted:false']
          })
          .then(response => {
            if (!response.hits.length) return resolve(null)

            let result = response.hits[0]

            result.date_created = new firestore.Timestamp(
              result.date_created._seconds,
              result.date_created._nanoseconds
            )

            result.id = result.objectID
            result = this.lodash.omit(result, ['objectID', '_highlightResult'])

            resolve(result)
          })
          .catch(error => {
            this.$bugsnag.notify(error, {
              severity: 'error',
              metaData: {
                explanation: 'Error finding post from algolia.',
                destination: 'mixins/advancedSearch.js'
              }
            })
            resolve(null)
          })
      })
    }
  }
}
