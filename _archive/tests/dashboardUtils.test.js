import test from 'node:test'
import assert from 'node:assert/strict'
import { getProgressTrend, getWeakStrands, getStudentPerformanceTrend, getMathPerformance } from './dashboardUtils.js'

test('getWeakStrands returns strands below the target threshold', () => {
  const assessment = {
    topicBreakdown: [
      { topic: 'Algebra', percentage: 65 },
      { topic: 'Geometry', percentage: 82 },
      { topic: 'Measurement', percentage: 57 },
    ],
  }

  assert.deepEqual(getWeakStrands(assessment), [
    { name: 'Algebra', percentage: 65 },
    { name: 'Measurement', percentage: 57 },
  ])
})

test('getProgressTrend combines history with the latest result', () => {
  const history = [
    { percentage: 60, submittedAt: '2024-01-01T00:00:00.000Z' },
    { percentage: 72, submittedAt: '2024-01-02T00:00:00.000Z' },
  ]
  const result = { percentage: 81, submittedAt: '2024-01-03T00:00:00.000Z' }

  const trend = getProgressTrend(history, result)

  assert.equal(trend.length, 3)
  assert.deepEqual(trend.map((entry) => entry.value), [60, 72, 81])
})

test('getStudentPerformanceTrend uses real submitted scores and keeps the latest result', () => {
  const history = [
    { percentage: 55, submittedAt: '2024-01-01T00:00:00.000Z' },
    { percentage: 68, submittedAt: '2024-01-02T00:00:00.000Z' },
  ]
  const result = { percentage: 74, submittedAt: '2024-01-03T00:00:00.000Z' }

  const trend = getStudentPerformanceTrend(history, result)

  assert.deepEqual(trend.map((entry) => entry.value), [55, 68, 74])
  assert.equal(trend[trend.length - 1].label, 'Latest')
})

test('getMathPerformance returns the latest math score and ignores non-math subjects', () => {
  const history = [
    { percentage: 60, subject: 'Math', submittedAt: '2024-01-01T00:00:00.000Z' },
    { percentage: 72, subject: 'Science', submittedAt: '2024-01-02T00:00:00.000Z' },
    { percentage: 80, subject: 'Math', submittedAt: '2024-01-03T00:00:00.000Z' },
  ]

  assert.equal(getMathPerformance(history), 80)
})
