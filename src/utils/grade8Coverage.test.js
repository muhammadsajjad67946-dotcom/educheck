import assert from 'node:assert/strict'
import { grade8QuestionBank } from '../data/grade8QuestionBank.js'

const grade8NumberOps = grade8QuestionBank.filter((question) => Number(question.grade) === 8 && question.topic === 'Number & Operations')
const grade8Algebra = grade8QuestionBank.filter((question) => Number(question.grade) === 8 && question.topic === 'Algebra')

assert.ok(grade8NumberOps.length >= 20, `Expected at least 20 Number & Operations Grade 8 questions, received ${grade8NumberOps.length}`)
assert.ok(grade8Algebra.length >= 20, `Expected at least 20 Algebra Grade 8 questions, received ${grade8Algebra.length}`)

console.log('Grade 8 coverage:', {
  numberOps: grade8NumberOps.length,
  algebra: grade8Algebra.length,
  total: grade8QuestionBank.filter((question) => Number(question.grade) === 8).length,
})
