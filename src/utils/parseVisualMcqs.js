const TOPIC_NAMES = {
  'Number System & Operations': 'Number & Operations',
  Algebra: 'Algebra',
  Geometry: 'Geometry',
  Measurement: 'Measurement',
  'Data Analysis': 'Data Analysis',
}

function cleanText(value) {
  return value.replace(/\r/g, '').replace(/\*\*/g, '').trim()
}

export function parseVisualMcqs(markdown) {
  const questions = []
  let topic = 'Number & Operations'
  let subtopic = 'General Operations'
  let topicQuestionNumber = 0
  const blocks = String(markdown).split(/(?=\*\*\d+\.\s)/)

  blocks.forEach((block) => {
    const heading = block.match(/^# \d+\.\s+(.+?)\s+—/m)
    if (heading) {
      const headingName = heading[1].trim()
      topic = TOPIC_NAMES[headingName] || headingName
      subtopic = 'General Operations'
      topicQuestionNumber = 0
    }
    const subheading = block.match(/^###\s+(.+)$/m)
    if (subheading) subtopic = cleanText(subheading[1])

    const questionMatch = block.match(/^\*\*(\d+)\.\s+([\s\S]*?)\*\*/)
    if (!questionMatch) return
    const optionMatches = [...block.matchAll(/^([A-D])\)\s*(.+)$/gm)]
    const answerMatch = block.match(/\*\*Answer:\s*([A-D])\*\*/i)
    if (optionMatches.length !== 4 || !answerMatch) return

    topicQuestionNumber += 1
    const difficulty = topicQuestionNumber <= 20 ? 'Low' : topicQuestionNumber <= 40 ? 'Medium' : 'High'
    questions.push({
      id: 381 + questions.length,
      grade: 3,
      topic,
      subtopic,
      difficulty,
      question: cleanText(questionMatch[2]),
      options: Object.fromEntries(optionMatches.map((match) => [match[1], cleanText(match[2])])),
      answer: answerMatch[1].toUpperCase(),
    })
  })

  return questions
}
