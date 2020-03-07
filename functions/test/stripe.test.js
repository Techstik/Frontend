const test = require('firebase-functions-test')()
test.mockConfig({
  stripe: {
    publishable_key: 'pk_test_30FHQUHqtO2LVy8KXvUknGDr00p9KeSeXQ',
    secret_key: 'sk_test_NPauJg1IIZDBG63PumdKAiY1007n7nJynP',
    signing_secret_key: 'whsec_aUGn3GCfwDDyYNpWFTAWll5EXpfYxczY'
  }
})
const stripe_functions = require('../stripe.js')

describe('Create Payment Intent', () => {
  it('standard completion', async () => {
    const wrapper = test.wrap(stripe_functions.create_payment_intent)

    let result = await wrapper({
      amount: 100,
      currency: 'USD',
      description: 'UNIT TEST : CREATING PAYMENT INTENT - IGNORE'
    })

    expect(result.success).toBeTruthy()
    expect(result.data).toHaveProperty('clientSecret')
    expect(result.data).toHaveProperty('publishableKey')
    expect(result.data).toHaveProperty('paymentIntentId')
    expect(result.data.clientSecret).not.toBeNull()
    expect(result.data.publishableKey).not.toBeNull()
    expect(result.data.paymentIntentId).not.toBeNull()
    expect(result.data.clientSecret).not.toHaveLength(3)
    expect(result.data.publishableKey).not.toHaveLength(3)
    expect(result.data.paymentIntentId).not.toHaveLength(3)
  })

  it('big completion', async () => {
    const wrapper = test.wrap(stripe_functions.create_payment_intent)

    let result = await wrapper({
      amount: 100000,
      currency: 'ZAR',
      description: 'UNIT TEST : CREATING PAYMENT INTENT - IGNORE'
    })

    expect(result.success).toBeTruthy()
    expect(result.data).toHaveProperty('clientSecret')
    expect(result.data).toHaveProperty('publishableKey')
    expect(result.data).toHaveProperty('paymentIntentId')
    expect(result.data.clientSecret).not.toBeNull()
    expect(result.data.publishableKey).not.toBeNull()
    expect(result.data.paymentIntentId).not.toBeNull()
    expect(result.data.clientSecret).not.toHaveLength(3)
    expect(result.data.publishableKey).not.toHaveLength(3)
    expect(result.data.paymentIntentId).not.toHaveLength(3)
  })

  it('unsupported currency code', async () => {
    const wrapper = test.wrap(stripe_functions.create_payment_intent)

    let result = await wrapper({
      amount: 100,
      currency: 'USDT',
      description: 'UNIT TEST : CREATING PAYMENT INTENT - IGNORE'
    })

    expect(result.success).not.toBeTruthy()
    expect(result.data.type).toBe('StripeInvalidRequestError')
    expect(result.data.raw.message).toContain('Invalid currency')
  })

  it('negative amount', async () => {
    const wrapper = test.wrap(stripe_functions.create_payment_intent)

    let result = await wrapper({
      amount: -1,
      currency: 'USD',
      description: 'UNIT TEST : CREATING PAYMENT INTENT - IGNORE'
    })

    expect(result.success).not.toBeTruthy()
    expect(result.data.type).toBe('StripeInvalidRequestError')
    expect(result.data.raw.code).toBe('parameter_invalid_integer')
  })

  it('zero amount', async () => {
    const wrapper = test.wrap(stripe_functions.create_payment_intent)

    let result = await wrapper({
      amount: 0,
      currency: 'USD',
      description: 'UNIT TEST : CREATING PAYMENT INTENT - IGNORE'
    })

    expect(result.success).not.toBeTruthy()
    expect(result.data.type).toBe('StripeInvalidRequestError')
    expect(result.data.raw.code).toBe('parameter_invalid_integer')
  })

  test.cleanup()
})

describe('Update Payment Intent', () => {
  it('successfull update', async () => {
    const wrapper_create = test.wrap(stripe_functions.create_payment_intent)
    const wrapper_update = test.wrap(stripe_functions.update_payment_intent)

    let create_result = await wrapper_create({
      amount: 100,
      currency: 'USD'
    })

    expect(create_result.success).toBeTruthy()
    expect(create_result.data).toHaveProperty('clientSecret')
    expect(create_result.data).toHaveProperty('publishableKey')
    expect(create_result.data).toHaveProperty('paymentIntentId')
    expect(create_result.data.clientSecret).not.toBeNull()
    expect(create_result.data.publishableKey).not.toBeNull()
    expect(create_result.data.paymentIntentId).not.toBeNull()
    expect(create_result.data.clientSecret).not.toHaveLength(3)
    expect(create_result.data.publishableKey).not.toHaveLength(3)
    expect(create_result.data.paymentIntentId).not.toHaveLength(3)

    let update_result = await wrapper_update({
      id: create_result.data.paymentIntentId,
      data: {
        description: 'UNIT TEST : UPDATING PAYMENT INTENT - IGNORE'
      }
    })

    expect(update_result.success).toBeTruthy()
  })

  test.cleanup()
})

describe('Create Customer', () => {
  it('successfull create', async () => {
    const wrapper = test.wrap(stripe_functions.create_customer)

    let result = await wrapper({
      email: 'unit.test@hotmail.com',
      description: 'UNIT TEST : CREATING CUSTOMER - IGNORE'
    })

    expect(result.success).toBeTruthy()
    expect(result.data).toHaveProperty('id')
    expect(result.data.id).toContain('cus_')
    expect(result.data.object).toBe('customer')
  })

  test.cleanup()
})

describe('List Customers', () => {
  it('successfull request - no parameters', async () => {
    const wrapper = test.wrap(stripe_functions.list_customers)

    let result = await wrapper()

    expect(result.success).toBeTruthy()
    expect(result.data.data).not.toEqual([])
  })

  it('successfull request - email', async () => {
    const wrapper = test.wrap(stripe_functions.list_customers)

    let result = await wrapper({ email: 'unit.test@hotmail.com' })

    expect(result.success).toBeTruthy()
    expect(result.data.data).not.toEqual([])
  })

  it('successfull request - limit', async () => {
    const wrapper = test.wrap(stripe_functions.list_customers)

    let result = await wrapper({ limit: 2 })

    expect(result.success).toBeTruthy()
    expect(result.data.data.length).toBe(2)
  })

  test.cleanup()
})
