<template>
  <div>
    <div class="search-bar">
      <a-input v-model="searchWord" />
      <p class="filter-text">Apply some filters</p>
    </div>
    <vuescroll>
      <h3 class="subheading">Posted Today</h3>
      <Post v-for="post in searchFilter" :key="post.id" :post="post" />
    </vuescroll>
  </div>
</template>

<script>
import vuescroll from 'vuescroll'
import Post from '@/components/post'

export default {
  components: {
    vuescroll,
    Post
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
    this.$readData('posts', {
      order: { field: 'date_created', operation: 'desc' },
      limit: 8
    }).then(data => {
      this.posts = data
      this.scroll()
    })
  },
  methods: {
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight
        console.log(bottomOfWindow)
        if (bottomOfWindow) {
          this.scrolledToBottom = true // replace it with your code
        }
      }
    }
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
