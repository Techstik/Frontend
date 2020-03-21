<template>
  <div>
    <div class="search-bar">
      <a-input v-model="searchWord" />
      <p class="filter-text">Apply some filters</p>
    </div>
    <vuescroll
      ref="scroller"
      class="scroll-container"
      @handle-scroll="onScroll"
    >
      <h3 class="subheading">Posted Today</h3>
      <Post v-for="post in searchFilter" :key="post.id" :post="post" />
    </vuescroll>
  </div>
</template>

<script>
import vuescroll from 'vuescroll'
import { db } from '@/plugins/firebase'
import Post from '@/components/post'

export default {
  components: {
    vuescroll,
    Post
  },
  data() {
    return {
      posts: [],
      searchWord: '',
      nextSet: null,
      paging: false,
      reachedEnd: false
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
    this.paginate()
  },
  methods: {
    onScroll() {
      const { v, h } = this.$refs.scroller.getScrollProcess()

      if (v > 0.8 && !this.paging && !this.reachedEnd) {
        this.paginate()
      }
    },
    paginate() {
      this.paging = true

      var query = this.nextSet
        ? this.nextSet
        : db
            .collection('posts')
            .orderBy('date_created', 'desc')
            .limit(8)

      query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          //TODO: save these to vuex store

          this.posts.push({
            id: doc.id,
            ...doc.data()
          })
        })

        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]

        this.nextSet = db
          .collection('posts')
          .orderBy('date_created', 'desc')
          .startAfter(lastVisible)
          .limit(8)

        this.reachedEnd = querySnapshot.docs.length < 8
        this.paging = false
      })
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
.scroll-container {
  height: 400px !important;
}
</style>
