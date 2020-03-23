<template>
  <div>
    <p>
      <b>
        {{
          selectedFilters.length
            ? 'Select another field:'
            : 'Start by selecting a field:'
        }}</b
      >
    </p>
    <div class="align-center">
      <span
        v-for="filter in filters"
        :key="filter.name"
        :class="[{ active: filter.selected }, 'filter-btn']"
      >
        <div @click="filter.selected = !filter.selected">{{ filter.name }}</div>
      </span>
    </div>
    <div v-if="selectedFilters.length" class="conditions">
      <p><b>Configure conditions:</b></p>
      <div v-for="filter in selectedFilters" :key="filter.name" class="filter">
        <a-row type="flex" align="middle">
          <a-col :span="5">
            <span class="filter-btn no-hover align-center">
              <div>{{ filter.name }}</div>
            </span>
          </a-col>
          <a-col :span="5" class="align-center">
            <span v-if="filter.conditions.length == 1">{{
              filter.conditions[0]
            }}</span>
            <v-select
              v-else
              v-model="filter.selected_condition"
              class="vs-multiple"
              placeholder="Select"
              :clearable="false"
              :options="filter.conditions"
            ></v-select>
          </a-col>
          <a-col :span="14">
            <v-select
              v-if="filter.name == 'salary currency'"
              v-model="filter.values"
              class="vs-multiple"
              label="name"
              placeholder="Select currencies here"
              multiple
              :close-on-select="false"
              :options="currencies"
            >
            </v-select>

            <v-select
              v-else-if="filter.name == 'tech stack'"
              v-model="filter.values"
              class="vs-multiple"
              taggable
              label="name"
              placeholder="Select tech here"
              multiple
              :close-on-select="false"
              :options="tech"
            >
              <template
                v-slot:selected-option="option"
                v-bind="
                  typeof option === 'object' ? option : { [label]: option }
                "
              >
                <span
                  :class="[
                    `devicon-${
                      option.iconname
                        ? option.iconname
                        : `${option.name.toLowerCase().replace(/ /g, '')}-plain`
                    }`,
                    'colored'
                  ]"
                ></span>
                {{ option.name }}
              </template>
              <template v-slot:option="option">
                <span
                  :class="[
                    `devicon-${
                      option.iconname
                        ? option.iconname
                        : `${option.name.toLowerCase().replace(/ /g, '')}-plain`
                    }`,
                    'colored'
                  ]"
                ></span>
                {{ option.name }}
              </template>
            </v-select>

            <v-select
              v-else-if="filter.name == 'country'"
              v-model="filter.values"
              class="vs-multiple"
              label="name"
              placeholder="Select countries here"
              multiple
              :close-on-select="false"
              :options="countries"
            >
              <template
                v-slot:selected-option="option"
                v-bind="
                  typeof option === 'object' ? option : { [label]: option }
                "
              >
                <span
                  :class="
                    `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                  "
                ></span>
                {{ option.name }}
              </template>
              <template v-slot:option="option">
                <span
                  :class="
                    `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                  "
                ></span>
                {{ option.name }}
              </template>
            </v-select>

            <v-select
              v-else-if="filter.conditions.includes('includes')"
              v-model="filter.values"
              :taggable="filter.allowCustom"
              label="name"
              class="vs-multiple"
              placeholder="Select values here"
              multiple
              :close-on-select="false"
              :options="filter.conditional_values"
            ></v-select>

            <input
              v-else-if="filter.name.includes('salary amount')"
              v-model="filter.values"
              v-currency="{
                precision: 0
              }"
              class="ant-input"
            />

            <a-date-picker
              v-else-if="filter.name.includes('date')"
              v-model="filter.values"
              :default-value="$moment()"
              format="DD MMMM YYYY"
              :allow-clear="false"
            />

            <a-input
              v-else-if="filter.conditions.includes('like')"
              v-model="filter.value"
            />
          </a-col>
        </a-row>
      </div>
      <div class="align-center mt-15">
        <a-button class="btn-yellow" @click="emit"
          >Apply filter{{ selectedFilters.length == 1 ? '' : 's' }}</a-button
        >
        <a-button class="btn-grey"
          >Clear filter{{ selectedFilters.length == 1 ? '' : 's' }}</a-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      filters: [
        {
          name: 'tech stack',
          conditions: ['includes'],
          allowCustom: true,
          values: [],
          selected: false
        },
        {
          name: 'experience',
          conditions: ['includes'],
          conditional_values: ['entry-level', 'intermediate', 'senior'],
          values: [],
          selected: false
        },
        {
          name: 'contract',
          conditions: [''],
          selected: false
        },
        {
          name: 'full-time',
          conditions: [''],
          selected: false
        },
        {
          name: 'city',
          conditions: ['like'],
          values: '',
          selected: false
        },
        {
          name: 'country',
          conditions: ['includes'],
          values: '',
          selected: false
        },
        {
          name: 'salary currency',
          conditions: ['includes'],
          values: [],
          selected: false
        },
        {
          name: 'salary amount (p.a.)',
          conditions: ['more than', 'less than'],
          selected_condition: 'more than',
          values: 10000,
          selected: false
        },
        {
          name: 'company size',
          conditions: ['includes'],
          conditional_values: [
            '1-10',
            '11-50',
            '51-200',
            '201-500',
            '501-1,000',
            '1,001-5,000',
            '5,001-10,000',
            '10,001+'
          ],
          values: [],
          selected: false
        },
        {
          name: 'date posted',
          conditions: ['before', 'after', 'on'],
          selected_condition: 'on',
          values: this.$moment(),
          selected: false
        }
      ]
    }
  },
  computed: {
    ...mapState({
      tech: state => state.tech.all,
      currencies: state => state.currencies.all,
      countries: state => state.countries.all
    }),
    selectedFilters() {
      return this.filters.filter(filt => {
        return filt.selected
      })
    }
  },
  created() {
    this.filters.find(filter => {
      return filter.name == 'tech stack'
    }).conditional_values = this.tech
  },
  methods: {
    onDateChange(date) {
      this.filters.find(filter => {
        return filter.name == 'date posted'
      }).values = date.toDate()
    },
    emit() {
      this.$emit('filtersApplied', this.selectedFilters)
    }
  }
}
</script>
<style scoped>
.filter-btn div {
  border: 1px solid #161d2d;
  padding: 3px 10px;
  border-radius: 15px;
  background-color: #161d2d;
  display: inline-block;
  cursor: pointer;
  color: white;
  margin: 3px 0px;
  transition: 200ms;
}
.filter-btn div:hover,
.filter-btn.active div {
  background-color: #fcd668;
  border-color: #fcd668;
  color: black;
}
.no-hover {
  pointer-events: none;
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
<style>
.filter .vs__dropdown-toggle,
.filter .vs__search::placeholder {
  min-height: 30px;
  height: fit-content;
  font-size: 13px;
  padding: 0 10px !important;
}
.filter .vs__selected {
  height: 18px;
  font-size: 12px;
  margin: 5px 3px;
}
.filter .ant-input {
  height: 30px;
  font-size: 13px;
  margin-bottom: 0;
}
</style>
