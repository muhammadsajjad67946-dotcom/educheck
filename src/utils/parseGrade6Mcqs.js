const domainNames = {
  'Ratios and Proportional Relationships': 'Number & Operations',
  'The Number System': 'Number & Operations',
  'Expressions and Equations': 'Algebra',
  Geometry: 'Geometry',
  'Statistics and Probability': 'Data Analysis',
}

export function parseGrade6Mcqs(source) {
  const questions = Array.isArray(source?.questions) ? source.questions : []

  return questions.map((question, index) => ({
    id: 1101 + index,
    grade: 6,
    domainKey: question.domain,
    topic: domainNames[question.domain] || question.domain,
    subtopic: question.subdomain,
    leafTopic: question.leaf_topic,
    question: question.question,
    options: question.options,
    answer: String(question.answer_letter || '').toUpperCase(),
    difficulty: ['Low', 'Medium', 'High'][index % 3],
    explanation: question.explanation,
  }))
}