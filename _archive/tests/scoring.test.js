import assert from 'node:assert/strict'
import { computeTopicPercent, computeTopicGrade, computeOverallGrade, computeColor } from './scoring.js'

// Topic percent basic
assert.strictEqual(computeTopicPercent({ attempts: 10, correct: 7 }), 0.7)
assert.strictEqual(computeTopicPercent({ attempts: 0, correct: 0 }), NaN)

// Topic grade mapping (Grade 1-8)
const g = computeTopicGrade({ attempts: 10, correct: 5 }, 1, 8)
assert.strictEqual(g, 4.5)

// Overall grade from two topics
const overall = computeOverallGrade([{ attempts: 10, correct: 8 }, { attempts: 5, correct: 2 }], null, 1, 8)
// topic percents: 0.8 and 0.4 => avg 0.6 => grade = 1 + 0.6*7 = 5.2
assert.strictEqual(overall, 5.2)

// Color outputs
assert.strictEqual(computeColor(null, [1, 2], false).name, 'grey')
assert.strictEqual(computeColor(1.0, [2, 3], true).name, 'below')
assert.strictEqual(['on-target', 'above'].includes(computeColor(3.5, [2, 3.5], true).name), true)

console.log('scoring.test.js: all tests passed')
