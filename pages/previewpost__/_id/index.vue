<template>
  <div>
    <div v-if="loading">
      <PostSkeleton class="skeleton" />
    </div>
    <Post
      v-else
      :post="post"
      :post-info="postdetails"
      :gallary-u-r-ls="postdetails.gallery ? postdetails.gallery : []"
    />
  </div>
</template>
<script>
import Post from '@/components/post'
import { db } from '@/plugins/firebase'
import PostSkeleton from '@/components/post/skeleton'

export default {
  layout: 'previewpost',
  components: {
    Post,
    PostSkeleton
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

    this.fetchPost()
  },
  methods: {
    fetchPost() {
      db.collection('posts')
        .doc(this.$route.params.id.substring(6))
        .onSnapshot(
          doc => {
            this.post = {
              id: doc.id,
              ...doc.data()
            }
            this.fetchPostDetails()
          },
          error => {
            this.$bugsnag.notify(error, {
              severity: 'info',
              metaData: {
                explanation: 'Could not find post on preview page.',
                postId: this.$route.params.id.substring(6),
                destination: 'pages/previewpost__/_id/index.vue'
              }
            })
            return this.$nuxt.error({ statusCode: 404 })
          }
        )
    },
    fetchPostDetails() {
      db.collection('postdetails')
        .doc(this.post.postdetails_ref.split('/')[1])
        .onSnapshot(
          doc => {
            this.postdetails = {
              id: doc.id,
              ...doc.data()
            }
            this.loading = false
          },
          error => {
            this.$bugsnag.notify(error, {
              severity: 'info',
              metaData: {
                explanation: 'Could not find post on preview page.',
                postId: this.$route.params.id.substring(6),
                destination: 'pages/previewpost__/_id/index.vue'
              }
            })
            return this.$nuxt.error({ statusCode: 404 })
          }
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
