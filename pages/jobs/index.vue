<template>
  <div class="wrapper wrapper--intro">
    <div class="grid grid--centered">
      <div
        :class="[
          { showBackground: showFilters },
          'grid__item grid__item--mobile-large search'
        ]"
      >
        <a-input
          v-model="searchWord"
          :placeholder="
            `Know what you're looking for? ${isMobile ? '' : 'Search here...'}`
          "
          :class="[
            { searchingByWord: search.awaitingTimout && searchWord },
            'search-input'
          ]"
        >
          <a-spin v-show="search.awaitingTimout && searchWord" slot="prefix">
            <a-icon
              slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin
            />
          </a-spin>
        </a-input>
        <a-collapse :active-key="showFilters ? 1 : 0">
          <a-collapse-panel key="1" :show-arrow="false">
            <FilterBlock @filtersApplied="updateFilters" />
          </a-collapse-panel>
        </a-collapse>
        <div class="filter-text" @click="showFilters = !showFilters">
          <span v-if="!showFilters">
            <a-badge v-if="filters.length" :count="filters.length">
              Filters applied
            </a-badge>
            <small v-else class="filter-button">Apply some filters</small>
          </span>
          <a-icon
            v-else
            type="caret-up"
            theme="filled"
            class="cursor-pointer"
          />
        </div>
      </div>

      <div class="grid__item push--bottom align-center">
        <a-button :class="[{ active: remote }]" @click="remote = !remote"
          >REMOTE</a-button
        >
        <a-button
          :class="[{ active: location_based }]"
          @click="location_based = !location_based"
          >LOCATION-BASED</a-button
        >
      </div>

      <div class="grid__item grid__item--mobile-large post-container">
        <Post
          v-for="post in searchFilter.sticky"
          :key="post.id"
          :post="post"
          :class="[{ max: isMobile && currentlyRevealedPost == post.id }]"
        />
        <div v-if="searchFilter.today.length">
          <h3 class="subheading">Today</h3>
          <Post
            v-for="post in searchFilter.today"
            :key="post.id"
            :post="post"
            :class="[{ max: isMobile && currentlyRevealedPost == post.id }]"
          />
        </div>
        <div v-if="searchFilter.yesterday.length">
          <h3 class="subheading">Yesterday</h3>
          <Post
            v-for="post in searchFilter.yesterday"
            :key="post.id"
            :post="post"
            :class="[{ max: isMobile && currentlyRevealedPost == post.id }]"
          />
        </div>
        <div v-if="searchFilter.lastweek.length">
          <h3 class="subheading">Last 7 Days</h3>
          <Post
            v-for="post in searchFilter.lastweek"
            :key="post.id"
            :post="post"
            :class="[{ max: isMobile && currentlyRevealedPost == post.id }]"
          />
        </div>
        <div v-if="searchFilter.older.length">
          <h3 class="subheading">Older</h3>
          <Post
            v-for="post in searchFilter.older"
            :key="post.id"
            :post="post"
            :class="[{ max: isMobile && currentlyRevealedPost == post.id }]"
          />
        </div>
        <div v-if="loading">
          <PostSkeleton class="skeleton" />
          <PostSkeleton class="skeleton" />
          <PostSkeleton class="skeleton" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import { db } from '@/plugins/firebase'
import { firestore } from 'firebase/app'
import advancedSearch from '@/mixins/advancedSearch'
import FilterBlock from '@/components/filter'
import Post from '@/components/post'
import PostSkeleton from '@/components/post/skeleton'

export default {
  components: {
    FilterBlock,
    Post,
    PostSkeleton
  },
  mixins: [advancedSearch],
  data() {
    return {
      loading: false,
      searchWord: '',
      setLimit: 8,
      showFilters: false,
      pagingInProgress: false,
      filters: [],
      remote: false,
      location_based: false,
      fetchedSticky: false,
      search: {
        page: 0,
        results: [],
        allLoaded: false,
        wordTimer: null,
        awaitingTimout: false
      }
    }
  },
  computed: {
    ...mapGetters({
      isMobile: ['isMobile']
    }),
    ...mapState({
      posts: state => state.posts.all,
      allPostsLoaded: state => state.posts.all_loaded,
      newestPostSubscription: state => state.posts.newestSubscription,
      canPaginate: state => state.paging.canPaginate,
      isSearching: state => state.paging.isSearching,
      currentlyRevealedPost: state => state.posts.selected
    }),
    searchFilter() {
      let filtered

      if (!this.isSearching) filtered = this.posts
      else filtered = this.search.results

      if (this.remote) filtered = filtered.filter(post => post.remote)

      if (this.location_based)
        filtered = filtered.filter(post => post.location_based)

      filtered = this.lodash.orderBy(filtered, ['date_created'], ['desc'])

      let yesterday = this.$moment().subtract(1, 'days')
      let lastweek = this.$moment().subtract(7, 'days')

      return {
        sticky: filtered.filter(post => post.sticky),
        today: filtered.filter(post => {
          return (
            post.date_created.toDate() >= this.$moment().startOf('day') &&
            post.date_created.toDate() <= this.$moment().endOf('day') &&
            !post.sticky
          )
        }),
        yesterday: filtered.filter(post => {
          return (
            post.date_created.toDate() >= yesterday.startOf('day') &&
            post.date_created.toDate() <= yesterday.endOf('day') &&
            !post.sticky
          )
        }),
        lastweek: filtered.filter(post => {
          return (
            post.date_created.toDate() < yesterday.startOf('day') &&
            post.date_created.toDate() >= lastweek.startOf('day') &&
            !post.sticky
          )
        }),
        older: filtered.filter(post => {
          return (
            post.date_created.toDate() < lastweek.startOf('day') && !post.sticky
          )
        })
      }
    },
    trimmedSearchWord() {
      return this.searchWord.replace(/^\s+/g, '')
    }
  },
  watch: {
    canPaginate(value) {
      if (value) this.paginate()
    },
    remote(value) {
      if (value && this.location_based) this.location_based = false
    },
    location_based(value) {
      if (value && this.remote) this.remote = false
    },
    trimmedSearchWord(value) {
      if (value.trim()) {
        this.search.awaitingTimout = true
        if (this.wordTimer) clearTimeout(this.wordTimer)

        this.wordTimer = setTimeout(() => {
          this.search = {
            page: -1,
            results: [],
            allLoaded: false
          }
          this.determineSearching()
          this.search.awaitingTimout = false
          this.paginate()
        }, 1000)
      } else this.determineSearching()
    },
    currentlyRevealedPost(value) {
      if (!value && this.canPaginate) this.setPaginate(false)
    }
  },
  created() {
    this.$eventbus.$emit('scroll-to', 0, 0)
    // eslint-disable-next-line no-undef
    this.setLimit = Math.floor(globalThis.outerHeight / 110)
    this.paginate()

    if (!this.newestPostSubscription) this.setupNewPostSubscription()

    document.addEventListener('click', evt => {
      if (!this.currentlyRevealedPost) return
      let revealed = document.getElementById(
        `__post_${this.currentlyRevealedPost}`
      )
      let currencyDropdown = document.getElementById('main-currency-select')
      let targetElement = evt.target // clicked element

      if (targetElement) {
        do {
          if (targetElement == revealed || targetElement == currencyDropdown)
            return

          targetElement = targetElement.parentNode
        } while (targetElement)
      }

      // This is a click outside.
      this.setCurrentlyRevealed(null)
    })
  },
  beforeDestroy() {
    this.setCurrentlyRevealed(null)
  },
  methods: {
    ...mapMutations({
      setPost: 'posts/set',
      setAllPostsLoaded: 'posts/setAllLoaded',
      setPaginate: 'paging/setPaginate',
      setSearching: 'paging/setSearching',
      setCurrentlyRevealed: 'posts/setSelected',
      setNewestPostSubscription: 'posts/setNewestSubscription'
    }),
    determineSearching() {
      this.setSearching(
        this.filters.length > 0 || this.trimmedSearchWord.length > 0
      )
    },
    async paginate() {
      if (
        this.pagingInProgress ||
        this.currentlyRevealedPost ||
        (!this.isSearching && this.allPostsLoaded) ||
        (this.isSearching && this.search.allLoaded)
      )
        return

      this.pagingInProgress = true
      this.loading = true

      //first need to pull all the stuck posts
      if (!this.fetchedSticky) return this.fetchSticky()

      if (this.isSearching) this.organizeSearch()
      else this.normalFetch()
    },
    updateFilters(filters) {
      this.filters = filters
      this.search = {
        page: -1,
        results: [],
        allLoaded: false
      }
      this.determineSearching()
      this.paginate()

      this.$logAnalytic('search-filters', {
        filters: JSON.stringify(filters)
      })
    },
    setupNewPostSubscription() {
      this.setNewestPostSubscription(
        db
          .collection('posts')
          .where('verified', '==', true)
          .where('deleted', '==', false)
          .orderBy('date_created', 'desc')
          .limit(1)
          .onSnapshot(querySnapshot => {
            let doc = querySnapshot.docs[0]
            if (
              !this.posts.find(post => {
                return post.id == doc.id
              })
            ) {
              let post = {
                id: doc.id,
                ...doc.data()
              }

              if (doc.data().type.extras && doc.data().type.extras.length)
                post.sticky = true

              this.setPost(post)
            }
          })
      )
    },
    fetchSticky() {
      this.stickyPosts().then(results => {
        results.forEach(post => {
          if (!this.lodash.find(this.posts, { id: post.id }))
            this.setPost({ sticky: true, ...post })
        })
        this.setPaginate(false)

        this.pagingInProgress = false
        this.fetchedSticky = true
        this.paginate()
      })
    },
    normalFetch() {
      var query = db
        .collection('posts')
        .where('verified', '==', true)
        .where('deleted', '==', false)
        .where(
          'date_created',
          '>=',
          firestore.Timestamp.fromDate(
            this.$moment()
              .subtract(30, 'days')
              .startOf('day')
              .toDate()
          )
        )
        .orderBy('date_created', 'desc')

      let nonSticky = this.posts.filter(post => {
        return !post.sticky
      })

      if (nonSticky.length)
        query = query.startAfter(
          this.lodash.takeRight(
            this.lodash.orderBy(this.posts, ['date_created'], ['desc'])
          )[0].date_created
        )

      query = query.limit(this.setLimit)

      query.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (!this.lodash.find(this.posts, { id: doc.id }))
            this.setPost({
              id: doc.id,
              ...doc.data()
            })
        })

        this.loading = false

        if (querySnapshot.docs.length < this.setLimit)
          this.setAllPostsLoaded(true)

        this.setPaginate(false)

        this.pagingInProgress = false
      })
    },
    organizeSearch() {
      let refinedWord = this.searchWord.toLowerCase().trim()
      if (!refinedWord && !this.filters.length)
        return (this.search.results = [])

      //set the page to loading. dont show any posts fetched from fireabse. we now have a blank screen
      this.loading = true

      // query algolia
      this.performSearch(
        refinedWord,
        this.filters,
        ++this.search.page,
        this.setLimit
      ).then(results => {
        this.search.results = this.search.results.length
          ? this.lodash.concat(this.search.results, results)
          : results

        if (results.length < this.setLimit) this.search.allLoaded = true

        this.loading = false
        this.setPaginate(false)
        this.pagingInProgress = false
      })
    }
  },
  head() {
    return {
      title: 'Jobs | Software Development, DevOps, Design and More',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Find remote or location-based jobs at leading tech companies around the globe with upfront salary offers.'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content:
            'Find remote or location-based jobs at leading tech companies around the globe with upfront salary offers.'
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: `https://techstik.com/jobs`
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: 'Jobs | Software Development, DevOps, Design and More'
        }
      ]
    }
  }
}
</script>
<style scoped>
.wrapper--intro {
  padding: 4em 0 4em 0;
}
.subheading {
  color: white;
}
.search {
  background-color: transparent;
  padding: 1em 1.5em;
  border-radius: 6px;
  transition: 300ms;
}
.showBackground {
  background-color: #303c6c;
  margin-bottom: 15px;
}
.search .filter-text {
  font-family: 'Graphik', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  width: fit-content;
  margin: auto;
  color: white;
  margin-bottom: 0;
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
.ant-collapse {
  border: none;
  background-color: transparent;
}
.filter-text .ant-badge {
  border: 1px solid #fcd669;
  padding: 7px 15px;
  border-radius: 15px;
  background-color: #fcd669;
  color: black;
  text-transform: uppercase;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  cursor: pointer;
  margin-top: 5px;
}
.filter-button {
  transition: 300ms;
  padding: 7px 15px;
  border-radius: 15px;
}
.filter-button:hover {
  background-color: #fcd669;
  cursor: pointer;
  color: black;
}
.post-container .listing {
  margin: 15px 0px;
}
.big-button {
  border: 1px solid white;
  padding: 10px;
  display: inline-block;
  border-radius: 15px;
  background: white;
  min-width: 250px;
  color: black;
  cursor: pointer;
}
.big-button.active {
  background: #fcd669;
}
.mr-15 {
  margin-right: 15px;
}
.ml-15 {
  margin-left: 15px;
}
@media (max-width: 750px) {
  .wrapper--intro {
    padding: 4.2em 0 4em 0;
  }
  .search {
    padding: 0.8em;
  }
  .subheading {
    font-size: 120%;
  }
  .post-container .listing,
  .skeleton {
    margin: 7px 0px;
  }
  .post-container .listing.max {
    margin-left: -15px;
    margin-right: -15px;
  }
}
</style>
<style>
.search .ant-collapse-content {
  background-color: transparent !important;
  border-top: none;
  border-radius: 0px !important;
}
.searchingByWord input {
  padding-left: 50px !important;
}

.search .ant-input-affix-wrapper .ant-input-prefix {
  left: 17px;
}
.search .ant-input-affix-wrapper .ant-input-prefix {
  top: 42% !important;
}
.search .anticon-spin {
  color: orange !important;
}
@media (max-width: 750px) {
  .search-input .ant-input {
    height: 35px !important;
  }
}
</style>
