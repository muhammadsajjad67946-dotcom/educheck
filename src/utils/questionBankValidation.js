export const REQUIRED_DIFFICULTIES = ['Low', 'Medium', 'High']
export const REQUIRED_TOPICS = ['Number & Operations', 'Measurement', 'Data Analysis', 'Algebra', 'Geometry']

export function validateQuestionBank(questions = []) {
  const groups = new Map()
  const duplicateIds = []
  const seenIds = new Set()
  const invalidQuestions = []

  questions.forEach((question, index) => {
    const questionId = question?.id
    if (questionId == null || seenIds.has(questionId)) {
      duplicateIds.push(questionId ?? `index-${index}`)
    }
    seenIds.add(questionId)

    const grade = Number(question?.grade)
    const groupKey = `${grade} | ${question?.topic || 'Unknown topic'}`
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        grade,
        topic: question?.topic || 'Unknown topic',
        total: 0,
        counts: { Low: 0, Medium: 0, High: 0 },
        missingDifficulties: [...REQUIRED_DIFFICULTIES],
      })
    }

    const group = groups.get(groupKey)
    group.total += 1
    if (REQUIRED_DIFFICULTIES.includes(question?.difficulty)) {
      group.counts[question.difficulty] += 1
      group.missingDifficulties = group.missingDifficulties.filter(
        (difficulty) => difficulty !== question.difficulty,
      )
    }

    if (
      !question ||
      question.id == null ||
      !Number.isFinite(grade) ||
      !question.topic ||
      !REQUIRED_TOPICS.includes(question.topic) ||
      !REQUIRED_DIFFICULTIES.includes(question.difficulty)
    ) {
      invalidQuestions.push({ index, id: questionId ?? null, reason: 'Invalid id, grade, topic, or difficulty' })
    }
  })

  const coverage = [...groups.values()].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade
    return a.topic.localeCompare(b.topic)
  })

  return {
    totalQuestions: questions.length,
    uniqueQuestionIds: seenIds.size,
    duplicateIds: [...new Set(duplicateIds)],
    invalidQuestions,
    coverage,
    incompleteGroups: coverage.filter((group) => group.missingDifficulties.length > 0),
    isValid: duplicateIds.length === 0 && invalidQuestions.length === 0,
  }
}

export function formatQuestionBankCoverageReport(report) {
  return report.coverage.map((group) => ({
    grade: group.grade,
    topic: group.topic,
    total: group.total,
    low: group.counts.Low,
    medium: group.counts.Medium,
    high: group.counts.High,
    missing: group.missingDifficulties,
  }))
}
