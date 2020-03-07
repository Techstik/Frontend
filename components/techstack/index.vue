<template>
  <div class="tech-blocks">
    <a-row>
      <draggable v-model="selectedTech" class="inline" @change="emitChange">
        <span
          v-for="technology in selectedTech"
          :key="`selected_${technology.name}`"
          class="tech-block"
        >
          <div class="tech-icon">
            <i
              :class="[
                `devicon-${
                  technology.iconname
                    ? technology.iconname
                    : `${technology.name.toLowerCase().replace(/ /g, '')}-plain`
                }`,
                {
                  colored: selectedTech.includes(technology)
                }
              ]"
            ></i>
            <p>{{ technology.name }}</p>
          </div>
          <span
            title="Remove"
            class="ant-scroll-number ant-badge-count"
            data-show="true"
            @click="updateTech(technology)"
            >X</span
          >
        </span>
      </draggable>
      <span
        v-for="(placeholder, index) in placeholdersRequired"
        :key="`placeholder_${index}`"
        class="tech-block placeholder"
      >
        <div class="tech-icon">
          <i class="devicon-apache-plain"></i>
          <p>Apache</p>
        </div>
        <span
          title="Remove"
          class="ant-scroll-number ant-badge-count"
          data-show="true"
          @click="updateTech(technology)"
          >X</span
        >
      </span>
    </a-row>
    <a-input
      v-model="searchWord"
      placeholder="Search for something.."
      class="search"
    />
    <div
      v-for="technology in !searchWord
        ? tech
        : tech.filter(_tech => {
            return _tech.name.toLowerCase().includes(searchWord)
          })"
      :key="technology.name"
      :class="[
        {
          'tech-icon-active': selectedTech.includes(technology)
        },
        'tech-icon'
      ]"
      @click="updateTech(technology)"
    >
      <i
        :class="[
          `devicon-${
            technology.iconname
              ? technology.iconname
              : `${technology.name.toLowerCase().replace(/ /g, '')}-plain`
          }`,
          {
            colored: selectedTech.includes(technology)
          }
        ]"
      ></i>
      <p>{{ technology.name }}</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      selectedTech: [],
      searchWord: ''
    }
  },
  computed: {
    ...mapState({
      tech: state => state.tech.all
    }),
    placeholdersRequired() {
      return this.selectedTech.length > 2 ? 0 : 2 - this.selectedTech.length
    }
  },
  methods: {
    updateTech(tech) {
      if (this.selectedTech.includes(tech)) {
        this.selectedTech = this.lodash.remove(this.selectedTech, existing => {
          return existing !== tech
        })
      } else {
        this.selectedTech.push(tech)
      }
      this.emitChange()
    },
    emitChange() {
      this.$emit(
        'input',
        this.selectedTech.map(tech => {
          return tech.name
        })
      )
    }
  }
}
</script>
<style scoped>
.tech-blocks {
  text-align: center;
}
.tech-icon {
  width: fit-content;
  display: inline-block;
  border: 2px solid white;
  background: white;
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}
.tech-icon i {
  font-size: 65px;
}
.tech-icon:hover {
  border-color: #e4e4e4 !important;
}
.tech-icon p {
  font-size: 12px;
  font-family: Graphik-Bold;
  text-align: center;
  margin-bottom: 0px;
}
.tech-icon-active {
  border-width: 2px;
  background-color: #fcd669;
  border-color: #fcd669;
}
.tech-block {
  position: relative;
  display: inline-block;
}
.ant-badge-count {
  cursor: pointer;
}
.ant-badge-count {
  top: 5px;
  right: 5px;
}
.placeholder .tech-icon {
  color: transparent;
  background: transparent;
  border-color: #e4e4e4;
  cursor: unset;
}
.placeholder .ant-badge-count {
  background: transparent;
  color: transparent;
  box-shadow: none;
}
.highlighted {
  background-color: #9ab6f1;
}
.search {
  width: 50%;
  display: block;
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
