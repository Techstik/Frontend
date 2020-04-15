<script>
import { mapMutations } from 'vuex'

export default {
  created() {
    if (!this.$route.params.id) return this.$nuxt.error({ statusCode: 404 })

    this.$readData('users', {
      where: {
        field: 'uid',
        operation: '==',
        value: this.$route.params.id
      },
      limit: 1
    }).then(data => {
      if (!data || !data.length) return this.$nuxt.error({ statusCode: 404 })

      this.setOperatingAsAdmin(true)
      return this.$router.push('/post-a-job')
    })
  },
  methods: {
    ...mapMutations({
      setOperatingAsAdmin: 'users/setOperatingAsAdmin'
    })
  },
  head() {
    return {
      meta: [{ name: 'robots', content: 'noindex' }]
    }
  }
}
</script>
