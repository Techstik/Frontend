<template>
  <div class="filter-container">
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
      <div
        v-for="filter in filters"
        :key="filter.name"
        :class="[{ active: filter.selected }, 'filter-btn']"
      >
        <span @click="filter.selected = !filter.selected">{{
          filter.name
        }}</span>
      </div>
    </div>
    <div v-if="selectedFilters.length" class="conditions">
      <p><b>Configure conditions:</b></p>
      <div v-for="filter in selectedFilters" :key="filter.name" class="filter">
        <a-row type="flex" align="middle">
          <a-col :span="isMobile ? 24 : 5">
            <div class="filter-btn no-hover align-center">
              <span>{{ filter.name }}</span>
            </div>
          </a-col>
          <a-col :span="isMobile ? 8 : 5" class="align-center">
            <div
              v-if="filter.conditions.length == 1"
              class="condition-container"
            >
              <b>{{ filter.conditions[0] ? filter.conditions[0] : 'only' }}</b>
            </div>
            <v-select
              v-else
              v-model="filter.selected_condition"
              class="vs-multiple height-max-30"
              append-to-body
              :calculate-position="dd_position_calc"
              placeholder="Select"
              :clearable="false"
              :options="filter.conditions"
            ></v-select>
          </a-col>
          <a-col :span="isMobile ? 16 : 14">
            <v-select
              v-if="filter.name == 'salary currency'"
              v-model="filter.values"
              class="vs-multiple"
              label="name"
              placeholder="Select currencies here"
              multiple
              append-to-body
              :calculate-position="dd_position_calc"
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
              append-to-body
              :calculate-position="dd_position_calc"
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
              append-to-body
              :calculate-position="dd_position_calc"
              :close-on-select="false"
              :options="countries"
            >
              <template
                v-slot:selected-option="option"
                v-bind="
                  typeof option === 'object' ? option : { [label]: option }
                "
              >
                <CountryFlag :country-code="option.code" :classes="['mr-15']" />
                <!-- <span
                  :class="
                    `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                  "
                ></span> -->
                {{ option.name }}
              </template>
              <template v-slot:option="option">
                <CountryFlag :country-code="option.code" :classes="['mr-15']" />
                <!-- <span
                  :class="
                    `flag-icon flag-icon-${option.code.toLowerCase()} mr-15`
                  "
                ></span> -->
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
              append-to-body
              :calculate-position="dd_position_calc"
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
              :disabled-date="disabledDates"
            />

            <a-input
              v-else-if="filter.conditions.includes('like')"
              v-model="filter.values"
            />
          </a-col>
        </a-row>
      </div>
      <div class="align-center mt-15">
        <a-button class="btn-yellow" @click="emit"
          >Apply filter{{ selectedFilters.length == 1 ? '' : 's' }}</a-button
        >
        <a-button class="btn-grey" @click="clearFilters"
          >Clear filter{{ selectedFilters.length == 1 ? '' : 's' }}</a-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import CountryFlag from '@/components/countryflag'
import { mapState, mapGetters } from 'vuex'
import { createPopper } from '@popperjs/core'

export default {
  components: {
    CountryFlag
  },
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
          values: [true],
          selected: false
        },
        {
          name: 'full-time',
          conditions: [''],
          values: [true],
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
          name: 'salary amount (/year)',
          conditions: ['more than', 'less than'],
          reduced_conditions: ['>', '<'],
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
          reduced_conditions: ['<', '>', '='],
          selected_condition: 'on',
          values: this.$moment(),
          selected: false
        }
      ],
      blanks: []
    }
  },
  computed: {
    ...mapGetters({
      isMobile: ['isMobile']
    }),
    ...mapState({
      tech: state =>
        state.tech.all.map(tech => {
          let result = {
            name: tech.name
          }
          if (tech.iconname) result.iconname = tech.iconname
          return result
        }),
      currencies: state => state.currencies.all,
      countries: state => state.countries.all
    }),
    selectedFilters() {
      return this.filters.filter(filt => {
        return filt.selected
      })
    }
  },
  watch: {
    selectedFilters(value) {
      if (!value.length) this.emit()
    }
  },
  created() {
    this.filters.find(filter => {
      return filter.name == 'tech stack'
    }).conditional_values = this.tech
    this.blanks = this.lodash.cloneDeep(this.filters)
  },
  methods: {
    onDateChange(date) {
      this.filters.find(filter => {
        return filter.name == 'date posted'
      }).values = date.toDate()
    },
    disabledDates(currentDate) {
      return (
        currentDate <
        this.$moment()
          .subtract(30, 'days')
          .endOf('day')
      )
    },
    clearFilters() {
      this.filters = this.lodash.cloneDeep(this.blanks)
    },
    emit() {
      let refined = this.selectedFilters
        .filter(filter => {
          return (
            filter.values.length ||
            (!Array.isArray(filter.values) &&
              !(typeof filter.values === 'string'))
          )
        })
        .map(filter => {
          return {
            name: filter.name,
            condition:
              filter.conditions.length == 1
                ? filter.conditions[0]
                : filter.selected_condition,
            values: filter.values
          }
        })
      this.$emit('filtersApplied', refined)
    },
    dd_position_calc(dropdownList, component, { width }) {
      dropdownList.style.width = width

      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -1]
            }
          },
          {
            name: 'toggleClass',
            enabled: true,
            phase: 'write',
            fn({ state }) {
              component.$el.classList.toggle(
                'drop-up',
                state.placement === 'top'
              )
            }
          }
        ]
      })

      return () => popper.destroy()
    }
  }
}
</script>
<style scoped>
.filter-container {
  font-size: 75%;
  color: white;
}
.filter-btn span {
  border: 1px solid #161d2d;
  padding: 3px 10px;
  border-radius: 15px;
  background-color: #161d2d;
  display: inline-block;
  cursor: pointer;
  color: white;
  margin: 3px 0px;
  transition: 200ms;
  padding: 0.2em 0.8em;
}
.filter-btn span:hover,
.filter-btn.active span {
  background-color: #fcd668;
  border-color: #fcd668;
  color: black;
}
.no-hover {
  pointer-events: none;
}
.filter-btn {
  margin-right: 10px;
  display: inline-block;
  /* line-height: 0; */
}
.filter-btn:last-child {
  margin-right: 0px;
}
.conditions {
  margin: 10px 0px;
}
.filter {
  margin-bottom: 1em;
}
.filter:last-child {
  margin-bottom: 0;
}
.condition-container {
  height: 30px;
  background: white;
  border-radius: 10px;
  text-align: left;
  padding: 0 1.5em;
  color: black;
  font-size: 75%;
  line-height: 30px;
}
</style>
<style>
.filter .vs__dropdown-toggle,
.filter .vs__search::placeholder {
  min-height: 30px;
  height: fit-content;
  padding: 0 10px !important;
}
.filter .vs__selected {
  height: 18px;
  margin: 5px 3px;
}
.filter .ant-input {
  height: 30px;
  margin-bottom: 0;
}
.vs__dropdown-menu {
  min-width: unset !important;
}
.height-max-30 .vs__dropdown-toggle,
.height-max-30 .vs__search::placeholder {
  max-height: 30px;
}
</style>
