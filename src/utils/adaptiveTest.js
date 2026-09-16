import { CONCEPT_FAMILY_MAP } from './gradeOneTaxonomy.js'

export const ADAPTIVE_TOPICS = ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']
export const ADAPTIVE_DIFFICULTIES = ['Low', 'Medium', 'High']
export const MAX_ADAPTIVE_QUESTIONS = 30
export const GRADE_BATCH_QUESTION_COUNT = 30
export const QUESTIONS_PER_CATEGORY = 6
export const QUESTIONS_PER_GRADE_BATCH = 6
export const BATCH_PASSING_SCORE = 4
export const MAX_PROBE_DEPTH = 1

export function shuffleArray(array) {
  const arr = [...(array || [])]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function normalizeConceptKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getFoundationAliases(subtopic) {
  const normalized = normalizeConceptKey(subtopic)
  if (!normalized) return []

  const directMatches = Object.entries(CONCEPT_FAMILY_MAP)
    .filter(([key, aliases]) => {
      const allNames = [key, ...aliases]
      return allNames.some((candidate) => normalizeConceptKey(candidate) === normalized || normalizeConceptKey(candidate).includes(normalized) || normalized.includes(normalizeConceptKey(candidate)))
    })
    .flatMap(([, aliases]) => aliases)

  return [...new Set([...(directMatches), ...(subtopic ? [subtopic] : [])])]
}

function findFoundationalQuestion(questionBank, topic, subtopic, currentGrade, askedIds = [], usedQuestionIds = []) {
  const helperAliases = getFoundationAliases(subtopic)
  const targetGrade = Math.max(1, Number(currentGrade) - 1)
  const alreadyAsked = new Set(Array.isArray(askedIds) ? askedIds : [])
  const isUnused = (q) => !alreadyAsked.has(q.id) && q.topic === topic

  const isSameSubtopicOrAlias = (q) => (
    matchesQuestionSubtopic(q, subtopic) ||
    helperAliases.some((alias) => matchesQuestionSubtopic(q, alias))
  )

  // 1. Priority 1: Immediate lower grade (currentGrade - 1) for the EXACT SAME SUBTOPIC
  const exactLowerGrade = questionBank.filter((q) => isUnused(q) && Number(q.grade) === targetGrade && isSameSubtopicOrAlias(q))
  if (exactLowerGrade.length) {
    return exactLowerGrade[Math.floor(Math.random() * exactLowerGrade.length)]
  }

  // 2. Priority 2: Any lower grade (< currentGrade) for the EXACT SAME SUBTOPIC
  for (let g = targetGrade - 1; g >= 1; g--) {
    const earlierGrade = questionBank.filter((q) => isUnused(q) && Number(q.grade) === g && isSameSubtopicOrAlias(q))
    if (earlierGrade.length) {
      return earlierGrade[Math.floor(Math.random() * earlierGrade.length)]
    }
  }

  // 3. Priority 3: Low difficulty foundational question of the EXACT SAME SUBTOPIC at current grade
  const sameSubtopicLow = questionBank.filter((q) => isUnused(q) && Number(q.grade) === Number(currentGrade) && isSameSubtopicOrAlias(q) && q.difficulty === 'Low')
  if (sameSubtopicLow.length) {
    return sameSubtopicLow[Math.floor(Math.random() * sameSubtopicLow.length)]
  }

  // 4. Priority 4: Any other unused question of the EXACT SAME SUBTOPIC
  const sameSubtopicAny = questionBank.filter((q) => isUnused(q) && isSameSubtopicOrAlias(q))
  if (sameSubtopicAny.length) {
    return sameSubtopicAny[Math.floor(Math.random() * sameSubtopicAny.length)]
  }

  // 5. Fallback only if no questions exist for this subtopic: Low difficulty from the same topic
  const fallback = questionBank.filter((q) => isUnused(q) && (Number(q.grade) <= targetGrade || q.difficulty === 'Low'))
  if (fallback.length) {
    return fallback[Math.floor(Math.random() * fallback.length)]
  }

  return null
}

export function getMaxAdaptiveQuestionBudget(_currentGrade) {
  return MAX_ADAPTIVE_QUESTIONS
}

export function getBenchmarkGrade(targetGrade) {
  const maxGrade = clamp(Number(targetGrade) || 1, 1, 8)
  return Math.max(1, Math.ceil(maxGrade / 2))
}

function getAdaptiveNextGrade(currentGrade, lowGrade, highGrade, isCorrect, minimumGrade = 1) {
  const adjustedLow = Math.max(Number(lowGrade) || minimumGrade, minimumGrade)
  const adjustedHigh = Math.max(adjustedLow, Number(highGrade) || currentGrade)

  if (isCorrect) {
    if (currentGrade >= adjustedHigh) return adjustedHigh
    return clamp(Math.ceil((currentGrade + adjustedHigh) / 2), currentGrade, adjustedHigh)
  }

  if (currentGrade <= adjustedLow) return adjustedLow
  return clamp(Math.floor((currentGrade + adjustedLow) / 2), adjustedLow, currentGrade)
}

function difficultyIndex(difficulty) {
  const index = ADAPTIVE_DIFFICULTIES.indexOf(difficulty)
  return index === -1 ? 1 : index
}

function questionDistance(question, grade, difficulty) {
  return Math.abs(Number(question.grade) - grade) * 10
    + Math.abs(difficultyIndex(question.difficulty) - difficultyIndex(difficulty))
}

function inferSubtopicFromText(question, topic) {
  const text = String(question?.question || '').toLowerCase()

  if (topic === 'Number & Operations') {
    if (/(lcm|least common multiple|common multiple)/.test(text)) return 'LCM'
    if (/(gcd|hcf|greatest common divisor|highest common factor)/.test(text)) return 'GCD'
    if (/(fraction|numerator|denominator|equivalent fraction|simplify.*fraction|mixed number)/.test(text)) return 'Fractions'
    if (/(decimal|decimal point|tenths|hundredths|decimal value)/.test(text)) return 'Decimals'
    if (/(integer|negative|positive|absolute value|opposite)/.test(text)) return 'Integers'
    if (/(ratio|proportion|percent|percentage|rate)/.test(text)) return 'Ratios & Percent'
    if (/(exponent|power|square root|cube root|root)/.test(text)) return 'Exponents & Roots'
    if (/(order of operations|pemdas|parentheses|brackets)/.test(text)) return 'Order of Operations'
    if (/(place value|digit|hundreds|tens|ones|expanded form)/.test(text)) return 'Place Value'
    if (/(multiply|product|factor|times table|multiple)/.test(text)) return 'Multiplication'
    if (/(divide|division|quotient|remainder|divisible)/.test(text)) return 'Division'
    if (/(add|sum|total|subtract|difference|estimate)/.test(text)) return 'Addition & Subtraction'
  }

  if (topic === 'Algebra') {
    if (/(equation|solve.*x|variable|unknown)/.test(text)) return 'Equations'
    if (/(pattern|sequence|term)/.test(text)) return 'Patterns'
    if (/(expression|evaluate|simplify)/.test(text)) return 'Expressions'
  }

  if (topic === 'Geometry') {
    if (/(angle|triangle|circle|polygon)/.test(text)) return 'Shapes & Angles'
    if (/(area|perimeter|volume|surface)/.test(text)) return 'Measurement in Geometry'
  }

  if (topic === 'Measurement') {
    if (/(area|perimeter|volume|surface)/.test(text)) return 'Area & Perimeter'
    if (/(time|clock|hour|minute|seconds)/.test(text)) return 'Time'
    if (/(length|cm|m|inch|meter|distance)/.test(text)) return 'Length'
  }

  if (topic === 'Data Analysis') {
    if (/(mean|median|mode|range|average)/.test(text)) return 'Statistics'
    if (/(graph|bar graph|line plot|pie chart|histogram)/.test(text)) return 'Graphs'
    if (/(probability|chance|likely|unlikely)/.test(text)) return 'Probability'
  }

  return null
}

function normalizeQuestionText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getQuestionPatternKey(question) {
  const text = normalizeQuestionText(question?.question)
  const topic = String(question?.topic || '').trim()
  const subtopic = String(question?.subtopic || question?.topic || '').trim()

  if (!text) return `${topic}|general`

  if (/(place value|digit.*value|value of .* in|expanded form|standard form|nearest|rounding)/.test(text)) return `${subtopic}|place-value-pattern`
  if (/(compare|greater than|less than|order|ascending|descending|which is larger|which is smaller)/.test(text)) return `${subtopic}|comparison-pattern`
  if (/(simplify|equivalent|lowest terms|convert|fraction.*to|decimal.*to)/.test(text)) return `${subtopic}|representation-pattern`
  if (/(add|sum|subtract|difference|multiply|product|divide|quotient|percentage|percent)/.test(text)) return `${subtopic}|operation-pattern`
  if (/(factor|multiple|gcd|hcf|lcm|common divisor|common multiple)/.test(text)) return `${subtopic}|factor-pattern`
  if (/(equation|solve.*x|variable|unknown|expression|evaluate)/.test(text)) return `${subtopic}|algebra-pattern`
  if (/(area|perimeter|volume|angle|triangle|circle|coordinate|graph)/.test(text)) return `${subtopic}|geometry-pattern`
  if (/(mean|median|mode|range|probability|chance|graph|data)/.test(text)) return `${subtopic}|data-pattern`

  return `${subtopic}|general-pattern`
}

function normalizeQuestionSubtopics(question) {
  if (Array.isArray(question?.subtopics) && question.subtopics.length) return question.subtopics.filter(Boolean)
  if (Array.isArray(question?.subtopic) && question.subtopic.length) return question.subtopic.filter(Boolean)

  const direct = question?.subtopic || question?.topic
  if (direct && direct !== question?.topic) return [direct]

  const inferred = inferSubtopicFromText(question, question?.topic)
  if (inferred) return [inferred]

  return direct ? [direct] : [question?.topic || 'General']
}

function getQuestionSubtopics(questionBank, topic) {
  const subtopics = [...new Set(questionBank
    .filter((question) => question.topic === topic)
    .flatMap((question) => normalizeQuestionSubtopics(question))
    .filter(Boolean))]
  return subtopics.length ? subtopics : [topic]
}

function initializeSubtopicProgress(subtopics) {
  return Object.fromEntries(subtopics.map((subtopic) => [subtopic, { attempts: 0, correct: 0, wrong: 0, revisitCount: 0 }]))
}

function subtopicProgressReady(subtopicProgress) {
  if (!subtopicProgress) return false
  const attempts = Number(subtopicProgress.attempts) || 0
  const correct = Number(subtopicProgress.correct) || 0
  const wrong = Number(subtopicProgress.wrong) || 0
  return attempts >= 4 && (correct >= 3 || wrong >= 3)
}

function shouldAdvanceSubtopic(subtopicProgress, isCorrect, requiredEvidence = 4) {
  if (!subtopicProgress) return false
  const attempts = Number(subtopicProgress.attempts) || 0
  const correct = Number(subtopicProgress.correct) || 0
  const wrong = Number(subtopicProgress.wrong) || 0
  if (attempts < requiredEvidence) return false
  return isCorrect ? correct >= 3 : wrong >= 3
}

function calculateConfidence(correct, wrong, attempts) {
  if (!attempts) return 0
  const correctRatio = correct / attempts
  return Math.min(1, (attempts / 6) * correctRatio)
}

function getSubtopicStatus(progress) {
  const attempts = Number(progress?.attempts) || 0
  const correct = Number(progress?.correct) || 0
  const wrong = Number(progress?.wrong) || 0

  if (!attempts) return 'unknown'
  if ((correct >= 2 && wrong === 0) || (correct >= 3 && attempts >= 3)) return 'mastered'
  if (wrong >= 2 && attempts >= 2) return 'needs_support'
  if (attempts >= 1) return 'developing'
  return 'unknown'
}

function getSubtopicConfidence(progress) {
  const attempts = Number(progress?.attempts) || 0
  const correct = Number(progress?.correct) || 0
  const wrong = Number(progress?.wrong) || 0
  return calculateConfidence(correct, wrong, attempts)
}

function findNextUnresolvedSubtopic(topicSubtopics, subtopicProgress, currentSubtopic) {
  const currentIndex = Math.max(0, topicSubtopics.indexOf(currentSubtopic))
  for (let offset = 1; offset < topicSubtopics.length; offset += 1) {
    const candidate = topicSubtopics[(currentIndex + offset) % topicSubtopics.length]
    const progress = subtopicProgress?.[candidate] || { attempts: 0, correct: 0, wrong: 0, revisitCount: 0 }
    const status = getSubtopicStatus(progress)
    if (status === 'unknown' || status === 'developing') return candidate
  }
  return currentSubtopic || topicSubtopics[0]
}

function findWeakSubtopicForRevisit(topicSubtopics, subtopicProgress) {
  // Find weak subtopics eligible for targeted revisit
  // Only revisit if: needs_support status AND hasn't been revisited yet
  const weakCandidates = topicSubtopics.filter((subtopic) => {
    const progress = subtopicProgress?.[subtopic] || { attempts: 0, correct: 0, wrong: 0, revisitCount: 0 }
    const status = getSubtopicStatus(progress)
    const revisitCount = Number(progress?.revisitCount) || 0
    return status === 'needs_support' && revisitCount === 0
  })

  if (!weakCandidates.length) return null
  // Return first weak candidate for revisit
  return weakCandidates[0]
}

function resolveCurrentSubtopic(topicSubtopics, currentSubtopic, questionSubtopics, subtopicProgress) {
  if (Array.isArray(questionSubtopics) && questionSubtopics.length) {
    const preferred = questionSubtopics.find((subtopic) => subtopic && topicSubtopics.includes(subtopic)) || questionSubtopics[0]
    if (preferred && preferred !== currentSubtopic) return preferred
  }

  const unresolved = topicSubtopics.find((subtopic) => !subtopicProgressReady(subtopicProgress?.[subtopic] || { attempts: 0, correct: 0, wrong: 0 }))
  return unresolved || currentSubtopic || topicSubtopics[0]
}

function matchesQuestionSubtopic(question, subtopic) {
  if (!subtopic) return true
  const qSub = normalizeConceptKey(question.subtopic || question.subtopic_name)
  const targetSub = normalizeConceptKey(subtopic)
  if (!qSub || !targetSub) return false
  if (qSub === targetSub) return true
  if (qSub.includes(targetSub) || targetSub.includes(qSub)) return true
  const subtopics = normalizeQuestionSubtopics(question).map(normalizeConceptKey)
  return subtopics.some((s) => s === targetSub || s.includes(targetSub) || targetSub.includes(s))
}

export function selectAdaptiveQuestion(questionBank, topic, grade, difficulty, askedIds = [], targetGrade = 8, subtopic = null, usedQuestionIds = []) {
  const maxGrade = Number(targetGrade) || 8
  const normalizedGrade = clamp(Number(grade) || getBenchmarkGrade(maxGrade), 1, maxGrade)
  const globalUsed = new Set(Array.isArray(usedQuestionIds) ? usedQuestionIds : [])

  const recentPatternCounts = new Map()
  const recentSubtopicCounts = new Map()
  for (const questionId of askedIds) {
    const matchingQuestion = questionBank.find((question) => Number(question.id) === Number(questionId))
    if (!matchingQuestion) continue
    const patternKey = getQuestionPatternKey(matchingQuestion)
    recentPatternCounts.set(patternKey, (recentPatternCounts.get(patternKey) || 0) + 1)
    for (const item of normalizeQuestionSubtopics(matchingQuestion)) {
      recentSubtopicCounts.set(item, (recentSubtopicCounts.get(item) || 0) + 1)
    }
  }

  const basePool = questionBank.filter((question) => (
    question.topic === topic
    && Number(question.grade) >= 1
    && Number(question.grade) <= maxGrade
    && !askedIds.includes(question.id)
    && !globalUsed.has(question.id)
  ))

  const sameSubtopicPool = subtopic ? basePool.filter((question) => matchesQuestionSubtopic(question, subtopic)) : basePool
  const alternateSubtopicPool = subtopic ? basePool.filter((question) => !matchesQuestionSubtopic(question, subtopic)) : []
  const currentSubtopicSeen = Number(recentSubtopicCounts.get(subtopic) || 0)

  const unseenPatternPool = basePool.filter((question) => (recentPatternCounts.get(getQuestionPatternKey(question)) || 0) === 0)
  const unseenCurrentSubtopicPool = subtopic ? unseenPatternPool.filter((question) => matchesQuestionSubtopic(question, subtopic)) : unseenPatternPool
  const unseenAlternatePool = subtopic ? unseenPatternPool.filter((question) => !matchesQuestionSubtopic(question, subtopic)) : []

  const preferredPool = (
    currentSubtopicSeen >= 2 && unseenAlternatePool.length
      ? unseenAlternatePool
      : (unseenCurrentSubtopicPool.length ? unseenCurrentSubtopicPool : (unseenPatternPool.length ? unseenPatternPool : basePool))
  )

  const available = preferredPool.filter((question) => {
    if (subtopic && currentSubtopicSeen < 2) return matchesQuestionSubtopic(question, subtopic)
    return true
  })

  const grade6To8PriorityPool = normalizedGrade >= 6 && maxGrade >= 6
    ? available.filter((question) => Number(question.grade) >= Math.max(6, maxGrade - 2) && Number(question.grade) <= maxGrade)
    : available

  const alignedAvailable = grade6To8PriorityPool.length ? grade6To8PriorityPool : available

  if (!alignedAvailable.length && sameSubtopicPool.length) {
    const fallback = sameSubtopicPool
    if (fallback.length) return [...fallback].sort((a, b) => questionDistance(a, normalizedGrade, difficulty) - questionDistance(b, normalizedGrade, difficulty))[0]
    return null
  }

  if (!alignedAvailable.length) return null

  const sameGrade = alignedAvailable.filter((question) => Number(question.grade) === normalizedGrade)
  const sameDifficulty = alignedAvailable.filter((question) => question.difficulty === difficulty)
  const difficultyFallback = alignedAvailable.filter((question) => {
    if (difficulty === 'Low') return question.difficulty === 'Low' || question.difficulty === 'Medium'
    if (difficulty === 'Medium') return question.difficulty === 'Low' || question.difficulty === 'Medium' || question.difficulty === 'High'
    if (difficulty === 'High') return question.difficulty === 'Medium' || question.difficulty === 'High'
    return true
  })
  const preferredCandidates = sameDifficulty.length
    ? sameDifficulty
    : (sameGrade.length ? sameGrade : (difficultyFallback.length ? difficultyFallback : alignedAvailable))

  const sorted = [...preferredCandidates].sort((a, b) => {
    const aPatternSeen = recentPatternCounts.get(getQuestionPatternKey(a)) || 0
    const bPatternSeen = recentPatternCounts.get(getQuestionPatternKey(b)) || 0
    const aSubtopicSeen = subtopic && matchesQuestionSubtopic(a, subtopic) ? (currentSubtopicSeen || 0) : 0
    const bSubtopicSeen = subtopic && matchesQuestionSubtopic(b, subtopic) ? (currentSubtopicSeen || 0) : 0
    const aDifficultyGap = Math.abs(difficultyIndex(a.difficulty) - difficultyIndex(difficulty))
    const bDifficultyGap = Math.abs(difficultyIndex(b.difficulty) - difficultyIndex(difficulty))
    return (aPatternSeen * 80 + aSubtopicSeen * 30 + aDifficultyGap * 10 + questionDistance(a, normalizedGrade, difficulty))
      - (bPatternSeen * 80 + bSubtopicSeen * 30 + bDifficultyGap * 10 + questionDistance(b, normalizedGrade, difficulty))
  })

  // Get the best score
  if (sorted.length === 0) return null
  const bestScore = (aPatternSeen, aSubtopicSeen, aDifficultyGap, aDistance) =>
    aPatternSeen * 80 + aSubtopicSeen * 30 + aDifficultyGap * 10 + aDistance

  const topQuestion = sorted[0]
  const topScore = bestScore(
    recentPatternCounts.get(getQuestionPatternKey(topQuestion)) || 0,
    subtopic && matchesQuestionSubtopic(topQuestion, subtopic) ? (currentSubtopicSeen || 0) : 0,
    Math.abs(difficultyIndex(topQuestion.difficulty) - difficultyIndex(difficulty)),
    questionDistance(topQuestion, normalizedGrade, difficulty)
  )

  // Find all questions with the same top score (within tolerance)
  const topCandidates = sorted.filter((q) => {
    const score = bestScore(
      recentPatternCounts.get(getQuestionPatternKey(q)) || 0,
      subtopic && matchesQuestionSubtopic(q, subtopic) ? (currentSubtopicSeen || 0) : 0,
      Math.abs(difficultyIndex(q.difficulty) - difficultyIndex(difficulty)),
      questionDistance(q, normalizedGrade, difficulty)
    )
    return Math.abs(score - topScore) < 1  // Within 1 point tolerance
  })

  // Keep selection deterministic and performance-based: stable tie-break by grade, difficulty, id.
  return [...topCandidates].sort((a, b) => {
    const aKey = `${Number(a.grade) || 0}-${difficultyIndex(a.difficulty)}-${Number(a.id) || 0}`
    const bKey = `${Number(b.grade) || 0}-${difficultyIndex(b.difficulty)}-${Number(b.id) || 0}`
    return aKey.localeCompare(bKey)
  })[0]
}

export function createAdaptiveTestState(questionBank, targetGrade, selectedStrand = 'Overall') {
  const topics = selectedStrand === 'Overall' ? ADAPTIVE_TOPICS : [selectedStrand]
  const maxGrade = clamp(Number(targetGrade) || 1, 1, 8)
  const benchmarkGrade = getBenchmarkGrade(maxGrade)
  const topicStates = Object.fromEntries(topics.map((topic) => {
    const subtopics = getQuestionSubtopics(questionBank, topic)
    const firstSubtopic = subtopics[0]
    return [topic, {
      topic,
      currentGrade: benchmarkGrade,
      lowGrade: 1,
      highGrade: maxGrade,
      currentDifficulty: 'Medium',
      currentSubtopic: firstSubtopic,
      consecutiveWrong: 0,
      consecutiveCorrect: 0,
      completed: false,
      askedIds: [],
      correct: 0,
      wrong: 0,
      benchmarkGrade,
      subtopicProgress: initializeSubtopicProgress(subtopics),
      topicQuestionCount: 0,
    }]
  }))
  const firstTopic = topics[0]
  const firstQuestion = selectAdaptiveQuestion(questionBank, firstTopic, benchmarkGrade, 'Medium', [], targetGrade, topicStates[firstTopic].currentSubtopic)

  const usedQuestionIds = firstQuestion ? [firstQuestion.id] : []

  return {
    topics,
    topicIndex: 0,
    topicStates,
    questions: firstQuestion ? [firstQuestion] : [],
    targetGrade,
    maxBudget: getMaxAdaptiveQuestionBudget(targetGrade),
    usedQuestionIds,
  }
}

export function buildAdaptiveQuestionSet(questionBank, targetGrade, selectedStrand = 'Overall', targetQuestionCount = getMaxAdaptiveQuestionBudget(targetGrade)) {
  const bank = Array.isArray(questionBank) ? questionBank : []
  if (!bank.length) {
    return {
      topics: selectedStrand === 'Overall' ? ADAPTIVE_TOPICS : [selectedStrand],
      topicIndex: 0,
      topicStates: {},
      questions: [],
      targetGrade,
      maxBudget: getMaxAdaptiveQuestionBudget(targetGrade),
      usedQuestionIds: [],
    }
  }

  let state = createAdaptiveTestState(bank, targetGrade, selectedStrand)
  const desiredCount = Math.min(Number(targetQuestionCount) || state.maxBudget, Math.max(1, state.maxBudget))

  while (state.questions.length < desiredCount && state.questions.length < state.maxBudget) {
    const lastQuestion = state.questions[state.questions.length - 1]
    if (!lastQuestion) break

    const nextState = advanceAdaptiveTest(state, bank, lastQuestion, lastQuestion.answer, targetGrade)
    if (nextState.questions.length <= state.questions.length) break
    state = nextState
  }

  return {
    ...state,
    questions: state.questions.slice(0, desiredCount),
  }
}

function shouldTerminateAssessment(topicStates, allTopics, totalQuestions) {
  if (totalQuestions < 12) return false
  const masteriedOrNeedsSupport = allTopics.filter((topic) => {
    const state = topicStates[topic]
    if (!state) return false
    const subtopicProgress = state.subtopicProgress || {}
    const statuses = Object.values(subtopicProgress).map((progress) => getSubtopicStatus(progress))
    return statuses.every((s) => s === 'mastered' || s === 'needs_support' || s === 'unknown')
  })
  const allResolved = allTopics.every((topic) => {
    const state = topicStates[topic]
    if (!state) return false
    const subtopicProgress = state.subtopicProgress || {}
    const statuses = Object.values(subtopicProgress).map((progress) => getSubtopicStatus(progress))
    const hasResolved = statuses.some((s) => s === 'mastered' || s === 'needs_support')
    return hasResolved || Object.keys(subtopicProgress).length === 0
  })
  // Changed from 0.8 (80%) to full allTopics.length (100%) - requires ALL strands to be clear
  return masteriedOrNeedsSupport.length >= allTopics.length && allResolved
}

export function advanceAdaptiveTest(adaptiveState, questionBank, currentQuestion, selectedAnswer, targetGrade) {
  const state = adaptiveState
  const maxBudget = getMaxAdaptiveQuestionBudget(targetGrade || state.targetGrade || 8)
  if (state.questions.length >= maxBudget) return { ...state, maxBudgetReached: true }
  const shouldTerminate = shouldTerminateAssessment(state.topicStates, state.topics, state.questions.length + 1)
  if (shouldTerminate) return { ...state, assessmentComplete: true }

  const topic = currentQuestion.topic
  const topicState = state.topicStates[topic]
  if (!topicState || topicState.completed) return { ...state, questions: state.questions }

  const isCorrect = selectedAnswer === currentQuestion.answer
  const nextWrongCount = isCorrect ? 0 : (topicState.consecutiveWrong || 0) + 1
  const nextCorrectCount = isCorrect ? (topicState.consecutiveCorrect || 0) + 1 : 0
  const askedIds = [...new Set([...(topicState.askedIds || []), currentQuestion.id])]
  const usedQuestionIds = [...new Set([...(state.usedQuestionIds || []), currentQuestion.id])]

  const questionSubtopics = normalizeQuestionSubtopics(currentQuestion)
  const topicSubtopics = getQuestionSubtopics(questionBank, topic)
  const currentSubtopic = topicState.currentSubtopic || questionSubtopics[0] || currentQuestion.subtopic || currentQuestion.topic
  const currentSubtopicIndex = Math.max(0, topicSubtopics.indexOf(currentSubtopic) === -1 ? 0 : topicSubtopics.indexOf(currentSubtopic))
  const hasMoreSubtopics = currentSubtopicIndex < topicSubtopics.length - 1
  const hasMultipleSubtopics = topicSubtopics.length > 1

  const updatedProgress = { ...(topicState.subtopicProgress || {}) }
  for (const subtopic of questionSubtopics) {
    const previousProgress = { ...(updatedProgress[subtopic] || { attempts: 0, correct: 0, wrong: 0 }) }
    updatedProgress[subtopic] = {
      attempts: Number(previousProgress.attempts || 0) + 1,
      correct: Number(previousProgress.correct || 0) + (isCorrect ? 1 : 0),
      wrong: Number(previousProgress.wrong || 0) + (!isCorrect ? 1 : 0),
    }
  }

  const topicQuestionPool = questionBank.filter((question) => question.topic === topic && Number(question.grade) <= Number(targetGrade || state.targetGrade || 8)).length
  const evidenceTarget = Math.max(4, Math.min(topicQuestionPool || 4, 6))
  const currentProgress = updatedProgress[currentSubtopic] || { attempts: 0, correct: 0, wrong: 0 }
  const currentStatus = getSubtopicStatus(currentProgress)
  const validEvidence = shouldAdvanceSubtopic(currentProgress, isCorrect, evidenceTarget)
  let nextDifficulty = topicState.currentDifficulty || 'Medium'
  let nextSubtopic = currentSubtopic
  let nextGrade = getAdaptiveNextGrade(topicState.currentGrade, topicState.lowGrade || 1, topicState.highGrade || topicState.currentGrade, isCorrect, 1)
  let moveToNextTopic = false

  const hasWeakSubtopic = topicSubtopics.some((st) => getSubtopicStatus(updatedProgress[st]) === 'needs_support')
  const allMasteriedOrWeak = topicSubtopics.every((st) => {
    const status = getSubtopicStatus(updatedProgress[st])
    return status === 'mastered' || status === 'needs_support'
  })
  const hasUnresolvedSubtopic = topicSubtopics.some((st) => {
    const status = getSubtopicStatus(updatedProgress[st])
    return status === 'unknown' || status === 'developing'
  })

  const foundationalQuestion = !isCorrect && currentProgress.wrong >= 2 && currentStatus !== 'needs_support'
    ? findFoundationalQuestion(questionBank, topic, currentSubtopic, nextGrade, askedIds, usedQuestionIds)
    : null

  if (foundationalQuestion) {
    nextDifficulty = 'Low'
    nextSubtopic = foundationalQuestion.subtopic || currentSubtopic
    nextGrade = Math.max(1, Math.min(Number(targetGrade || state.targetGrade || 8), Number(foundationalQuestion.grade) || nextGrade))
  } else if (currentStatus === 'mastered') {
    nextDifficulty = 'High'
    if (hasMoreSubtopics && hasUnresolvedSubtopic) {
      nextSubtopic = findNextUnresolvedSubtopic(topicSubtopics, updatedProgress, currentSubtopic)
    } else if (allMasteriedOrWeak) {
      // Check if weak subtopic revisit is appropriate
      const totalQuestionsAsked = state.questions.length + 1
      const weakRevisitCandidate = totalQuestionsAsked >= 15 ? findWeakSubtopicForRevisit(topicSubtopics, updatedProgress) : null
      if (weakRevisitCandidate) {
        // Revisit weak subtopic with targeted approach
        nextSubtopic = weakRevisitCandidate
        nextDifficulty = 'Medium'
        // Mark this subtopic as having been revisited
        if (updatedProgress[weakRevisitCandidate]) {
          updatedProgress[weakRevisitCandidate].revisitCount = (updatedProgress[weakRevisitCandidate].revisitCount || 0) + 1
        }
      } else {
        moveToNextTopic = true
      }
    }
  } else if (currentStatus === 'needs_support') {
    nextDifficulty = 'Low'
    if (hasMoreSubtopics && hasUnresolvedSubtopic) {
      nextSubtopic = findNextUnresolvedSubtopic(topicSubtopics, updatedProgress, currentSubtopic)
    } else if (allMasteriedOrWeak) {
      // Check if weak subtopic revisit is appropriate
      const totalQuestionsAsked = state.questions.length + 1
      const weakRevisitCandidate = totalQuestionsAsked >= 15 ? findWeakSubtopicForRevisit(topicSubtopics, updatedProgress) : null
      if (weakRevisitCandidate) {
        // Revisit weak subtopic with targeted approach
        nextSubtopic = weakRevisitCandidate
        nextDifficulty = 'Medium'
        // Mark this subtopic as having been revisited
        if (updatedProgress[weakRevisitCandidate]) {
          updatedProgress[weakRevisitCandidate].revisitCount = (updatedProgress[weakRevisitCandidate].revisitCount || 0) + 1
        }
      } else {
        moveToNextTopic = true
      }
    }
  } else if (validEvidence) {
    nextDifficulty = isCorrect ? 'High' : 'Low'
    if (hasMoreSubtopics) {
      nextSubtopic = findNextUnresolvedSubtopic(topicSubtopics, updatedProgress, currentSubtopic)
      if (nextSubtopic && nextSubtopic !== currentSubtopic) {
        updatedProgress[nextSubtopic] = updatedProgress[nextSubtopic] || { attempts: 0, correct: 0, wrong: 0 }
      }
      if (nextSubtopic === currentSubtopic && topicSubtopics.length > 1) {
        const lastResolved = topicSubtopics.every((subtopic) => {
          const status = getSubtopicStatus(updatedProgress[subtopic] || { attempts: 0, correct: 0, wrong: 0 })
          return status === 'mastered' || status === 'needs_support'
        })
        if (lastResolved) moveToNextTopic = true
      }
    } else {
      moveToNextTopic = true
    }
  } else if (!isCorrect) {
    nextDifficulty = 'Low'
  } else if (topicState.currentDifficulty === 'Low') {
    nextDifficulty = 'Medium'
  } else if (topicState.currentDifficulty === 'Medium') {
    nextDifficulty = 'High'
  } else if (currentProgress.attempts >= 2) {
    nextDifficulty = 'Medium'
  }

  if (!isCorrect) {
    nextGrade = Math.max(1, Math.min(Number(targetGrade || 8), nextGrade))
  }

  const questionsAskedInTopic = (topicState.askedIds || []).length
  const shouldRotateTopicEarly = state.topics.length > 1 && questionsAskedInTopic >= 3 && state.topicIndex < state.topics.length - 1
  const topicSubtopicStatuses = topicSubtopics.map((st) => getSubtopicStatus(updatedProgress[st]))
  const topicHasResolution = topicSubtopicStatuses.some((s) => s === 'mastered' || s === 'needs_support')
  const topicFullyResolved = topicSubtopicStatuses.every((s) => s === 'mastered' || s === 'needs_support' || s === 'unknown')
  const isTopicFinished = moveToNextTopic || (topicFullyResolved && topicHasResolution && questionsAskedInTopic >= 8)
    || (state.topicIndex === state.topics.length - 1 && topicFullyResolved && topicHasResolution && questionsAskedInTopic >= 6)
  const updatedTopicState = {
    ...topicState,
    currentGrade: nextGrade,
    lowGrade: Math.min(topicState.lowGrade || 1, nextGrade),
    highGrade: Math.max(topicState.highGrade || targetGrade || 8, nextGrade),
    currentDifficulty: nextDifficulty,
    currentSubtopic: nextSubtopic,
    consecutiveWrong: nextWrongCount,
    consecutiveCorrect: nextCorrectCount,
    askedIds,
    correct: topicState.correct + (isCorrect ? 1 : 0),
    wrong: topicState.wrong + (!isCorrect ? 1 : 0),
    completed: isTopicFinished,
    subtopicProgress: updatedProgress,
    topicQuestionCount: questionsAskedInTopic + 1,
  }
  const topicStates = { ...state.topicStates, [topic]: updatedTopicState }
  const nextUsedQuestionIds = usedQuestionIds

  const nextQuestionInTopic = selectAdaptiveQuestion(
    questionBank,
    topic,
    nextGrade,
    nextDifficulty,
    askedIds,
    targetGrade || 8,
    nextSubtopic,
    nextUsedQuestionIds,
  )

  const forceNextTopic = !nextQuestionInTopic && state.topicIndex < state.topics.length - 1

  if (updatedTopicState.completed || forceNextTopic || shouldRotateTopicEarly) {
    const nextTopicIndex = (state.topicIndex + 1) % state.topics.length
    const nextTopic = state.topics[nextTopicIndex]
    if (!nextTopic) return { ...state, topicStates, topicIndex: nextTopicIndex, questions: state.questions }

    const nextTopicState = topicStates[nextTopic]
    const nextQuestion = selectAdaptiveQuestion(
      questionBank,
      nextTopic,
      nextTopicState?.currentGrade ?? getBenchmarkGrade(targetGrade || 8),
      nextTopicState?.currentDifficulty ?? 'Medium',
      nextTopicState?.askedIds ?? [],
      targetGrade || 8,
      nextTopicState?.currentSubtopic,
      nextUsedQuestionIds,
    )
    const finalizedUsedQuestionIds = nextQuestion ? [...new Set([...nextUsedQuestionIds, nextQuestion.id])] : nextUsedQuestionIds
    return {
      ...state,
      topicStates,
      topicIndex: nextTopicIndex,
      questions: nextQuestion ? [...state.questions, nextQuestion] : state.questions,
      usedQuestionIds: finalizedUsedQuestionIds,
    }
  }

  const finalizedUsedQuestionIds = nextQuestionInTopic ? [...new Set([...nextUsedQuestionIds, nextQuestionInTopic.id])] : nextUsedQuestionIds

  const finalState = {
    ...state,
    topicStates,
    questions: nextQuestionInTopic ? [...state.questions, nextQuestionInTopic] : state.questions,
    usedQuestionIds: finalizedUsedQuestionIds,
  }

  const shouldTerminateNow = shouldTerminateAssessment(finalState.topicStates, finalState.topics, finalState.questions.length)
  if (shouldTerminateNow) return { ...finalState, assessmentComplete: true }

  return finalState
}

export function resolveAdaptiveDisplayTopic(currentQuestion, fallbackTopic = 'Overall') {
  if (currentQuestion && typeof currentQuestion.topic === 'string' && currentQuestion.topic.trim()) {
    return currentQuestion.topic
  }
  return fallbackTopic
}

export function getAdaptiveGapReport(topicStates) {
  if (!topicStates || typeof topicStates !== 'object') return {}

  const report = {}
  for (const [topic, state] of Object.entries(topicStates)) {
    const progress = state?.subtopicProgress || {}
    const subtopics = Object.keys(progress).length ? Object.keys(progress) : [state?.currentSubtopic || topic]
    report[topic] = {}
    for (const subtopic of subtopics) {
      report[topic][subtopic] = getSubtopicStatus(progress[subtopic])
    }
  }
  return report
}

export function calculateAdaptiveTopicGE(questions, answers, targetGrade) {
  const attempted = questions.filter((question) => answers[question.id] !== undefined)
  if (!attempted.length) return null

  const target = Math.max(1, Number(targetGrade) || 8)
  const maxSpan = Math.max(0, target - 1.0)

  let weightedScore = 0
  let weightedTotal = 0

  attempted.forEach((question) => {
    const weight = { Low: 1, Medium: 2, High: 3 }[question.difficulty] || 2
    weightedTotal += weight
    const expected = question.correct_answer || question.answer || question.correctAnswer || question.correct_option
    const isCorrect = answers[question.id] !== undefined && String(answers[question.id]).trim().toUpperCase() === String(expected || '').trim().toUpperCase()
    if (isCorrect) {
      weightedScore += weight
    }
  })

  const topicAccuracy = weightedTotal > 0 ? weightedScore / weightedTotal : 0
  const topicGE = 1.0 + topicAccuracy * maxSpan
  return Number(clamp(topicGE, 1.0, target).toFixed(2))
}

export function calculateAdaptiveOverallGE(topicResults, targetGrade) {
  const values = Object.values(topicResults).filter((value) => typeof value === 'number' && Number.isFinite(value))
  if (!values.length) return null
  const target = Math.max(1, Number(targetGrade) || 8)
  return Number(clamp(values.reduce((sum, value) => sum + value, 0) / values.length, 1.0, target).toFixed(2))
}

function matchesStrand(questionTopic, selectedStrand) {
  if (!selectedStrand || selectedStrand === 'Overall') return true
  const qTopic = String(questionTopic || '').toLowerCase()
  if (selectedStrand === 'Number & Operations') return qTopic.includes('number') || qTopic.includes('operation')
  if (selectedStrand === 'Data Analysis') return qTopic.includes('data') || qTopic.includes('analysis') || qTopic.includes('statistic') || qTopic.includes('probability')
  return qTopic.includes(selectedStrand.toLowerCase().split(' ')[0])
}

function selectGradeBatchQuestions(questionBank, grade, selectedStrand, usedQuestionIds = []) {
  const usedIds = new Set(usedQuestionIds)
  const exactGrade = questionBank.filter((question) => (
    matchesStrand(question.topic, selectedStrand)
    && Number(question.grade) === Number(grade)
    && !usedIds.has(question.id)
  ))

  if (exactGrade.length) return exactGrade.slice(0, QUESTIONS_PER_GRADE_BATCH)

  const fallback = questionBank.filter((question) => (
    matchesStrand(question.topic, selectedStrand)
    && Number(question.grade) >= Number(grade)
    && !usedIds.has(question.id)
  ))
  return fallback.slice(0, QUESTIONS_PER_GRADE_BATCH)
}

function selectLowerGradeQuestions(questionBank, targetGrade, selectedStrand, questionLimit = MAX_ADAPTIVE_QUESTIONS) {
  const eligibleQuestions = questionBank.filter((question) => (
    matchesStrand(question.topic, selectedStrand)
    && Number(question.grade) >= 1
    && Number(question.grade) <= Number(targetGrade)
  ))
  const selectedQuestions = []
  const usedIds = new Set()
  const baseQuota = Math.floor(questionLimit / targetGrade)
  const remainder = questionLimit % targetGrade

  for (let grade = 1; grade <= targetGrade; grade += 1) {
    const quota = baseQuota + (grade <= remainder ? 1 : 0)
    const gradeQuestions = eligibleQuestions.filter((question) => Number(question.grade) === grade)
    for (const question of gradeQuestions.slice(0, quota)) {
      selectedQuestions.push(question)
      usedIds.add(question.id)
    }
  }

  if (selectedQuestions.length < questionLimit) {
    selectedQuestions.push(...eligibleQuestions.filter((question) => !usedIds.has(question.id)).slice(0, questionLimit - selectedQuestions.length))
  }

  return selectedQuestions
}

export function createGradeBatchTestState(questionBank, targetGrade, selectedStrand = 'Overall', requestedQuestionCount = GRADE_BATCH_QUESTION_COUNT) {
  const maxGrade = clamp(Number(targetGrade) || 8, 1, 8)
  const questionLimit = Math.max(1, Number(requestedQuestionCount) || GRADE_BATCH_QUESTION_COUNT)
  const diffOrder = { Low: 1, Medium: 2, High: 3 }

  const topics = ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']
  let initialPool = []
  const usedIds = new Set()

  if (selectedStrand === 'Overall') {
    const questionsPerTopic = Math.floor(questionLimit / topics.length) // 30 / 5 = 6 questions per topic
    const topicPools = {}

    topics.forEach((topic) => {
      const isTopicMatch = (q) => matchesStrand(q.topic, topic)

      // Prioritize questions strictly at the selected targetGrade
      const targetGradeQuestions = questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) === maxGrade && !usedIds.has(q.id))
      const lowerGradeQuestions = questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) < maxGrade && !usedIds.has(q.id))

      const targetMed = shuffleArray(targetGradeQuestions.filter((q) => q.difficulty === 'Medium'))
      const targetLow = shuffleArray(targetGradeQuestions.filter((q) => q.difficulty === 'Low'))
      const targetHigh = shuffleArray(targetGradeQuestions.filter((q) => q.difficulty === 'High'))

      // Primary pool: strictly target grade questions starting at Medium baseline
      const primaryTargetPool = [...targetMed, ...targetLow, ...targetHigh]
      const fallbackLowerPool = shuffleArray(lowerGradeQuestions)

      const picked = []
      // Take up to questionsPerTopic from target grade first
      while (picked.length < questionsPerTopic && primaryTargetPool.length > 0) {
        picked.push(primaryTargetPool.shift())
      }
      // If target grade runs short, backfill from lower grades
      while (picked.length < questionsPerTopic && fallbackLowerPool.length > 0) {
        picked.push(fallbackLowerPool.shift())
      }

      // Sort topic questions adaptively: Medium first (baseline), then Low, then High
      const startingOrder = { Medium: 1, Low: 2, High: 3 }
      picked.sort((a, b) => (startingOrder[a.difficulty] || 2) - (startingOrder[b.difficulty] || 2))

      picked.forEach((q) => usedIds.add(q.id))
      topicPools[topic] = picked
    })

    // Block-wise across the 5 topics: 6 questions per strand sequentially (1-6 Strand 1, 7-12 Strand 2, etc.)
    for (const topic of topics) {
      const bucket = topicPools[topic] || []
      for (let i = 0; i < questionsPerTopic && i < bucket.length; i++) {
        initialPool.push(bucket[i])
      }
    }

    if (initialPool.length < questionLimit) {
      const remainingQuestions = shuffleArray(
        questionBank.filter((question) => Number(question.grade) === maxGrade && !usedIds.has(question.id))
      )
      for (const question of remainingQuestions) {
        if (initialPool.length >= questionLimit) break
        initialPool.push(question)
        usedIds.add(question.id)
      }
    }
  } else {
    // Specific strand selected by student
    const isTopicMatch = (q) => matchesStrand(q.topic, selectedStrand)

    const targetMed = shuffleArray(questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) === maxGrade && q.difficulty === 'Medium'))
    const targetLow = shuffleArray(questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) === maxGrade && q.difficulty === 'Low'))
    const targetHigh = shuffleArray(questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) === maxGrade && q.difficulty === 'High'))

    const lowerQuestions = shuffleArray(questionBank.filter((q) => isTopicMatch(q) && Number(q.grade) < maxGrade))

    const combined = [
      ...targetMed.slice(0, 1),
      ...shuffleArray([...targetMed.slice(1), ...targetHigh, ...targetLow, ...lowerQuestions]),
    ]
    initialPool = combined.slice(0, questionLimit)
    if (initialPool.length < questionLimit) {
      const remaining = shuffleArray(questionBank.filter((q) => isTopicMatch(q) && !initialPool.some(p => p.id === q.id)))
      initialPool = [...initialPool, ...remaining].slice(0, questionLimit)
    }
    initialPool.forEach((q) => usedIds.add(q.id))
  }

  return {
    mode: 'grade-batch',
    selectedStrand,
    targetGrade: maxGrade,
    batchGrade: maxGrade,
    currentDifficulty: 'Medium',
    batchQuestionCount: 0,
    batchCorrect: 0,
    batchWrong: 0,
    askedIds: [],
    questions: initialPool,
    usedQuestionIds: initialPool.map((question) => question.id),
    maxBudget: questionLimit,
    questionLimit,
    weakPoints: [],
    strongPoints: [],
    prerequisiteChecks: {},
    activeProbe: null,
    probeHistory: [],
    weaknessMap: {},
  }
}

export function advanceGradeBatchTest(state, questionBank, currentQuestion, selectedAnswer) {
  if (!state || state.mode !== 'grade-batch' || !currentQuestion) return state

  const isCorrect = String(selectedAnswer || '').trim().toUpperCase() === String(currentQuestion.answer || '').trim().toUpperCase()
  const batchQuestionCount = Number(state.batchQuestionCount || 0) + 1
  const batchCorrect = Number(state.batchCorrect || 0) + (isCorrect ? 1 : 0)
  const batchWrong = Number(state.batchWrong || 0) + (isCorrect ? 0 : 1)
  const askedIds = [...new Set([...(state.askedIds || []), currentQuestion.id])]
  const usedQuestionIds = [...new Set([...(state.usedQuestionIds || []), currentQuestion.id])]
  const subtopic = currentQuestion.subtopic || currentQuestion.topic
  const questionGrade = Number(currentQuestion.grade) || state.targetGrade || 8

  let weakPoints = [...(state.weakPoints || [])]
  let strongPoints = [...(state.strongPoints || [])]
  let questions = [...(state.questions || [])]
  let nextDifficulty = state.currentDifficulty || 'Medium'
  let activeProbe = state.activeProbe ? { ...state.activeProbe } : null
  let probeHistory = [...(state.probeHistory || [])]
  let weaknessMap = { ...(state.weaknessMap || {}) }

  const isProbeQuestion = activeProbe && questionGrade < state.targetGrade

  if (isProbeQuestion) {
    // ========== PROBE QUESTION RESPONSE ==========
    if (isCorrect) {
      // Probe question answered correctly — prerequisite verified at this level
      // Record which grade level was weak (one above where they got it right)
      const weakGrade = activeProbe.probeGrade // The grade they failed at to trigger this probe
      probeHistory.push({
        subtopic: activeProbe.subtopic,
        topic: activeProbe.topic,
        startGrade: activeProbe.startGrade,
        probeGrade: questionGrade,
        depth: activeProbe.depth,
        result: 'prerequisite_verified',
        weakAtGrade: weakGrade,
      })

      if (weakGrade < state.targetGrade) {
        weaknessMap[activeProbe.subtopic] = {
          rootGrade: weakGrade,
          probeDepth: activeProbe.depth,
          resolved: true,
        }
      }

      // BOUNCE BACK to target grade
      activeProbe = null
      nextDifficulty = 'Medium'

      // Inject a target grade question for the next concept
      const bounceBackQ = questionBank.find(
        (q) => !usedQuestionIds.includes(q.id) &&
          Number(q.grade) === state.targetGrade &&
          q.difficulty === 'Medium'
      )
      if (bounceBackQ) {
        const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
        const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
        questions = questions.filter((q) => q.id !== bounceBackQ.id)
        questions.splice(insertionIndex, 0, bounceBackQ)
        usedQuestionIds.push(bounceBackQ.id)
      }
    } else {
      // Probe question answered WRONG
      if (activeProbe.depth < MAX_PROBE_DEPTH && questionGrade > 1) {
        // Go ONE more level deeper
        const deeperGrade = questionGrade - 1
        const deeperQ = findFoundationalQuestion(
          questionBank,
          activeProbe.topic,
          activeProbe.subtopic,
          questionGrade,
          askedIds,
          usedQuestionIds
        )

        if (deeperQ) {
          activeProbe = {
            ...activeProbe,
            probeGrade: questionGrade,
            depth: activeProbe.depth + 1,
          }
          const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
          const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
          questions = questions.filter((q) => q.id !== deeperQ.id)
          questions.splice(insertionIndex, 0, deeperQ)
          usedQuestionIds.push(deeperQ.id)
          nextDifficulty = 'Low'
        } else {
          // No deeper question available — record weakness and bounce back
          weaknessMap[activeProbe.subtopic] = {
            rootGrade: questionGrade,
            probeDepth: activeProbe.depth,
            resolved: false,
          }
          probeHistory.push({
            subtopic: activeProbe.subtopic,
            topic: activeProbe.topic,
            startGrade: activeProbe.startGrade,
            probeGrade: questionGrade,
            depth: activeProbe.depth,
            result: 'no_deeper_questions',
            weakAtGrade: questionGrade,
          })
          activeProbe = null
          nextDifficulty = 'Medium'

          const bounceBackQ = questionBank.find(
            (q) => !usedQuestionIds.includes(q.id) &&
              Number(q.grade) === state.targetGrade &&
              q.difficulty === 'Medium'
          )
          if (bounceBackQ) {
            const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
            const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
            questions = questions.filter((q) => q.id !== bounceBackQ.id)
            questions.splice(insertionIndex, 0, bounceBackQ)
            usedQuestionIds.push(bounceBackQ.id)
          }
        }
      } else {
        // Maximum probe depth reached — ROOT WEAKNESS FOUND
        weaknessMap[activeProbe.subtopic] = {
          rootGrade: Math.max(1, questionGrade),
          probeDepth: activeProbe.depth,
          resolved: false,
        }
        probeHistory.push({
          subtopic: activeProbe.subtopic,
          topic: activeProbe.topic,
          startGrade: activeProbe.startGrade,
          probeGrade: questionGrade,
          depth: activeProbe.depth,
          result: 'root_weakness_found',
          weakAtGrade: Math.max(1, questionGrade),
        })

        if (!weakPoints.includes(activeProbe.subtopic)) {
          weakPoints.push(activeProbe.subtopic)
        }

        // BOUNCE BACK to target grade for next concept
        activeProbe = null
        nextDifficulty = 'Medium'

        const bounceBackQ = questionBank.find(
          (q) => !usedQuestionIds.includes(q.id) &&
            Number(q.grade) === state.targetGrade &&
            q.difficulty === 'Medium'
        )
        if (bounceBackQ) {
          const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
          const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
          questions = questions.filter((q) => q.id !== bounceBackQ.id)
          questions.splice(insertionIndex, 0, bounceBackQ)
          usedQuestionIds.push(bounceBackQ.id)
        }
      }
    }
  } else {
    // ========== NORMAL QUESTION (not a probe) ==========
    if (isCorrect) {
      const targetDiff = currentQuestion.difficulty === 'Low' ? 'Medium' : 'High'
      nextDifficulty = targetDiff

      if (targetDiff === 'High') {
        if (questionGrade >= state.targetGrade && !strongPoints.includes(subtopic)) {
          strongPoints.push(subtopic)
        }
      }

      // Inject elevated difficulty question at target grade
      const elevatedQ = questionBank.find(
        (q) => !usedQuestionIds.includes(q.id) &&
          Number(q.grade) === state.targetGrade &&
          matchesStrand(q.topic, currentQuestion.topic) &&
          q.difficulty === targetDiff &&
          matchesQuestionSubtopic(q, subtopic)
      ) || questionBank.find(
        (q) => !usedQuestionIds.includes(q.id) &&
          Number(q.grade) === state.targetGrade &&
          matchesStrand(q.topic, currentQuestion.topic) &&
          q.difficulty === targetDiff
      )

      if (elevatedQ) {
        const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
        const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
        questions = questions.filter((q) => q.id !== elevatedQ.id)
        questions.splice(insertionIndex, 0, elevatedQ)
        usedQuestionIds.push(elevatedQ.id)
      }
    } else {
      // Student answered WRONG on a normal question
      if (currentQuestion.difficulty === 'High') {
        // Failed High — drop to Medium at SAME target grade (no probe needed)
        nextDifficulty = 'Medium'
        const sameGradeMed = questionBank.find(
          (q) => !usedQuestionIds.includes(q.id) &&
            Number(q.grade) === state.targetGrade &&
            q.topic === currentQuestion.topic &&
            q.difficulty === 'Medium' &&
            matchesQuestionSubtopic(q, subtopic)
        ) || questionBank.find(
          (q) => !usedQuestionIds.includes(q.id) &&
            Number(q.grade) === state.targetGrade &&
            q.topic === currentQuestion.topic &&
            q.difficulty === 'Medium'
        )

        if (sameGradeMed) {
          const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
          const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
          questions = questions.filter((q) => q.id !== sameGradeMed.id)
          questions.splice(insertionIndex, 0, sameGradeMed)
          usedQuestionIds.push(sameGradeMed.id)
        }
      } else {
        // Failed Medium or Low — START DIAGNOSTIC PROBE to lower grade
        const foundationalQ = findFoundationalQuestion(
          questionBank,
          currentQuestion.topic,
          subtopic,
          questionGrade,
          askedIds,
          usedQuestionIds
        )

        if (foundationalQ) {
          // Start a new probe
          activeProbe = {
            startGrade: state.targetGrade,
            subtopic: subtopic,
            topic: currentQuestion.topic,
            probeGrade: questionGrade,
            depth: 1,
          }

          const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id)
          const insertionIndex = currentIndex >= 0 ? currentIndex + 1 : questions.length
          questions = questions.filter((q) => q.id !== foundationalQ.id)
          questions.splice(insertionIndex, 0, foundationalQ)
          usedQuestionIds.push(foundationalQ.id)
          nextDifficulty = 'Low'
        } else {
          nextDifficulty = 'Low'
        }

        // Record subtopic in weak points
        if (!weakPoints.includes(subtopic)) {
          weakPoints.push(subtopic)
        }
      }
    }
  }

  // Keep the fixed assessment length
  const questionLimit = state.questionLimit || GRADE_BATCH_QUESTION_COUNT
  if (questions.length > questionLimit) {
    questions = questions.slice(0, questionLimit)
  }

  const assessmentComplete = batchQuestionCount >= questionLimit

  return {
    ...state,
    batchQuestionCount,
    batchCorrect,
    batchWrong,
    askedIds,
    usedQuestionIds,
    questions,
    currentDifficulty: nextDifficulty,
    weakPoints,
    strongPoints,
    assessmentComplete,
    activeProbe,
    probeHistory,
    weaknessMap,
  }
}

export function createWeakPointsRetakeState(questionBank, targetGrade, weakTopicsList = [], requestedQuestionCount = GRADE_BATCH_QUESTION_COUNT) {
  const maxGrade = clamp(Number(targetGrade) || 8, 1, 8)
  const questionLimit = Math.max(1, Number(requestedQuestionCount) || GRADE_BATCH_QUESTION_COUNT)
  const diffOrder = { Low: 1, Medium: 2, High: 3 }
  const normalizedWeakTopics = Array.isArray(weakTopicsList) && weakTopicsList.length ? weakTopicsList : ADAPTIVE_TOPICS

  const usedIds = new Set()
  let pool = []

  // Prioritize questions from student's weak subtopics/topics
  const weakQuestions = shuffleArray(questionBank.filter((q) => {
    const qTopic = String(q.topic || '')
    const qSubtopic = String(q.subtopic || '')
    const matchesWeak = normalizedWeakTopics.some((item) => {
      const needle = String(item || '').toLowerCase()
      return qTopic.toLowerCase().includes(needle) || qSubtopic.toLowerCase().includes(needle)
    })
    return matchesWeak && Number(q.grade) <= maxGrade
  })).sort((a, b) => (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2))

  for (const q of weakQuestions) {
    if (pool.length >= questionLimit) break
    pool.push(q)
    usedIds.add(q.id)
  }

  // If weak question pool is less than questionLimit, fill with general grade questions
  if (pool.length < questionLimit) {
    const extraQuestions = shuffleArray(questionBank.filter((q) => !usedIds.has(q.id) && Number(q.grade) <= maxGrade))
      .sort((a, b) => (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2))
    for (const q of extraQuestions) {
      if (pool.length >= questionLimit) break
      pool.push(q)
      usedIds.add(q.id)
    }
  }

  return {
    mode: 'grade-batch',
    selectedStrand: 'Overall',
    targetGrade: maxGrade,
    batchGrade: maxGrade,
    currentDifficulty: 'Low',
    batchQuestionCount: 0,
    batchCorrect: 0,
    batchWrong: 0,
    questions: pool,
    usedQuestionIds: pool.map((q) => q.id),
    maxBudget: questionLimit,
    questionLimit,
    weakPoints: [],
    strongPoints: [],
    prerequisiteChecks: {},
    isRetake: true,
  }
}
