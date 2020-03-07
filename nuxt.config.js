module.exports = {
  mode: 'spa',
  env: {
    DEVELOPMENT: process.env.NODE_ENV !== 'production',
    GOOGLE_API_KEY: 'AIzaSyDVa0vRTfMXY1qBXz1ctMDHZGpPhC6TRvU',
    LOCATION_IQ_API_KEY: '96fbe635b05579',
    reCAPTCHA_SITE_KEY: '6LcuONkUAAAAACcZcOapQiTVOWz52mAUWU-G2Daj',
    reCAPTCHA_SECRET_KEY: '6LcuONkUAAAAAK2Rej6Gr7AvR9B2ZjUYMPQC9N8r'
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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
    '@/assets/styles/grid.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/firebase',
    '@/plugins/snapshot-subscriptions',
    '@/plugins/lodash',
    '@/plugins/moment',
    '@/plugins/vuelidate',
    '@/plugins/vue-select',
    '@/plugins/devicon'
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
