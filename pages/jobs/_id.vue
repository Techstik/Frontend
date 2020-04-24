<template>
  <div class="wrapper wrapper--intro">
    <div class="grid grid--centered grid--formatted">
      <Skeleton
        v-if="loading"
        height="1.5em"
        class="heading heading--x-large grid__item grid__item--mobile-large flush--top flush--bottom"
      />
      <Skeleton
        v-if="loading"
        height="1.5em"
        class="subheading heading--x-large grid__item grid__item--mobile-large flush--top w-40"
      />
    </div>
    <div v-if="!loading" class="grid grid--centered grid--formatted">
      <h1
        class="heading heading--x-large grid__item grid__item--mobile-large flush--top flush--bottom"
      >
        {{ post.position }}
      </h1>
      <h3
        class="subheading heading--x-large grid__item grid__item--mobile-large flush--top"
      >
        <a
          v-if="post.company_website"
          :href="post.company_website"
          target="_blank"
        >
          {{ post.company_name }}</a
        >
        <span v-else>{{ post.company_name }}</span>
        <small class="date-posted">{{
          post.date_created.toDate() | moment('from', 'now')
        }}</small>
      </h3>
      <div class="job-container grid__item grid__item--mobile-large">
        <PostDetails
          :post="post"
          :post-details="post_details"
          :computed-salary="computedSalary"
        />
      </div>
    </div>
  </div>
</template>
<script>
import advancedSearch from '@/mixins/advancedSearch'
import PostDetails from '@/components/post/details'
import Skeleton from '@/components/generalskeleton'
import currencySymbols from '@/assets/scripts/currency_symbols.json'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    PostDetails,
    Skeleton
  },
  mixins: [advancedSearch],
  data() {
    return {
      loading: true,
      post: null,
      post_details: null,
      symbols: currencySymbols,
      structuredData: {}
    }
  },
  computed: {
    ...mapState({
      selectedCurrency: state => state.currencies.specified
    }),
    ...mapGetters({
      getSelectedExchangeRates: ['currencies/getSelectedExchangeRates']
    }),
    computedDescription() {
      if (!this.post_details) return ''
      var tmp = document.createElement('DIV')
      tmp.innerHTML = this.post_details.about_position
      return tmp.textContent || tmp.innerText || ''
    },
    computedMetaDescription() {
      return this.post
        ? `📣 ${this.post.company_name} is hiring a${
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.post.experience.sort()[0].charAt(0) == 'i' && !this.post.remote
              ? 'n'
              : ''
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          } ${this.post.remote ? 'remote ' : ''}${this.post.experience
            .sort()
            .map(exp => {
              if (exp === 'entry-level') return 'Junior'
              return exp.charAt(0).toUpperCase() + exp.substring(1)
            })
            .join('/')} ${this.post.position}. Offering ${
            this.symbols[this.post.salary.currency.code].symbol
          }${
            this.post.salary.set
              ? `${this.post.salary.maximum / 1000}k`
              : `${this.post.salary.minimum / 1000}k - ${this.post.salary
                  .maximum / 1000}k`
          } and a bunch of benefits - find out more and apply on Techstik.`
        : 'Find remote or location-based jobs at leading tech companies around the globe with upfront salary offers.'
    },
    computedSalary() {
      if (
        !this.post ||
        !this.selectedCurrency ||
        !this.getSelectedExchangeRates
      )
        return {
          minimum: this.post.salary.minimum,
          maximum: this.post.salary.maximum
        }

      let rate = this.getSelectedExchangeRates.rates[
        this.post.salary.currency.code
      ]

      return {
        minimum: this.post.salary.minimum / rate,
        maximum: this.post.salary.maximum / rate
      }
    }
  },
  created() {
    let paramPieces = this.$route.params.id.split('-at-')
    this.findPost(paramPieces[0], paramPieces[1]).then(result => {
      if (!result) return this.$nuxt.error({ statusCode: 404 })

      this.post = result
      this.loading = false

      this.$readReference(this.post.postdetails_ref)
        .then(details => {
          this.post_details = details

          this.structuredData = {
            '@context': 'https://schema.org/',
            '@type': 'JobPosting',
            title: this.post.position,
            description: this.computedDescription,
            identifier: {
              '@type': 'PropertyValue',
              name: `${this.post.position.toLowerCase()} at ${this.post.company_name.toLowerCase()}`,
              value: this.post.id
            },
            datePosted: this.$moment(this.post.date_created.toDate()).format(),
            validThrough: this.$moment(this.post.date_created.toDate())
              .add(30, 'days')
              .format(),
            employmentType:
              this.post.full_time && this.post.contract
                ? ['FULL_TIME', 'CONTRACTOR']
                : this.post.full_time
                ? 'FULL_TIME'
                : 'CONTRACTOR',
            hiringOrganization: {
              '@type': 'Organization',
              name: this.post.company_name,
              sameAs: this.post.company_website
            },
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: this.post.salary.currency.code,
              value: {
                '@type': 'QuantitativeValue',
                unitText: 'YEAR'
              }
            }
          }

          if (this.post.type.name == 'Premium' && this.post.company_logo)
            this.structuredData.hiringOrganization.logo = this.post.company_logo
          if (this.post.location_based)
            this.structuredData.jobLocation = {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: this.post.location.city,
                addressCountry: this.post.location.country_code
              },
              geo: {
                latitude: this.post.location.coords.lat,
                longitude: this.post.location.coords.lng
              }
            }
          else {
            this.structuredData.jobLocationType = 'TELECOMMUTE'
            this.structuredData.applicantLocationRequirements = {
              '@type': 'Country',
              name: 'USA'
            }
          }
          if (this.post.salary.set)
            this.structuredData.baseSalary.value.value = this.post.salary.maximum
          else {
            this.structuredData.baseSalary.value.minValue = this.post.salary.minimum
            this.structuredData.baseSalary.value.maxValue = this.post.salary.maximum
          }
        })
        .catch(error => {
          this.$bugsnag.notify(error, {
            severity: 'error',
            metaData: {
              explanation: 'Error reading post details on single page.',
              postId: this.post.postdetails_ref,
              destination: 'pages/jobs/_id.vue'
            }
          })
        })
    })
  },
  head() {
    return {
      title: this.post
        ? `${this.post.position} at ${this.post.company_name} | Techstik, Tech Jobs Worldwide`
        : 'Techstik | Tech-Related Jobs Worldwide',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.computedMetaDescription
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: this.computedMetaDescription
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: `https://techstik.com${this.$route.path}`
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: this.post
            ? `${this.post.position} at ${this.post.company_name} | Techstik`
            : 'Techstik | Tech-Related Jobs Worldwide'
        }
      ],
      script: [
        {
          innerHTML: JSON.stringify(this.structuredData),
          type: 'application/ld+json'
        }
      ]
    }
  }
}
</script>
<style scoped>
.title {
  text-align: left;
}
.subheading {
  color: white;
  position: relative;
}
.date-posted {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 60%;
}
.job-container {
  border-radius: 10px;
}
a:hover {
  color: #fcd669 !important;
}
.w-40 {
  width: 40%;
}
</style>
