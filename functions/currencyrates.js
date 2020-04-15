const firebase_functions = require('firebase-functions')
const firebase_admin = require('firebase-admin')
const axios = require('axios')

const runtimeOpts = {
  timeoutSeconds: 200
}

exports.fetch = firebase_functions
  .runWith(runtimeOpts)
  .pubsub.schedule('every 12 hours')
  .onRun(async () => {
    if (firebase_functions.config().base.environment !== 'production')
      return true

    const codes = [
      'AFN',
      'ALL',
      'DZD',
      'AOA',
      'ARS',
      'AMD',
      'AWG',
      'AUD',
      'AZN',
      'BSD',
      'BHD',
      'BDT',
      'BBD',
      'BZD',
      'BMD',
      'BTN',
      'BOB',
      'BAM',
      'BWP',
      'BRL',
      'GBP',
      'BND',
      'BGN',
      'MMK',
      'BIF',
      'XPF',
      'KHR',
      'CAD',
      'CVE',
      'KYD',
      'XAF',
      'CLP',
      'CNY',
      'COP',
      'KMF',
      'CDF',
      'CRC',
      'HRK',
      'CZK',
      'DKK',
      'DJF',
      'DOP',
      'XCD',
      'EGP',
      'ERN',
      'ETB',
      'EUR',
      'FKP',
      'FJD',
      'GMD',
      'GEL',
      'GHS',
      'GIP',
      'GTQ',
      'GNF',
      'GYD',
      'HTG',
      'HNL',
      'HKD',
      'HUF',
      'ISK',
      'INR',
      'IDR',
      'IRR',
      'IQD',
      'ILS',
      'JMD',
      'JPY',
      'JOD',
      'KZT',
      'KES',
      'KWD',
      'KGS',
      'LAK',
      'LBP',
      'LRD',
      'LYD',
      'MOP',
      'MKD',
      'MGA',
      'MWK',
      'MYR',
      'MVR',
      'MRO',
      'MUR',
      'MXN',
      'MDL',
      'MNT',
      'MAD',
      'MZN',
      'NAD',
      'NPR',
      'ANG',
      'BYN',
      'TWD',
      'NZD',
      'NIO',
      'NGN',
      'KPW',
      'NOK',
      'OMR',
      'PKR',
      'PGK',
      'PYG',
      'PEN',
      'PHP',
      'PLN',
      'QAR',
      'RON',
      'RUB',
      'RWF',
      'SHP',
      'WST',
      'STD',
      'SAR',
      'RSD',
      'SCR',
      'SLL',
      'SBD',
      'SOS',
      'ZAR',
      'KRW',
      'LKR',
      'SRD',
      'SZL',
      'SEK',
      'CHF',
      'SYP',
      'TJS',
      'TZS',
      'THB',
      'TOP',
      'TTD',
      'TND',
      'TRY',
      'UGX',
      'UAH',
      'AED',
      'USD',
      'UYU',
      'UZS',
      'VUV',
      'VEF',
      'VND',
      'XOF',
      'YER',
      'ZMW'
    ]

    for (var i = 0; i < codes.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await axios
        .get(
          `http://data.fixer.io/api/latest?access_key=${
            firebase_functions.config().fixer.access_key
          }&base=${codes[i]}&symbols=${codes.join()}`
        )
        .then(response => {
          if (!response.data.success) return false

          response.data.timestamp = firebase_admin.firestore.Timestamp.fromDate(
            new Date(response.data.timestamp * 1000)
          )

          return firebase_admin
            .firestore()
            .collection('currencyrates')
            .doc(`${response.data.base}rates`)
            .set(response.data)
        })
        .catch(error => {
          console.error(
            `Error fetching the latest rates for currency: ${error}`
          )
        })
    }

    return true
  })
