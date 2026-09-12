import test from 'node:test'
import assert from 'node:assert/strict'
import { getStudentCountSql } from './studentCount.js'

test('counts student accounts from users table', () => {
  assert.equal(getStudentCountSql(), "SELECT COUNT(*) AS total FROM users WHERE role = 'student'")
})
