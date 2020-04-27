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
          '🚀 Explore remote and location-based tech opportunities around the world. A hub for Software Developers, Designers, DevOps and more. With upfront salary offers and tech stack transparency, your search ends here.'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        property: 'og:description',
        content:
          '🚀 Explore remote and location-based tech opportunities around the world. A hub for Software Developers, Designers, DevOps and more. With upfront salary offers and tech stack transparency, your search ends here.'
      },
      {
        hid: 'og:url',
        name: 'og:url',
        property: 'og:url',
        content: 'https://techstik.com'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        property: 'og:title',
        content: 'Techstik | Tech Jobs Around the World'
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        property: 'og:site_name',
        content: 'Techstik'
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: 'https://techstik.com/web-icon.png'
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
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff',
        href:
          '/fonts/Graphik-Bold-Web-1e0056812ec1e2fd3dc9ef458b15a188a912570556fff0b5f721c549f865ccf4.woff',
        crossorigin: true
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff',
        href:
          '/fonts/Graphik-Regular-Web-36a20ba0e775b202ea4c516e93a90b390a3ae495d69b0854e66d744f601327c5.woff',
        crossorigin: true
      },
      {
        rel: 'preconnect',
        href: 'https://www.google-analytics.com'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://www.google-analytics.com'
      },
      {
        rel: 'preconnect',
        href: 'https://firestore.googleapis.com'
      },
      {
        rel: 'dns-prefetch',
        href: 'https://firestore.googleapis.com'
      }
    ],
    script: [
      {
        innerHTML:
          '{"@context":"http://schema.org","@type":"Organization","name":"Techstik","url":"https://techstik.com","logo":"https://techstik.com/web-icon.png","sameAs":["https://twitter.com/Techstik_Jobs"],"contactPoint":[{"@type":"ContactPoint","email":"team@techstik.com","contactType":"customer support","url":"https://techstik.com/support"}]}',
        type: 'application/ld+json'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f3976b' },
  /*
   ** Global CSS
   */
  css: [
    'ant-design-vue/dist/antd.min.css',
    '@/assets/styles/layout.css',
    '@/assets/styles/ant-overrides.css',
    '@/assets/styles/site-wide.css',
    '@/assets/styles/grid.css',
    '@/assets/styles/currency-flags.min.css',
    '@/assets/styles/skeleton.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/injections/bugsnag.js',
    '@/plugins/firebase.js',
    '@plugins/injections/firebase.js',
    '@plugins/injections/locationservices.js',
    '@plugins/injections/eventBus.js',
    '@plugins/injections/localStorage.js',
    '@/plugins/packages.js',
    '@/plugins/vuex-seed.js',
    '@/plugins/filters.js'
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

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    // analyze: true,
    cache: true,
    babel: {
      plugins: [['import', { libraryName: 'ant-design-vue/lib', style: 'css' }]]
    },
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  }
}
