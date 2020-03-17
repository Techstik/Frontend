<template>
  <div>
    <div class="search-bar">
      <a-input v-model="searchWord" />
      <p class="filter-text">Apply some filters</p>
    </div>
    <h3 class="subheading">Posted Today</h3>
    <listing v-for="post in searchFilter" :key="post.id" :post="post" />
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
      posts: [],
      searchWord: ''
    }
  },
  computed: {
    searchFilter() {
      if (!this.searchWord) return this.posts

      return this.posts.filter(post => {
        return (
          post.position.toLowerCase().includes(this.searchWord.toLowerCase()) ||
          post.company_name
            .toLowerCase()
            .includes(this.searchWord.toLowerCase())
        )
      })
    }
  },
  created() {
    this.$readData('posts', { limit: 3 }).then(data => {
      this.posts = data
    })
  }
}
</script>
<style scoped>
.subheading {
  color: white;
}
.search-bar {
  background-color: transparent;
  padding: 30px 50px;
  border-radius: 6px;
}
.search-bar .filter-text {
  font-family: Graphik;
  text-align: center;
  color: white;
}
</style>
