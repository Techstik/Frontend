<template>
  <div>
    <a-row
      type="flex"
      :align="columnRevealed > -1 ? 'top' : 'middle'"
      class="_row"
    >
      <a-col
        v-for="(listing, index) in listings"
        ref="columns"
        :key="listing.id"
        :span="8"
        class="_column"
        @click="onColumnReveal(index)"
      >
        <listing
          ref="listings"
          v-model="listings[index]"
          @collapsing="resetColumns"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script>
import listing from './listing'

export default {
  components: {
    listing
  },
  props: {
    listings: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      columnRevealed: -1
    }
  },
  methods: {
    onColumnReveal(columnIndex) {
      if (this.columnRevealed == columnIndex) return

      this.columnRevealed = columnIndex

      for (let index = 0; index < this.listings.length; index++) {
        this.$refs.columns[index].$el.classList.remove('_column_selected')

        if (columnIndex == index) {
          this.$refs.listings[index].setThumbnail(false)
          this.$refs.columns[index].$el.classList.add('_column_selected')
          setTimeout(() => {
            this.$refs.listings[index].setReveal(true)
          }, 300)
        } else {
          this.$refs.listings[index].setThumbnail(true)
          this.$refs.columns[index].$el.classList.add('column_unselected')
        }
      }
    },
    resetColumns() {
      this.columnRevealed = -1

      for (let index = 0; index < this.listings.length; index++) {
        this.$refs.columns[index].$el.classList.remove(
          'column_unselected',
          '_column_selected'
        )
        setTimeout(() => {
          this.$refs.listings[index].setThumbnail(false)
        }, 200)
      }
    }
  }
}
</script>
<style scoped>
.column_unselected {
  width: 15%;
}

._column_selected {
  width: 70%;
}
* {
  transition: all 0.3s ease 0s;
}
</style>
