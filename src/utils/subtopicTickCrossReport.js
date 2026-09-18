import { GRADE_EIGHT_CURRICULUM } from './gradeOneTaxonomy.js'

export function resolveSubtopicOutcome({ attempts = 0, correct = 0, wrong = 0 }) {
  if (!attempts) return '–'
  if (wrong > 0) return '✗'
  if (correct > 0) return '✓'
  return '–'
}

export function formatSubtopicTitle(name) {
  if (!name) return 'General Skills'
  let clean = String(name).trim()
  if (clean.includes('>')) {
    clean = clean.split('>').pop().trim()
  }
  return clean
    .split(/\s+/)
    .map((word, idx) => {
      const lower = word.toLowerCase()
      if (idx > 0 && ['and', 'or', 'of', 'in', 'on', 'to', 'for', 'with', 'a', 'an', 'the', '&'].includes(lower)) {
        return lower === '&' ? '&' : lower
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function getQuestionTopic(question) {
  const rawTopic = String(question.topic || '').trim()
  const topic = rawTopic.toLowerCase()
  if (topic.includes('number')) return 'Number & Operations'
  if (topic.includes('algebra')) return 'Algebra'
  if (topic.includes('measurement')) return 'Measurement'
  if (topic.includes('geometry')) return 'Geometry'
  if (topic.includes('data')) return 'Data Analysis'
  return rawTopic || 'General'
}

function flattenTaxonomy(value, path = []) {
  if (Array.isArray(value)) {
    return value.map((leaf) => ({ leaf: String(leaf), path: [...path, String(leaf)] }))
  }

  return Object.entries(value || {}).flatMap(([key, child]) => flattenTaxonomy(child, [...path, key]))
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function findTaxonomySubtopic(question, candidates) {
  const explicitSubtopic = normalize(question.subtopic)
  if (explicitSubtopic) {
    const explicitMatch = candidates.find(({ leaf, path }) => {
      const leafText = normalize(leaf)
      const pathText = normalize(path.join(' '))
      return leafText === explicitSubtopic || pathText.includes(explicitSubtopic)
    })
    if (explicitMatch) return explicitMatch
  }

  const questionWords = new Set(normalize(`${question.question || ''} ${question.topic || ''}`).split(' ').filter((word) => word.length > 2))
  let bestMatch = null
  let bestScore = 0

  for (const candidate of candidates) {
    const words = normalize(candidate.leaf).split(' ').filter((word) => word.length > 2)
    const score = words.reduce((total, word) => total + (questionWords.has(word) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestMatch = candidate
    }
  }

  return bestMatch
}

function getDatabaseSubtopics(topic, topicHierarchy) {
  const normalizedTopic = normalize(topic)
  return (topicHierarchy[normalizedTopic] || []).filter(Boolean)
}

function isParentTopicLabel(value, topic) {
  const normalizedValue = normalize(value)
  const normalizedTopic = normalize(topic)
  return !normalizedValue || normalizedValue === normalizedTopic || normalizedValue === 'general'
}

function findDatabaseSubtopic(question, candidates) {
  const explicitSubtopic = normalize(question.subtopic)
  const explicitMatch = candidates.find((candidate) => normalize(candidate) === explicitSubtopic)
  if (explicitMatch) return explicitMatch

  const questionWords = new Set(normalize(`${question.question || ''} ${question.subtopic || ''}`).split(' ').filter((word) => word.length > 2))
  let bestMatch = null
  let bestScore = 0
  for (const candidate of candidates) {
    const score = normalize(candidate).split(' ').filter((word) => word.length > 2).reduce(
      (total, word) => total + (questionWords.has(word) ? 1 : 0),
      0,
    )
    if (score > bestScore) {
      bestScore = score
      bestMatch = candidate
    }
  }

  return bestMatch
}

export function buildSubtopicTickCrossReport(questions = [], answers = {}, targetGrade = null, topicDescriptions = {}, topicHierarchy = {}) {
  void targetGrade
  const gradeMap = new Map()

  for (const question of questions) {
    if (!question || typeof question !== 'object') continue

    const gradeNumber = Number(question.grade)
    const gradeKey = Number.isFinite(gradeNumber) ? `Grade ${gradeNumber}` : 'Grade 1'
    const topic = getQuestionTopic(question)
    if (!gradeMap.has(gradeKey)) gradeMap.set(gradeKey, new Map())
    const topicMap = gradeMap.get(gradeKey)
    if (!topicMap.has(topic)) topicMap.set(topic, new Map())
    const subtopicMap = topicMap.get(topic)

    const rawSubtopic = String(question.subtopic || '').trim()
    const databaseSubtopics = getDatabaseSubtopics(topic, topicHierarchy)
    const databaseSubtopic = findDatabaseSubtopic(question, databaseSubtopics)
    const topicDescription = String(
      question.topicDescription
      || question.topic_description
      || question.description
      || topicDescriptions[topic]
      || '',
    ).trim()
    let subtopic = databaseSubtopic
      || (isParentTopicLabel(rawSubtopic, topic) ? topicDescription : rawSubtopic)
    if ((!subtopic || isParentTopicLabel(subtopic, topic)) && gradeNumber === 8 && GRADE_EIGHT_CURRICULUM[topic]) {
      const matched = findTaxonomySubtopic(question, flattenTaxonomy(GRADE_EIGHT_CURRICULUM[topic]))
      if (matched?.leaf) subtopic = matched.leaf
    }
    subtopic = subtopic
      || String(question.topicDescription || question.topic_description || question.description || topicDescriptions[topic] || '').trim()
      || 'General Skills'
    if (isParentTopicLabel(subtopic, topic)) subtopic = 'General Skills'
    const reportSubtopic = formatSubtopicTitle(subtopic)

    const existing = subtopicMap.get(reportSubtopic) || { attempts: 0, correct: 0, wrong: 0 }
    const selectedAnswer = answers[question.id]
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== ''
    const isCorrect = isAnswered && String(selectedAnswer) === String(question.answer)
    subtopicMap.set(reportSubtopic, {
      attempts: existing.attempts + (isAnswered ? 1 : 0),
      correct: existing.correct + (isCorrect ? 1 : 0),
      wrong: existing.wrong + (isAnswered && !isCorrect ? 1 : 0),
    })
  }

  const orderedReport = {}
  const gradeEntries = [...gradeMap.entries()].sort((a, b) => (Number(a[0].replace(/\D+/g, '')) || 1) - (Number(b[0].replace(/\D+/g, '')) || 1))
  for (const [gradeKey, topicMap] of gradeEntries) {
    const topicEntries = {}
    for (const [topic, subtopicMap] of [...topicMap.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      const filteredSubtopics = Object.fromEntries(
        [...subtopicMap.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .filter(([, details]) => Number(details.attempts || 0) > 0)
          .map(([subtopic, details]) => [subtopic, resolveSubtopicOutcome(details)]),
      )

      if (Object.keys(filteredSubtopics).length) {
        topicEntries[topic] = filteredSubtopics
      }
    }

    if (Object.keys(topicEntries).length) {
      orderedReport[gradeKey] = topicEntries
    }
  }

  return orderedReport
}

export function findWeakSubtopics(questions = [], answers = {}, topicDescriptions = {}) {
  const performance = new Map()

  for (const question of questions) {
    if (!question || typeof question !== 'object') continue

    const topic = getQuestionTopic(question)
    const rawSubtopic = String(question.subtopic || '').trim()
    const description = String(
      question.topicDescription
      || question.topic_description
      || question.description
      || topicDescriptions[topic]
      || '',
    ).trim()
    const subtopic = isParentTopicLabel(rawSubtopic, topic)
      ? (description || 'General Skills')
      : rawSubtopic
    const key = `${topic}|||${subtopic}`
    const selectedAnswer = answers[question.id]
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== ''
    if (!isAnswered) continue

    const current = performance.get(key) || { topic, subtopic, attempts: 0, correct: 0, wrong: 0 }
    const isCorrect = String(selectedAnswer) === String(question.answer)
    performance.set(key, {
      ...current,
      attempts: current.attempts + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
    })
  }

  return [...performance.values()]
    .map((item) => ({ ...item, accuracy: item.attempts ? item.correct / item.attempts : 0 }))
    .filter((item) => item.accuracy < 0.6)
    .sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong || a.topic.localeCompare(b.topic) || a.subtopic.localeCompare(b.subtopic))
}

export function findWeakestSubtopic(questions = [], answers = {}) {
  return findWeakSubtopics(questions, answers)[0] || null
}
