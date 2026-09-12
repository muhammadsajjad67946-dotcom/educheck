import test from 'node:test'
import assert from 'node:assert/strict'
import { buildStudentRegistrationProfile } from './authProfile.js'

test('student registration resets role to student even if current user is admin', () => {
  const profile = buildStudentRegistrationProfile(
    { id: 9, name: 'Admin', email: 'admin@educheck.com', role: 'admin' },
    { id: 42, actualGrade: null },
    {
      name: 'Ali Khan',
      email: 'ali@example.com',
      fatherName: 'Hamza',
      age: 12,
      grade: 'Grade 5',
    },
  )

  assert.equal(profile.role, 'student')
  assert.equal(profile.name, 'Ali Khan')
  assert.equal(profile.email, 'ali@example.com')
  assert.equal(profile.grade, 'Grade 5')
})
