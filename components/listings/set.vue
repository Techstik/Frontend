<template>
  <div>
    <a-row
      type="flex"
      justify="space-around"
      :align="columnRevealed ? 'top' : 'middle'"
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
      columnRevealed: false,
      resettingColumns: false
    }
  },
  methods: {
    onColumnReveal(columnIndex) {
      if (this.resettingColumns) return (this.resettingColumns = false)

      console.log('oncolumnreveal hit - index = ' + columnIndex)
      this.columnRevealed = true

      for (let index = 0; index < this.listings.length; index++) {
        this.$refs.columns[index].$el.classList.remove('_column_selected')

        if (columnIndex == index) {
          this.$refs.listings[index].setThumbnail(false)
          this.$refs.listings[index].setReveal(true)
          this.$refs.columns[index].$el.classList.add('_column_selected')
        } else {
          this.$refs.listings[index].setThumbnail(true)
          this.$refs.columns[index].$el.classList.add('column_unselected')
        }
      }
    },
    resetColumns() {
      this.resettingColumns = true
      this.columnRevealed = false

      for (let index = 0; index < this.listings.length; index++) {
        this.$refs.columns[index].$el.classList.remove(
          '_column_selected',
          'column_unselected'
        )
        this.$refs.listings[index].setThumbnail(false)
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
