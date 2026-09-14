import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import Stripe from 'stripe'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { checkDatabase, pool } from './db.js'
import { getStudentCount } from './studentCount.js'
import { saveStripePaymentRecord } from './paymentStore.js'
import { generateDiagnosticsWithGemini, generateGeminiQuestions, generateGeminiReport } from './geminiReport.js'
import { isMailConfigured, sendContactEmails } from './mailer.js'
import { autoSeedDatabaseIfNeeded } from './autoSeed.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT || 4000)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const SUBSCRIPTION_PRICE_PKR = 3500
const SUBSCRIPTION_DAYS = 30

async function getSubscriptionStatus(userId) {
  const numericUserId = Number(userId)
  if (!Number.isInteger(numericUserId) || numericUserId < 1) {
    return { active: false, expiresAt: null, source: null }
  }

  const [payments] = await pool.query(
    `SELECT payment_date AS startedAt,
            DATE_ADD(payment_date, INTERVAL ${SUBSCRIPTION_DAYS} DAY) AS expiresAt
     FROM payments
     WHERE user_id = ? AND amount >= ? AND currency = 'PKR' AND status IN ('paid', 'completed')
     ORDER BY payment_date DESC LIMIT 1`,
    [numericUserId, SUBSCRIPTION_PRICE_PKR],
  )
  const payment = payments[0]

  const [subscriptions] = await pool.query(
    `SELECT start_date AS startedAt, end_date AS expiresAt
     FROM subscriptions
     WHERE user_id = ? AND is_active = 1 AND start_date <= NOW() AND (end_date IS NULL OR end_date >= NOW())
     ORDER BY end_date DESC LIMIT 1`,
    [numericUserId],
  )
  const subscription = subscriptions[0]
  const paymentExpiresAt = payment?.expiresAt ? new Date(payment.expiresAt) : null
  const subscriptionExpiresAt = subscription?.expiresAt ? new Date(subscription.expiresAt) : null
  const expiresAt = [paymentExpiresAt, subscriptionExpiresAt]
    .filter((date) => date && !Number.isNaN(date.getTime()))
    .sort((first, second) => second - first)[0] || null
  const hasActiveSubscription = Boolean(subscription && (!subscriptionExpiresAt || subscriptionExpiresAt > new Date()))

  return {
    active: Boolean((expiresAt && expiresAt > new Date()) || hasActiveSubscription),
    expiresAt: expiresAt?.toISOString() || null,
    source: hasActiveSubscription ? 'subscription' : payment ? 'payment' : null,
  }
}

function normalizeAssessmentTopic(topic) {
  const value = String(topic || '')
  if (/number|operation/i.test(value)) return 'Number & Operations'
  if (/algebra/i.test(value)) return 'Algebra'
  if (/geometry/i.test(value)) return 'Geometry'
  if (/measurement/i.test(value)) return 'Measurement'
  if (/data/i.test(value)) return 'Data Analysis'
  return value || 'Mathematics'
}

function inferQuestionSubtopic(questionText, topic) {
  const text = String(questionText || '').toLowerCase()
  const matches = [
    [/multipli|product|times|groups of/, 'Multiplication'],
    [/divid|quotient|shared equally|per each/, 'Division'],
    [/subtract|difference|minus|take away/, 'Subtraction'],
    [/add|sum|total|combine/, 'Addition'],
    [/fraction|numerator|denominator|equivalent/, 'Fractions'],
    [/decimal|tenths|hundredths/, 'Decimals'],
    [/place value|digit value|expanded form|rounding/, 'Place Value'],
    [/area|perimeter|volume|angle|triangle|circle|polygon/, 'Geometry and Measurement'],
    [/mean|median|mode|probability|bar graph|data|table/, 'Data Analysis'],
    [/equation|variable|expression|solve|unknown/, 'Expressions and Equations'],
  ]
  return matches.find(([pattern]) => pattern.test(text))?.[1] || `${normalizeAssessmentTopic(topic)} Skills`
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://educheck12.vercel.app',
  process.env.CLIENT_ORIGIN,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
  }),
)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return response.status(503).send('Stripe webhook is not configured.')
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error.message)
    return response.status(400).send(`Webhook Error: ${error.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const saved = await saveStripePaymentRecord(pool, session)

    if (!saved) {
      return response.status(400).send('Invalid checkout session metadata or payment already recorded.')
    }
  }

  return response.json({ received: true })
})
app.use(express.json({ limit: '1mb' }))

app.get('/api', (_request, response) => {
  response.json({ ok: true, service: 'EduCheck API', status: 'online' })
})

app.get('/api/contact', async (request, response) => {
  try {
    const status = String(request.query.status || '').trim()
    const conditions = status ? 'WHERE cm.status = ?' : ''
    const params = status ? [status] : []
    const [rows] = await pool.query(
      `SELECT cm.id, cm.user_id AS userId, cm.name, cm.email, cm.subject, cm.message,
              cm.status, cm.admin_notes AS adminNotes, cm.created_at AS createdAt,
              cm.updated_at AS updatedAt
       FROM contact_messages cm ${conditions} ORDER BY cm.created_at DESC`,
      params,
    )
    response.json(rows)
  } catch (error) {
    console.error('Contact messages load failed:', error.message)
    response.status(500).json({ message: 'Unable to load contact messages.' })
  }
})

app.get('/api/contact/:contactId', async (request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, user_id AS userId, name, email, subject, message, status,
              admin_notes AS adminNotes, created_at AS createdAt, updated_at AS updatedAt
       FROM contact_messages WHERE id = ?`,
      [request.params.contactId],
    )
    if (!rows.length) return response.status(404).json({ message: 'Contact message not found.' })
    response.json(rows[0])
  } catch (error) {
    console.error('Contact message load failed:', error.message)
    response.status(500).json({ message: 'Unable to load contact message.' })
  }
})

app.post('/api/contact', async (request, response) => {
  const { name, email, subject = 'General enquiry', message } = request.body || {}
  const cleanName = String(name || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanSubject = String(subject || 'General enquiry').trim().slice(0, 190)
  const cleanMessage = String(message || '').trim()
  if (!cleanName || !/^\S+@\S+\.\S+$/.test(cleanEmail) || !cleanMessage) {
    return response.status(400).json({ message: 'Name, valid email, and message are required.' })
  }

  try {
    const userId = Number(request.body?.userId)
    const [result] = await pool.query(
      'INSERT INTO contact_messages (user_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [Number.isInteger(userId) && userId > 0 ? userId : null, cleanName, cleanEmail, cleanSubject, cleanMessage],
    )
    const contact = { id: result.insertId, name: cleanName, email: cleanEmail, subject: cleanSubject, message: cleanMessage }
    let mail = { sent: false, reason: 'SMTP is not configured.' }
    try {
      mail = await sendContactEmails(contact)
    } catch (mailError) {
      console.error('Contact email delivery failed:', mailError.message)
      mail = { sent: false, reason: 'Message saved, but email delivery failed.' }
    }
    response.status(201).json({ message: 'Contact message saved successfully.', id: result.insertId, mailSent: mail.sent, mailMessage: mail.reason || null })
  } catch (error) {
    console.error('Contact message save failed:', error.message)
    response.status(500).json({ message: 'Unable to save contact message.' })
  }
})

app.put('/api/contact/:contactId', async (request, response) => {
  const { status, adminNotes } = request.body || {}
  const allowedStatuses = ['new', 'in_progress', 'resolved', 'archived']
  if (!allowedStatuses.includes(status)) return response.status(400).json({ message: 'Invalid contact message status.' })
  try {
    const [result] = await pool.query(
      'UPDATE contact_messages SET status = ?, admin_notes = ? WHERE id = ?',
      [status, String(adminNotes || '').trim() || null, request.params.contactId],
    )
    if (!result.affectedRows) return response.status(404).json({ message: 'Contact message not found.' })
    const [rows] = await pool.query('SELECT id, status, admin_notes AS adminNotes, updated_at AS updatedAt FROM contact_messages WHERE id = ?', [request.params.contactId])
    response.json(rows[0])
  } catch (error) {
    console.error('Contact message update failed:', error.message)
    response.status(500).json({ message: 'Unable to update contact message.' })
  }
})

app.delete('/api/contact/:contactId', async (request, response) => {
  try {
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [request.params.contactId])
    if (!result.affectedRows) return response.status(404).json({ message: 'Contact message not found.' })
    response.status(204).send()
  } catch (error) {
    console.error('Contact message delete failed:', error.message)
    response.status(500).json({ message: 'Unable to delete contact message.' })
  }
})

app.post('/api/reports/gemini', async (request, response) => {
  const { studentGrade, accuracy, questionReview = [] } = request.body
  const submittedReview = Array.isArray(questionReview)
    ? questionReview.filter((question) => question?.status === 'Wrong')
    : []

  if (!submittedReview.length) {
    return response.json({ report: { summary: 'No incorrect answers were recorded.', weakAreas: [], questionFeedback: [] } })
  }

  try {
    const questionIds = submittedReview
      .map((question) => Number(question.questionId ?? question.id))
      .filter((questionId) => Number.isInteger(questionId) && questionId > 0)

    let correctAnswersById = new Map()
    if (questionIds.length) {
      const placeholders = questionIds.map(() => '?').join(', ')
      const [rows] = await pool.query(
        `SELECT id, correct_answer FROM questions WHERE id IN (${placeholders})`,
        questionIds,
      )
      correctAnswersById = new Map(rows.map((row) => [Number(row.id), String(row.correct_answer || '').trim().toUpperCase()]))
    }

    const review = submittedReview.map((question) => {
      const questionId = Number(question.questionId ?? question.id)
      const databaseAnswer = correctAnswersById.get(questionId) || null
      const correctAnswer = databaseAnswer || question.correct_answer || question.correctAnswer || question.answer || null
      const selectedAnswer = String(question.selectedAnswer || '').trim().toUpperCase()
      return {
        ...question,
        correct_answer: correctAnswer,
        status: selectedAnswer ? (selectedAnswer === correctAnswer ? 'Correct' : 'Wrong') : 'Unanswered',
      }
    }).filter((question) => question.correct_answer && question.status === 'Wrong')

    const report = await generateGeminiReport({ studentGrade, accuracy, questionReview: review })
    const answerByQuestionId = new Map(review.map((question) => [String(question.questionId ?? question.id), question.correct_answer]))
    report.questionFeedback = Array.isArray(report.questionFeedback)
      ? report.questionFeedback.map((feedback) => ({
        ...feedback,
        correctAnswer: answerByQuestionId.get(String(feedback.questionId)) || feedback.correctAnswer,
      }))
      : []
    return response.json({ report })
  } catch (error) {
    console.error('Gemini report generation failed:', error.message)
    return response.status(502).json({ message: 'Gemini report generation is temporarily unavailable.' })
  }
})

app.get('/api/health', async (_request, response) => {
  try {
    await checkDatabase()
    response.json({ ok: true, database: 'connected' })
  } catch (error) {
    response.status(503).json({ ok: false, database: 'disconnected', error: error.message })
  }
})

app.get('/api/profile', async (request, response) => {
  const userId = Number(request.query.userId)
  if (!Number.isInteger(userId) || userId < 1) {
    return response.status(400).json({ message: 'User is required.' })
  }

  try {
    const [[profile]] = await pool.query(
      `SELECT u.id, u.name, u.email, sp.age, sp.grade, sp.actual_grade AS actualGrade,
              sp.current_difficulty AS currentDifficulty
       FROM users u
       LEFT JOIN student_profiles sp ON sp.user_id = u.id
       WHERE u.id = ? AND u.status = 'active'`,
      [userId],
    )
    if (!profile) return response.status(404).json({ message: 'Profile not found.' })
    return response.json(profile)
  } catch (error) {
    console.error('Profile load failed:', error.message)
    return response.status(500).json({ message: 'Unable to load profile.' })
  }
})

export async function ensureDatabaseReady() {
  try {
    // 1. Clean up invalid/orphaned zero-id rows from prior failed inserts
    try {
      await pool.query('DELETE FROM student_profiles WHERE user_id = 0')
      await pool.query('DELETE FROM users WHERE id = 0')
    } catch (e) {
      console.warn('ensureDatabaseReady cleanup id 0:', e.message)
    }

    // 2. Ensure PRIMARY KEY & AUTO_INCREMENT on users
    try {
      const [userCols] = await pool.query("SHOW COLUMNS FROM users WHERE Field = 'id'")
      if (userCols.length > 0) {
        const idCol = userCols[0]
        const hasAi = String(idCol.Extra || '').toLowerCase().includes('auto_increment')
        const isPri = String(idCol.Key || '').toUpperCase() === 'PRI'
        if (!isPri) {
          try { await pool.query('ALTER TABLE users ADD PRIMARY KEY (id)') } catch {}
        }
        if (!hasAi) {
          try { await pool.query('ALTER TABLE users MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT') } catch {}
        }
      }
    } catch (e) {
      console.warn('ensureDatabaseReady users note:', e.message)
    }

    // 3. Ensure PRIMARY KEY & AUTO_INCREMENT on student_profiles
    try {
      const [profCols] = await pool.query("SHOW COLUMNS FROM student_profiles WHERE Field = 'id'")
      if (profCols.length > 0) {
        const idCol = profCols[0]
        const hasAi = String(idCol.Extra || '').toLowerCase().includes('auto_increment')
        const isPri = String(idCol.Key || '').toUpperCase() === 'PRI'
        if (!isPri) {
          try { await pool.query('ALTER TABLE student_profiles ADD PRIMARY KEY (id)') } catch {}
        }
        if (!hasAi) {
          try { await pool.query('ALTER TABLE student_profiles MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT') } catch {}
        }
      }
    } catch (e) {
      console.warn('ensureDatabaseReady student_profiles note:', e.message)
    }
  } catch (err) {
    console.warn('ensureDatabaseReady global note:', err.message)
  }
}

app.get('/api/repair-database', async (_req, res) => {
  const log = []
  try {
    try {
      const [delSp] = await pool.query('DELETE FROM student_profiles WHERE user_id = 0')
      const [delU] = await pool.query('DELETE FROM users WHERE id = 0')
      log.push(`Cleaned id=0: users=${delU.affectedRows}, student_profiles=${delSp.affectedRows}`)
    } catch (e) {
      log.push(`Cleanup error: ${e.message}`)
    }

    try {
      await pool.query('ALTER TABLE users MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT')
      log.push('users table AUTO_INCREMENT: success')
    } catch (e) {
      log.push(`users AUTO_INCREMENT note: ${e.message}`)
    }

    try {
      await pool.query('ALTER TABLE student_profiles MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT')
      log.push('student_profiles table AUTO_INCREMENT: success')
    } catch (e) {
      log.push(`student_profiles AUTO_INCREMENT note: ${e.message}`)
    }

    res.json({ ok: true, log })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, log })
  }
})


app.post('/api/auth/register', async (request, response) => {
  const { name, email, password, fatherName = '', age = null, grade = 'Grade 5' } = request.body || {}
  const cleanName = String(name || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanFather = String(fatherName || '').trim()
  const parsedAge = age && Number(age) >= 3 ? Number(age) : null
  const cleanGrade = String(grade || 'Grade 5').trim().slice(0, 30)

  if (!cleanName || !cleanEmail || !password || password.length < 6) {
    return response.status(400).json({ message: 'Name, valid email, and a password of at least 6 characters are required.' })
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail])
    if (existing.length) {
      return response.status(409).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    let userInsertId = null
    try {
      const [userResult] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [cleanName, cleanEmail, passwordHash, 'student'],
      )
      userInsertId = userResult.insertId
    } catch (insertErr) {
      if (insertErr.code === 'ER_NO_DEFAULT_FOR_FIELD' || String(insertErr.message).includes("'id'")) {
        try {
          await pool.query('ALTER TABLE users MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT')
          const [retryResult] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [cleanName, cleanEmail, passwordHash, 'student'],
          )
          userInsertId = retryResult.insertId
        } catch (alterErr) {
          const [maxUser] = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM users')
          const nextUserId = Number(maxUser[0]?.nextId) || 1
          await pool.query(
            'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [nextUserId, cleanName, cleanEmail, passwordHash, 'student'],
          )
          userInsertId = nextUserId
        }
      } else {
        throw insertErr
      }
    }

    if (!userInsertId) {
      const [fetched] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail])
      userInsertId = fetched[0]?.id
    }

    if (userInsertId) {
      try {
        await pool.query(
          'INSERT INTO student_profiles (user_id, father_name, age, grade) VALUES (?, ?, ?, ?)',
          [userInsertId, cleanFather || null, parsedAge, cleanGrade],
        )
      } catch (profErr) {
        if (profErr.code === 'ER_NO_DEFAULT_FOR_FIELD' || String(profErr.message).includes("'id'")) {
          try {
            await pool.query('ALTER TABLE student_profiles MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT')
            await pool.query(
              'INSERT INTO student_profiles (user_id, father_name, age, grade) VALUES (?, ?, ?, ?)',
              [userInsertId, cleanFather || null, parsedAge, cleanGrade],
            )
          } catch (pAlterErr) {
            const [maxProf] = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM student_profiles')
            const nextProfId = Number(maxProf[0]?.nextId) || 1
            await pool.query(
              'INSERT INTO student_profiles (id, user_id, father_name, age, grade) VALUES (?, ?, ?, ?, ?)',
              [nextProfId, userInsertId, cleanFather || null, parsedAge, cleanGrade],
            )
          }
        } else if (profErr.code === 'ER_DUP_ENTRY') {
          await pool.query(
            'UPDATE student_profiles SET father_name = ?, age = ?, grade = ? WHERE user_id = ?',
            [cleanFather || null, parsedAge, cleanGrade, userInsertId],
          )
        } else {
          console.warn('Student profile insert note:', profErr.message)
        }
      }
    }

    return response.status(201).json({
      id: userInsertId,
      name: cleanName,
      email: cleanEmail,
      age: parsedAge || '',
      grade: cleanGrade,
      actualGrade: null,
      role: 'student',
    })
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ message: 'An account with this email already exists.' })
    }
    return response.status(500).json({ message: error.sqlMessage || error.message || 'Unable to create account.' })
  }
})

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role, sp.age, sp.grade, sp.actual_grade, sp.current_difficulty
       FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id
       WHERE u.email = ? AND u.status = 'active'`,
      [String(email || '').trim().toLowerCase()],
    )
    const account = rows[0]
    if (!account || !(await bcrypt.compare(password || '', account.password_hash))) {
      return response.status(401).json({ message: 'Invalid email or password.' })
    }
    const subscription = account.role === 'student' ? await getSubscriptionStatus(account.id) : { active: true, expiresAt: null, source: 'admin' }
    return response.json({ id: account.id, name: account.name, email: account.email, age: account.age, grade: account.grade, actualGrade: account.actual_grade, currentDifficulty: account.current_difficulty || 'Low', role: account.role, subscription })
  } catch (error) {
    console.error('Login failed:', error)
    return response.status(500).json({ message: 'Unable to sign in.' })
  }
})

app.get('/api/users/:userId/profile', async (request, response) => {
  const { userId } = request.params
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, sp.age, sp.grade, sp.actual_grade, sp.current_difficulty
       FROM users u LEFT JOIN student_profiles sp ON sp.user_id = u.id
       WHERE u.id = ? AND u.status = 'active'`,
      [userId],
    )
    if (!rows.length) return response.status(404).json({ message: 'User not found.' })
    const account = rows[0]
    return response.json({
      id: account.id,
      name: account.name,
      email: account.email,
      age: account.age,
      grade: account.grade || 'Grade 1',
      actualGrade: account.actual_grade,
      currentDifficulty: account.current_difficulty || 'Low',
      role: account.role,
    })
  } catch (error) {
    console.error('Profile fetch failed:', error)
    return response.status(500).json({ message: 'Unable to fetch profile.' })
  }
})

app.post('/api/create-checkout-session', async (request, response) => {
  const { studentId } = request.body

  if (!studentId) return response.status(400).json({ message: 'Student is required.' })
  if (!stripe) return response.status(503).json({ message: 'Stripe is not configured on the server.' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price_data: { currency: 'pkr', product_data: { name: 'EduCheck Mathematics Assessment' }, unit_amount: 350000 }, quantity: 1 }],
      metadata: { studentId: String(studentId) },
      success_url: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/payment`,
    })

    return response.status(201).json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout session failed:', error)
    return response.status(500).json({ message: 'Unable to start Stripe checkout.' })
  }
})

app.get('/api/checkout-session/:sessionId', async (request, response) => {
  if (!stripe) return response.status(503).json({ message: 'Stripe is not configured on the server.' })

  try {
    const session = await stripe.checkout.sessions.retrieve(request.params.sessionId)
    const paid = session.payment_status === 'paid'

    if (paid) {
      const saved = await saveStripePaymentRecord(pool, session)
      if (!saved) {
        return response.status(500).json({ message: 'Payment was received, but the subscription could not be activated.' })
      }
    }

    return response.json({
      paid,
      paymentId: session.payment_intent || session.id,
    })
  } catch (error) {
    console.error('Stripe checkout session lookup failed:', error)
    return response.status(400).json({ message: 'Unable to verify Stripe payment.' })
  }
})

app.post('/api/create-payment-intent', async (request, response) => {
  const { studentId } = request.body

  if (!studentId) return response.status(400).json({ message: 'Student ID is required.' })
  if (!stripe) return response.status(503).json({ message: 'Stripe is not configured on the server.' })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 350000,
      currency: 'pkr',
      metadata: { studentId: String(studentId) },
      automatic_payment_methods: { enabled: true },
    })

    return response.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Create payment intent failed:', error)
    return response.status(500).json({ message: error.message || 'Unable to create payment intent.' })
  }
})

app.post('/api/confirm-payment-intent', async (request, response) => {
  const { paymentIntentId, studentId } = request.body

  if (!paymentIntentId) return response.status(400).json({ message: 'Payment intent ID is required.' })
  if (!stripe) return response.status(503).json({ message: 'Stripe is not configured on the server.' })

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return response.status(400).json({ message: `Payment is not completed. Current status: ${paymentIntent.status}` })
    }

    if (studentId && !paymentIntent.metadata?.studentId) {
      paymentIntent.metadata = { ...paymentIntent.metadata, studentId: String(studentId) }
    }

    const saved = await saveStripePaymentRecord(pool, paymentIntent)
    if (!saved) {
      return response.status(500).json({ message: 'Payment verified, but failed to activate subscription in database.' })
    }

    return response.json({
      success: true,
      paid: true,
      paymentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Confirm payment intent failed:', error)
    return response.status(500).json({ message: error.message || 'Unable to confirm payment.' })
  }
})

app.post('/api/payments', async (request, response) => {
  const { studentId, amount, paymentReference } = request.body

  if (!studentId || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !paymentReference?.trim()) {
    return response.status(400).json({ message: 'Student, amount, and payment reference are required.' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO payments (student_id, amount, payment_reference, status, paid_at)
       VALUES (?, ?, ?, 'paid', NOW())`,
      [studentId, Number(amount), paymentReference.trim()],
    )

    return response.status(201).json({
      id: result.insertId,
      paymentReference: paymentReference.trim(),
      amount: Number(amount),
      status: 'paid',
    })
  } catch (error) {
    console.error('Payment save failed:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ message: 'This payment reference already exists.' })
    }
    return response.status(500).json({ message: 'Unable to save payment.' })
  }
})

let adminDashboardCache = { data: null, expiresAt: 0 }
let adminAnalyticsCache = { data: null, expiresAt: 0 }

export function invalidateAdminCache() {
  adminDashboardCache.expiresAt = 0
  adminAnalyticsCache.expiresAt = 0
}

app.get('/api/admin/dashboard', async (request, response) => {
  const force = request.query.refresh === 'true'
  if (!force && adminDashboardCache.data && Date.now() < adminDashboardCache.expiresAt) {
    return response.json(adminDashboardCache.data)
  }

  try {
    const [[studentRows], [questionCount], [testStats], [revenueStats], [recentPayments], [recentAssessments], [performanceTrend], [subjectPerformance]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'"),
      pool.query('SELECT COUNT(*) AS total FROM questions WHERE is_active = 1'),
      pool.query("SELECT COUNT(*) AS total, COALESCE(AVG(percentage), 0) AS averageScore FROM assessment_attempts WHERE status = 'submitted'"),
      pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'paid'"),
      pool.query(
        `SELECT p.id, u.name AS studentName, u.email, sp.grade, p.stripe_payment_id AS paymentReference,
          p.amount, p.status, p.payment_date AS paidAt, p.payment_date AS createdAt
         FROM payments p
         JOIN users u ON u.id = p.user_id
         LEFT JOIN student_profiles sp ON sp.user_id = p.user_id
         ORDER BY p.payment_date DESC LIMIT 50`,
      ),
      pool.query(
        `SELECT a.id, u.name AS student, u.email, a.estimated_grade AS grade,
                a.percentage AS score, a.submitted_at AS submittedAt,
                CASE WHEN a.percentage >= 80 THEN 'Excellent'
                     WHEN a.percentage >= 60 THEN 'Good'
                     WHEN a.percentage >= 40 THEN 'Average'
                     ELSE 'Needs Work' END AS status
         FROM assessment_attempts a
         JOIN users u ON u.id = a.student_id
         WHERE a.status = 'submitted'
         ORDER BY a.submitted_at DESC LIMIT 5`,
      ),
      pool.query(
        `SELECT DATE(a.submitted_at) AS submittedDate, COUNT(*) AS value
         FROM assessment_attempts a
         WHERE a.status = 'submitted'
         GROUP BY DATE(a.submitted_at)
         ORDER BY submittedDate DESC
         LIMIT 10`,
      ),
      pool.query(
        `SELECT COALESCE(t.subject, 'Math') AS subject,
             ROUND((SUM(aa.is_correct) / NULLIF(COUNT(aa.id), 0)) * 100) AS score,
             COUNT(DISTINCT aa.attempt_id) AS assessments
        FROM attempt_answers aa
        JOIN assessment_attempts a ON a.id = aa.attempt_id
        LEFT JOIN questions q ON q.id = aa.question_id
           LEFT JOIN topics t ON t.id = q.topic_id
        WHERE a.status = 'submitted'
           GROUP BY COALESCE(t.subject, 'Math')
        ORDER BY subject ASC`,
      ),
    ])

    const payload = {
      stats: {
        students: Number(studentRows[0]?.total || 0),
        questions: Number(questionCount[0]?.total || 0),
        tests: Number(testStats[0]?.total || 0),
        averageScore: Math.round(Number(testStats[0]?.averageScore || 0)),
        revenue: Number(revenueStats[0]?.total || 0),
      },
      payments: recentPayments,
      assessments: recentAssessments,
      performanceTrend: performanceTrend.reverse().map((entry) => {
        let cleanDate = ''
        if (entry.submittedDate instanceof Date) {
          cleanDate = entry.submittedDate.toISOString().slice(0, 10)
        } else {
          cleanDate = String(entry.submittedDate || '').slice(0, 10)
        }
        return {
          label: cleanDate,
          value: Number(entry.value || 0),
          submittedAt: cleanDate,
        }
      }),
      subjectPerformance: subjectPerformance.map((entry) => ({
        subject: entry.subject,
        score: Number(entry.score || 0),
        assessments: Number(entry.assessments || 0),
      })),
    }

    adminDashboardCache = { data: payload, expiresAt: Date.now() + 30000 }
    return response.json(payload)
  } catch (error) {
    console.error('Admin dashboard load failed:', error)
    return response.status(500).json({ message: 'Unable to load admin dashboard data.' })
  }
})

app.get('/api/admin/analytics', async (request, response) => {
  const force = request.query.refresh === 'true'
  if (!force && adminAnalyticsCache.data && Date.now() < adminAnalyticsCache.expiresAt) {
    return response.json(adminAnalyticsCache.data)
  }

  try {
    const [[summary], [trend], [topicAttempts]] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS assessments,
                COALESCE(AVG(percentage), 0) AS averageScore,
                COALESCE(MAX(percentage), 0) AS highestScore,
                COUNT(DISTINCT student_id) AS studentsTested
         FROM assessment_attempts
         WHERE status = 'submitted'`,
      ),
      pool.query(
        `SELECT a.id, a.percentage AS score, a.submitted_at AS submittedAt,
          COALESCE(GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ', '), 'All Topics') AS topics
         FROM assessment_attempts a
         LEFT JOIN attempt_answers aa ON aa.attempt_id = a.id
         LEFT JOIN questions q ON q.id = aa.question_id
         LEFT JOIN topics t ON t.id = q.topic_id
         WHERE a.status = 'submitted'
         GROUP BY a.id, a.percentage, a.submitted_at
         ORDER BY a.submitted_at DESC, a.id DESC LIMIT 10`,
      ),
      pool.query(
        `SELECT t.name AS topic, a.id AS attemptId, a.submitted_at AS submittedAt,
                ROUND((SUM(aa.is_correct) / NULLIF(COUNT(aa.id), 0)) * 100) AS score
         FROM attempt_answers aa
         JOIN assessment_attempts a ON a.id = aa.attempt_id
         LEFT JOIN questions q ON q.id = aa.question_id
         JOIN topics t ON t.id = q.topic_id
         WHERE a.status = 'submitted'
         GROUP BY t.name, a.id, a.submitted_at
         ORDER BY t.name ASC, a.submitted_at ASC, a.id ASC`,
      ),
    ])

    const payload = {
      stats: {
        assessments: Number(summary[0]?.assessments || 0),
        averageScore: Math.round(Number(summary[0]?.averageScore || 0)),
        highestScore: Math.round(Number(summary[0]?.highestScore || 0)),
        studentsTested: Number(summary[0]?.studentsTested || 0),
      },
      trend: trend.reverse().map((entry, index, entries) => ({
        id: entry.id,
        label: index === entries.length - 1 ? 'Latest' : `A${index + 1}`,
        score: Number(entry.score || 0),
        submittedAt: entry.submittedAt,
        topics: entry.topics,
      })),
      topicCandles: ['Algebra', 'Data Analysis', 'Geometry', 'Measurement', 'Number & Operations'].map((topic) => {
        const scores = topicAttempts.filter((entry) => entry.topic === topic).map((entry) => Number(entry.score || 0))
        return {
          topic,
          open: scores[0] || 0,
          close: scores[scores.length - 1] || 0,
          low: scores.length ? Math.min(...scores) : 0,
          high: scores.length ? Math.max(...scores) : 0,
          assessments: scores.length,
        }
      }),
    }

    adminAnalyticsCache = { data: payload, expiresAt: Date.now() + 30000 }
    return response.json(payload)
  } catch (error) {
    console.error('Admin analytics load failed:', error)
    return response.status(500).json({ message: 'Unable to load analytics data.' })
  }
})

app.get('/api/admin/payments', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, u.name AS studentName, u.email, sp.grade, p.stripe_payment_id AS paymentReference,
              p.amount, p.status, p.payment_date AS paidAt, p.payment_date AS createdAt
       FROM payments p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN student_profiles sp ON sp.user_id = p.user_id
       ORDER BY p.payment_date DESC`,
    )
    return response.json(rows)
  } catch (error) {
    console.error('Admin payments load failed:', error)
    return response.status(500).json({ message: 'Unable to load payment records.' })
  }
})

app.get('/api/payments', async (request, response) => {
  const studentId = Number(request.query.studentId)

  if (!studentId) {
    return response.status(400).json({ message: 'Student is required to view payment history.' })
  }

  try {
    const [rows] = await pool.query(
      `SELECT p.id,
              p.user_id AS studentId,
              p.amount,
              p.stripe_payment_id AS payment_reference,
              p.status,
              p.payment_date AS paid_at,
              p.payment_date AS created_at
       FROM payments p
       WHERE p.user_id = ?
       ORDER BY p.payment_date DESC`,
      [studentId],
    )

    return response.json(rows)
  } catch (error) {
    console.error('User payments load failed:', error)
    return response.status(500).json({ message: 'Unable to load your payment records.' })
  }
})

app.get('/api/subscription/status', async (request, response) => {
  try {
    const subscription = await getSubscriptionStatus(request.query.userId)
    response.json({ ...subscription, price: SUBSCRIPTION_PRICE_PKR, durationDays: SUBSCRIPTION_DAYS })
  } catch (error) {
    console.error('Subscription status failed:', error)
    response.status(500).json({ message: 'Unable to verify subscription status.' })
  }
})

app.get('/api/assessments', async (request, response) => {
  const studentId = Number(request.query.studentId)

  if (!studentId) {
    return response.status(400).json({ message: 'Student is required to view assessment history.' })
  }

  try {
    const [rows] = await pool.query(
      `SELECT a.id,
              a.student_id AS studentId,
              a.assessment_id,
              a.total_questions,
              a.correct_answers,
              a.wrong_answers,
              a.score,
              a.percentage,
              a.estimated_grade,
              a.status,
              a.submitted_at
       FROM assessment_attempts a
       WHERE a.student_id = ?
       ORDER BY a.submitted_at DESC, a.id DESC`,
      [studentId],
    )

    return response.json(rows)
  } catch (error) {
    console.error('User assessments load failed:', error)
    return response.status(500).json({ message: 'Unable to load your assessment history.' })
  }
})

app.get('/api/admin/students', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.status, u.created_at AS joinedDate, sp.grade,
              COUNT(a.id) AS tests, COALESCE(AVG(a.percentage), 0) AS avgScore
       FROM users u
       LEFT JOIN student_profiles sp ON sp.user_id = u.id
       LEFT JOIN assessment_attempts a ON a.student_id = u.id AND a.status = 'submitted'
       WHERE u.role = 'student'
       GROUP BY u.id, u.name, u.email, u.status, u.created_at, sp.grade
       ORDER BY u.created_at DESC`,
    )
    return response.json(rows.map((student) => ({ ...student, tests: Number(student.tests), avgScore: Math.round(Number(student.avgScore)), status: student.status === 'active' ? 'Active' : 'Inactive', joinedDate: new Date(student.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })))
  } catch (error) {
    console.error('Admin students load failed:', error)
    return response.status(500).json({ message: 'Unable to load students.' })
  }
})

app.get('/api/admin/reports', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, u.name AS student, u.email, COALESCE(sp.grade, 'N/A') AS grade,
              a.percentage AS score, a.estimated_grade AS level,
              a.correct_answers AS correct, a.wrong_answers AS wrong,
              GREATEST(a.total_questions - a.correct_answers - a.wrong_answers, 0) AS unanswered,
              a.submitted_at AS submittedAt
       FROM assessment_attempts a
       JOIN users u ON u.id = a.student_id
       LEFT JOIN student_profiles sp ON sp.user_id = a.student_id
       WHERE a.status = 'submitted'
       ORDER BY a.submitted_at DESC`,
    )
    const reports = rows.map((report) => ({
      ...report,
      subject: 'Math',
      score: Number(report.score || 0),
      level: report.level || 'N/A',
      correct: Number(report.correct || 0),
      wrong: Number(report.wrong || 0),
      unanswered: Number(report.unanswered || 0),
      date: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'N/A',
    }))
    const [[totals]] = await pool.query(
      `SELECT COUNT(*) AS totalAttempts,
              SUM(status = 'submitted') AS submittedAttempts,
              SUM(submitted_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AND status = 'submitted') AS thisMonth
       FROM assessment_attempts`,
    )
    return response.json({ reports, stats: { total: reports.length, averageScore: reports.length ? Math.round(reports.reduce((sum, report) => sum + report.score, 0) / reports.length) : 0, completionRate: Number(totals.totalAttempts) ? Math.round((Number(totals.submittedAttempts || 0) / Number(totals.totalAttempts)) * 100) : 0, thisMonth: Number(totals.thisMonth || 0) } })
  } catch (error) {
    console.error('Admin reports load failed:', error)
    return response.status(500).json({ message: 'Unable to load reports.' })
  }
})

app.delete('/api/admin/reports/:reportId', async (request, response) => {
  try {
    const [result] = await pool.query("DELETE FROM assessment_attempts WHERE id = ? AND status = 'submitted'", [request.params.reportId])
    if (!result.affectedRows) return response.status(404).json({ message: 'Report not found.' })
    return response.status(204).send()
  } catch (error) {
    console.error('Admin report delete failed:', error)
    return response.status(500).json({ message: 'Unable to delete report.' })
  }
})

app.get('/api/admin/subjects', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.description, s.status,
              COUNT(DISTINCT t.id) AS topics,
              COUNT(DISTINCT q.id) AS questions,
          MIN(g.grade_level) AS minGrade,
          MAX(g.grade_level) AS maxGrade
      FROM subjects s
      LEFT JOIN topics t ON CONVERT(t.subject USING utf8mb4) COLLATE utf8mb4_unicode_ci = CONVERT(CASE WHEN s.name = 'Math' THEN 'Mathematics' ELSE s.name END USING utf8mb4) COLLATE utf8mb4_unicode_ci
      LEFT JOIN questions q ON q.topic_id = t.id AND q.is_active = 1
        LEFT JOIN grades g ON g.id = q.grade_id
       GROUP BY s.id, s.name, s.description, s.status
       ORDER BY s.name` ,
    )
    return response.json(rows.map((subject) => ({
      ...subject,
      topics: Number(subject.topics || 0),
      questions: Number(subject.questions || 0),
      grades: subject.minGrade && subject.maxGrade ? `${subject.minGrade}-${subject.maxGrade}` : 'N/A',
      status: subject.status === 'active' ? 'Active' : 'Inactive',
      icon: subject.name.toLowerCase() === 'math' ? '📐' : '📚',
    })))
  } catch (error) {
    console.error('Admin subjects load failed:', error)
    return response.status(500).json({ message: 'Unable to load subjects.' })
  }
})

app.post('/api/admin/subjects', async (request, response) => {
  const { name, description = '' } = request.body
  if (!name?.trim()) return response.status(400).json({ message: 'Subject name is required.' })

  try {
    const [result] = await pool.query(
      'INSERT INTO subjects (name, description) VALUES (?, ?)',
      [name.trim(), description.trim() || null],
    )
    return response.status(201).json({ id: result.insertId, name: name.trim(), description: description.trim(), topics: 0, questions: 0, grades: 'N/A', status: 'Active', icon: '📚' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'This subject already exists.' })
    console.error('Admin subject save failed:', error)
    return response.status(500).json({ message: 'Unable to save subject.' })
  }
})

app.put('/api/admin/subjects/:subjectId', async (request, response) => {
  const { name, description = '', status = 'Active' } = request.body
  if (!name?.trim() || !['Active', 'Inactive'].includes(status)) return response.status(400).json({ message: 'Subject name and valid status are required.' })

  try {
    const [result] = await pool.query(
      'UPDATE subjects SET name = ?, description = ?, status = ? WHERE id = ?',
      [name.trim(), description.trim() || null, status === 'Active' ? 'active' : 'inactive', request.params.subjectId],
    )
    if (!result.affectedRows) return response.status(404).json({ message: 'Subject not found.' })
    return response.json({ id: Number(request.params.subjectId), name: name.trim(), description: description.trim(), status, icon: name.toLowerCase() === 'math' ? '📐' : '📚' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'This subject already exists.' })
    console.error('Admin subject update failed:', error)
    return response.status(500).json({ message: 'Unable to update subject.' })
  }
})

app.delete('/api/admin/subjects/:subjectId', async (request, response) => {
  try {
    const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [request.params.subjectId])
    if (!result.affectedRows) return response.status(404).json({ message: 'Subject not found.' })
    return response.status(204).send()
  } catch (error) {
    console.error('Admin subject delete failed:', error)
    return response.status(409).json({ message: 'Subject cannot be deleted while it has topics or questions.' })
  }
})

app.get('/api/admin/topics', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.name, NULL AS description, s.name AS subject,
              t.parent_topic_id AS parentTopicId, parent.name AS parentName
       FROM topics t
       LEFT JOIN subjects s ON s.id = t.subject_id
       LEFT JOIN topics parent ON parent.id = t.parent_topic_id
       ORDER BY t.name`,
    )
    const [subtopics] = await pool.query(
      `SELECT st.id, st.name, c.name AS chapterName, c.id AS chapterId
       FROM subtopics st
       JOIN chapters c ON c.id = st.chapter_id
       ORDER BY c.name, st.name`,
    )
    const subtopicsByChapter = new Map()
    for (const subtopic of subtopics) {
      const chapterSubtopics = subtopicsByChapter.get(subtopic.chapterName) || []
      chapterSubtopics.push({ id: subtopic.id, name: subtopic.name, chapterId: subtopic.chapterId })
      subtopicsByChapter.set(subtopic.chapterName, chapterSubtopics)
    }
    return response.json(rows.map((topic) => ({
      ...topic,
      status: 'Active',
      subtopics: subtopicsByChapter.get(topic.name) || [],
    })))
  } catch (error) {
    console.error('Admin topics load failed:', error)
    return response.status(500).json({ message: 'Unable to load topics.' })
  }
})

app.post('/api/admin/topics', async (request, response) => {
  const { name, subject = 'Math', parentTopicId = null } = request.body
  if (!name?.trim() || !subject?.trim()) return response.status(400).json({ message: 'Topic name and subject are required.' })

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const topicSubject = subject.trim() === 'Math' ? 'Math' : subject.trim()
    const [subjectRows] = await connection.query('SELECT id FROM subjects WHERE name = ? LIMIT 1', [topicSubject])
    let subjectId = subjectRows[0]?.id
    if (!subjectId) {
      const [subjectResult] = await connection.query('INSERT INTO subjects (name) VALUES (?)', [topicSubject])
      subjectId = subjectResult.insertId
    }
    const [result] = await connection.query('INSERT INTO topics (subject_id, name, parent_topic_id) VALUES (?, ?, ?)', [subjectId, name.trim(), parentTopicId || null])
    await connection.commit()
    return response.status(201).json({ id: result.insertId, name: name.trim(), parentTopicId: parentTopicId || null, parentName: null, subject: topicSubject, status: 'Active' })
  } catch (error) {
    await connection.rollback()
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'This topic already exists for the selected subject.' })
    console.error('Admin topic save failed:', error)
    return response.status(500).json({ message: 'Unable to save topic.' })
  } finally {
    connection.release()
  }
})

app.put('/api/admin/topics/:topicId', async (request, response) => {
  const { name } = request.body
  if (!name?.trim()) return response.status(400).json({ message: 'Topic name is required.' })

  const connection = await pool.getConnection()
  try {
    const [topicRows] = await connection.query(
      `SELECT t.id, s.name AS subject, t.parent_topic_id AS parentTopicId
       FROM topics t JOIN subjects s ON s.id = t.subject_id
       WHERE t.id = ? LIMIT 1`,
      [request.params.topicId],
    )
    if (!topicRows.length) return response.status(404).json({ message: 'Topic not found.' })
    const topic = topicRows[0]
    await connection.query('UPDATE topics SET name = ? WHERE id = ?', [name.trim(), request.params.topicId])
    return response.json({ id: topic.id, name: name.trim(), parentTopicId: topic.parentTopicId, parentName: null, subject: topic.subject, status: 'Active' })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'This topic already exists for the selected subject.' })
    console.error('Admin topic update failed:', error)
    return response.status(500).json({ message: 'Unable to update topic.' })
  } finally {
    connection.release()
  }
})

app.delete('/api/admin/topics/:topicId', async (request, response) => {
  try {
    const [result] = await pool.query('DELETE FROM topics WHERE id = ?', [request.params.topicId])
    if (!result.affectedRows) return response.status(404).json({ message: 'Topic not found.' })
    return response.status(204).send()
  } catch (error) {
    console.error('Admin topic delete failed:', error)
    return response.status(500).json({ message: 'Unable to delete topic.' })
  }
})

async function migrateLegacyAssessmentSchema() {
  await pool.query("SET collation_connection = 'utf8mb4_unicode_ci'")
    const hasColumn = async (table, column) => {
      const [rows] = await pool.query('SHOW COLUMNS FROM ??', [table])
      return rows.some((row) => row.Field === column)
    }
    const addColumn = async (table, column, definition) => {
      if (!(await hasColumn(table, column))) {
        await pool.query(`ALTER TABLE ?? ADD COLUMN ?? ${definition}`, [table, column])
      }
    }

    await addColumn('topics', 'subject_id', 'BIGINT UNSIGNED NULL AFTER id')
    await pool.query(
      `INSERT INTO subjects (name, description) VALUES ('Math', 'Mathematics')
      ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    )
    await pool.query(
      `UPDATE topics
       SET subject_id = (SELECT id FROM subjects WHERE name = 'Math' LIMIT 1)
       WHERE subject_id IS NULL`,
    )

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        subject_id BIGINT UNSIGNED NOT NULL,
        name VARCHAR(120) NOT NULL,
        description VARCHAR(255) NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_chapter_subject_name (subject_id, name)
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subtopics (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        chapter_id BIGINT UNSIGNED NOT NULL,
        name VARCHAR(160) NOT NULL,
        description VARCHAR(255) NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_subtopic_chapter_name (chapter_id, name)
      )
    `)
    await addColumn('questions', 'subject_id', 'BIGINT UNSIGNED NULL AFTER id')
    await addColumn('questions', 'chapter_id', 'BIGINT UNSIGNED NULL AFTER topic_id')
    await addColumn('questions', 'subtopic_id', 'BIGINT UNSIGNED NULL AFTER chapter_id')
    await addColumn('questions', 'subtopic_name', 'VARCHAR(160) NULL AFTER chapter_id')
    await addColumn('questions', 'explanation', 'TEXT NULL AFTER correct_answer')
    await addColumn('questions', 'grade', 'TINYINT UNSIGNED NULL AFTER question_text')
    await addColumn('questions', 'difficulty', "VARCHAR(20) NULL AFTER grade")
    await addColumn('questions', 'correct_answer', "CHAR(1) NULL AFTER option_d")
    await addColumn('questions', 'status', "VARCHAR(20) NULL AFTER correct_answer")
    try {
      await pool.query('ALTER TABLE questions ADD CONSTRAINT fk_question_subtopic FOREIGN KEY (subtopic_id) REFERENCES topics(id) ON DELETE SET NULL')
    } catch (error) {
      if (!['ER_DUP_KEYNAME', 'ER_FK_DUP_NAME'].includes(error.code)) throw error
    }

    const hasLegacySubtopicId = await hasColumn('questions', 'subtopic_id')
    const hasLegacyCorrectOption = await hasColumn('questions', 'correct_option')
    const hasLegacyDifficultyLevel = await hasColumn('questions', 'difficulty_level')
    const correctAnswerMigration = hasLegacyCorrectOption
      ? 'q.correct_answer = COALESCE(q.correct_answer, UPPER(q.correct_option)), '
      : ''
    const difficultyMigration = hasLegacyDifficultyLevel
      ? "q.difficulty = COALESCE(q.difficulty, CASE LOWER(q.difficulty_level) WHEN 'easy' THEN 'Low' WHEN 'hard' THEN 'High' ELSE 'Medium' END), "
      : "q.difficulty = COALESCE(q.difficulty, 'Medium'), "
    await pool.query(hasLegacySubtopicId
      ? `UPDATE questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         LEFT JOIN topics st ON st.id = q.subtopic_id
         SET q.subject_id = COALESCE(q.subject_id, t.subject_id),
             q.grade = COALESCE(q.grade, q.grade_id),
             ${difficultyMigration}
             ${correctAnswerMigration}
             q.status = COALESCE(q.status, CASE WHEN q.is_active = 1 THEN 'active' ELSE 'archived' END),
             q.subtopic_name = COALESCE(q.subtopic_name, st.name)`
      : `UPDATE questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         SET q.subject_id = COALESCE(q.subject_id, t.subject_id),
             q.grade = COALESCE(q.grade, q.grade_id),
             ${difficultyMigration}
             ${correctAnswerMigration}
             q.status = COALESCE(q.status, CASE WHEN q.is_active = 1 THEN 'active' ELSE 'archived' END)`)
    await pool.query(
      `INSERT INTO chapters (subject_id, name)
       SELECT DISTINCT t.subject_id, t.name
       FROM topics t
       WHERE t.subject_id IS NOT NULL AND (t.parent_topic_id IS NULL OR t.parent_topic_id = 0)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    )
    await pool.query(
      `UPDATE questions q
       JOIN topics t ON t.id = q.topic_id
       JOIN chapters c ON c.subject_id = t.subject_id AND c.name COLLATE utf8mb4_unicode_ci = t.name COLLATE utf8mb4_unicode_ci
       SET q.chapter_id = COALESCE(q.chapter_id, c.id)
       WHERE q.chapter_id IS NULL`,
    )
}

app.post('/api/admin/students', async (request, response) => {
  const { name, email, password, grade = 'Grade 6', status = 'Active' } = request.body
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!name?.trim() || !normalizedEmail || !password || password.length < 6 || !['Active', 'Inactive'].includes(status)) {
    return response.status(400).json({ message: 'Name, email, password of at least 6 characters, grade, and valid status are required.' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const passwordHash = await bcrypt.hash(password, 12)
    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, \'student\', ?)',
      [name.trim(), normalizedEmail, passwordHash, status === 'Active' ? 'active' : 'inactive'],
    )
    await connection.query('INSERT INTO student_profiles (user_id, grade) VALUES (?, ?)', [userResult.insertId, grade])
    await connection.commit()
    return response.status(201).json({ id: userResult.insertId, name: name.trim(), email: normalizedEmail, grade, tests: 0, avgScore: 0, status, joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
  } catch (error) {
    await connection.rollback()
    if (error.code === 'ER_DUP_ENTRY') return response.status(409).json({ message: 'A student with this email already exists.' })
    console.error('Admin student save failed:', error)
    return response.status(500).json({ message: 'Unable to save student.' })
  } finally {
    connection.release()
  }
})

app.post('/api/admin/questions/generate-diagnostics', async (request, response) => {
  const { question, grade = 5, subject = 'Math', topic = 'Mathematics', options = {}, answer = 'A' } = request.body

  if (!question?.trim() || !['A', 'B', 'C', 'D'].includes(answer) || ['A', 'B', 'C', 'D'].some((opt) => !options[opt]?.trim())) {
    return response.status(400).json({ message: 'Question, four options, and correct answer are required for AI generation.' })
  }

  try {
    const result = await generateDiagnosticsWithGemini({
      question: question.trim(),
      grade: Number(grade) || 5,
      subject,
      topic,
      options,
      answer,
    })
    return response.json(result)
  } catch (error) {
    console.error('AI diagnostics generation failed:', error)
    return response.status(500).json({ message: error.message || 'Unable to generate diagnostics with AI.' })
  }
})

app.post('/api/admin/questions', async (request, response) => {
  const { question, subject = 'Math', topic, topicId, subtopic, grade, difficulty, options = {}, answer, explanation = null } = request.body
  const rawDiagnostics = request.body.distractor_diagnostics ?? request.body.distractorDiagnostics ?? null
  const distractorDiagnosticsJson = rawDiagnostics ? (typeof rawDiagnostics === 'string' ? rawDiagnostics : JSON.stringify(rawDiagnostics)) : null
  const requestedSubtopicId = request.body.subtopicId ?? request.body.subtopic_id

  if (!question?.trim() || !Number.isInteger(Number(grade)) || !['Low', 'Medium', 'High'].includes(difficulty) || !['A', 'B', 'C', 'D'].includes(answer) || ['A', 'B', 'C', 'D'].some((option) => !options[option]?.trim())) {
    return response.status(400).json({ message: 'Question, grade, difficulty, four options, and correct answer are required.' })
  }

  const normalizedTopicName = String(topic || '').trim()
  const normalizedSubtopicName = String(subtopic || '').trim()
  const numericTopicId = Number(topicId)

  if (!normalizedTopicName && !Number.isInteger(numericTopicId)) {
    return response.status(400).json({ message: 'Topic is required.' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [subjectRows] = await connection.query('SELECT id FROM subjects WHERE name = ? LIMIT 1', [subject.trim()])
    let subjectId = subjectRows[0]?.id
    if (!subjectId) {
      const [subjectResult] = await connection.query('INSERT INTO subjects (name) VALUES (?)', [subject.trim()])
      subjectId = subjectResult.insertId
    }

    const numericGrade = Number(grade)
    const [gradeRows] = await connection.query(
      'SELECT id FROM grades WHERE id = ? OR name IN (?, ?) ORDER BY id LIMIT 1',
      [numericGrade, `Grade ${numericGrade}`, String(numericGrade)],
    )
    const gradeId = gradeRows[0]?.id
    if (!gradeId) {
      await connection.rollback()
      return response.status(400).json({ message: `Grade ${numericGrade} is not configured in the database.` })
    }

    let selectedTopicId = Number.isInteger(numericTopicId) && numericTopicId > 0 ? numericTopicId : null
    if (!selectedTopicId && normalizedTopicName) {
      const [topicRows] = await connection.query('SELECT id, parent_topic_id AS parentTopicId FROM topics WHERE subject_id = ? AND name = ? LIMIT 1', [subjectId, normalizedTopicName])
      selectedTopicId = topicRows[0]?.id ?? null
    }

    if (!selectedTopicId) {
      const [topicResult] = await connection.query('INSERT INTO topics (subject_id, name) VALUES (?, ?)', [subjectId, normalizedTopicName || 'General'])
      selectedTopicId = topicResult.insertId
    }

    let numericSubtopicId = requestedSubtopicId == null || requestedSubtopicId === '' ? null : Number(requestedSubtopicId)
    if (numericSubtopicId !== null && (!Number.isInteger(numericSubtopicId) || numericSubtopicId <= 0)) {
      await connection.rollback()
      return response.status(400).json({ message: 'Selected subtopic is invalid.' })
    }

    if (numericSubtopicId === null && normalizedSubtopicName) {
      const [subtopicRows] = await connection.query(
        'SELECT id FROM topics WHERE parent_topic_id = ? AND name = ? LIMIT 1',
        [selectedTopicId, normalizedSubtopicName],
      )
      numericSubtopicId = subtopicRows[0]?.id ?? null
    }

    const [topicRows] = await connection.query('SELECT name FROM topics WHERE id = ? LIMIT 1', [selectedTopicId])
    const chapterName = topicRows[0]?.name || normalizedTopicName || 'General'
    let selectedSubtopicId = null
    let normalizedSelectedSubtopicName = normalizedSubtopicName
    if (numericSubtopicId !== null) {
      const [subtopicRows] = await connection.query(
        'SELECT id, name FROM topics WHERE id = ? AND parent_topic_id = ? LIMIT 1',
        [numericSubtopicId, selectedTopicId],
      )
      if (!subtopicRows.length) {
        await connection.rollback()
        return response.status(400).json({ message: 'Selected subtopic must belong to the selected topic.' })
      }
      selectedSubtopicId = subtopicRows[0].id
      normalizedSelectedSubtopicName = subtopicRows[0].name
    }

    const [chapterResult] = await connection.query(
      `INSERT INTO chapters (subject_id, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, chapterName],
    )
    const chapterId = chapterResult.insertId
    if (normalizedSelectedSubtopicName) {
      await connection.query(
        `INSERT INTO subtopics (chapter_id, name) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [chapterId, normalizedSelectedSubtopicName],
      )
    }

    const [result] = await connection.query(
      `INSERT INTO questions
        (subject_id, topic_id, chapter_id, subtopic_id, subtopic_name, question_text, grade_id, grade, difficulty, option_a, option_b, option_c, option_d, correct_answer, explanation, distractor_diagnostics)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, selectedTopicId, chapterId, selectedSubtopicId, normalizedSelectedSubtopicName || null, question.trim(), gradeId, numericGrade, difficulty, options.A.trim(), options.B.trim(), options.C.trim(), options.D.trim(), answer, explanation, distractorDiagnosticsJson],
    )
    await connection.commit()
    return response.status(201).json({ id: result.insertId, question: question.trim(), subject: subject.trim(), topic: normalizedTopicName || 'General', subtopic: normalizedSelectedSubtopicName || null, subtopicId: selectedSubtopicId, grade: Number(grade), difficulty, options, answer, status: 'Active', explanation, distractor_diagnostics: rawDiagnostics })
  } catch (error) {
    await connection.rollback()
    console.error('Admin question save failed:', error)
    return response.status(500).json({ message: error.message || 'Unable to save question.' })
  } finally {
    connection.release()
  }
})

app.post('/api/assessment-attempts', async (request, response) => {
  const { studentId, attemptId = null, questions = [], answers = {}, selectedTargetGrade = null, estimatedGrade = null, reportData = {}, topicBreakdown = [] } = request.body

  if (!studentId || !Array.isArray(questions)) {
    return response.status(400).json({ message: 'Student and assessment questions are required.' })
  }

  const normalizeAnswer = (value) => {
    if (value == null || value === '') return null
    const normalized = String(value).trim().toUpperCase()
    return ['A', 'B', 'C', 'D'].includes(normalized) ? normalized : null
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const saveReport = async (savedAttemptId) => {
      const overallScore = Number(reportData.accuracy ?? reportData.overallResult?.accuracy ?? 0) * 100
      const gradeLetter = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F'
      const strongTopics = Array.isArray(reportData.strengths) ? reportData.strengths : []
      const weakTopics = Array.isArray(reportData.gaps) ? reportData.gaps : []
      const recommendations = Array.isArray(reportData.recommendedLearningFocus) ? reportData.recommendedLearningFocus : []

      await connection.query(
        `INSERT INTO reports
         (assessment_id, student_id, overall_score, grade_letter, strong_topics, weak_topics, topic_breakdown, recommendations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE overall_score = VALUES(overall_score), grade_letter = VALUES(grade_letter), strong_topics = VALUES(strong_topics), weak_topics = VALUES(weak_topics), topic_breakdown = VALUES(topic_breakdown), recommendations = VALUES(recommendations), generated_at = CURRENT_TIMESTAMP`,
        [savedAttemptId, studentId, overallScore, gradeLetter, JSON.stringify(strongTopics), JSON.stringify(weakTopics), JSON.stringify(topicBreakdown), JSON.stringify(recommendations)],
      )
    }

    const qIds = questions.map((q) => q.id).filter(Boolean)
    let dbCorrectAnswers = new Map()
    if (qIds.length > 0) {
      const [dbQRows] = await connection.query(
        'SELECT id, correct_answer FROM questions WHERE id IN (?)',
        [qIds]
      )
      dbCorrectAnswers = new Map(dbQRows.map((r) => [r.id, normalizeAnswer(r.correct_answer)]))
    }

    if (attemptId) {
      for (const question of questions) {
        if (question.id == null) continue
        const selectedAnswer = normalizeAnswer(answers[question.id])
        const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
        await connection.query(
          `INSERT INTO attempt_answers
           (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
           VALUES (?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE selected_answer = VALUES(selected_answer), correct_answer = VALUES(correct_answer), is_correct = VALUES(is_correct), answered_at = NOW()`,
          [attemptId, question.id, selectedAnswer, correctAnswer, selectedAnswer === correctAnswer],
        )
      }
      const [updatedAnswers] = await connection.query(
        'SELECT COUNT(*) AS answered, SUM(is_correct) AS correct FROM attempt_answers WHERE attempt_id = ?',
        [attemptId],
      )
      const correctAnswers = Number(updatedAnswers[0].correct || 0)
      const answered = Number(updatedAnswers[0].answered || 0)
      await connection.query(
        `UPDATE assessment_attempts
         SET total_questions = ?, correct_answers = ?, wrong_answers = ?, score = ?, percentage = ?, estimated_grade = ?, status = 'submitted', submitted_at = NOW()
         WHERE id = ? AND student_id = ?`,
        [questions.length, correctAnswers, answered - correctAnswers, correctAnswers, questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0, estimatedGrade, attemptId, studentId],
      )
      const weakSubtopics = new Map()
      for (const question of questions) {
        const selectedAnswer = normalizeAnswer(answers[question.id])
        const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
        if (!selectedAnswer || selectedAnswer === correctAnswer) continue
        const key = `${question.topic || 'Mathematics'}|||${question.subtopic || 'General'}`
        const current = weakSubtopics.get(key) || { wrong: 0, grade: Number(question.grade) || 1 }
        weakSubtopics.set(key, { wrong: current.wrong + 1, grade: Math.min(current.grade, Number(question.grade) || 1) })
      }
      const currentProfile = (await connection.query('SELECT grade FROM student_profiles WHERE user_id = ? LIMIT 1', [studentId]))[0][0]
      const currentGrade = Number(String(currentProfile?.grade || '').match(/\d+/)?.[0] || selectedTargetGrade || 1)
      const weakGrade = weakSubtopics.size ? Math.min(...[...weakSubtopics.values()].map((item) => item.grade)) : null
      const nextGrade = weakGrade != null
        ? Math.max(1, Math.min(currentGrade - 1, weakGrade))
        : currentGrade < Number(selectedTargetGrade || currentGrade) && correctAnswers / Math.max(questions.length, 1) >= 0.7
          ? currentGrade + 1
          : currentGrade
      await connection.query('UPDATE student_profiles SET actual_grade = ?, grade = ? WHERE user_id = ?', [estimatedGrade, `Grade ${nextGrade}`, studentId])
      await connection.query('DELETE FROM attempt_questions WHERE attempt_id = ?', [attemptId])
      await saveReport(attemptId)
      await connection.commit()
      return response.status(200).json({ id: attemptId, selectedTargetGrade, recommendedGrade: `Grade ${nextGrade}`, weakSubtopics: [...weakSubtopics.keys()] })
    }

    const answerEntries = questions.filter((question) => {
      const selectedAnswer = normalizeAnswer(answers[question.id])
      return selectedAnswer != null
    })
    const correctAnswers = questions.filter((question) => {
      const selectedAnswer = normalizeAnswer(answers[question.id])
      const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
      return selectedAnswer != null && selectedAnswer === correctAnswer
    }).length
    const totalQuestions = questions.length

    const [attemptResult] = await connection.query(
      `INSERT INTO assessment_attempts
       (student_id, total_questions, correct_answers, wrong_answers, score, percentage, estimated_grade, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())`,
      [studentId, totalQuestions, correctAnswers, answerEntries.length - correctAnswers, correctAnswers, totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0, estimatedGrade],
    )

    for (const question of questions) {
      const selectedAnswer = normalizeAnswer(answers[question.id])
      const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
      await connection.query(
        `INSERT INTO attempt_answers
         (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [attemptResult.insertId, question.id, selectedAnswer, correctAnswer, selectedAnswer === correctAnswer],
      )
    }

    await connection.query('UPDATE student_profiles SET actual_grade = ? WHERE user_id = ?', [estimatedGrade, studentId])
    await saveReport(attemptResult.insertId)
    await connection.commit()
    return response.status(201).json({ id: attemptResult.insertId, selectedTargetGrade })
  } catch (error) {
    await connection.rollback()
    console.error('Assessment saving failed:', error)
    return response.status(500).json({ message: 'Unable to save assessment.' })
  } finally {
    connection.release()
  }
})

app.get('/api/questions', async (request, response) => {
  try {
    const gradeId = Number(request.query.gradeId ?? request.query.grade)
    const minGradeId = Number(request.query.minGradeId ?? request.query.minGrade)
    const maxGradeId = Number(request.query.maxGradeId ?? request.query.maxGrade)
    const topicFilter = String(request.query.topic || '').trim()
    const studentId = Number(request.query.studentId)
    const limit = Math.min(Number(request.query.limit) || 5000, 10000)

    const safeMaxGrade = Math.min(Math.max(Number.isFinite(maxGradeId) ? maxGradeId : 6, 1), 8)
    const safeMinGrade = Math.min(Math.max(Number.isFinite(minGradeId) ? minGradeId : 1, 1), safeMaxGrade)

    let whereClause = 'q.grade IS NOT NULL'
    const queryValues = []

    if (Number.isFinite(gradeId) && gradeId >= 1 && gradeId <= 8) {
      whereClause += ' AND q.grade = ?'
      queryValues.push(gradeId)
    } else if (Number.isFinite(minGradeId) && Number.isFinite(maxGradeId)) {
      whereClause += ' AND q.grade BETWEEN ? AND ?'
      queryValues.push(safeMinGrade, safeMaxGrade)
    } else {
      whereClause += ' AND q.grade BETWEEN ? AND ?'
      queryValues.push(1, 6)
    }

    if (topicFilter) {
      whereClause += ' AND (t.name LIKE ?)'
      queryValues.push(`%${topicFilter}%`)
    }

    if (Number.isInteger(studentId) && studentId > 0) {
      whereClause += ` AND q.id NOT IN (
        SELECT aa.question_id
        FROM attempt_answers aa
        JOIN assessment_attempts previous_attempt ON previous_attempt.id = aa.attempt_id
        WHERE previous_attempt.student_id = ? AND previous_attempt.status = 'submitted'
      )`
      queryValues.push(studentId)
    }

    let [rows] = await pool.query(
      `SELECT q.id, q.grade, q.topic_id AS topicId, q.subtopic_id AS subtopicId, s.name AS subject, t.name AS topic, t.parent_topic_id AS parentTopicId, q.subtopic_name AS subtopic,
        q.difficulty, q.question_text AS question,
        q.option_a, q.option_b, q.option_c, q.option_d,
        q.correct_answer, q.explanation, q.distractor_diagnostics
       FROM questions q
       LEFT JOIN topics t ON t.id = q.topic_id
       LEFT JOIN subjects s ON s.id = q.subject_id
       WHERE ${whereClause}
       ORDER BY RAND()
       LIMIT ?`,
      [...queryValues, limit],
    )

    // Fallback: If excluding previous answers leaves fewer than 30 questions,
    // query without the previous attempt exclusion so retakes always have a full question pool
    if (rows.length < 30 && Number.isInteger(studentId) && studentId > 0) {
      let fallbackWhere = 'q.grade IS NOT NULL'
      const fallbackValues = []
      if (Number.isFinite(gradeId) && gradeId >= 1 && gradeId <= 8) {
        fallbackWhere += ' AND q.grade = ?'
        fallbackValues.push(gradeId)
      } else if (Number.isFinite(minGradeId) && Number.isFinite(maxGradeId)) {
        fallbackWhere += ' AND q.grade BETWEEN ? AND ?'
        fallbackValues.push(safeMinGrade, safeMaxGrade)
      } else {
        fallbackWhere += ' AND q.grade BETWEEN ? AND ?'
        fallbackValues.push(1, 6)
      }
      if (topicFilter) {
        fallbackWhere += ' AND (t.name LIKE ?)'
        fallbackValues.push(`%${topicFilter}%`)
      }
      const [fallbackRows] = await pool.query(
        `SELECT q.id, q.grade, q.topic_id AS topicId, q.subtopic_id AS subtopicId, s.name AS subject, t.name AS topic, t.parent_topic_id AS parentTopicId, q.subtopic_name AS subtopic,
          q.difficulty, q.question_text AS question,
          q.option_a, q.option_b, q.option_c, q.option_d,
          q.correct_answer, q.explanation, q.distractor_diagnostics
         FROM questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         LEFT JOIN subjects s ON s.id = q.subject_id
         WHERE ${fallbackWhere}
         ORDER BY RAND()
         LIMIT ?`,
        [...fallbackValues, limit],
      )
      rows = fallbackRows
    }

    response.json(rows.map((question) => ({
      id: question.id,
      subject: question.subject || 'Math',
      gradeId: Number(question.grade),
      topicId: question.topicId ?? null,
      grade: `Grade ${question.grade}`,
      topic: question.topic || 'Uncategorized',
      parentTopicId: question.parentTopicId ?? 0,
      subtopicId: question.subtopicId ?? null,
      subtopic: question.subtopic || inferQuestionSubtopic(question.question, question.topic),
      difficulty: question.difficulty,
      distractor_diagnostics: question.distractor_diagnostics,
      question: question.question,
      options: {
        A: question.option_a,
        B: question.option_b,
        C: question.option_c,
        D: question.option_d
      },
      correctAnswer: (question.correct_answer || 'a').toUpperCase(),
      explanation: question.explanation
    })))
  } catch (error) {
    console.error('Questions load failed:', error.message)
    response.status(500).json({ message: 'Unable to load questions.' })
  }
})

app.put('/api/admin/questions/:questionId', async (request, response) => {
  const { question, subject = 'Math', topic, topicId, subtopic, grade, difficulty, options = {}, answer, explanation = null } = request.body
  const rawDiagnostics = request.body.distractor_diagnostics ?? request.body.distractorDiagnostics ?? null
  const distractorDiagnosticsJson = rawDiagnostics ? (typeof rawDiagnostics === 'string' ? rawDiagnostics : JSON.stringify(rawDiagnostics)) : null
  const requestedSubtopicId = request.body.subtopicId ?? request.body.subtopic_id
  const questionId = Number(request.params.questionId)

  if (!Number.isInteger(questionId) || questionId <= 0 || !question?.trim() || !Number.isInteger(Number(grade)) || !['Low', 'Medium', 'High'].includes(difficulty) || !['A', 'B', 'C', 'D'].includes(answer) || ['A', 'B', 'C', 'D'].some((option) => !options[option]?.trim())) {
    return response.status(400).json({ message: 'Question, grade, difficulty, four options, and correct answer are required.' })
  }

  const normalizedTopicName = String(topic || '').trim()
  const normalizedSubtopicName = String(subtopic || '').trim()
  const numericTopicId = Number(topicId)
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [subjectRows] = await connection.query('SELECT id FROM subjects WHERE name = ? LIMIT 1', [subject.trim()])
    const subjectId = subjectRows[0]?.id
    const [gradeRows] = await connection.query('SELECT id FROM grades WHERE id = ? OR name IN (?, ?) ORDER BY id LIMIT 1', [Number(grade), `Grade ${Number(grade)}`, String(Number(grade))])
    const gradeId = gradeRows[0]?.id
    if (!subjectId || !gradeId) {
      await connection.rollback()
      return response.status(400).json({ message: 'Selected subject or grade is not configured.' })
    }

    const selectedTopicId = Number.isInteger(numericTopicId) && numericTopicId > 0 ? numericTopicId : null
    if (!selectedTopicId) {
      await connection.rollback()
      return response.status(400).json({ message: 'Topic is required.' })
    }

    let numericSubtopicId = requestedSubtopicId == null || requestedSubtopicId === '' ? null : Number(requestedSubtopicId)
    if (numericSubtopicId === null && normalizedSubtopicName) {
      const [subtopicRows] = await connection.query('SELECT id FROM topics WHERE parent_topic_id = ? AND name = ? LIMIT 1', [selectedTopicId, normalizedSubtopicName])
      numericSubtopicId = subtopicRows[0]?.id ?? null
    }
    let selectedSubtopicId = null
    let normalizedSelectedSubtopicName = normalizedSubtopicName
    if (numericSubtopicId !== null) {
      const [subtopicRows] = await connection.query('SELECT id, name FROM topics WHERE id = ? AND parent_topic_id = ? LIMIT 1', [numericSubtopicId, selectedTopicId])
      if (!subtopicRows.length) {
        await connection.rollback()
        return response.status(400).json({ message: 'Selected subtopic must belong to the selected topic.' })
      }
      selectedSubtopicId = subtopicRows[0].id
      normalizedSelectedSubtopicName = subtopicRows[0].name
    }

    const [topicRows] = await connection.query('SELECT name FROM topics WHERE id = ? LIMIT 1', [selectedTopicId])
    const chapterName = topicRows[0]?.name || normalizedTopicName || 'General'
    const [chapterResult] = await connection.query('INSERT INTO chapters (subject_id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)', [subjectId, chapterName])
    const chapterId = chapterResult.insertId
    await connection.query(
      `UPDATE questions SET subject_id = ?, topic_id = ?, chapter_id = ?, subtopic_id = ?, subtopic_name = ?,
       question_text = ?, grade_id = ?, grade = ?, difficulty = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?,
       correct_answer = ?, explanation = ?, distractor_diagnostics = ? WHERE id = ?`,
      [subjectId, selectedTopicId, chapterId, selectedSubtopicId, normalizedSelectedSubtopicName || null, question.trim(), gradeId, Number(grade), difficulty, options.A.trim(), options.B.trim(), options.C.trim(), options.D.trim(), answer, explanation, distractorDiagnosticsJson, questionId],
    )
    await connection.commit()
    return response.json({ id: questionId, question: question.trim(), subject: subject.trim(), topic: normalizedTopicName, subtopic: normalizedSelectedSubtopicName || null, subtopicId: selectedSubtopicId, grade: Number(grade), difficulty, options, answer, status: 'Active', explanation, distractor_diagnostics: rawDiagnostics })
  } catch (error) {
    await connection.rollback()
    console.error('Admin question update failed:', error)
    return response.status(500).json({ message: error.message || 'Unable to update question.' })
  } finally {
    connection.release()
  }
})


app.get('/api/feedback', async (request, response) => {
  try {
    const studentId = request.query.studentId ? Number(request.query.studentId) : null
    const filter = Number.isInteger(studentId) && studentId > 0 ? 'WHERE f.student_id = ?' : ''
    const values = filter ? [studentId] : []
    const [rows] = await pool.query(
      `SELECT f.id, u.name, u.email, f.rating, f.comment AS suggestion, f.created_at AS createdAt
       FROM feedback f JOIN users u ON u.id = f.student_id ${filter} ORDER BY f.created_at DESC`,
      values,
    )
    response.json(rows)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load feedback.' })
  }
})

app.post('/api/feedback', async (request, response) => {
  const { studentId, rating, suggestion = '' } = request.body
  const numericStudentId = Number(studentId)
  const numericRating = Number(rating)

  if (!Number.isInteger(numericStudentId) || numericStudentId < 1 || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return response.status(400).json({ message: 'A valid student and rating between 1 and 5 are required.' })
  }

  try {
    const [students] = await pool.query('SELECT id FROM users WHERE id = ? AND role = \'student\' AND status = \'active\'', [numericStudentId])
    if (!students.length) return response.status(404).json({ message: 'Student account not found.' })

    const [existing] = await pool.query('SELECT id FROM feedback WHERE student_id = ? LIMIT 1', [numericStudentId])
    if (existing.length) return response.status(409).json({ message: 'Feedback already submitted. You can edit your existing feedback.' })

    const comment = String(suggestion).trim()
    const [result] = await pool.query(
      'INSERT INTO feedback (student_id, rating, comment) VALUES (?, ?, ?)',
      [numericStudentId, numericRating, comment || null],
    )

    response.status(201).json({ id: result.insertId, studentId: numericStudentId, rating: numericRating, suggestion: comment, createdAt: new Date().toISOString() })
  } catch (error) {
    console.error('Feedback submission failed:', error.message)
    response.status(500).json({ message: 'Unable to save feedback.' })
  }
})

app.put('/api/feedback/:feedbackId', async (request, response) => {
  const numericFeedbackId = Number(request.params.feedbackId)
  const numericStudentId = Number(request.body.studentId)
  const numericRating = Number(request.body.rating)
  const comment = String(request.body.suggestion || '').trim()

  if (!Number.isInteger(numericFeedbackId) || numericFeedbackId < 1 || !Number.isInteger(numericStudentId) || numericStudentId < 1 || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return response.status(400).json({ message: 'A valid feedback record, student, and rating between 1 and 5 are required.' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE feedback SET rating = ?, comment = ? WHERE id = ? AND student_id = ?',
      [numericRating, comment || null, numericFeedbackId, numericStudentId],
    )
    if (!result.affectedRows) return response.status(404).json({ message: 'Feedback record not found for this student.' })

    const [rows] = await pool.query(
      `SELECT f.id, u.name, u.email, f.rating, f.comment AS suggestion, f.created_at AS createdAt
       FROM feedback f JOIN users u ON u.id = f.student_id WHERE f.id = ? AND f.student_id = ?`,
      [numericFeedbackId, numericStudentId],
    )
    response.json(rows[0])
  } catch (error) {
    console.error('Feedback update failed:', error.message)
    response.status(500).json({ message: 'Unable to update feedback.' })
  }
})

// ==================== GRADES MANAGEMENT ====================
app.get('/api/grades', async (_request, response) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM grades ORDER BY id')
    response.json(rows)
  } catch (error) {
    console.error('Grades load failed:', error.message)
    response.status(500).json({ message: 'Unable to load grades.' })
  }
})

/* Duplicate route block retained below only for reference; the active listener is declared at the end of the file.
app.listen(port, async () => {
  try {
    await checkDatabase()
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NULL,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        subject VARCHAR(190) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'in_progress', 'resolved', 'archived') NOT NULL DEFAULT 'new',
        admin_notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_contact_status_created (status, created_at),
        INDEX idx_contact_email (email),
        CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    console.log(`Contact email notifications: ${isMailConfigured() ? 'configured' : 'not configured'}`)
    try {
      await migrateLegacyAssessmentSchema()
    } catch (error) {
      console.warn(`Legacy schema cleanup skipped: ${error.message}`)
    }
    const [questionColumns] = await pool.query('SHOW COLUMNS FROM questions')
    if (!questionColumns.some((column) => column.Field === 'subtopic_id')) {
      await pool.query('ALTER TABLE questions ADD COLUMN subtopic_id BIGINT UNSIGNED NULL AFTER topic_id')
      await pool.query('ALTER TABLE questions ADD CONSTRAINT fk_question_subtopic FOREIGN KEY (subtopic_id) REFERENCES topics(id) ON DELETE SET NULL')
    }
    try {
      await pool.query('ALTER TABLE topics ADD COLUMN parent_topic_id BIGINT UNSIGNED NULL')
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error
    }
    for (const strand of ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']) {
      await pool.query(
        `INSERT INTO topics (subject_id, name, parent_topic_id)
         SELECT s.id, ?, NULL
         FROM subjects s WHERE s.name = 'Math'
         WHERE NOT EXISTS (SELECT 1 FROM topics WHERE name = ? AND parent_topic_id IS NULL)`,
        [strand, strand],
      )
    }
    try {
      await pool.query(
      `UPDATE topics child
       JOIN topics parent
         ON CONVERT(parent.name USING utf8mb4) COLLATE utf8mb4_unicode_ci =
            CONVERT(CASE
         WHEN LOWER(child.name) REGEXP 'equation|expression|function|variable|pattern|linear|inequal|proportional|sequence|algebra' THEN 'Algebra'
         WHEN LOWER(child.name) REGEXP 'area|angle|triangle|polygon|circle|coordinate|congru|similar|transformation|pythag|volume|surface|perimeter|quadrilateral|geometry' THEN 'Geometry'
         WHEN LOWER(child.name) REGEXP 'measurement|unit|length|mass|time|money|convert|capacity|temperature' THEN 'Measurement'
         WHEN LOWER(child.name) REGEXP 'data|statistic|probability|graph|plot|mean|median|mode|sample|survey' THEN 'Data Analysis'
         ELSE 'Number & Operations' END USING utf8mb4) COLLATE utf8mb4_unicode_ci
       SET child.parent_topic_id = parent.id
       WHERE child.parent_topic_id IS NULL
         AND child.name NOT IN ('Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis')`,
      )
    } catch (error) {
      console.warn('Topic parent backfill skipped because legacy topic collations differ.')
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assessment_id BIGINT UNSIGNED NOT NULL,
        student_id BIGINT UNSIGNED NOT NULL,
        overall_score DECIMAL(8,2) NOT NULL DEFAULT 0,
        grade_letter VARCHAR(5) NULL,
        strong_topics LONGTEXT NULL,
        weak_topics LONGTEXT NULL,
        topic_breakdown LONGTEXT NULL,
        recommendations LONGTEXT NULL,
        generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_reports_assessment_id (assessment_id),
        KEY idx_reports_student_id (student_id),
        CONSTRAINT fk_report_attempt FOREIGN KEY (assessment_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        CONSTRAINT fk_report_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('Server ready on port', port)
  } catch (error) {
    console.error('Server bootstrap failed:', error)
    process.exit(1)
  }
})
}

  }

    const [result] = await connection.query(
      `INSERT INTO questions
       (subject_id, topic_id, question_text, grade, difficulty, option_a, option_b, option_c, option_d, correct_answer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, topicId, question.trim(), Number(grade), difficulty, options.A.trim(), options.B.trim(), options.C.trim(), options.D.trim(), answer],
    )
    await connection.commit()
    return response.status(201).json({ id: result.insertId, question: question.trim(), subject: subject.trim(), topic: topic.trim(), grade: Number(grade), difficulty, options, answer, status: 'Active' })
  } catch (error) {
    await connection.rollback()
    console.error('Admin question save failed:', error)
    return response.status(500).json({ message: 'Unable to save question.' })
  } finally {
    connection.release()
  }
})

app.post('/api/assessment-attempts', async (request, response) => {
  const { studentId, attemptId = null, questions = [], answers = {}, selectedTargetGrade = null, estimatedGrade = null, reportData = {}, topicBreakdown = [] } = request.body

  if (!studentId || !Array.isArray(questions)) {
    return response.status(400).json({ message: 'Student and assessment questions are required.' })
  }

  const normalizeAnswer = (value) => {
    if (value == null || value === '') return null
    const normalized = String(value).trim().toUpperCase()
    return ['A', 'B', 'C', 'D'].includes(normalized) ? normalized : null
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const saveReport = async (savedAttemptId) => {
      const overallScore = Number(reportData.accuracy ?? reportData.overallResult?.accuracy ?? 0) * 100
      const gradeLetter = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F'
      const strongTopics = Array.isArray(reportData.strengths) ? reportData.strengths : []
      const weakTopics = Array.isArray(reportData.gaps) ? reportData.gaps : []
      const recommendations = Array.isArray(reportData.recommendedLearningFocus) ? reportData.recommendedLearningFocus : []

      await connection.query(
        `INSERT INTO reports
         (assessment_id, student_id, overall_score, grade_letter, strong_topics, weak_topics, topic_breakdown, recommendations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE overall_score = VALUES(overall_score), grade_letter = VALUES(grade_letter), strong_topics = VALUES(strong_topics), weak_topics = VALUES(weak_topics), topic_breakdown = VALUES(topic_breakdown), recommendations = VALUES(recommendations), generated_at = CURRENT_TIMESTAMP`,
        [savedAttemptId, studentId, overallScore, gradeLetter, JSON.stringify(strongTopics), JSON.stringify(weakTopics), JSON.stringify(topicBreakdown), JSON.stringify(recommendations)],
      )
    }

    const qIds = questions.map((q) => q.id).filter(Boolean)
    let dbCorrectAnswers = new Map()
    if (qIds.length > 0) {
      const [dbQRows] = await connection.query(
        'SELECT id, correct_answer FROM questions WHERE id IN (?)',
        [qIds]
      )
      dbCorrectAnswers = new Map(dbQRows.map((r) => [r.id, normalizeAnswer(r.correct_answer)]))
    }

    if (attemptId) {
      for (const question of questions) {
        if (question.id == null) continue
        const selectedAnswer = normalizeAnswer(answers[question.id])
        const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
        await connection.query(
          `INSERT INTO attempt_answers
           (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
           VALUES (?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE selected_answer = VALUES(selected_answer), correct_answer = VALUES(correct_answer), is_correct = VALUES(is_correct), answered_at = NOW()`,
          [attemptId, question.id, selectedAnswer, correctAnswer, selectedAnswer === correctAnswer],
        )
      }
      const [updatedAnswers] = await connection.query(
        'SELECT COUNT(*) AS answered, SUM(is_correct) AS correct FROM attempt_answers WHERE attempt_id = ?',
        [attemptId],
      )
      const correctAnswers = Number(updatedAnswers[0].correct || 0)
      const answered = Number(updatedAnswers[0].answered || 0)
      await connection.query(
        `UPDATE assessment_attempts
         SET total_questions = ?, correct_answers = ?, wrong_answers = ?, score = ?, percentage = ?, estimated_grade = ?, status = 'submitted', submitted_at = NOW()
         WHERE id = ? AND student_id = ?`,
        [questions.length, correctAnswers, answered - correctAnswers, correctAnswers, questions.length ? Math.round((correctAnswers / questions.length) * 100) : 0, estimatedGrade, attemptId, studentId],
      )
      await connection.query('UPDATE student_profiles SET actual_grade = ? WHERE user_id = ?', [estimatedGrade, studentId])
      await connection.query('DELETE FROM attempt_questions WHERE attempt_id = ?', [attemptId])
      await saveReport(attemptId)
      await connection.commit()
      return response.status(200).json({ id: attemptId, selectedTargetGrade })
    }

    const answerEntries = questions.filter((question) => {
      const selectedAnswer = normalizeAnswer(answers[question.id])
      return selectedAnswer != null
    })
    const correctAnswers = questions.filter((question) => {
      const selectedAnswer = normalizeAnswer(answers[question.id])
      const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
      return selectedAnswer != null && selectedAnswer === correctAnswer
    }).length
    const totalQuestions = questions.length

    const [attemptResult] = await connection.query(
      `INSERT INTO assessment_attempts
       (student_id, total_questions, correct_answers, wrong_answers, score, percentage, estimated_grade, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())`,
      [studentId, totalQuestions, correctAnswers, answerEntries.length - correctAnswers, correctAnswers, totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0, estimatedGrade],
    )

    for (const question of questions) {
      if (question.id == null) continue
      const selectedAnswer = normalizeAnswer(answers[question.id])
      const correctAnswer = dbCorrectAnswers.get(question.id) || normalizeAnswer(question.correct_answer || question.answer || question.correctAnswer || question.correct_option)
      await connection.query(
        `INSERT INTO attempt_answers
         (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [attemptResult.insertId, question.id, selectedAnswer, correctAnswer, selectedAnswer === correctAnswer],
      )
    }

    await connection.query('UPDATE student_profiles SET actual_grade = ? WHERE user_id = ?', [estimatedGrade, studentId])
  await saveReport(attemptResult.insertId)

    await connection.commit()
    return response.status(201).json({ id: attemptResult.insertId, selectedTargetGrade })
  } catch (error) {
    await connection.rollback()
    console.error('Assessment save failed:', error)
    return response.status(500).json({ message: 'Unable to save assessment answers.' })
  } finally {
    connection.release()
  }
})
*/

app.post('/api/assessment-attempts/start', async (request, response) => {
  const { studentId, minGrade = 1, maxGrade = 8, topic = 'Overall', questionCount = 30 } = request.body
  const safeStudentId = Number(studentId)
  const safeMinGrade = Math.min(Math.max(Number(minGrade) || 1, 1), 8)
  const safeMaxGrade = Math.min(Math.max(Number(maxGrade) || 8, safeMinGrade), 8)
  const safeQuestionCount = Math.min(Math.max(Number(questionCount) || 30, 1), 60)

  if (!Number.isInteger(safeStudentId) || safeStudentId < 1) {
    return response.status(400).json({ message: 'Student is required.' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    await connection.query(
      `UPDATE assessment_attempts
       SET status = 'abandoned'
       WHERE status = 'in_progress' AND started_at < DATE_SUB(NOW(), INTERVAL 2 HOUR)`,
    )
    await connection.query(
      `UPDATE assessment_attempts
       SET status = 'abandoned'
       WHERE student_id = ? AND status = 'in_progress'`,
      [safeStudentId],
    )
    await connection.query(
      `DELETE aq FROM attempt_questions aq
       JOIN assessment_attempts a ON a.id = aq.attempt_id
       WHERE a.status <> 'in_progress'`,
    )

    const [attemptResult] = await connection.query(
      `INSERT INTO assessment_attempts (student_id, started_at, status)
       VALUES (?, NOW(), 'in_progress')`,
      [safeStudentId],
    )
    const attemptId = attemptResult.insertId
    const topicFilter = String(topic || '').trim()
    const topicClause = topicFilter && topicFilter !== 'Overall' ? ' AND t.name LIKE ?' : ''
    const values = [safeMinGrade, safeMaxGrade]
    if (topicClause) values.push(`%${topicFilter}%`)

    const [weakRows] = await connection.query(
      `SELECT LOWER(CONCAT(COALESCE(t.name, ''), '|||', COALESCE(q.subtopic_name, ''))) AS weakness
       FROM attempt_answers aa
       JOIN assessment_attempts a ON a.id = aa.attempt_id
       JOIN questions q ON q.id = aa.question_id
       LEFT JOIN topics t ON t.id = q.topic_id
       WHERE a.student_id = ? AND a.status = 'submitted' AND aa.is_correct = 0
       GROUP BY weakness
       ORDER BY COUNT(*) DESC`,
      [safeStudentId],
    )
    const weakAreas = new Set(weakRows.map((row) => row.weakness))

    const [candidates] = await connection.query(
            `SELECT q.id, q.grade, t.name AS topic, t.parent_topic_id AS parentTopicId, q.subtopic_name AS subtopic,
              q.difficulty, q.question_text AS question,
              q.option_a, q.option_b, q.option_c, q.option_d,
              q.correct_answer, q.explanation, q.distractor_diagnostics
       FROM questions q
       LEFT JOIN topics t ON t.id = q.topic_id
      WHERE q.grade BETWEEN ? AND ?
         ${topicClause ? topicClause : ''}
       ORDER BY RAND()
       LIMIT 10000
       FOR UPDATE`,
      values,
    )
    if (candidates.length < safeQuestionCount) {
      const [gradeFallback] = await connection.query(
        `SELECT q.id, q.grade, t.name AS topic, t.parent_topic_id AS parentTopicId, q.subtopic_name AS subtopic,
                q.difficulty, q.question_text AS question,
                q.option_a, q.option_b, q.option_c, q.option_d,
                q.correct_answer, q.explanation, q.distractor_diagnostics
         FROM questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         WHERE q.grade BETWEEN ? AND ?
         ORDER BY RAND()
         LIMIT 10000
         FOR UPDATE`,
        [safeMinGrade, safeMaxGrade],
      )
      candidates.push(...gradeFallback)
    }
    if (candidates.length < safeQuestionCount) {
      const [bankFallback] = await connection.query(
        `SELECT q.id, q.grade, t.name AS topic, t.parent_topic_id AS parentTopicId, q.subtopic_name AS subtopic,
                q.difficulty, q.question_text AS question,
                q.option_a, q.option_b, q.option_c, q.option_d,
                q.correct_answer, q.explanation, q.distractor_diagnostics
         FROM questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         WHERE q.grade IS NOT NULL
         ORDER BY RAND()
         LIMIT 10000
         FOR UPDATE`,
      )
      candidates.push(...bankFallback)
    }

    const selected = []
    const selectedIds = new Set()
    const topics = ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']

    if (!topicFilter || topicFilter === 'Overall') {
      const perTopic = Math.floor(safeQuestionCount / topics.length) // 6 questions per topic
      const topicBuckets = {}

      topics.forEach((top) => {
        const isMatch = (q) => {
          const qTopic = String(q.topic || '').toLowerCase()
          if (top === 'Number & Operations') return qTopic.includes('number') || qTopic.includes('operation')
          if (top === 'Data Analysis') return qTopic.includes('data') || qTopic.includes('analysis') || qTopic.includes('statistic')
          return qTopic.includes(top.toLowerCase().split(' ')[0])
        }

        const targetQ = candidates.filter((q) => isMatch(q) && Number(q.grade) === safeMaxGrade)
        const lowerQ = candidates.filter((q) => isMatch(q) && Number(q.grade) < safeMaxGrade && Number(q.grade) >= safeMinGrade)
          .sort((a, b) => Number(b.grade) - Number(a.grade))
        topicBuckets[top] = [...targetQ, ...lowerQ]
      })

      // Interleave 6 from each topic so student experiences all 5 topics
      for (let i = 0; i < perTopic; i++) {
        for (const top of topics) {
          const candidate = topicBuckets[top]?.find((q) => !selectedIds.has(q.id))
          if (candidate) {
            selected.push(candidate)
            selectedIds.add(candidate.id)
          }
        }
      }
    }

    if (selected.length < safeQuestionCount) {
      for (const question of candidates) {
        if (selected.length >= safeQuestionCount) break
        if (selectedIds.has(question.id)) continue
        selected.push(question)
        selectedIds.add(question.id)
      }
    }
    if (selected.length < safeQuestionCount) {
      const generatedTopic = topicFilter && topicFilter !== 'Overall' ? topicFilter : 'Number & Operations'
      const [topicRows] = await connection.query(
        `SELECT t.id, t.name, t.subject_id AS subjectId, c.id AS chapterId
         FROM topics t
         LEFT JOIN chapters c ON c.subject_id = t.subject_id AND c.name = t.name
         WHERE t.name LIKE ?
         ORDER BY t.parent_topic_id IS NULL DESC, t.id
         LIMIT 1`,
        [`%${generatedTopic}%`],
      )
      let topicRow = topicRows[0]
      if (!topicRow) {
        const [fallbackTopicRows] = await connection.query(
          `SELECT t.id, t.name, t.subject_id AS subjectId, c.id AS chapterId
           FROM topics t
           LEFT JOIN chapters c ON c.subject_id = t.subject_id AND c.name = t.name
           JOIN questions existing ON existing.topic_id = t.id AND existing.status = 'active'
           ORDER BY existing.id
           LIMIT 1`,
        )
        topicRow = fallbackTopicRows[0]
      }
      if (topicRow) {
        let chapterId = topicRow.chapterId
        if (!chapterId) {
          const [chapterResult] = await connection.query(
            `INSERT INTO chapters (subject_id, name) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name)`,
            [topicRow.subjectId, topicRow.name],
          )
          const [chapterRows] = await connection.query(
            'SELECT id FROM chapters WHERE subject_id = ? AND name = ? LIMIT 1',
            [topicRow.subjectId, topicRow.name],
          )
          chapterId = chapterRows[0]?.id || chapterResult.insertId
        }
        const generatedQuestions = await generateGeminiQuestions({
          grade: safeMaxGrade,
          topic: topicRow.name,
          difficulty: 'Medium',
          count: safeQuestionCount - selected.length,
        })
        for (const generated of generatedQuestions) {
          const options = generated.options || {}
          const [result] = await connection.query(
            `INSERT INTO questions
             (subject_id, topic_id, chapter_id, subtopic_name, question_text, grade, difficulty, option_a, option_b, option_c, option_d, correct_answer, explanation, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [topicRow.subjectId, topicRow.id, chapterId, generated.subtopic || 'General', generated.question, safeMaxGrade, generated.difficulty || 'Medium', options.A, options.B, options.C, options.D, generated.answer, generated.explanation || null],
          )
          selected.push({
            id: result.insertId,
            grade: safeMaxGrade,
            topic: topicRow.name,
            subtopic: generated.subtopic || 'General',
            difficulty: generated.difficulty || 'Medium',
            question: generated.question,
            option_a: options.A,
            option_b: options.B,
            option_c: options.C,
            option_d: options.D,
            correct_answer: generated.answer,
            explanation: generated.explanation || null,
          })
        }
      }
    }
    if (!selected.length) {
      await connection.rollback()
      return response.status(409).json({ message: 'No unused questions are currently available for this selection.' })
    }
    if (selected.length < safeQuestionCount) {
      await connection.rollback()
      return response.status(409).json({ message: `Only ${selected.length} questions are available and Gemini could not fill the requested ${safeQuestionCount}.` })
    }

    for (const question of selected) {
      await connection.query(
        'INSERT INTO attempt_questions (attempt_id, question_id) VALUES (?, ?)',
        [attemptId, question.id],
      )
    }
    await connection.query('UPDATE assessment_attempts SET total_questions = ? WHERE id = ?', [selected.length, attemptId])
    await connection.commit()

    return response.status(201).json({
      attemptId,
      questions: selected.map((question) => ({
        id: question.id,
        gradeId: Number(question.grade),
        grade: `Grade ${question.grade}`,
        topic: question.topic || 'Uncategorized',
        parentTopicId: question.parentTopicId ?? 0,
        subtopic: question.subtopic || inferQuestionSubtopic(question.question, question.topic),
        difficulty: question.difficulty,
        question: question.question,
        options: { A: question.option_a, B: question.option_b, C: question.option_c, D: question.option_d },
        correctAnswer: (question.correct_answer || 'A').toUpperCase(),
        explanation: question.explanation,
        distractor_diagnostics: question.distractor_diagnostics,
      })),
    })
  } catch (error) {
    await connection.rollback()
    console.error('Assessment start failed:', error)
    return response.status(500).json({ message: 'Unable to reserve assessment questions.' })
  } finally {
    connection.release()
  }
})

app.post('/api/assessment-attempts/answer', async (request, response) => {
  const { studentId, attemptId = null, questionId, selectedAnswer, correctAnswer } = request.body

  if (!studentId || questionId == null || !['A', 'B', 'C', 'D'].includes(selectedAnswer) || !['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    return response.status(400).json({ message: 'Student, question, and a valid answer are required.' })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    let currentAttemptId = attemptId
    if (!currentAttemptId) {
      const [openAttempts] = await connection.query(
        `SELECT id FROM assessment_attempts
         WHERE student_id = ? AND status = 'in_progress'
         ORDER BY id DESC LIMIT 1`,
        [studentId],
      )
      if (openAttempts.length) {
        currentAttemptId = openAttempts[0].id
      } else {
        const [attemptResult] = await connection.query(
          `INSERT INTO assessment_attempts (student_id, started_at, status)
           VALUES (?, NOW(), 'in_progress')`,
          [studentId],
        )
        currentAttemptId = attemptResult.insertId
      }
    } else {
      const [attemptRows] = await connection.query(
        `SELECT id FROM assessment_attempts
         WHERE id = ? AND student_id = ? AND status = 'in_progress'`,
        [currentAttemptId, studentId],
      )
      if (!attemptRows.length) {
        await connection.rollback()
        return response.status(404).json({ message: 'Assessment attempt not found.' })
      }
    }

    await connection.query(
      `INSERT INTO attempt_answers
       (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE selected_answer = VALUES(selected_answer), correct_answer = VALUES(correct_answer), is_correct = VALUES(is_correct), answered_at = NOW()`,
      [currentAttemptId, questionId, selectedAnswer, correctAnswer, selectedAnswer === correctAnswer],
    )
    await connection.query(
      `UPDATE assessment_attempts
       SET total_questions = (SELECT COUNT(*) FROM attempt_answers WHERE attempt_id = ?),
           correct_answers = (SELECT COALESCE(SUM(is_correct), 0) FROM attempt_answers WHERE attempt_id = ?),
           wrong_answers = (SELECT COUNT(*) - COALESCE(SUM(is_correct), 0) FROM attempt_answers WHERE attempt_id = ?)
       WHERE id = ? AND student_id = ?`,
      [currentAttemptId, currentAttemptId, currentAttemptId, currentAttemptId, studentId],
    )
    await connection.commit()
    return response.status(200).json({ id: currentAttemptId })
  } catch (error) {
    await connection.rollback()
    console.error('Answer save failed:', error)
    return response.status(500).json({ message: 'Unable to save answer.' })
  } finally {
    connection.release()
  }
})

/* Duplicate legacy routes:
app.get('/api/questions', async (request, response) => {
  try {
    const gradeId = Number(request.query.gradeId ?? request.query.grade)
    const minGradeId = Number(request.query.minGradeId ?? request.query.minGrade)
    const maxGradeId = Number(request.query.maxGradeId ?? request.query.maxGrade)
    const topicFilter = String(request.query.topic || '').trim()
    const limit = Math.min(Number(request.query.limit) || 5000, 10000)

    const safeMaxGrade = Math.min(Math.max(Number.isFinite(maxGradeId) ? maxGradeId : 6, 1), 8)
    const safeMinGrade = Math.min(Math.max(Number.isFinite(minGradeId) ? minGradeId : 1, 1), 8)

    let whereClause = 'q.is_active = 1'
    const queryValues = []

    if (Number.isFinite(gradeId) && gradeId >= 1 && gradeId <= 6) {
      whereClause += ' AND q.grade_id = ?'
      queryValues.push(gradeId)
    } else if (Number.isFinite(minGradeId) && Number.isFinite(maxGradeId)) {
      whereClause += ' AND q.grade_id BETWEEN ? AND ?'
      queryValues.push(safeMinGrade, safeMaxGrade)
    } else {
      whereClause += ' AND q.grade_id BETWEEN ? AND ?'
      queryValues.push(1, 6)
    }

    if (topicFilter) {
      whereClause += ' AND (t.name LIKE ?)'
      queryValues.push(`%${topicFilter}%`)
    }

    const [rows] = await pool.query(
      `SELECT q.id, q.grade_id, g.name AS grade, t.name AS topic,
              q.difficulty, q.question_text AS question,
              q.option_a, q.option_b, q.option_c, q.option_d, 
              q.correct_answer, q.explanation
       FROM questions q
       LEFT JOIN grades g ON g.id = q.grade_id
       LEFT JOIN topics t ON t.id = q.topic_id
       WHERE ${whereClause}
       ORDER BY q.grade_id, q.id
       LIMIT ?`,
      [...queryValues, limit],
    )

    response.json(rows.map((question) => ({
      id: question.id,
      gradeId: Number(question.grade_id),
      grade: question.grade || 'Grade Unknown',
      topic: question.topic || 'Uncategorized',
      difficulty: question.difficulty || 'Medium',
      question: question.question,
      options: {
        A: question.option_a,
        B: question.option_b,
        C: question.option_c,
        D: question.option_d
      },
      correctAnswer: (question.correct_answer || '').toUpperCase(),
      explanation: question.explanation
    })))
  } catch (error) {
    console.error('Questions load failed:', error.message)
    response.status(500).json({ message: 'Unable to load questions.' })
  }
})

app.get('/api/feedback', async (request, response) => {
  try {
    const studentId = request.query.studentId ? Number(request.query.studentId) : null
    const filter = Number.isInteger(studentId) && studentId > 0 ? 'WHERE f.student_id = ?' : ''
    const values = filter ? [studentId] : []
    const [rows] = await pool.query(
      `SELECT f.id, u.name, u.email, f.rating, f.comment AS suggestion, f.created_at AS createdAt
       FROM feedback f JOIN users u ON u.id = f.student_id ${filter} ORDER BY f.created_at DESC`,
      values,
    )
    response.json(rows)
  } catch (error) {
    response.status(500).json({ message: 'Unable to load feedback.' })
  }
})

app.post('/api/feedback', async (request, response) => {
  const { studentId, rating, suggestion = '' } = request.body
  const numericStudentId = Number(studentId)
  const numericRating = Number(rating)

  if (!Number.isInteger(numericStudentId) || numericStudentId < 1 || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return response.status(400).json({ message: 'A valid student and rating between 1 and 5 are required.' })
  }

  try {
    const [students] = await pool.query('SELECT id FROM users WHERE id = ? AND role = \'student\' AND status = \'active\'', [numericStudentId])
    if (!students.length) return response.status(404).json({ message: 'Student account not found.' })

    const [existing] = await pool.query('SELECT id FROM feedback WHERE student_id = ? LIMIT 1', [numericStudentId])
    if (existing.length) return response.status(409).json({ message: 'Feedback already submitted. You can edit your existing feedback.' })

    const comment = String(suggestion).trim()
    const [result] = await pool.query(
      'INSERT INTO feedback (student_id, rating, comment) VALUES (?, ?, ?)',
      [numericStudentId, numericRating, comment || null],
    )

    response.status(201).json({ id: result.insertId, studentId: numericStudentId, rating: numericRating, suggestion: comment, createdAt: new Date().toISOString() })
  } catch (error) {
    console.error('Feedback submission failed:', error.message)
    response.status(500).json({ message: 'Unable to save feedback.' })
  }
})

app.put('/api/feedback/:feedbackId', async (request, response) => {
  const numericFeedbackId = Number(request.params.feedbackId)
  const numericStudentId = Number(request.body.studentId)
  const numericRating = Number(request.body.rating)
  const comment = String(request.body.suggestion || '').trim()

  if (!Number.isInteger(numericFeedbackId) || numericFeedbackId < 1 || !Number.isInteger(numericStudentId) || numericStudentId < 1 || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return response.status(400).json({ message: 'A valid feedback record, student, and rating between 1 and 5 are required.' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE feedback SET rating = ?, comment = ? WHERE id = ? AND student_id = ?',
      [numericRating, comment || null, numericFeedbackId, numericStudentId],
    )
    if (!result.affectedRows) return response.status(404).json({ message: 'Feedback record not found for this student.' })

    const [rows] = await pool.query(
      `SELECT f.id, u.name, u.email, f.rating, f.comment AS suggestion, f.created_at AS createdAt
       FROM feedback f JOIN users u ON u.id = f.student_id WHERE f.id = ? AND f.student_id = ?`,
      [numericFeedbackId, numericStudentId],
    )
    response.json(rows[0])
  } catch (error) {
    console.error('Feedback update failed:', error.message)
    response.status(500).json({ message: 'Unable to update feedback.' })
  }
})

// ==================== GRADES MANAGEMENT ====================
app.get('/api/grades', async (_request, response) => {
  try {
    const [grades] = await pool.query(
      `SELECT id, grade_level as gradeLevel, name, description, created_at as createdAt
       FROM grades ORDER BY grade_level ASC`
    )
    response.json(grades)
  } catch (error) {
    console.error('Failed to load grades:', error)
    response.status(500).json({ message: 'Unable to load grades.' })
  }
})

*/
app.post('/api/admin/grades', async (request, response) => {
  const { gradeLevel, name, description } = request.body
  
  if (!gradeLevel || !name?.trim()) {
    return response.status(400).json({ message: 'Grade level and name are required.' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO grades (grade_level, name, description) VALUES (?, ?, ?)`,
      [Number(gradeLevel), name.trim(), description || null]
    )
    response.status(201).json({ 
      id: result.insertId, 
      gradeLevel: Number(gradeLevel), 
      name: name.trim(), 
      description: description || null 
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ message: 'This grade level already exists.' })
    }
    console.error('Failed to create grade:', error)
    response.status(500).json({ message: 'Unable to create grade.' })
  }
})

// ==================== ASSESSMENT ATTEMPT ANSWERS ====================
app.get('/api/assessment-attempts/:attemptId/answers', async (request, response) => {
  try {
    const [answers] = await pool.query(
      `SELECT aa.id, aa.attempt_id as attemptId, aa.question_id as questionId, 
              q.question_text as question, aa.selected_answer as selectedAnswer, 
              aa.correct_answer as correctAnswer, aa.is_correct as isCorrect, 
              aa.answered_at as answeredAt, 
              q.option_a, q.option_b, q.option_c, q.option_d,
              q.difficulty, s.name as subject
       FROM attempt_answers aa
       JOIN questions q ON q.id = aa.question_id
       LEFT JOIN subjects s ON s.id = q.subject_id
       WHERE aa.attempt_id = ?
       ORDER BY aa.answered_at`,
      [request.params.attemptId]
    )
    
    const formattedAnswers = answers.map(a => ({
      ...a,
      isCorrect: Boolean(a.isCorrect),
      options: {
        A: a.option_a,
        B: a.option_b,
        C: a.option_c,
        D: a.option_d
      },
      option_a: undefined,
      option_b: undefined,
      option_c: undefined,
      option_d: undefined
    }))

    response.json(formattedAnswers)
  } catch (error) {
    console.error('Failed to load assessment answers:', error)
    response.status(500).json({ message: 'Unable to load assessment answers.' })
  }
})

app.get('/api/attempt-answers/:attemptId', async (request, response) => {
  try {
    const [answers] = await pool.query(
      `SELECT aa.id, aa.attempt_id as attemptId, aa.question_id as questionId, 
              q.question_text as question, aa.selected_answer as selectedAnswer, 
              aa.correct_answer as correctAnswer, aa.is_correct as isCorrect, 
              aa.answered_at as answeredAt, q.difficulty, s.name as subject
       FROM attempt_answers aa
       JOIN questions q ON q.id = aa.question_id
       LEFT JOIN subjects s ON s.id = q.subject_id
       WHERE aa.attempt_id = ?
       ORDER BY aa.answered_at`,
      [request.params.attemptId]
    )
    
    response.json(answers.map(a => ({
      ...a,
      isCorrect: Boolean(a.isCorrect)
    })))
  } catch (error) {
    console.error('Failed to load attempt answers:', error)
    response.status(500).json({ message: 'Unable to load attempt answers.' })
  }
})

/* Duplicate legacy route replaced by handler at line 1304
app.post('/api/assessment-attempts', async (request, response) => {
  const { studentId, attemptId = null, questions = [], answers = {}, estimatedGrade = null } = request.body
  const numericStudentId = Number(studentId)
  if (!Number.isInteger(numericStudentId) || numericStudentId < 1 || !Array.isArray(questions) || !questions.length) {
    return response.status(400).json({ message: 'Student and assessment questions are required.' })
  }

  try {
    const subscription = await getSubscriptionStatus(numericStudentId)
    if (!subscription.active) {
      return response.status(403).json({ code: 'SUBSCRIPTION_REQUIRED', message: 'Your subscription has expired. Please renew it before submitting an assessment.' })
    }

    const [[profileBeforeSubmit]] = await pool.query('SELECT grade, current_difficulty AS currentDifficulty FROM student_profiles WHERE user_id = ? LIMIT 1', [numericStudentId])
    const currentDifficulty = ['Low', 'Medium', 'High'].includes(profileBeforeSubmit?.currentDifficulty) ? profileBeforeSubmit.currentDifficulty : 'Low'

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      let currentAttemptId = Number(attemptId)
      if (!Number.isInteger(currentAttemptId) || currentAttemptId < 1) {
        const [attemptResult] = await connection.query(
          `INSERT INTO assessment_attempts (student_id, started_at, status, total_questions, difficulty_level)
           VALUES (?, NOW(), 'in_progress', ?, ?)`,
          [numericStudentId, questions.length, currentDifficulty],
        )
        currentAttemptId = attemptResult.insertId
      } else {
        const [attempts] = await connection.query(
          `SELECT id FROM assessment_attempts WHERE id = ? AND student_id = ? LIMIT 1`,
          [currentAttemptId, numericStudentId],
        )
        if (!attempts.length) {
          await connection.rollback()
          return response.status(404).json({ message: 'Assessment attempt not found.' })
        }
      }

      const qIds = questions.map((q) => q.id).filter(Boolean)
      let dbCorrectAnswers = new Map()
      if (qIds.length > 0) {
        const [dbQRows] = await connection.query(
          'SELECT id, correct_answer FROM questions WHERE id IN (?)',
          [qIds]
        )
        dbCorrectAnswers = new Map(dbQRows.map((r) => [r.id, String(r.correct_answer || '').trim().toUpperCase()]))
      }

      let correctAnswers = 0
      let answeredQuestions = 0
      for (const question of questions) {
        if (question.id == null) continue
        const selectedAnswer = String(answers[question.id] || '').trim().toUpperCase() || null
        const correctAnswer = dbCorrectAnswers.get(question.id) || String(question.correct_answer || question.answer || question.correctAnswer || question.correct_option || '').trim().toUpperCase()
        const isCorrect = Boolean(selectedAnswer && correctAnswer && selectedAnswer === correctAnswer)
        if (selectedAnswer) answeredQuestions += 1
        if (isCorrect) correctAnswers += 1
        await connection.query(
          `INSERT INTO attempt_answers (attempt_id, question_id, selected_answer, correct_answer, is_correct, answered_at)
           VALUES (?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE selected_answer = VALUES(selected_answer), correct_answer = VALUES(correct_answer), is_correct = VALUES(is_correct), answered_at = NOW()`,
          [currentAttemptId, question.id, selectedAnswer, correctAnswer, isCorrect],
        )
      }

      const percentage = Math.round((correctAnswers / questions.length) * 100)
      await connection.query(
        `UPDATE assessment_attempts
         SET total_questions = ?, correct_answers = ?, wrong_answers = ?, score = ?, percentage = ?, estimated_grade = ?, status = 'submitted', submitted_at = NOW()
         WHERE id = ? AND student_id = ?`,
        [questions.length, correctAnswers, answeredQuestions - correctAnswers, correctAnswers, percentage, estimatedGrade, currentAttemptId, numericStudentId],
      )
      const currentGradeMatch = String(profileBeforeSubmit?.grade || '').match(/(\d+)/)
      const currentGrade = Number(currentGradeMatch?.[1] || 1)
      const promotedGrade = percentage >= 70 && currentGrade < 8 ? `Grade ${currentGrade + 1}` : profileBeforeSubmit?.grade || `Grade ${currentGrade}`
      const promotedDifficulty = percentage >= 70 && currentDifficulty === 'Low' ? 'Medium' : percentage >= 70 && currentDifficulty === 'Medium' ? 'High' : currentDifficulty
      await connection.query(
        'UPDATE student_profiles SET actual_grade = ?, grade = ?, current_difficulty = ? WHERE user_id = ?',
        [estimatedGrade, promotedGrade, promotedDifficulty, numericStudentId],
      )
      await connection.commit()
      return response.status(200).json({ id: currentAttemptId, total: questions.length, correct: correctAnswers, percentage, promoted: promotedGrade !== profileBeforeSubmit?.grade, promotedGrade, difficulty: promotedDifficulty, subscription })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Assessment submission failed:', error)
    return response.status(500).json({ message: 'Unable to save assessment results.' })
  }
})
*/

// ==================== SUBSCRIPTIONS MANAGEMENT ====================
app.get('/api/subscriptions', async (request, response) => {
  try {
    const userId = request.query.userId
    let query = `SELECT s.id, s.user_id as userId, s.plan_name as planName, 
                        s.price, s.start_date as startDate, s.end_date as endDate, 
                        s.is_active as isActive, s.stripe_subscription_id as stripeSubscriptionId,
                        u.name, u.email
                 FROM subscriptions s
                 JOIN users u ON u.id = s.user_id`
    const queryValues = []

    if (userId) {
      query += ` WHERE s.user_id = ?`
      queryValues.push(userId)
    }

    query += ` ORDER BY s.start_date DESC`
    const [subscriptions] = await pool.query(query, queryValues)
    
    response.json(subscriptions.map(s => ({
      ...s,
      isActive: Boolean(s.isActive),
      price: Number(s.price)
    })))
  } catch (error) {
    console.error('Failed to load subscriptions:', error)
    response.status(500).json({ message: 'Unable to load subscriptions.' })
  }
})

app.post('/api/admin/subscriptions', async (request, response) => {
  const { userId, planName, price, startDate, endDate, stripeSubscriptionId } = request.body

  if (!userId || !planName?.trim() || !price) {
    return response.status(400).json({ message: 'User ID, plan name, and price are required.' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_name, price, start_date, end_date, stripe_subscription_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [userId, planName.trim(), Number(price), startDate || null, endDate || null, stripeSubscriptionId || null]
    )

    response.status(201).json({
      id: result.insertId,
      userId,
      planName: planName.trim(),
      price: Number(price),
      startDate,
      endDate,
      isActive: true,
      stripeSubscriptionId: stripeSubscriptionId || null
    })
  } catch (error) {
    console.error('Failed to create subscription:', error)
    response.status(500).json({ message: 'Unable to create subscription.' })
  }
})

app.put('/api/admin/subscriptions/:subscriptionId', async (request, response) => {
  const { isActive, endDate } = request.body
  const { subscriptionId } = request.params

  try {
    await pool.query(
      `UPDATE subscriptions SET is_active = ?, end_date = ? WHERE id = ?`,
      [isActive ? 1 : 0, endDate || null, subscriptionId]
    )

    const [updated] = await pool.query(
      `SELECT id, user_id as userId, plan_name as planName, price, start_date as startDate,
              end_date as endDate, is_active as isActive, stripe_subscription_id as stripeSubscriptionId
       FROM subscriptions WHERE id = ?`,
      [subscriptionId]
    )

    response.json({
      ...updated[0],
      isActive: Boolean(updated[0].isActive),
      price: Number(updated[0].price)
    })
  } catch (error) {
    console.error('Failed to update subscription:', error)
    response.status(500).json({ message: 'Unable to update subscription.' })
  }
})

app.delete('/api/admin/subscriptions/:subscriptionId', async (request, response) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM subscriptions WHERE id = ?`,
      [request.params.subscriptionId]
    )

    if (!result.affectedRows) {
      return response.status(404).json({ message: 'Subscription not found.' })
    }

    response.status(204).send()
  } catch (error) {
    console.error('Failed to delete subscription:', error)
    response.status(500).json({ message: 'Unable to delete subscription.' })
  }
})

const distPath = path.resolve(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

if (process.env.VERCEL !== '1') {
app.listen(port, async () => {
  try {
    await checkDatabase()
    await autoSeedDatabaseIfNeeded()
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NULL,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        subject VARCHAR(190) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'in_progress', 'resolved', 'archived') NOT NULL DEFAULT 'new',
        admin_notes TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_contact_status_created (status, created_at),
        INDEX idx_contact_email (email),
        CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    console.log(`Contact email notifications: ${isMailConfigured() ? 'configured' : 'not configured'}`)
    try {
      await migrateLegacyAssessmentSchema()
    } catch (error) {
      console.warn(`Legacy schema cleanup skipped: ${error.message}`)
    }
    for (const [table, column, definition] of [
      ['student_profiles', 'current_difficulty', "ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low'"],
      ['assessment_attempts', 'difficulty_level', "ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low'"],
    ]) {
      try {
        await pool.query(`ALTER TABLE ?? ADD COLUMN ?? ${definition}`, [table, column])
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') throw error
      }
    }
    try {
      await pool.query('ALTER TABLE topics ADD COLUMN parent_topic_id BIGINT UNSIGNED NULL')
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error
    }
    for (const strand of ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']) {
      await pool.query(
        `INSERT INTO topics (subject_id, name, parent_topic_id)
         SELECT s.id, ?, NULL
         FROM subjects s
         WHERE s.name = 'Math'
           AND NOT EXISTS (
             SELECT 1 FROM topics
             WHERE CONVERT(name USING utf8mb4) COLLATE utf8mb4_unicode_ci = CONVERT(? USING utf8mb4) COLLATE utf8mb4_unicode_ci
               AND parent_topic_id IS NULL
           )`,
        [strand, strand],
      )
    }
    try {
      await pool.query(
      `UPDATE topics child
       JOIN topics parent
         ON CONVERT(parent.name USING utf8mb4) COLLATE utf8mb4_unicode_ci =
            CONVERT(CASE
         WHEN LOWER(child.name) REGEXP 'equation|expression|function|variable|pattern|linear|inequal|proportional|sequence|algebra' THEN 'Algebra'
         WHEN LOWER(child.name) REGEXP 'area|angle|triangle|polygon|circle|coordinate|congru|similar|transformation|pythag|volume|surface|perimeter|quadrilateral|geometry' THEN 'Geometry'
         WHEN LOWER(child.name) REGEXP 'measurement|unit|length|mass|time|money|convert|capacity|temperature' THEN 'Measurement'
         WHEN LOWER(child.name) REGEXP 'data|statistic|probability|graph|plot|mean|median|mode|sample|survey' THEN 'Data Analysis'
         ELSE 'Number & Operations' END USING utf8mb4) COLLATE utf8mb4_unicode_ci
       SET child.parent_topic_id = parent.id
       WHERE child.parent_topic_id IS NULL
         AND child.name NOT IN ('Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis')`,
      )
    } catch (error) {
      if (error.code !== 'ER_CANT_AGGREGATE_2COLLATIONS') throw error
      console.warn('Topic parent backfill skipped because legacy topic collations differ.')
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        assessment_id BIGINT UNSIGNED NOT NULL,
        student_id BIGINT UNSIGNED NOT NULL,
        overall_score DECIMAL(8,2) NOT NULL DEFAULT 0,
        grade_letter VARCHAR(5) NULL,
        strong_topics LONGTEXT NULL,
        weak_topics LONGTEXT NULL,
        topic_breakdown LONGTEXT NULL,
        recommendations LONGTEXT NULL,
        generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_reports_assessment_id (assessment_id),
        KEY idx_reports_student_id (student_id),
        CONSTRAINT fk_report_attempt FOREIGN KEY (assessment_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        CONSTRAINT fk_report_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attempt_questions (
        attempt_id BIGINT UNSIGNED NOT NULL,
        question_id BIGINT UNSIGNED NOT NULL,
        assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (question_id),
        KEY idx_attempt_questions_attempt (attempt_id),
        CONSTRAINT fk_attempt_question_attempt FOREIGN KEY (attempt_id) REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        CONSTRAINT fk_attempt_question_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `)
    await pool.query(`
      INSERT INTO reports (assessment_id, student_id, overall_score, grade_letter, strong_topics, weak_topics, topic_breakdown, recommendations)
      SELECT a.id, a.student_id, a.percentage,
             CASE WHEN a.percentage >= 90 THEN 'A' WHEN a.percentage >= 80 THEN 'B' WHEN a.percentage >= 70 THEN 'C' WHEN a.percentage >= 60 THEN 'D' ELSE 'F' END,
             JSON_ARRAY(), JSON_ARRAY(), JSON_ARRAY(), '[]'
      FROM assessment_attempts a
      WHERE a.status = 'submitted'
        AND NOT EXISTS (SELECT 1 FROM reports r WHERE r.assessment_id = a.id)
    `)
    console.log(`EduCheck API running at http://localhost:${port}`)
    console.log('MySQL connection: ready')
  } catch (error) {
    console.error(`API running, but MySQL is unavailable: ${error.message}`)
  }
})
}

export default app
