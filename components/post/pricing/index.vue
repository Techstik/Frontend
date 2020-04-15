<template>
  <div>
    <a-row class="price-blocks" type="flex" align="middle">
      <a-col v-for="type in types" :key="type.id" :span="isMobile ? 24 : 12">
        <div
          :class="[{ active: selected == type }, 'price-block']"
          @click="selected = type"
        >
          <p class="price">{{ type.name }}</p>
          <h2 class="subheading mb-0">
            <span v-if="!type.discount_active">${{ type.price }}</span>
            <span v-else>
              <span class="strike">${{ type.price }} </span>
              {{
                type.discount_price == 0 ? 'FREE' : `$${type.discount_price}`
              }}
            </span>
          </h2>
          <div class="features small">
            <p v-for="feature in type.features" :key="feature.id">
              {{ feature }}
            </p>
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="mt-15">
      <label class="mb-10 d-block">Optional extras</label>
      <div v-if="poststats">
        <div v-for="extra in extras" :key="extra.id" class="optioanl-extras">
          <a-checkbox
            :checked="selectedExtras.includes(extra)"
            :disabled="poststats[extra.name] == 0"
            @change="updateExtras(extra)"
          ></a-checkbox>
          <span>
            <b>${{ extra.price }}</b> - {{ extra.description }}
            <small
              :class="{
                warning:
                  poststats[extra.name] > 0 && poststats[extra.name] <= 3,
                danger: poststats[extra.name] == 0
              }"
              ><b
                >({{
                  poststats // eslint-disable-next-line vue/no-parsing-error
                    ? poststats[extra.name] < 0
                      ? 0
                      : poststats[extra.name]
                    : 0
                }}
                slots available)</b
              ></small
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selected: null,
      extras: [
        {
          name: 'stick_1_week',
          price: 50,
          description: 'Stick your post to the top of our list for 1 week'
        },
        {
          name: 'stick_duration',
          price: 90,
          description:
            "Stick your post to the top of our list for it's duration (30 days)"
        }
      ],
      selectedExtras: []
    }
  },
  computed: {
    ...mapGetters({
      isMobile: 'isMobile'
    }),
    ...mapState({
      types: state => state.posttypes.all,
      poststats: state => state.poststatistics.all
    })
  },
  watch: {
    types(values) {
      this.selected = values.find(type => {
        return type.name == 'Premium'
      })
    },
    selected() {
      this.emit()
    }
  },
  created() {
    if (this.types)
      this.selected = this.types.find(type => {
        return type.name == 'Premium'
      })
  },
  methods: {
    updateExtras(option) {
      if (this.selectedExtras.includes(option)) this.selectedExtras = []
      else this.selectedExtras = [option]

      this.emit()
    },
    emit() {
      if (!this.selected) return

      let result = {
        name: this.selected.name
      }

      if (this.selected.discount_active)
        result.price = this.selected.discount_price
      else result.price = this.selected.price

      if (this.selectedExtras.length) {
        result.extras = []
        this.selectedExtras.forEach(extra => {
          result.extras.push(extra.name)
          result.price += extra.price
        })
      }

      this.$emit('input', result)
    }
  }
}
</script>
<style scoped>
.price-block {
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  cursor: pointer;
}
.price-block.active,
.price-block:hover {
  background: #fcd669;
}
.price-block h2 {
  text-align: center;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
}
.price-block .features {
  text-align: center;
  margin: 10px 0px;
}
.price-block .features p {
  font-size: 85%;
}
.price-block .features p:last-child {
  margin: 0;
}
.price-block .price {
  text-align: center;
  font-family: 'Graphik-Bold', 'Helvetica Neue', helvetica, 'Apple Color Emoji',
    arial, sans-serif;
  color: black;
  margin: 0px;
}
.price-blocks {
  max-width: 750px;
  margin: auto;
}
.warning {
  color: orange;
}
.danger {
  color: red;
}
.strike {
  text-decoration: line-through;
  color: grey;
  margin-right: 5px;
  font-size: 85%;
}
.optioanl-extras {
  font-size: 85%;
  color: black;
}
@media (max-width: 750px) {
  .price-block {
    padding: 10px;
    margin-bottom: 10px;
  }
}
</style>
