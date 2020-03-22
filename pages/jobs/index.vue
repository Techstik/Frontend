<template>
  <div class="post-wrapper">
    <div class="search-bar">
      <a-input v-model="searchWord" />
      <p class="filter-text">Apply some filters</p>
    </div>
    <h3 class="subheading">Posted Today</h3>
    <Post v-for="post in searchFilter" :key="post.id" :post="post" />

    <div v-if="loading">
      <PostSkeleton class="skeleton" />
      <PostSkeleton class="skeleton" />
      <PostSkeleton class="skeleton" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { db } from '@/plugins/firebase'
import Post from '@/components/post'
import PostSkeleton from '@/components/post/skeleton'

export default {
  components: {
    Post,
    PostSkeleton
  },
  data() {
    return {
      loading: true,
      searchWord: '',
      paging: false,
      reachedEnd: false,
      setLimit: 8,
      scrollHeight: 500,
      page: 1,
      list: []
    }
  },
  computed: {
    ...mapState({
      posts: state => state.posts.all,
      allPostsLoaded: state => state.posts.all_loaded,
      canPaginate: state => state.paging.canPaginate
    }),
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
    },
    scrollContainerStyles() {
      return {
        height: `${this.scrollHeight}px`
      }
    }
  },
  watch: {
    canPaginate(value) {
      if (value) this.paginate()
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    // this.setLimit = Math.floor(globalThis.outerHeight / 110)
    this.setLimit = 3
    this.scrollHeight = (this.setLimit - 1) * 110

    this.paginate()
  },
  methods: {
    ...mapMutations({
      setPost: 'posts/set',
      setAllPostsLoaded: 'posts/setAllLoaded',
      setPaginate: 'paging/setPaginate'
    }),
    paginate() {
      if (this.allPostsLoaded) return

      this.loading = true
      console.log('paginating')
      var query = this.posts.length
        ? db
            .collection('posts')
            .orderBy('date_created', 'desc')
            .startAfter(this.posts[this.posts.length - 1].date_created)
            .limit(this.setLimit)
        : db
            .collection('posts')
            .orderBy('date_created', 'desc')
            .limit(this.setLimit)

      query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setPost({
            id: doc.id,
            ...doc.data()
          })
        })

        this.loading = false

        if (querySnapshot.docs.length < this.setLimit)
          this.setAllPostsLoaded(true)

        this.setPaginate(false)
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
  height: 90% !important;
}
.skeleton {
  margin-bottom: 15px;
}
.skeleton:last-child {
  margin-bottom: 0px;
}
.h-200 {
  height: 400px;
  color: white;
}
</style>
