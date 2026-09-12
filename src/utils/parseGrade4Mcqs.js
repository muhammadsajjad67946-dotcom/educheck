const topicNames = {
  'Number System & Operations': 'Number & Operations',
  Algebra: 'Algebra',
  Geometry: 'Geometry',
  Measurement: 'Measurement',
  'Data Analysis': 'Data Analysis',
}

function clean(value) {
  return value.replace(/\r/g, '').replace(/\*\*/g, '').trim()
}

export function parseGrade4Mcqs(source) {
  const questions = []
  let topic = 'Number & Operations'
  let subtopic = 'General Operations'
  const blocks = String(source).split(/(?=\*\*Q\d+\.)/)

  blocks.forEach((block) => {
    const heading = block.match(/^## \d+\.\s+(.+?)\s+—/m)
    if (heading) topic = topicNames[clean(heading[1])] || clean(heading[1])
    const section = block.match(/^###\s+(.+)$/m)
    if (section) subtopic = clean(section[1])
    const dailyLifeHeading = block.match(/^###\s+[A-E]\.\s+(.+?)(?:\s+—|\s*$)/m)
    if (dailyLifeHeading) {
      const headingName = dailyLifeHeading[1].replace(/\s+Daily Life$/, '').trim()
      topic = headingName.startsWith('Number') ? 'Number & Operations' : headingName.startsWith('Algebra') ? 'Algebra' : headingName.startsWith('Fractions') ? 'Number & Operations' : headingName.startsWith('Measurement') ? 'Measurement' : 'Data Analysis'
      subtopic = headingName
    }
    const questionMatch = block.match(/^\*\*Q(\d+)\.\s*(?:\[[^\]]+\]\s*)?\*\*\s*([\s\S]*?)(?=\n\n\*\*Skill:|\n\*\*Skill:|\n\nA\))/)
    if (!questionMatch) return
    const metadata = block.match(/\*\*Skill:\s*([^|]+)\|\s*\*\*Difficulty:\s*([^|]+)\|\s*\*\*Context:\s*([^\n]+?)(?:\*\*)?\s*$/m)
    const options = [...block.matchAll(/^([A-D])\)\s*(.+)$/gm)]
    const answer = block.match(/\*\*(?:Correct\s+)?Answer:\s*([A-D])(?:\s*\([^\n]+\))?[^\n]*\*?\*?/i)
    const bracketDifficulty = block.match(/^\*\*Q\d+\.\s*\[([^\s\]]+)/)
    if ((!metadata && !bracketDifficulty) || options.length !== 4 || !answer) return
    questions.push({
      id: 551 + Number(questionMatch[1]),
      grade: 4,
      topic,
      subtopic: clean(metadata?.[1] || subtopic),
      skill: clean(metadata?.[1] || subtopic),
      difficulty: clean(metadata?.[2] || bracketDifficulty?.[1]) === 'Hard'
        ? 'High'
        : clean(metadata?.[2] || bracketDifficulty?.[1]) === 'Medium' ? 'Medium' : 'Low',
      context: clean(metadata?.[3] || 'Daily-Life'),
      question: clean(questionMatch[2]),
      options: Object.fromEntries(options.map((match) => [match[1], clean(match[2])])),
      answer: answer[1].toUpperCase(),
    })
  })

  return questions
}
