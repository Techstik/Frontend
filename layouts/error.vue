<template>
  <div class="wrapper wrapper--fill">
    <div class="grid grid--centered grid--formatted">
      <div class="grid grid--row grid__item grid__item--large">
        <div class="grid__item grid__item--half">
          <h1 class="heading">
            {{
              error.statusCode === 404
                ? "Oops, we don't have that page."
                : 'Something went wrong...'
            }}
          </h1>
          <p v-if="error.statusCode === 404" class="large">
            If this is a page you frequently visit, we may have moved it
            elsewhere. Please
            <a
              :href="
                `mailto:team@techstik.com?subject=Page Not Found&body=Hi there%0D%0A%0D%0AI recently navigated to https://techstik.com${this.$route.fullPath} but there is nothing there...`
              "
              >let us know</a
            >
            if we can try and fix it for you!
          </p>
          <p v-else class="large">
            Damn - this is an issue on our side. We have notified the team and
            will resolve it shortly.
          </p>
        </div>
        <div class="grid__item grid__item--half centered-medium">
          <nuxt-link to="/"><a-button>Return home</a-button></nuxt-link>
          <nuxt-link to="/jobs"><a-button>Checkout jobs</a-button></nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  created() {
    if (this.error.statusCode !== 404)
      this.$bugsnag.notify(
        new Error(`${this.error.code}: ${this.error.message}`),
        {
          severity: 'error',
          metaData: {
            explanation: 'Error screen hit'
          }
        }
      )
  },
  head() {
    return {
      title:
        this.error.statusCode === 404
          ? "Oops - this page doesn't exist!"
          : 'Oops - there was an issue...',
      meta: [
        {
          name: 'robots',
          content: 'noindex, nofollow'
        }
      ]
    }
  }
}
</script>
<style scoped>
.error-container,
h1,
p {
  color: white;
}
.full-page-height {
  min-height: 100vh;
  margin-top: -8em;
  margin-bottom: -4em;
}
</style>
