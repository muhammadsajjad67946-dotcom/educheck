const domainNames = {
  'Operations & Algebraic Thinking': 'Algebra',
  'Number & Operations in Base Ten': 'Number & Operations',
  'Number & Operations - Fractions': 'Number & Operations',
  'Number & Operations – Fractions': 'Number & Operations',
  'Measurement & Data': 'Measurement',
  Geometry: 'Geometry',
}

export function parseGrade5Mcqs(source) {
  const questions = Array.isArray(source?.questions) ? source.questions : []

  return questions.map((question, index) => ({
    id: 801 + index,
    grade: 5,
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