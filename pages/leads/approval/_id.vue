<template>
  <div id="lead_approvals" class="wrapper wrapper--intro">
    <div v-if="!loading" class="grid grid--centered grid--formatted centered">
      <h1
        ref="welcomeBackHeading"
        class="heading heading--x-large flush--top grid__item grid__item--large"
      >
        Awesome!
      </h1>
      <h3 class="subheading push--top grid__item">
        Your search for a
        <span class="position">{{ lead.position }}</span> will soon be revealed
        to the tech community.
      </h3>
      <p class="medium grid__item--medium mt-1">
        Your post will be curated from
        <a :href="lead.URL" target="_blank">this source</a> and handled by our
        team member, <b>{{ lead.assignee.name }}</b
        >. <br />Feel free to contact {{ lead.assignee.salutation }} if you have
        any questions.
      </p>
      <AvatarCard
        :staff-member="lead.assignee"
        class="mtb-10 grid__item assignee"
      />
    </div>
  </div>
</template>
<script>
import AvatarCard from '@/components/avatarcard'

export default {
  components: {
    AvatarCard
  },
  data() {
    return {
      lead: null,
      loading: true
    }
  },
  created() {
    if (!this.$route.params.id) return this.$nuxt.error({ statusCode: 404 })

    this.$readDocument('leads', this.$route.params.id)
      .then(lead => {
        this.lead = lead
        this.loading = false
        this.updateLead()
      })
      .catch(error => {
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Error fetching lead on approval page.',
            destination: 'components/pages/leads/approvals/_id.vue'
          }
        })
        return this.$nuxt.error({ statusCode: 404 })
      })
  },
  methods: {
    updateLead() {
      this.$createLog('leadlogs', `leads/${this.lead.id}`, {
        title: 'Approved',
        severity: 'success'
      })
      this.$updateDocument(
        'leads',
        this.lead.id,
        {
          approved: true
        },
        true
      )
    }
  },
  head() {
    return {
      meta: [{ name: 'robots', content: 'noindex' }]
    }
  }
}
</script>
<style>
#lead_approvals .subheading,
#lead_approvals p {
  color: white !important;
}
#lead_approvals .position {
  color: #f3976b;
}
#lead_approvals .assignee {
  width: fit-content;
  margin: auto;
}
#lead_approvals .mt-1 {
  margin-top: 1em;
}
</style>
