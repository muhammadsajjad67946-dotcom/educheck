export async function saveStripePaymentRecord(dbPool, session) {
  if (!dbPool || !session) return false

  const userId = Number(session.metadata?.studentId ?? session.metadata?.userId ?? session.metadata?.student_id ?? session.metadata?.user_id)
  const amountTotal = Number(session.amount_total ?? session.amount ?? 0)
  const amount = Number.isFinite(amountTotal) && amountTotal > 0 ? amountTotal / 100 : 0
  const stripePaymentId = session.payment_intent || session.id || session.metadata?.stripePaymentId || session.metadata?.paymentId
  const currency = String(session.currency || 'PKR').toUpperCase()
  const description = 'EduCheck Mathematics Assessment'
  const planName = 'monthly'

  if (!Number.isFinite(userId) || userId <= 0 || !stripePaymentId || !Number.isFinite(amount) || amount <= 0) {
    return false
  }

  try {
    const [existingRows] = await dbPool.query(
      'SELECT id FROM payments WHERE stripe_payment_id = ? LIMIT 1',
      [stripePaymentId],
    )

    if (existingRows.length) {
      if (Number(existingRows[0].user_id) !== userId || Number(existingRows[0].amount) !== Number(amount.toFixed(2))) {
        await dbPool.query(
          `UPDATE payments
           SET user_id = ?, amount = ?, currency = ?, status = 'paid', description = ?, payment_date = NOW()
           WHERE stripe_payment_id = ?`,
          [userId, Number(amount.toFixed(2)), currency, description, stripePaymentId],
        )
      }
      const [subscriptionRows] = await dbPool.query(
        `SELECT id FROM subscriptions
         WHERE user_id = ? AND plan_name = ?
         ORDER BY start_date DESC LIMIT 1`,
        [userId, planName],
      )

      if (subscriptionRows.length) {
        await dbPool.query(
          `UPDATE subscriptions
           SET price = ?, start_date = NOW(), end_date = DATE_ADD(NOW(), INTERVAL 30 DAY), is_active = 1
           WHERE id = ?`,
          [Number(amount.toFixed(2)), subscriptionRows[0].id],
        )
      } else {
        await dbPool.query(
          `INSERT INTO subscriptions (user_id, plan_name, price, start_date, end_date, is_active)
           VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1)`,
          [userId, planName, Number(amount.toFixed(2))],
        )
      }

      return true
    }

    await dbPool.query(
      `INSERT INTO payments (user_id, stripe_payment_id, amount, currency, status, description, payment_date)
       VALUES (?, ?, ?, ?, 'paid', ?, NOW())`,
      [userId, stripePaymentId, Number(amount.toFixed(2)), currency, description],
    )

    await dbPool.query(
      `INSERT INTO subscriptions (user_id, plan_name, price, start_date, end_date, is_active)
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 1)`,
      [userId, planName, Number(amount.toFixed(2))],
    )

    return true
  } catch (error) {
    console.error('Stripe payment record failed:', error)
    return false
  }
}
