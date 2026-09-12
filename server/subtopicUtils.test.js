import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSubtopicSelection } from './subtopicUtils.js'

test('accepts a valid subtopic under the selected parent topic', () => {
  const topics = [
    { id: 1, name: 'Number & Operations', parentTopicId: null },
    { id: 2, name: 'Fractions', parentTopicId: 1 },
    { id: 3, name: 'Decimals', parentTopicId: 1 },
  ]

  const result = validateSubtopicSelection({ topicId: 1, subtopicId: 2, topics })

  assert.equal(result.valid, true)
  assert.equal(result.error, '')
  assert.equal(result.parentTopicId, 1)
  assert.equal(result.subtopicId, 2)
})

test('rejects a subtopic that does not belong to the selected topic', () => {
  const topics = [
    { id: 1, name: 'Number & Operations', parentTopicId: null },
    { id: 2, name: 'Fractions', parentTopicId: 1 },
    { id: 3, name: 'Decimals', parentTopicId: 1 },
    { id: 4, name: 'Algebra', parentTopicId: null },
  ]

  const result = validateSubtopicSelection({ topicId: 4, subtopicId: 2, topics })

  assert.equal(result.valid, false)
  assert.match(result.error, /does not belong/i)
})

test('allows a parent topic without a subtopic selection', () => {
  const topics = [
    { id: 1, name: 'Number & Operations', parentTopicId: null },
    { id: 2, name: 'Fractions', parentTopicId: 1 },
  ]

  const result = validateSubtopicSelection({ topicId: 1, subtopicId: null, topics })

  assert.equal(result.valid, true)
  assert.equal(result.parentTopicId, 1)
  assert.equal(result.subtopicId, null)
})
