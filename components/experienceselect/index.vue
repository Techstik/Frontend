<template>
  <div class="experience-select">
    <div
      v-if="(preview && selections.includes('entry-level')) || !preview"
      :class="[{ 'no-margin previewing': preview }, 'experience-level']"
    >
      <a-checkbox
        v-if="!preview"
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
    <div
      v-if="(preview && selections.includes('intermediate')) || !preview"
      :class="[{ 'no-margin previewing': preview }, 'experience-level']"
    >
      <a-checkbox
        v-if="!preview"
        @change="updateSelection('intermediate')"
      ></a-checkbox>
      <p>Intermediate</p>
      <a-progress
        :stroke-width="15"
        stroke-color="#f3976b"
        :percent="66"
        :show-info="false"
      />
    </div>
    <div
      v-if="(preview && selections.includes('senior')) || !preview"
      :class="[{ 'no-margin previewing': preview }, 'experience-level']"
    >
      <a-checkbox
        v-if="!preview"
        @change="updateSelection('senior')"
      ></a-checkbox>
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
    },
    selections: {
      type: Array,
      default: null
    },
    preview: {
      type: Boolean,
      default: false
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
.no-margin div {
  margin-top: 0px;
}
.experience-level {
  margin-bottom: 10px;
}
.experience-level p {
  margin: 0;
  display: inline-block;
  font-size: 14px;
  width: 130px;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  text-align: center;
}
@media (max-width: 750px) {
  .experience-level.previewing p {
    display: block;
    text-align: left;
    width: 105px;
  }
  .experience-level.previewing div {
    width: 100%;
    float: left;
  }
  .ant-progress-bg {
    height: 12px !important;
  }
}
</style>
<style>
.validation_error .ant-checkbox-inner {
  border-color: #fa755a;
  background-color: #fa755a;
}
@media (max-width: 750px) {
  .experience-select .ant-progress-bg {
    height: 12px !important;
  }
}
</style>
