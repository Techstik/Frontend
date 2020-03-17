<template>
  <div>
    <listing v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import listing from '@/components/listings/listing'

export default {
  components: {
    listing
  },
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    this.$readData('posts', { limit: 5 }).then(data => {
      this.posts = data
    })
  }
}
</script>
