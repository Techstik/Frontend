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
            description: this.post_details.about_position,
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
          hid: 'job-single-description',
          name: 'description',
          content: this.post_details ? this.post_details.about_position : ''
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
