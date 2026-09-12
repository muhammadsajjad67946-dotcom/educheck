import test from 'node:test'
import assert from 'node:assert/strict'
import { updateStudentAfterAssessment } from './studentRecords.js'

test('updateStudentAfterAssessment increments tests and updates average score', () => {
  const students = [
    { id: 1, name: 'Ali Khan', email: 'ali@example.com', grade: 'Grade 8', tests: 2, avgScore: 80, status: 'Active', joinedDate: 'Aug 16, 2026' },
  ]

  const updated = updateStudentAfterAssessment(students, { name: 'Ali Khan', email: 'ali@example.com', percentage: 90 })

  assert.equal(updated[0].tests, 3)
  assert.equal(updated[0].avgScore, 83)
  assert.equal(updated[0].status, 'Active')
})

test('updateStudentAfterAssessment creates a new student record when no match exists', () => {
  const students = []

  const updated = updateStudentAfterAssessment(students, { name: 'Sara', email: 'sara@example.com', percentage: 76 })

  assert.equal(updated.length, 1)
  assert.equal(updated[0].name, 'Sara')
  assert.equal(updated[0].tests, 1)
  assert.equal(updated[0].avgScore, 76)
})
