<template>
  <div>
    <div class="experience-level">
      <a-checkbox
        :default-checked="true"
        @change="updateSelection('entry-level')"
      ></a-checkbox>
      <p>Entry-level</p>
      <a-progress
        :stroke-width="15"
        stroke-color="#b4dfe5"
        :percent="33"
        :show-info="false"
      />
    </div>
    <div class="experience-level">
      <a-checkbox @change="updateSelection('intermediate')"></a-checkbox>
      <p>Intermediate</p>
      <a-progress
        :stroke-width="15"
        stroke-color="#f3976b"
        :percent="66"
        :show-info="false"
      />
    </div>
    <div class="experience-level">
      <a-checkbox @change="updateSelection('senior')"></a-checkbox>
      <p>Senior</p>
      <a-progress
        :stroke-width="15"
        stroke-color="#161d2d"
        :percent="100"
        :show-info="false"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      selectedExperience: ['entry-level']
    }
  },
  created() {
    this.$emit('input', this.selectedExperience)
  },
  methods: {
    updateSelection(experience) {
      if (this.selectedExperience.includes(experience)) {
        this.selectedExperience = this.lodash.remove(
          this.selectedExperience,
          existing => {
            return existing !== experience
          }
        )
      } else this.selectedExperience.push(experience)

      this.$emit('input', this.selectedExperience)
    }
  }
}
</script>
<style scoped>
.experience-level div {
  position: relative;
  width: calc(100% - 165px);
  font-size: 14px;
  float: right;
  margin-top: 5px;
}

.experience-level {
  margin-bottom: 10px;
}
.experience-level p {
  margin: 0;
  display: inline-block;
  font-size: 14px;
  width: 130px;
  font-family: Graphik-Bold;
  text-align: center;
}
</style>
<style>
.validation_error .ant-checkbox-inner {
  border-color: #fa755a;
  background-color: #fa755a;
}
</style>
