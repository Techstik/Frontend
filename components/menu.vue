<template>
  <!-- <div>
    <div class="menu-container">
      <nuxt-link to="/jobs"><h4>Jobs</h4></nuxt-link>
      <nuxt-link to="/portfolio"><h4>Your Portfolio</h4></nuxt-link>
      <nuxt-link to="/api"><h4>API</h4></nuxt-link>
      <a-button type="danger">Post a Job</a-button>
    </div>
  </div> -->
  <div class="menu-container">
    <vsm-menu :menu="menu">
      <template #default="data">
        <div>{{ data.item.dropdown }}</div>
      </template>
      <template slot="after-nav">
        <vsm-mob>Mobile Content</vsm-mob>
      </template>
    </vsm-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menu: [
        { title: 'First item', dropdown: 'first' },
        { title: 'Second item', dropdown: 'second' },
        { title: 'No dropdown' }
      ]
    }
  }
}
</script>
<style scoped>
a {
  margin-right: 30px;
}
h4 {
  display: inline-block;
  margin-bottom: 0;
  cursor: pointer;
}
a:last-child {
  margin-right: 0px !important;
}

.menu-container {
  padding: 30px;
  text-align: right;
}
</style>
