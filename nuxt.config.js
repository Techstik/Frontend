module.exports = {
  mode: 'spa',
  env: {
    DEVELOPMENT: process.env.NODE_ENV !== 'production',
    GOOGLE_API_KEY: 'AIzaSyDVa0vRTfMXY1qBXz1ctMDHZGpPhC6TRvU',
    LOCATION_IQ_API_KEY: '96fbe635b05579',
    MAPBOX_ACCESS_TOKEN:
      'pk.eyJ1IjoibWF0dC1ncmVwcGwiLCJhIjoiY2s1ZTYxbHhvMXZvMzNqcmY0amtoMWg2YSJ9.9hJ2XBQZxFIoxhwbB1Pb4w'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: 'https://js.stripe.com/v3/' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'ant-design-vue/dist/antd.css',
    '@/assets/styles/layout.css',
    '@/assets/styles/ant-overrides.css',
    '@/assets/styles/site-wide.css',
    '@/assets/styles/grid.css',
    '@/assets/styles/currency-flags.min.css',
    '@/node_modules/flag-icon-css/css/flag-icon.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/firebase',
    '@/plugins/vuex-seed',
    '@/plugins/lodash',
    '@/plugins/moment',
    '@/plugins/vuelidate',
    '@/plugins/vue-select',
    '@/plugins/devicon',
    //==== INJECTIONS =======
    '@plugins/injections/storage',
    '@plugins/injections/firestore',
    '@plugins/injections/locationservices'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    ['vue-scrollto/nuxt', { duration: 300, offset: -100 }],
    [
      'vue-currency-input/nuxt',
      { globalOptions: { allowNegative: false, currency: null } }
    ]
  ],

  toast: {
    position: 'top-center',
    duration: 3000,
    keepOnHover: true,
    className: 'toast'
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  }
}
