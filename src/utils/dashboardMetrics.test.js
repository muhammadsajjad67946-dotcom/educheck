import test from 'node:test'
import assert from 'node:assert/strict'

import { buildDashboardMetrics } from './dashboardMetrics.js'

test('buildDashboardMetrics uses assessment values and payment records from the database', () => {
  const summary = buildDashboardMetrics({
    assessments: [
      { percentage: 95 },
      { percentage: 80 },
      { percentage: 60 },
    ],
    payments: [
      { status: 'paid' },
    ],
    userGrade: 'Grade 6',
  })

  assert.equal(summary.totalAssessments, 3)
  assert.equal(summary.averageAccuracy, 78)
  assert.equal(summary.currentGradeLevel, 4.9)
  assert.equal(summary.paymentStatus, 'paid')
})

test('buildDashboardMetrics starts a new user at zero before any assessment', () => {
  const summary = buildDashboardMetrics({
    assessments: [],
    payments: [],
    userGrade: 'Grade 6',
  })

  assert.equal(summary.totalAssessments, 0)
  assert.equal(summary.averageAccuracy, 0)
  assert.equal(summary.currentGradeLevel, 0)
})
