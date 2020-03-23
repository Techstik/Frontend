<template>
  <div class="post-wrapper">
    <div :class="[{ showBackground: showFilters }, 'search']">
      <a-input
        v-model="searchWord"
        placeholder="Know what you're looking for? Search here..."
      />
      <a-collapse :active-key="showFilters ? 1 : 0">
        <a-collapse-panel key="1" :show-arrow="false">
          <FilterBlock @filtersApplied="updateFilters" />
        </a-collapse-panel>
      </a-collapse>
      <p class="filter-text" @click="showFilters = !showFilters">
        Apply some filters
      </p>
    </div>

    <div v-if="searchFilter.today.length">
      <h3 class="subheading">Today</h3>
      <Post v-for="post in searchFilter.today" :key="post.id" :post="post" />
    </div>
    <div v-if="searchFilter.yesterday.length">
      <h3 class="subheading">Yesterday</h3>
      <Post
        v-for="post in searchFilter.yesterday"
        :key="post.id"
        :post="post"
      />
    </div>
    <div v-if="searchFilter.lastweek.length">
      <h3 class="subheading">Last Week</h3>
      <Post v-for="post in searchFilter.lastweek" :key="post.id" :post="post" />
    </div>
    <div v-if="searchFilter.older.length">
      <h3 class="subheading">Older</h3>
      <Post v-for="post in searchFilter.older" :key="post.id" :post="post" />
    </div>

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
import FilterBlock from '@/components/filter'
import Post from '@/components/post'
import PostSkeleton from '@/components/post/skeleton'

export default {
  components: {
    FilterBlock,
    Post,
    PostSkeleton
  },
  data() {
    return {
      loading: true,
      searchWord: '',
      setLimit: 8,
      showFilters: false,
      filters: []
    }
  },
  computed: {
    ...mapState({
      posts: state => state.posts.all,
      allPostsLoaded: state => state.posts.all_loaded,
      canPaginate: state => state.paging.canPaginate,
      isSearching: state => state.paging.isSearching
    }),
    searchFilter() {
      let filtered = this.posts
      let refinedWord = this.searchWord.toLowerCase().trim()

      if (!refinedWord && !this.filters.length) {
        if (this.isSearching) this.setSearching(false)
      } else {
        if (!this.isSearching) this.setSearching(true)

        if (refinedWord)
          filtered = filtered.filter(post => {
            return (
              post.position.toLowerCase().includes(refinedWord) ||
              post.company_name.toLowerCase().includes(refinedWord) ||
              `${post.location.city.toLowerCase()}, ${post.location.country.toLowerCase()}`.includes(
                refinedWord
              ) ||
              post.tech.find(tech => {
                return tech.name.toLowerCase().includes(refinedWord)
              }) ||
              post.experience.find(exp => {
                return exp.toLowerCase() == refinedWord
              })
            )
          })

        if (this.filters.length) {
          this.filters.forEach(filter => {
            filtered = filtered.filter(post => {
              let result = false

              switch (filter.name) {
                case 'tech stack':
                  filter.values.forEach(tech => {
                    if (
                      post.tech.find(post_tech => {
                        return post_tech.name
                          .toLowerCase()
                          .includes(tech.name.toLowerCase().trim())
                      })
                    ) {
                      result = true
                      return
                    }
                  })
                  break
                case 'experience':
                  filter.values.forEach(exp => {
                    if (
                      post.experience.find(post_exp => {
                        return post_exp == exp
                      })
                    ) {
                      result = true
                      return
                    }
                  })
                  break
                case 'contract':
                  result = post.contract
                  break
                case 'full-time':
                  result = post.full_time
                  break
                case 'city':
                  result = post.location.city
                    .toLowerCase()
                    .includes(filter.values.toLowerCase().trim())
                  break
                case 'country':
                  filter.values.forEach(country => {
                    if (
                      post.location.country
                        .toLowerCase()
                        .includes(country.name.toLowerCase())
                    ) {
                      result = true
                      return
                    }
                  })
                  break
                case 'salary currency':
                  filter.values.forEach(currency => {
                    if (post.salary.currency.code == currency.code) {
                      result = true
                      return
                    }
                  })
                  break
                case 'salary amount (p.a.)':
                  if (filter.condition == 'more than')
                    result =
                      parseInt(
                        post.salary.maximum.toString().replace(',', '')
                      ) > parseInt(filter.values.toString().replace(',', ''))
                  else
                    result =
                      parseInt(
                        post.salary.maximum.toString().replace(',', '')
                      ) < parseInt(filter.values.toString().replace(',', ''))
                  break
                case 'company size':
                  filter.values.forEach(size => {
                    if (post.size == size) {
                      result = true
                      return
                    }
                  })
                  break
                case 'date posted':
                  if (filter.condition == 'before')
                    result =
                      post.date_created.toDate() < filter.values.startOf('day')
                  else if (filter.condition == 'after')
                    result =
                      post.date_created.toDate() > filter.values.endOf('day')
                  else
                    result =
                      post.date_created.toDate() >=
                        filter.values.startOf('day') &&
                      post.date_created.toDate() <= filter.values.endOf('day')
                  break
              }

              return result
            })
          })
        }

        if (filtered.length < this.setLimit) this.paginate()
      }

      let yesterday = this.$moment().subtract(1, 'days')
      let lastweek = this.$moment().subtract(7, 'days')

      return {
        today: filtered.filter(post => {
          return (
            post.date_created.toDate() >= this.$moment().startOf('day') &&
            post.date_created.toDate() <= this.$moment().endOf('day')
          )
        }),
        yesterday: filtered.filter(post => {
          return (
            post.date_created.toDate() >= yesterday.startOf('day') &&
            post.date_created.toDate() <= yesterday.endOf('day')
          )
        }),
        lastweek: filtered.filter(post => {
          return (
            post.date_created.toDate() < yesterday.startOf('day') &&
            post.date_created.toDate() >= lastweek.startOf('day')
          )
        }),
        older: filtered.filter(post => {
          return post.date_created.toDate() < lastweek.startOf('day')
        })
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
    this.setLimit = Math.floor(globalThis.outerHeight / 110)

    this.paginate()
  },
  methods: {
    ...mapMutations({
      setPost: 'posts/set',
      setAllPostsLoaded: 'posts/setAllLoaded',
      setPaginate: 'paging/setPaginate',
      setSearching: 'paging/setSearching'
    }),
    paginate() {
      if (this.allPostsLoaded) return

      this.loading = true

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
    },
    updateFilters(filters) {
      this.filters = filters
    }
  }
}
</script>
<style scoped>
.subheading {
  color: white;
}
.search {
  background-color: transparent;
  padding: 30px 50px;
  border-radius: 6px;
  transition: 300ms;
}
.showBackground {
  background-color: #f3976b;
  margin-bottom: 15px;
}
.search .filter-text {
  font-family: Graphik;
  text-align: center;
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
</style>
<style>
.search .ant-collapse-content {
  background-color: transparent !important;
  border-top: none;
  border-radius: 0px !important;
}
</style>
