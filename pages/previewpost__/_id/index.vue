<template>
  <div>
    <Post
      v-if="!loading"
      :post="post"
      :post-info="postdetails"
      :gallary-u-r-ls="postdetails.gallery ? postdetails.gallery : []"
    />
  </div>
</template>
<script>
import Post from '@/components/post'

export default {
  layout: 'previewpost',
  components: {
    Post
  },
  data() {
    return {
      post: null,
      postdetails: null,
      loading: true
    }
  },
  created() {
    if (!this.$route.params.id || this.$route.params.id.length < 10)
      return this.$nuxt.error({ statusCode: 404 })
    this.$readDocument('posts', this.$route.params.id.substring(6))
      .then(document => {
        this.post = document
        this.$readDocument(
          'postdetails',
          this.post.postdetails_ref.split('/')[1]
        ).then(document => {
          this.postdetails = document
          this.loading = false
        })
      })
      .catch(error => {
        this.$bugsnag.notify(error, {
          severity: 'info',
          metaData: {
            explanation: 'Could not find post on preview page.',
            postId: this.$route.params.id.substring(6),
            destination: 'pages/previewpost__/_id/index.vue'
          }
        })
        return this.$router.push('/')
      })
  },
  head() {
    return {
      meta: [{ name: 'robots', content: 'noindex' }]
    }
  }
}
</script>
