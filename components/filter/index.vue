<template>
  <div>
    <p>
      {{
        filters.length ? 'Select another field:' : 'Start by selecting a field:'
      }}
    </p>
    <div class="align-center">
      <span class="filter-btn">
        <div @click="toggleFilter('tech stack')">tech stack</div>
      </span>
      <span class="filter-btn"
        ><div @click="toggleFilter('experience')">experience</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('contract')">contract</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('full-time')">full-time</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('city')">city</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('country')">country</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('salary')">salary</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('company size')">company size</div></span
      >
      <span class="filter-btn"
        ><div @click="toggleFilter('date posted')">date posted</div></span
      >
    </div>
    <div class="conditions">
      <p>Configure conditions:</p>
      <div v-for="filter in filters" :key="filter" class="filter">
        <a-row type="flex" align="middle">
          <a-col :span="4">
            <span class="filter-btn">
              <div>{{ filter }}</div>
            </span>
          </a-col>
          <a-col :span="4">
            <span>includes</span>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filters: []
    }
  },
  methods: {
    toggleFilter(filter) {
      if (this.filters.includes(filter))
        this.filters = this.lodash.remove(this.filters, existing => {
          return existing !== filter
        })
      else this.filters.push(filter)
    }
  }
}
</script>
<style scoped>
.filter-btn div {
  border: 1px solid black;
  padding: 3px 10px;
  border-radius: 15px;
  display: inline-block;
  cursor: pointer;
}
.filter-btn {
  margin-right: 10px;
}
.filter-btn:last-child {
  margin-right: 0px;
}
.conditions {
  margin: 10px 0px;
}
.filter {
  margin-bottom: 5px;
}
.filter:last-child {
  margin-bottom: 0;
}
</style>
