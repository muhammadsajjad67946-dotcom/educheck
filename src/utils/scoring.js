// ============================================================================
// COMPREHENSIVE SCORING SYSTEM FOR ADAPTIVE MATHEMATICS ASSESSMENT
// ============================================================================
import { calculateAdaptiveOverallGE, calculateAdaptiveTopicGE } from './adaptiveTest.js'
// Features:
// - Difficulty-aware adaptive progression (Low, Medium, High)
// - One raw-score point for each correct MCQ
// - Normalized grade scores (0.00 to 1.00)
// - Cumulative scoring across multiple grades
// - Per-topic and per-difficulty performance analysis
// - Dynamic performance thresholds and status classification
// ============================================================================

// ============================================================================
// PERFORMANCE THRESHOLDS & CONFIGURATION
// ============================================================================

export const PERFORMANCE_THRESHOLDS = {
  Strong: { min: 0.80, max: 1.0 },
  Developing: { min: 0.60, max: 0.79 },
  NeedsImprovement: { min: 0.4, max: 0.59 },
  Weak: { min: 0.0, max: 0.39 },
}

export const DIFFICULTY_WEIGHTS = {
  Low: 1,
  Medium: 2,
  High: 3,
}

export const ALL_TOPICS = ['Number & Operations', 'Measurement', 'Data Analysis', 'Algebra', 'Geometry']

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

export function getPerformanceStatus(score) {
  if (score >= PERFORMANCE_THRESHOLDS.Strong.min) return 'Strong'
  if (score >= PERFORMANCE_THRESHOLDS.Developing.min) return 'Developing'
  if (score >= PERFORMANCE_THRESHOLDS.NeedsImprovement.min) return 'Needs Improvement'
  return 'Weak'
}

export function getPerformanceColor(score) {
  const status = getPerformanceStatus(score)
  const colors = {
    Strong: '#10b981',
    Developing: '#f59e0b',
    'Needs Improvement': '#ef5350',
    Weak: '#9ca3af',
  }
  return colors[status] || '#9ca3af'
}

export function getDiagnosticConfidence(totalAttempted, selectedTargetGrade, totalQuestions = 0, totalCorrect = 0) {
  const expectedQuestions = Math.max(Number(totalQuestions) || Number(selectedTargetGrade) || 1, 1)
  const attempted = Number(totalAttempted || 0)
  const correct = Number(totalCorrect || 0)
  const evidenceRatio = attempted / expectedQuestions

  if (attempted > 0 && correct === 0) return 'Low'

  if (evidenceRatio >= 1) return 'High'
  if (evidenceRatio >= 0.5) return 'Medium'
  return 'Low'
}

// ============================================================================
// QUESTION-LEVEL SCORING
// ============================================================================

/**
 * Calculate score for a single question
 * Handles all answer states: correct, wrong, unanswered
 * @param {Object} question - Question object {id, difficulty, answer}
 * @param {*} selectedAnswer - Student's selected answer (any type)
 * @param {*} correctAnswer - Correct answer value
 * @returns {Object} Score details {isAnswered, isCorrect, rawScore, weight, gradeContribution}
 */
export function calculateQuestionScore(question, selectedAnswer, correctAnswer) {
  // Validate question object
  if (!question || typeof question !== 'object') {
    console.warn('calculateQuestionScore: Invalid question object', question)
    return {
      isAnswered: false,
      isCorrect: false,
      rawScore: 0,
      weight: 1,
      gradeContribution: 0,
    }
  }
  
  const expectedAnswer = correctAnswer || question.correct_answer || question.correctAnswer || question.answer || question.correct_option
  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && String(selectedAnswer).trim() !== ''
  const isCorrect = isAnswered && String(selectedAnswer).trim().toUpperCase() === String(expectedAnswer || '').trim().toUpperCase()
  const weight = DIFFICULTY_WEIGHTS[question.difficulty] || 1

  const rawScore = isCorrect ? 1 : 0
  const gradeContribution = isCorrect ? weight : 0

  return {
    isAnswered,
    isCorrect,
    rawScore,
    weight,
    gradeContribution,
  }
}

// ============================================================================
// TOPIC-LEVEL SCORING
// ============================================================================

/**
 * Calculate normalized score for a specific topic within a grade
 * @param {Array} questions - Array of questions for this topic in a specific grade
 * @param {Object} answers - Map of questionId -> selectedAnswer
 * @returns {Object} Topic score data including normalized score (0-1)
 */
export function calculateTopicScore(questions, answers) {
  if (!questions || questions.length === 0) {
    return {
      total: 0,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      rawScore: 0,
      maxPossible: 0,
      weightedScore: 0,
      weightedTotal: 0,
      questionScores: [],
      normalizedScore: 0,
      performanceStatus: 'Weak',
    }
  }

  let total = 0
  let correct = 0
  let wrong = 0
  let unanswered = 0
  let rawScore = 0
  let weightedScore = 0
  let weightedTotal = 0
  const questionScores = []

  questions.forEach((question) => {
    const selectedAnswer = answers[question.id]
    const questionScore = calculateQuestionScore(question, selectedAnswer, question.answer)

    total += 1
    weightedTotal += questionScore.weight
    questionScores.push({
      questionId: question.id,
      grade: question.grade,
      topic: question.topic,
      difficulty: question.difficulty,
      difficultyWeight: questionScore.weight,
      gradeContribution: questionScore.gradeContribution,
      isAnswered: questionScore.isAnswered,
      isCorrect: questionScore.isCorrect,
    })

    if (questionScore.isAnswered) {
      if (questionScore.isCorrect) {
        correct += 1
      } else {
        wrong += 1
      }
      rawScore += questionScore.rawScore
      weightedScore += questionScore.gradeContribution
    } else {
      unanswered += 1
    }
  })

  const normalizedScore = weightedTotal > 0 ? clamp(weightedScore / weightedTotal, 0, 1) : 0

  return {
    total,
    correct,
    wrong,
    unanswered,
    rawScore,
    maxPossible: weightedTotal,
    weightedScore,
    weightedTotal,
    questionScores,
    normalizedScore: parseFloat(normalizedScore.toFixed(2)),
    performanceStatus: getPerformanceStatus(normalizedScore),
  }
}

// ============================================================================
// GRADE-LEVEL SCORING
// ============================================================================

/**
 * Calculate normalized score for all topics combined in a specific grade
 * @param {Object} topicScores - Object mapping topic name to topic score data
 * @returns {Object} Grade score data with overall normalized score and per-topic data
 */
export function calculateGradeScore(topicScores) {
  const validTopics = Object.entries(topicScores).filter(([, score]) => score.total > 0)

  if (validTopics.length === 0) {
    return {
      total: 0,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      rawScore: 0,
      maxPossible: 0,
      normalizedScore: 0,
      performanceStatus: 'Weak',
      topicScores,
    }
  }

  let totalAll = 0
  let correctAll = 0
  let wrongAll = 0
  let unansweredAll = 0
  let rawScoreAll = 0
  let maxPossibleAll = 0
  let weightedScoreAll = 0

  validTopics.forEach(([, score]) => {
    totalAll += score.total
    correctAll += score.correct
    wrongAll += score.wrong
    unansweredAll += score.unanswered
    rawScoreAll += score.rawScore
    maxPossibleAll += score.maxPossible
    weightedScoreAll += score.weightedScore || 0
  })

  const normalizedScore = maxPossibleAll > 0 ? clamp(weightedScoreAll / maxPossibleAll, 0, 1) : 0

  return {
    total: totalAll,
    correct: correctAll,
    wrong: wrongAll,
    unanswered: unansweredAll,
    rawScore: rawScoreAll,
    maxPossible: maxPossibleAll,
    weightedScore: weightedScoreAll,
    weightedTotal: maxPossibleAll,
    normalizedScore: parseFloat(normalizedScore.toFixed(2)),
    performanceStatus: getPerformanceStatus(normalizedScore),
    topicScores,
  }
}

// ============================================================================
// CUMULATIVE & OVERALL SCORING
// ============================================================================

/**
 * Calculate cumulative score across multiple grades
 * @param {Array} gradeScores - Array of grade scores in order (Grade 1, Grade 2, etc.)
 * @returns {Array} Same array with added cumulativeScore property for each grade
 */
export function calculateCumulativeScores(gradeScores) {
  let runningTotal = 0

  return gradeScores.map((gradeScore, index) => {
    const { normalizedScore } = gradeScore
    runningTotal += normalizedScore

    return {
      ...gradeScore,
      gradeNumber: gradeScore.gradeNumber || index + 1,
      cumulativeScore: parseFloat(runningTotal.toFixed(2)),
    }
  })
}

/**
 * Calculate overall/final results
 * @param {Array} gradeScores - Cumulative grade scores
 * @param {number} selectedTargetGrade - The grade student selected (1-8)
 * @returns {Object} Overall result data
 */
export function calculateOverallResult(gradeScores, selectedTargetGrade) {
  if (!gradeScores || gradeScores.length === 0) {
    return {
      selectedTargetGrade,
      finalCumulativeScore: 0,
      demonstratedMathLevel: 0,
      totalQuestions: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalUnanswered: 0,
    }
  }

  const relevantGrades = gradeScores.slice(0, selectedTargetGrade)
  const lastGrade = relevantGrades[relevantGrades.length - 1]
  const finalCumulativeScore = lastGrade?.cumulativeScore || 0

  const totalQuestions = relevantGrades.reduce((sum, grade) => sum + grade.total, 0)
  const totalCorrect = relevantGrades.reduce((sum, grade) => sum + grade.correct, 0)
  const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0
  const demonstratedMathLevel = selectedTargetGrade > 0 && totalQuestions > 0
    ? clamp(1.0 + accuracy * Math.max(0, selectedTargetGrade - 1), 1.0, selectedTargetGrade)
    : 1.0

  let totalWrong = 0
  let totalUnanswered = 0

  relevantGrades.forEach((grade) => {
    totalWrong += grade.wrong
    totalUnanswered += grade.unanswered
  })

  const totalAttempted = totalCorrect + totalWrong

  return {
    selectedTargetGrade,
    finalCumulativeScore: parseFloat(finalCumulativeScore.toFixed(2)),
    demonstratedMathLevel: parseFloat(demonstratedMathLevel.toFixed(2)),
    totalQuestions,
    totalAttempted,
    totalCorrect,
    totalWrong,
    totalUnanswered,
    gradeScores: relevantGrades,
  }
}

// ============================================================================
// DIFFICULTY-LEVEL PERFORMANCE
// ============================================================================

/**
 * Calculate performance on Low/Medium/High difficulty questions
 * @param {Array} questions - All attempted questions
 * @param {Object} answers - Map of questionId -> selectedAnswer
 * @returns {Object} Performance breakdown by difficulty
 */
export function calculateDifficultyPerformance(questions, answers) {
  const performance = {
    Low: { total: 0, correct: 0, wrong: 0, unanswered: 0, rawScore: 0, maxPossible: 0 },
    Medium: { total: 0, correct: 0, wrong: 0, unanswered: 0, rawScore: 0, maxPossible: 0 },
    High: { total: 0, correct: 0, wrong: 0, unanswered: 0, rawScore: 0, maxPossible: 0 },
  }

  questions.forEach((question) => {
    const difficulty = question.difficulty
    if (!performance[difficulty]) return

    const selectedAnswer = answers[question.id]
    const questionScore = calculateQuestionScore(question, selectedAnswer, question.answer)

    performance[difficulty].total += 1
    performance[difficulty].maxPossible += questionScore.weight

    if (questionScore.isAnswered) {
      if (questionScore.isCorrect) {
        performance[difficulty].correct += 1
      } else {
        performance[difficulty].wrong += 1
      }
      performance[difficulty].rawScore += questionScore.rawScore
      performance[difficulty].weightedScore = (performance[difficulty].weightedScore || 0) + questionScore.gradeContribution
    } else {
      performance[difficulty].unanswered += 1
    }
  })

  // Calculate normalized scores for each difficulty
  Object.keys(performance).forEach((key) => {
    const p = performance[key]
    p.weightedScore = p.weightedScore || 0
    p.weightedTotal = p.maxPossible
    p.normalizedScore = p.maxPossible > 0 ? clamp(p.weightedScore / p.maxPossible, 0, 1) : 0
    p.normalizedScore = parseFloat(p.normalizedScore.toFixed(2))
  })

  return performance
}

// ============================================================================
// COMPREHENSIVE GRADE RESULTS
// ============================================================================

/**
 * Calculate complete grade results (all grades with all metrics)
 * @param {Array} allQuestions - All questions available
 * @param {Object} answers - Map of questionId -> selectedAnswer
 * @param {number} selectedTargetGrade - Target grade (1-8)
 * @returns {Array} Array of grade results
 */
export function calculateGradeResults(allQuestions, answers, selectedTargetGrade) {
  const gradeResults = []

  for (let grade = 1; grade <= selectedTargetGrade; grade++) {
    const gradeQuestions = allQuestions.filter((q) => Number(q.grade) === grade)

    const topicScores = {}
    ALL_TOPICS.forEach((topic) => {
      const topicQuestions = gradeQuestions.filter((q) => q.topic === topic)
      topicScores[topic] = calculateTopicScore(topicQuestions, answers)
    })

    const gradeScore = calculateGradeScore(topicScores)
    gradeScore.gradeNumber = grade
    gradeResults.push(gradeScore)
  }

  return calculateCumulativeScores(gradeResults)
}

// A GE needs enough answered questions to be treated as reliable evidence.
export const GE_MASTERY_THRESHOLD = 80
export const GE_MINIMUM_SAMPLE = 3

/**
 * Calculate a topic's Grade Equivalent from grade-level mastery evidence.
 * GE is intentionally independent from raw score and weighted grade score.
 * @param {Object} grades - Grade number to topic performance data
 * @param {number} selectedTargetGrade - Maximum reportable GE
 * @param {number} minimumSample - Minimum answered questions for reliable evidence
 * @returns {Object} Topic GE details, including status and grade evidence
 */
export function calculateTopicGradeEquivalent(
  grades,
  selectedTargetGrade,
  minimumSample = GE_MINIMUM_SAMPLE,
) {
  const gradeNumbers = Object.keys(grades || {})
    .map(Number)
    .filter((grade) => Number.isInteger(grade) && grade >= 1 && grade <= 8 && grade <= selectedTargetGrade)
    .sort((a, b) => a - b)

  const evidence = gradeNumbers.map((grade) => {
    const gradeData = grades[grade] || {}
    const attemptedQuestions = Number(gradeData.attemptedQuestions || 0)
    const correctAnswers = Number(gradeData.correctAnswers || 0)
    const hasSufficientEvidence = attemptedQuestions >= minimumSample
    const masteryPercentage = attemptedQuestions > 0
      ? (correctAnswers / attemptedQuestions) * 100
      : 0

    return {
      grade,
      attemptedQuestions,
      correctAnswers,
      wrongAnswers: Number(gradeData.wrongAnswers || 0),
      masteryPercentage: parseFloat(masteryPercentage.toFixed(2)),
      masteryStatus: !hasSufficientEvidence
        ? 'Insufficient Evidence'
        : masteryPercentage >= GE_MASTERY_THRESHOLD ? 'Mastered' : 'Not Mastered',
      hasSufficientEvidence,
    }
  })

  const reliableEvidence = evidence.filter((item) => item.hasSufficientEvidence)
  if (!reliableEvidence.length) {
    return { topicGE: null, geStatus: 'Insufficient Evidence', highestMasteredGrade: null, evidence }
  }

  const firstNotMastered = reliableEvidence.find((item) => item.masteryPercentage < GE_MASTERY_THRESHOLD)
  const masteredEvidence = reliableEvidence.filter((item) => item.masteryPercentage >= GE_MASTERY_THRESHOLD)
  const highestMasteredGrade = masteredEvidence.length
    ? Math.max(...masteredEvidence.map((item) => item.grade))
    : 0

  // Mastery must remain consecutive through the highest mastered grade.
  const consecutiveMastered = highestMasteredGrade > 0 && evidence
    .filter((item) => item.grade <= highestMasteredGrade)
    .every((item) => item.hasSufficientEvidence && item.masteryPercentage >= GE_MASTERY_THRESHOLD)

  const reliableNextGrade = firstNotMastered && firstNotMastered.grade === highestMasteredGrade + 1
    ? firstNotMastered
    : evidence.find((item) => item.grade === highestMasteredGrade + 1 && item.hasSufficientEvidence)
  let topicGE = consecutiveMastered ? highestMasteredGrade : 0

  if (consecutiveMastered && reliableNextGrade && reliableNextGrade.masteryPercentage < GE_MASTERY_THRESHOLD) {
    topicGE += reliableNextGrade.masteryPercentage / 100
  }

  if (!consecutiveMastered && highestMasteredGrade > 0) {
    return { topicGE: null, geStatus: 'Insufficient Evidence', highestMasteredGrade: null, evidence }
  }

  topicGE = Math.min(topicGE, Number(selectedTargetGrade) || 0)
  return {
    topicGE: parseFloat(topicGE.toFixed(2)),
    geStatus: 'Calculated',
    highestMasteredGrade: highestMasteredGrade || null,
    evidence,
  }
}

// ============================================================================
// TOPIC-WISE PERFORMANCE MATRIX
// ============================================================================

/**
 * Calculate topic-wise performance matrix across all grades and topics
 * Optimized to filter questions once at the start
 * @param {Array} allQuestions - All questions (must be array)
 * @param {Object} answers - Map of questionId -> selectedAnswer
 * @param {number} selectedTargetGrade - Target grade (1-8)
 * @returns {Array} Array of topic performance rows with grade breakdowns
 */
export function calculateOverallGradeLevel(topicWisePerformance = [], selectedTargetGrade = 1) {
  if (!Array.isArray(topicWisePerformance) || !topicWisePerformance.length) {
    return Math.max(1, Number(selectedTargetGrade) || 1)
  }

  const targetG = Math.max(1, Number(selectedTargetGrade) || 1)
  const levels = topicWisePerformance
    .filter((topic) => (topic.totalAttempted > 0 || topic.attemptedQuestions > 0) && Number(topic.gradeLevel) > 0)
    .map((topic) => Number(topic.gradeLevel))
    .filter((value) => typeof value === 'number' && Number.isFinite(value) && value > 0)

  if (!levels.length) {
    return 1.0
  }

  const averageLevel = levels.reduce((sum, value) => sum + value, 0) / levels.length
  return parseFloat(clamp(averageLevel, 1.0, targetG).toFixed(2))
}

export function calculateTopicWisePerformance(allQuestions, answers, selectedTargetGrade) {
  // Validate inputs
  if (!Array.isArray(allQuestions) || !allQuestions.length) {
    return []
  }
  
  const topicMatrix = []

  // For each topic, calculate performance across all grades
  ALL_TOPICS.forEach((topic) => {
    const topicRow = {
      topicName: topic,
      grades: {},
      totalRawScore: 0,
      totalAttempted: 0,
      totalCorrect: 0,
      attemptedQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      masteryPercentage: 0,
      gradeLevel: 0,
      topicGE: null,
      geStatus: 'Insufficient Evidence',
      highestMasteredGrade: null,
    }

    // Calculate performance for this topic in each grade
    for (let grade = 1; grade <= 8; grade++) {
      // Filter once for this grade and topic combination
      const topicGradeQuestions = allQuestions.filter(
        (q) => Number(q.grade) === grade && q.topic === topic
      )

      if (topicGradeQuestions.length > 0) {
        const scoreData = calculateTopicScore(topicGradeQuestions, answers)
        topicRow.grades[grade] = {
          correct: scoreData.correct,
          total: scoreData.total,
          attemptedQuestions: scoreData.total - scoreData.unanswered,
          correctAnswers: scoreData.correct,
          wrongAnswers: scoreData.wrong,
          masteryPercentage: scoreData.total - scoreData.unanswered > 0
            ? parseFloat(((scoreData.correct / (scoreData.total - scoreData.unanswered)) * 100).toFixed(2))
            : 0,
          masteryStatus: scoreData.total - scoreData.unanswered >= GE_MINIMUM_SAMPLE
            ? (scoreData.correct / (scoreData.total - scoreData.unanswered)) * 100 >= GE_MASTERY_THRESHOLD ? 'Mastered' : 'Not Mastered'
            : 'Insufficient Evidence',
          normalizedScore: scoreData.normalizedScore,
          weightedScore: scoreData.weightedScore,
          weightedTotal: scoreData.weightedTotal,
          questionScores: scoreData.questionScores,
        }
        topicRow.totalAttempted += scoreData.total - scoreData.unanswered
        topicRow.totalCorrect += scoreData.correct
        topicRow.totalRawScore += scoreData.rawScore
        topicRow.wrongAnswers += scoreData.wrong
      } else {
        topicRow.grades[grade] = {
          correct: 0,
          total: 0,
          attemptedQuestions: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          masteryPercentage: 0,
          masteryStatus: 'Insufficient Evidence',
          normalizedScore: 0,
        }
      }
    }

    topicRow.attemptedQuestions = topicRow.totalAttempted
    topicRow.correctAnswers = topicRow.totalCorrect
    topicRow.masteryPercentage = topicRow.totalAttempted > 0
      ? parseFloat(((topicRow.totalCorrect / topicRow.totalAttempted) * 100).toFixed(2))
      : 0

    // Grade level reflects this topic's accuracy within the selected grade boundary.
    const targetG = Math.max(1, Number(selectedTargetGrade) || 1)
    if (topicRow.totalAttempted > 0) {
      const overallWeightedTotal = Object.values(topicRow.grades)
        .reduce((sum, gradeData) => sum + (gradeData.weightedTotal || 0), 0)
      const overallWeightedScore = Object.values(topicRow.grades)
        .reduce((sum, gradeData) => sum + (gradeData.weightedScore || 0), 0)
      const overallScore = overallWeightedTotal > 0
        ? overallWeightedScore / overallWeightedTotal
        : 0
      topicRow.gradeLevel = parseFloat(clamp(1.0 + overallScore * (targetG - 1.0), 1.0, targetG).toFixed(2))
    } else {
      topicRow.gradeLevel = null
    }

    const geResult = calculateTopicGradeEquivalent(topicRow.grades, selectedTargetGrade)
    topicRow.topicGE = geResult.topicGE
    topicRow.geStatus = geResult.geStatus
    topicRow.highestMasteredGrade = geResult.highestMasteredGrade
    topicRow.gradeEvidence = geResult.evidence
    if (topicRow.topicGE !== null && Number.isFinite(topicRow.topicGE) && topicRow.topicGE >= 1.0) {
      topicRow.gradeLevel = topicRow.topicGE
    }

    topicMatrix.push(topicRow)
  })

  return topicMatrix
}

// ============================================================================
// COMPLETE RESULT OBJECT
// ============================================================================

/**
 * Calculate everything and return a comprehensive result object
 * @param {Array} allQuestions - All questions (must be array)
 * @param {Object} answers - Student answers map (must be object)
 * @param {number} selectedTargetGrade - Student's selected target grade (1-8)
 * @param {Object} studentInfo - { name, age, testDate } student metadata
 * @returns {Object} Complete assessment result with reportData, gradePerformance, etc.
 * @throws {Error} If allQuestions is not an array or selectedTargetGrade is invalid
 */
export function generateCompleteAssessmentResult(allQuestions, answers, selectedTargetGrade, studentInfo = {}) {
  // Input validation
  if (!Array.isArray(allQuestions)) {
    console.error('generateCompleteAssessmentResult: allQuestions must be an array', allQuestions)
    throw new Error('Invalid questions format - expected array')
  }
  if (typeof answers !== 'object' || answers === null) {
    console.error('generateCompleteAssessmentResult: answers must be an object', answers)
    throw new Error('Invalid answers format - expected object')
  }
  const gradeNum = Number(selectedTargetGrade)
  if (!Number.isInteger(gradeNum) || gradeNum < 1 || gradeNum > 8) {
    console.error('generateCompleteAssessmentResult: selectedTargetGrade must be 1-8, got:', selectedTargetGrade)
    throw new Error('Invalid grade - must be between 1 and 8')
  }
  
  // Calculate grade-by-grade results
  const gradeResults = calculateGradeResults(allQuestions, answers, gradeNum)

  // Calculate overall results
  const overallResult = calculateOverallResult(gradeResults, gradeNum)

  // Calculate difficulty performance
  const attemptedQuestions = allQuestions.filter((q) => q.id in answers)
  const difficultyPerformance = calculateDifficultyPerformance(attemptedQuestions, answers)

  // Calculate topic-wise performance matrix
  const topicWisePerformance = calculateTopicWisePerformance(allQuestions, answers, gradeNum)
  const topicGradeEquivalents = Object.fromEntries(ALL_TOPICS.map((topic) => [
    topic,
    calculateAdaptiveTopicGE(allQuestions.filter((question) => question.topic === topic), answers, gradeNum),
  ]))
  topicWisePerformance.forEach((topic) => {
    topic.topicGE = topicGradeEquivalents[topic.topicName]
    topic.geStatus = topic.topicGE == null ? 'Insufficient Evidence' : 'Calculated'
  })
  const accuracy = overallResult.totalAttempted > 0
    ? parseFloat((overallResult.totalCorrect / overallResult.totalAttempted).toFixed(2))
    : 0

  const adaptiveOverall = calculateAdaptiveOverallGE(topicGradeEquivalents, gradeNum)
  const accuracyBasedGE = accuracy > 0 ? 1.0 + accuracy * (gradeNum - 1.0) : 1.0
  const finalDemonstratedLevel = adaptiveOverall !== null && Number.isFinite(adaptiveOverall) && adaptiveOverall >= 1.0
    ? clamp(adaptiveOverall, 1.0, gradeNum)
    : overallGradeLevel >= 1.0
    ? clamp(overallGradeLevel, 1.0, gradeNum)
    : clamp(accuracyBasedGE, 1.0, gradeNum)

  const overallGradeEquivalent = parseFloat(finalDemonstratedLevel.toFixed(2))
  const validTopicGEs = Object.values(topicGradeEquivalents)
    .filter((topicGE) => typeof topicGE === 'number' && Number.isFinite(topicGE))
  const diagnosticConfidence = getDiagnosticConfidence(
    overallResult.totalAttempted,
    selectedTargetGrade,
    overallResult.totalQuestions,
    overallResult.totalCorrect,
  )
  const topicInsights = topicWisePerformance
    .filter((topic) => topic.totalAttempted > 0)
    .map((topic) => ({
      topic: topic.topicName,
      score: topic.totalAttempted ? topic.totalCorrect / topic.totalAttempted : 0,
      totalAttempted: topic.totalAttempted,
    }))
  const strengths = topicInsights
    .filter((topic) => topic.score >= PERFORMANCE_THRESHOLDS.Strong.min)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((topic) => topic.topic)
  const gaps = topicInsights
    .filter((topic) => topic.score < PERFORMANCE_THRESHOLDS.Developing.min)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((topic) => topic.topic)
  const assessmentSummary = overallResult.totalQuestions === 0
    ? 'No questions were available for this assessment.'
    : `The student demonstrated a mathematical proficiency level of Grade ${overallGradeEquivalent == null ? 'insufficient evidence' : overallGradeEquivalent} based on topic mastery across Grades 1-${gradeNum}. The assessment included ${overallResult.totalQuestions} questions, of which ${overallResult.totalCorrect} were answered correctly. The student showed stronger performance in ${strengths.length ? strengths.join(', ') : 'no assessed topic yet'} and requires additional practice in ${gaps.length ? gaps.join(', ') : 'the assessed topics'}.`
  const recommendedLearningFocus = (gradeResults.length ? gradeResults : [{ gradeNumber: 1, performanceStatus: 'Needs Improvement' }])
    .filter((grade) => grade.performanceStatus !== 'Strong')
    .map((grade) => `Grade ${grade.gradeNumber}: Needs practice`)

  // Validate and normalize studentInfo
  const parsedTestDate = studentInfo?.testDate ? new Date(studentInfo.testDate) : new Date()
  const validatedStudentInfo = {
    name: String(studentInfo?.name || 'Student').trim(),
    age: String(studentInfo?.age || '').trim(),
    testDate: Number.isNaN(parsedTestDate.getTime()) ? new Date().toISOString() : parsedTestDate.toISOString(),
  }
  
  // Build comprehensive report data
  const reportData = {
    studentName: validatedStudentInfo.name,
    studentAge: validatedStudentInfo.age,
    testDate: validatedStudentInfo.testDate,
    selectedGrade: gradeNum,
    overallGradeEquivalent,
    demonstratedMathLevel: parseFloat(clamp(finalDemonstratedLevel, 1.0, gradeNum).toFixed(2)),
    finalCumulativeScore: overallResult.finalCumulativeScore,
    totalAttempted: overallResult.totalAttempted,
    totalQuestions: overallResult.totalQuestions,
    totalCorrect: overallResult.totalCorrect,
    totalWrong: overallResult.totalWrong,
    totalUnanswered: overallResult.totalUnanswered,
    accuracy,
    unansweredRate: overallResult.totalQuestions > 0
      ? parseFloat((overallResult.totalUnanswered / overallResult.totalQuestions).toFixed(2))
      : 0,
    diagnosticConfidence,
    strengths,
    gaps,
    assessmentSummary,
    recommendedLearningFocus,
    gradePerformance: gradeResults,
    difficultyPerformance,
    topicWisePerformance,
    topicGradeEquivalents,
    overallResult,
    validTopicCount: validTopicGEs.length,
  }

  return reportData
}

// ============================================================================
// LEGACY COMPATIBILITY (Keep existing functions working)
// ============================================================================

export function computeTopicPercent(topicState) {
  if (!topicState) return NaN
  if (topicState.totalWeight && topicState.weightedCorrect != null) {
    return topicState.totalWeight ? topicState.weightedCorrect / topicState.totalWeight : NaN
  }
  const attempts = Number(topicState.attempts || 0)
  const correct = Number(topicState.correct || 0)
  return attempts ? correct / attempts : NaN
}

export function computeTopicGrade(topicState, Gmin = 1, Gmax = 8) {
  const p = computeTopicPercent(topicState)
  if (Number.isNaN(p)) return null
  const grade = Gmin + p * (Gmax - Gmin)
  return Number(grade.toFixed(2))
}

export function computeOverallGrade(topicStates = [], weights = null, Gmin = 1, Gmax = 8) {
  if (!Array.isArray(topicStates) || topicStates.length === 0) return null

  const entries = topicStates
    .map((t, i) => {
      const p = typeof t === 'number' ? t : computeTopicPercent(t)
      const w = Array.isArray(weights) && weights[i] != null ? Number(weights[i]) : 1
      return { p, w }
    })
    .filter((e) => !Number.isNaN(e.p) && e.p != null)

  if (!entries.length) return null
  const totalW = entries.reduce((s, e) => s + e.w, 0)
  const P = entries.reduce((s, e) => s + e.p * e.w, 0) / totalW
  const grade = Gmin + P * (Gmax - Gmin)
  return Number(grade.toFixed(2))
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')
}

function lerpColor(aHex, bHex, t) {
  const a = hexToRgb(aHex)
  const b = hexToRgb(bHex)
  const r = Math.round(a[0] + (b[0] - a[0]) * t)
  const g = Math.round(a[1] + (b[1] - a[1]) * t)
  const bl = Math.round(a[2] + (b[2] - a[2]) * t)
  return rgbToHex(r, g, bl)
}

export function computeColor(grade, targetRange = [1, 8], attempted = true) {
  const GREY = { color: '#9ca3af', name: 'grey' }
  if (!attempted || grade == null || Number.isNaN(grade)) return GREY
  const [tmin, tmax] = targetRange
  if (grade < tmin) {
    const span = Math.max(1e-6, tmin - (tmin - 1))
    const t = clamp((grade - (tmin - span)) / span, 0, 1)
    return { color: lerpColor('#ef4444', '#f59e0b', t), name: 'below' }
  }
  if (grade > tmax) {
    const t = clamp((grade - tmax) / (tmax || 1), 0, 1)
    return { color: lerpColor('#34d399', '#059669', clamp(0.25 + t * 0.75, 0, 1)), name: 'above' }
  }
  const r = clamp((grade - tmin) / (tmax - tmin || 1), 0, 1)
  return { color: lerpColor('#f59e0b', '#10b981', r), name: 'on-target' }
}

