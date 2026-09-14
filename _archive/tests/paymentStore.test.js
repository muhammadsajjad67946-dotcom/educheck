import test from 'node:test'
import assert from 'node:assert/strict'

import { saveStripePaymentRecord } from './paymentStore.js'

test('saveStripePaymentRecord inserts a paid payment using Stripe checkout session data', async () => {
  const calls = []
  const fakePool = {
    query: async (sql, params) => {
      calls.push({ sql, params })
      if (/SELECT id FROM payments/i.test(sql)) return [[]]
      return [{ insertId: 42 }]
    },
  }

  const session = {
    id: 'cs_test_123',
    payment_intent: 'pi_test_123',
    metadata: { studentId: '7' },
    amount_total: 350000,
    currency: 'PKR',
  }

  const result = await saveStripePaymentRecord(fakePool, session)

  assert.equal(result, true)
  assert.equal(calls.length, 3)
  assert.match(calls[1].sql, /INSERT INTO payments \(user_id, stripe_payment_id, amount, currency, status, description, payment_date\)/i)
  assert.deepEqual(calls[1].params, [7, 'pi_test_123', 3500, 'PKR', 'EduCheck Mathematics Assessment'])
  assert.match(calls[2].sql, /INSERT INTO subscriptions \(user_id, plan_name, price, start_date, end_date, is_active\)/i)
  assert.deepEqual(calls[2].params, [7, 'monthly', 3500])
})

test('saveStripePaymentRecord ignores invalid sessions', async () => {
  const fakePool = {
    query: async () => {
      throw new Error('should not be called')
    },
  }

  const result = await saveStripePaymentRecord(fakePool, {
    metadata: {},
    amount_total: 0,
  })

  assert.equal(result, false)
})
