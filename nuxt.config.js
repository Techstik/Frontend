module.exports = {
  mode: 'spa',
  env: {
    DEVELOPMENT: process.env.NODE_ENV !== 'production',
    GOOGLE_API_KEY: 'AIzaSyDVa0vRTfMXY1qBXz1ctMDHZGpPhC6TRvU',
    LOCATION_IQ_API_KEY: '96fbe635b05579',
    BUGSNAG_KEY: '645bb4eb67f94b231df6229fa34acdd4',
    MAPBOX_ACCESS_TOKEN:
      'pk.eyJ1IjoibWF0dC1ncmVwcGwiLCJhIjoiY2s1ZTYxbHhvMXZvMzNqcmY0amtoMWg2YSJ9.9hJ2XBQZxFIoxhwbB1Pb4w',
    ALGOLIA_APP_ID: 'I37MW9PNFT',
    ALGOLIA_SEARCH_KEY: '5d53904af631e8943798b04607dbfcce'
  },
  head: {
    title: 'Techstik | Tech Jobs Around the World',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Explore remote and location-based tech opportunities around the world. A hub for Software Developers, Designers, DevOps and more. With upfront salary offers and tech stack transparency, your search ends here.'
      }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' }
    ],
    script: [{ src: 'https://js.stripe.com/v3/' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f3976b' },
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
    '@/node_modules/flag-icon-css/css/flag-icon.min.css',
    '@/assets/styles/skeleton.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/injections/bugsnag.js',
    '@/plugins/firebase.js',
    '@plugins/injections/storage.js',
    '@plugins/injections/firestore.js',
    '@plugins/injections/locationservices.js',
    '@plugins/injections/eventBus.js',
    '@plugins/injections/localStorage.js',
    '@plugins/injections/analytics.js',
    '@/plugins/antd-ui.js',
    '@/plugins/vuex-seed.js',
    '@/plugins/lodash.js',
    '@/plugins/moment.js',
    '@/plugins/vuelidate.js',
    '@/plugins/vue-select.js',
    '@/plugins/devicon.js',
    '@/plugins/filters.js',
    '@/plugins/lazy-load.js'
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
    '@nuxtjs/sitemap',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    ['vue-scrollto/nuxt', { duration: 300, offset: -100 }],
    [
      'vue-currency-input/nuxt',
      { globalOptions: { allowNegative: false, currency: null } }
    ]
  ],

  sitemap: {
    hostname: 'https://techstik.com',
    exclude: ['/leads/**', '/post-a-job/adminbypass/**', '/previewpost__/**'],
    gzip: true
  },

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
