/**
 * Formats and sanitizes question explanations for elementary and middle school students (Grades 1-8).
 * - Converts any legacy Roman Urdu to simple English.
 * - Completely removes LaTeX math syntax and dollar signs ($).
 * - Converts powers and roots to standard clean symbols (e.g. ², ³, √, →).
 * - Aligns explanation with the actual question options and correct answer.
 * - Provides step-by-step breakdown (Step 1, Step 2, Conclusion).
 */
export function formatKidFriendlyExplanation(text, correctOption = '', meta = {}) {
  if (!text || typeof text !== 'string') {
    const optLetter = String(correctOption || '').trim().toUpperCase()
    return optLetter ? `Therefore, option ${optLetter} is correct.` : 'Review the solution method for this topic.'
  }

  let cleaned = text

  // 1. Remove introductory Urdu or generic boilerplate headers
  cleaned = cleaned
    .replace(/^Agar\s+question\s+ko\s+is\s+tarah\s+hal\s+karte\s+to\s+theek\s+hota:?\s*/gim, '')
    .replace(/^Agar\s+aap\s+is\s+sawal\s+ko\s+is\s+tarah\s+hal\s+karein:?\s*/gim, '')
    .replace(/^Agar\s+question\s+ko\s+is\s+tarah\s+hal\s+kiya\s+jaye:?\s*/gim, '')
    .replace(/^Here\s+is\s+how\s+to\s+solve\s+this\s+question\s+correctly:?\s*/gim, '')
    .replace(/^Here\s+is\s+how\s+to\s+solve\s+this\s+correctly:?\s*/gim, '')
    .replace(/^How\s+to\s+solve:?\s*/gim, '')

  // 2. Remove rigid bullet markers (- Step 1:, Step 1:, - Step 2:, etc.)
  cleaned = cleaned
    .replace(/^[-\u2022*]\s*Step\s*\d+:\s*/gim, '')
    .replace(/\n\s*[-\u2022*]\s*Step\s*\d+:\s*/gim, ' ')
    .replace(/Step\s*\d+:\s*/gim, '')

  // 3. Remove conclusion markers and translate Urdu conclusions
  cleaned = cleaned
    .replace(/^[-\u2022*]\s*Conclusion:\s*/gim, '')
    .replace(/\n\s*[-\u2022*]\s*Conclusion:\s*/gim, ' ')
    .replace(/Conclusion:\s*/gim, ' ')
    .replace(/Is\s+tarah\s+sahi\s+option\s+([A-D])\s+banta\s+hai\.?/gim, 'Option $1 is correct.')
    .replace(/Is\s+liye\s+sahi\s+option\s+([A-D])\s+hai\.?/gim, 'Option $1 is correct.')
    .replace(/Sahi\s+jawab\s+option\s+([A-D])\s+hai\.?/gim, 'Option $1 is correct.')

  // Simplify robotic or overly verbose phrasing to simple kid-friendly language
  cleaned = cleaned
    .replace(/Set up the mathematical operation using the problem values:\s*/gi, 'Look at the numbers: ')
    .replace(/Set up the mathematical calculation for\s*/gi, 'Start with ')
    .replace(/Perform the calculation:\s*the accurate mathematical result is\s*/gi, 'Calculate: ')
    .replace(/the accurate mathematical result is\s*/gi, 'the answer is ')
    .replace(/Evaluate the mathematical expression to find the result\.?/gi, 'Calculate to find the answer.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+matches\s+the\s+answer\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+satisfies\s+the\s+equation\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+is\s+the\s+accurate\s+answer\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+is\s+the\s+correct\s+(sum|difference|product|quotient|perimeter|area|range|mode|median|mean)\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+accurate\s+because\s+(.+?)\s+is\s+the\s+correct\s+(perimeter|area)\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+it\s+satisfies\s+all\s+geometric\s+properties\.?/gi, 'Option $1 is correct.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+satisfies\s+all\s+geometric\s+properties\.?/gi, 'Option $1 is correct: $2.')
    .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\./gi, 'Option $1 is correct.')

  // 4. Translate common Roman Urdu phrases in math explanations
  cleaned = cleaned
    .replace(/\bDiye\s+gaye\s+triangle\s+mein\s+Pythagoras\s+theorem\s+istemal\s+karein:?/gi, 'In the given triangle, use the Pythagorean theorem:')
    .replace(/\bPythagoras\s+theorem\s+istemal\s+karein:?/gi, 'use the Pythagorean theorem:')
    .replace(/\bDiye\s+gaye\s+triangle\s+mein\b/gi, 'In the given triangle,')
    .replace(/\bDiye\s+gaye\s+sawal\s+mein\b/gi, 'In the given problem,')
    .replace(/\bDiye\s+gaye\b/gi, 'In the given')
    .replace(/\bistemal\s+karein\b/gi, 'use')
    .replace(/\bistemal\s+karta\s+hai\b/gi, 'uses')
    .replace(/\bJahan\b/gi, 'where')
    .replace(/\baur\b/gi, 'and')
    .replace(/\bhal\s+karein\b/gi, 'solve')
    .replace(/\bhal\s+kiya\s+jaye\b/gi, 'solved')
    .replace(/\bsahi\s+option\b/gi, 'correct option')
    .replace(/\bbanta\s+hai\b/gi, 'is correct')

  // 5. Clean LaTeX math formatting and symbols
  cleaned = cleaned
    // Square roots: $\sqrt{10}$ or \sqrt{10} -> √10
    .replace(/\$\\sqrt\{([^}]+)\}\$/g, '√$1')
    .replace(/\\sqrt\{([^}]+)\}/g, '√$1')
    .replace(/\$\\sqrt\s*([0-9a-zA-Z]+)\$/g, '√$1')
    .replace(/\\sqrt\s*([0-9a-zA-Z]+)/g, '√$1')
    .replace(/\\sqrt\b/g, '√')
    // Fractions: \frac{a}{b} -> (a / b)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    // Powers / Exponents
    .replace(/\$([a-zA-Z0-9]+)\^2\$/g, '$1²')
    .replace(/([a-zA-Z0-9]+)\^2/g, '$1²')
    .replace(/\$([a-zA-Z0-9]+)\^3\$/g, '$1³')
    .replace(/([a-zA-Z0-9]+)\^3/g, '$1³')
    .replace(/\$([a-zA-Z0-9]+)\^([0-9]+)\$/g, '$1^$2')
    // Math operators & arrows
    .replace(/\\Rightarrow/g, '→')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\Leftarrow/g, '←')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\cdot/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\degree/g, '°')
    .replace(/\\circ/g, '°')
    .replace(/\\pi/g, 'π')
    // Remove all LaTeX \text{...} wrappers
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    // Completely remove all dollar signs ($)
    .replace(/\$/g, '')
    // Remove any remaining backslash LaTeX macros
    .replace(/\\[a-zA-Z]+/g, '')

  // 6. Formatting cleanup: collapse newlines and double spaces into clean text
  cleaned = cleaned
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s*,\s*\./g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s+where\b/gi, ', where')
    .trim()

  const optLetter = String(correctOption || '').trim().toUpperCase()
  const options = meta?.options || {}
  const question = meta?.question || ''

  // 7. Align with question if mismatched
  if (optLetter) {
    cleaned = cleaned.replace(/option\s+[A-D]\b/gi, `Option ${optLetter}`)
    cleaned = cleaned.replace(/option\s+is\s+[A-D]\b/gi, `Option is ${optLetter}`)
  }

  // Handle specific rational number case if question options mismatch hallucinated example
  if (/rational/i.test(question) && optLetter) {
    const correctVal = options[optLetter] || options[optLetter.toLowerCase()]
    if (correctVal === '1/2' && /5\/8/.test(cleaned)) {
      cleaned = cleaned.replace(/5\/8/g, '1/2')
      cleaned = cleaned.replace(/5\s+and\s+8/gi, '1 and 2')
    }
  }

  // 8. Ensure clear conclusion with correct option
  if (optLetter) {
    const hasOptionMention = new RegExp(`option\\s+${optLetter}`, 'i').test(cleaned) ||
                             new RegExp(`option\\s+is\\s+${optLetter}`, 'i').test(cleaned) ||
                             new RegExp(`${optLetter}\\s+is\\s+(the\\s+)?correct`, 'i').test(cleaned)
    if (!hasOptionMention) {
      if (!/[.!?]$/.test(cleaned)) cleaned += '.'
      const optVal = options[optLetter] ? ` (${String(options[optLetter]).trim()})` : ''
      cleaned += ` Option ${optLetter}${optVal} is correct.`
    }
  }

  return cleaned
}

/**
 * Generates a concise, kid-friendly explanation for why a student's chosen option is incorrect.
 */
export function generateWrongAnswerReason({
  question = '',
  selectedAnswer = '',
  correctAnswer = '',
  options = {},
  topic = '',
  subtopic = '',
  existingReason = '',
} = {}) {
  const selLetter = String(selectedAnswer || '').trim().toUpperCase()
  const corrLetter = String(correctAnswer || '').trim().toUpperCase()

  if (!selLetter || selLetter === 'NONE' || selLetter === 'NULL') {
    return 'The question was left unanswered. Review the concept and options to practice this question type.'
  }

  // If a valid existing reason is provided from AI or DB, sanitize and return it
  if (existingReason && typeof existingReason === 'string' && existingReason.trim().length > 15) {
    const cleanedReason = formatKidFriendlyExplanation(existingReason, corrLetter, { options, question })
    if (!/selected option [A-D] does not satisfy the condition/i.test(cleanedReason)) {
      return cleanedReason
    }
  }

  const selText = String(options?.[selLetter] || options?.[selLetter.toLowerCase()] || '').trim()
  const corrText = String(options?.[corrLetter] || options?.[corrLetter.toLowerCase()] || '').trim()
  const qLower = String(question || '').toLowerCase()
  const subtopicLower = String(subtopic || '').toLowerCase()
  const topicLower = String(topic || '').toLowerCase()
  const contextText = `${qLower} ${subtopicLower} ${topicLower}`
  const selLower = selText.toLowerCase()
  const corrLower = corrText.toLowerCase()
  const numbers = [...question.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0])).filter((n) => Number.isFinite(n))

  // 1. Outlier misconceptions
  if (/\boutliers?\b/i.test(contextText)) {
    if (selText && corrText) {
      return `You selected Option ${selLetter} (${selText}). In this data set, ${selText} is close to the other numbers, so it belongs with the group. ${corrText} is the outlier because it is far away from the rest.`
    }
  }

  // 2. Shapes & Geometry misconceptions
  const shapeDescriptions = {
    triangle: 'has 3 sides and 3 angles',
    rectangle: 'has 4 sides with opposite sides equal and 4 right angles',
    square: 'has 4 equal sides and 4 right angles',
    circle: 'is round with no straight sides or corners',
    pentagon: 'has 5 sides and 5 angles',
    hexagon: 'has 6 sides and 6 angles',
    octagon: 'has 8 sides and 8 angles',
    rhombus: 'has 4 equal sides with opposite angles equal',
    trapezoid: 'has only one pair of parallel sides',
    cube: 'is a 3D solid with 6 square faces',
    cylinder: 'has 2 circular bases and a curved body',
    sphere: 'is a completely round 3D ball shape',
    cone: 'has a circular base and comes to a point',
  }

  const selShapeKey = Object.keys(shapeDescriptions).find((s) => selLower.includes(s))
  const corrShapeKey = Object.keys(shapeDescriptions).find((s) => corrLower.includes(s))

  if (selShapeKey && corrShapeKey && selShapeKey !== corrShapeKey) {
    return `You selected Option ${selLetter} (${selText}). A ${selShapeKey} ${shapeDescriptions[selShapeKey]}, whereas the question asks for a ${corrShapeKey} which ${shapeDescriptions[corrShapeKey]}.`
  }

  if (selShapeKey && (qLower.includes('opposite sides equal') || qLower.includes('4 sides') || qLower.includes('four sides'))) {
    return `You selected Option ${selLetter} (${selText}). A ${selShapeKey} ${shapeDescriptions[selShapeKey]}, which does not match the 4-sided figure requested in the question.`
  }

  // Number of sides / corners in shapes
  if (/\b(sides|corners|angles|vertices)\b/i.test(qLower)) {
    if (selText && corrText) {
      return `You chose Option ${selLetter} (${selText}). Counting the ${qLower.includes('sides') ? 'sides' : qLower.includes('angles') ? 'angles' : 'corners'} shows there are ${corrText}, not ${selText}.`
    }
  }

  // Perimeter vs Area confusion
  if (/\bperimeter\b/i.test(qLower) && (/\bmultiply|times|area\b/i.test(selLower) || Number(selText) > Number(corrText) * 1.5)) {
    return `You selected Option ${selLetter} (${selText}). This looks like an area calculation. Perimeter means adding all the outside boundary sides together.`
  }
  if (/\barea\b/i.test(qLower) && (/\badd|perimeter\b/i.test(selLower) || Number(selText) < Number(corrText) / 1.5)) {
    return `You selected Option ${selLetter} (${selText}). This looks like a perimeter calculation. Area means multiplying the dimensions (Length × Width).`
  }

  // Statistics: Range, Median, Mean, Mode
  if ((/\brange\b/i.test(contextText) || (/\bdifference\b/i.test(qLower) && /\blargest|highest\b/i.test(qLower) && /\bsmallest|lowest\b/i.test(qLower))) && selText && corrText) {
    if (numbers.length >= 2) {
      const max = Math.max(...numbers)
      const min = Math.min(...numbers)
      return `You selected Option ${selLetter} (${selText}). Range is the highest value minus the lowest value: ${max} - ${min} = ${corrText}.`
    }
    return `You selected Option ${selLetter} (${selText}). Range is the difference between the largest and smallest values (${corrText}).`
  }
  if (/\bmedian\b/i.test(contextText) && selText && corrText) {
    if (numbers.length >= 3) {
      const sorted = [...numbers].sort((a, b) => a - b)
      return `You selected Option ${selLetter} (${selText}). To find the median, arrange the numbers in order: ${sorted.join(', ')}. The middle number is ${corrText}.`
    }
    return `You selected Option ${selLetter} (${selText}). The median is the middle value when numbers are ordered from least to greatest (${corrText}).`
  }
  if (/\b(mean|average)\b/i.test(contextText) && selText && corrText) {
    if (numbers.length >= 2) {
      const sum = numbers.reduce((a, b) => a + b, 0)
      return `You selected Option ${selLetter} (${selText}). Mean is found by adding all numbers (${sum}) and dividing by the count (${numbers.length}): ${sum} ÷ ${numbers.length} = ${corrText}.`
    }
    return `You selected Option ${selLetter} (${selText}). The mean is the total sum divided by the number of values (${corrText}).`
  }
  if (/\bmode\b/i.test(contextText) && selText && corrText) {
    return `You selected Option ${selLetter} (${selText}). Mode is the number that appears most often in the data set (${corrText}).`
  }

  // Pythagorean Theorem
  if (/\b(pythagor|hypotenuse)\b/i.test(contextText) && selText && corrText) {
    return `You selected Option ${selLetter} (${selText}). Using the Pythagorean theorem (a² + b² = c²), the accurate side length is ${corrText}.`
  }

  // Slope-Intercept Form
  if (/\b(slope-intercept|y-intercept|slope)\b/i.test(contextText) && selText && corrText) {
    if (qLower.includes('y-intercept')) {
      return `You selected Option ${selLetter} (${selText}). In slope-intercept form y = mx + b, the constant b is the y-intercept (${corrText}).`
    }
    if (qLower.includes('slope')) {
      return `You selected Option ${selLetter} (${selText}). In slope-intercept form y = mx + b, m is the slope (${corrText}).`
    }
    return `You selected Option ${selLetter} (${selText}). In slope-intercept form y = mx + b, the correct equation is ${corrText}.`
  }

  // Arithmetic operations confusion (Total / Addition vs Subtraction)
  if (/\b(total|altogether|in all|sum|combined)\b/i.test(qLower)) {
    return `You selected Option ${selLetter} (${selText}). The question asks for the total altogether, which requires addition. Subtracting or miscalculating yields ${selText}.`
  }
  if (/\b(left|remaining|remain|remains|gives away|give away|lost|take away|difference|fewer|less|how many more)\b/i.test(qLower)) {
    if (numbers.length >= 2 && selText && corrText) {
      const [n1, n2] = numbers
      const selNum = Number(selText)
      const corrNum = Number(corrText)
      if (Number.isFinite(selNum) && Number.isFinite(corrNum)) {
        if (selNum === n1 + n2) {
          return `You selected Option ${selLetter} (${selText}). You added (${n1} + ${n2}) instead of subtracting. When items are given away or remain, subtract: ${n1} - ${n2} = ${corrText}.`
        }
        if (Math.abs(selNum - corrNum) === 1) {
          return `You selected Option ${selLetter} (${selText}). You were very close, but miscounted by 1 while mentally subtracting. Starting at ${Math.max(n1, n2)} and taking away ${Math.min(n1, n2)} leaves ${corrText}.`
        }
        if (Math.abs(selNum - corrNum) === 2) {
          return `You selected Option ${selLetter} (${selText}). You miscounted by 2 while mentally subtracting. ${Math.max(n1, n2)} - ${Math.min(n1, n2)} = ${corrText}.`
        }
      }
    }
    return `You selected Option ${selLetter} (${selText}). The question asks for how many remain or are left, which requires subtraction, not addition.`
  }
  if (/\b(each|times|product|groups of)\b/i.test(qLower)) {
    return `You selected Option ${selLetter} (${selText}). Equal groups require multiplication, not simple addition.`
  }
  if (/\b(shared|divided|split equally|each gets)\b/i.test(qLower)) {
    return `You selected Option ${selLetter} (${selText}). Splitting into equal groups requires division.`
  }

  // Arithmetic calculation mistakes & Mental Math off-by-one errors
  if (numbers.length >= 2 && selText && corrText) {
    const [n1, n2] = numbers
    const selNum = Number(selText)
    const corrNum = Number(corrText)
    if (Number.isFinite(selNum) && Number.isFinite(corrNum)) {
      if (n1 + n2 === corrNum && Math.abs(n1 - n2) === selNum) {
        return `You selected Option ${selLetter} (${selText}). You subtracted (${n1} - ${n2}) instead of adding. The question requires adding: ${n1} + ${n2} = ${corrText}.`
      }
      if (Math.abs(n1 - n2) === corrNum && n1 + n2 === selNum) {
        return `You selected Option ${selLetter} (${selText}). You added (${n1} + ${n2}) instead of subtracting. The question requires subtracting: ${n1 > n2 ? `${n1} - ${n2}` : `${n2} - ${n1}`} = ${corrText}.`
      }
      if (n1 * n2 === corrNum && n1 + n2 === selNum) {
        return `You selected Option ${selLetter} (${selText}). You added instead of multiplying. The question requires multiplying: ${n1} × ${n2} = ${corrText}.`
      }
      if (Math.abs(selNum - corrNum) === 1) {
        return `You selected Option ${selLetter} (${selText}). You were very close, but miscounted by 1 during calculation. The accurate answer is ${corrText}.`
      }
      if (Math.abs(selNum - corrNum) === 2) {
        return `You selected Option ${selLetter} (${selText}). You miscounted by 2 during calculation. The accurate answer is ${corrText}.`
      }
    }
  }

  // Comparisons
  if (/\b(smallest|least|minimum|lowest|fewest)\b/i.test(contextText) && selText && corrText) {
    return `You selected Option ${selLetter} (${selText}). Comparing the numbers shows that ${corrText} is the smallest value, not ${selText}.`
  }
  if (/\b(greatest|largest|maximum|highest|most)\b/i.test(contextText) && selText && corrText) {
    return `You selected Option ${selLetter} (${selText}). Comparing the numbers shows that ${corrText} is the greatest value, not ${selText}.`
  }

  // Fractions confusion
  if (/\bfraction|shaded|equal parts\b/i.test(qLower)) {
    return `You selected Option ${selLetter} (${selText}). In a fraction, the numerator counts the selected/shaded parts, and the denominator counts the total equal parts.`
  }

  // Measurement unit conversion
  if (/\b(liters?|kilograms?|meters?|centimeters?|hours?)\b/i.test(qLower)) {
    return `You selected Option ${selLetter} (${selText}). Check the conversion unit carefully (e.g. 1 liter = 1,000 mL, 1 kg = 1,000 g, 1 m = 100 cm).`
  }

  // Linear equations / Algebra
  const eqMatchReason = question.match(/(\d*)x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i)
  if (eqMatchReason && selText) {
    const a = eqMatchReason[1] ? Number(eqMatchReason[1]) : 1
    const sign = eqMatchReason[2]
    const b = Number(eqMatchReason[3])
    const c = Number(eqMatchReason[4])
    const selNum = Number(selText)
    if (Number.isFinite(selNum)) {
      const lhs = sign === '+' ? (a * selNum + b) : (a * selNum - b)
      return `You selected Option ${selLetter} (${selText}). Substituting x = ${selText} gives ${a > 1 ? `${a}(${selText})` : selText} ${sign} ${b} = ${lhs}, which does not equal ${c}. Solving the equation correctly gives x = ${corrText}.`
    }
  }

  // Missing numbers in simple equations (e.g. 3 + ___ = 7)
  const missingAddReason = question.match(/(\d+)\s*\+\s*[_?.]+\s*=\s*(\d+)/)
  if (missingAddReason && selText) {
    const a = Number(missingAddReason[1])
    const c = Number(missingAddReason[2])
    const selNum = Number(selText)
    if (Number.isFinite(selNum)) {
      return `You selected Option ${selLetter} (${selText}). Checking: ${a} + ${selText} = ${a + selNum}, not ${c}. The accurate number is ${c - a} because ${a} + ${c - a} = ${c}.`
    }
  }

  // Place Value questions
  if (/\b(place\s+value|thousands|hundreds|tens|ones|digit)\b/i.test(qLower) && selText && corrText) {
    return `You selected Option ${selLetter} (${selText}). Checking the place value columns of the given number shows that ${corrText} is the correct digit, not ${selText}.`
  }

  // General fallback
  if (selText && corrText) {
    if (subtopic && subtopic !== 'General') {
      return `You selected Option ${selLetter} (${selText}). In ${subtopic}, review the problem steps carefully to reach the accurate answer Option ${corrLetter} (${corrText}).`
    }
    return `You selected Option ${selLetter} (${selText}). Review the question steps carefully. The accurate answer is Option ${corrLetter} (${corrText}).`
  }

  return `You selected Option ${selLetter}. Review the concept carefully. Option ${corrLetter} is the accurate choice.`
}

/**
 * Splits an explanation into structured, numbered steps suitable for visual step-by-step display.
 * Returns: Array of { label: 'Step 1' | 'Step 2' | 'Conclusion', text: '...' }
 */
function buildFallbackExplanationSteps(question = '', correctOption = '', meta = {}) {
  const optLetter = String(correctOption || '').trim().toUpperCase()
  const options = meta.options || {}
  const questionText = String(question || meta.question || '').trim()
  const qLower = questionText.toLowerCase()
  const subtopic = String(meta.subtopic || '').trim()
  const topic = String(meta.topic || '').trim()
  const subtopicLower = subtopic.toLowerCase()
  const topicLower = topic.toLowerCase()
  const contextText = `${qLower} ${subtopicLower} ${topicLower}`
  const optValue = optLetter && options[optLetter] ? String(options[optLetter]).trim() : ''
  const optNum = Number(optValue?.replace(/[^\d.-]/g, ''))
  const numbers = [...questionText.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0])).filter((n) => Number.isFinite(n))

  const formatConclusion = (letter, val) => letter ? `Option ${letter} is correct${val ? `: ${val}` : ''}.` : 'Review the solution method for this topic.'
  const conclusionText = formatConclusion(optLetter, optValue)

  // 1. Outliers
  const isOutlier = /\boutliers?\b/i.test(contextText)
  if (isOutlier) {
    if (numbers.length >= 3) {
      const others = numbers.filter((n) => Number.isFinite(optNum) ? n !== optNum : true)
      const uniqueOthers = [...new Set(others)]
      const clusterDesc = uniqueOthers.length <= 4 ? uniqueOthers.join(', ') : `${uniqueOthers.slice(0, 3).join(', ')}...`
      return [
        { label: 'Step 1', text: 'An outlier is a data value that is much higher or much lower than the rest of the numbers.' },
        { label: 'Step 2', text: `The values ${clusterDesc} are grouped close together, but ${optValue} is far away from them.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, `${optValue} is the outlier`) },
      ]
    }
    return [
      { label: 'Step 1', text: 'An outlier is a value that lies far outside the main group of data points.' },
      { label: 'Step 2', text: `In this data set, ${optValue} is separated from the other values.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, `${optValue} is the outlier`) },
    ]
  }

  // 2. Algebra: Two-step linear equations (e.g. 5x - 7 = 18, 2x + 4 = 12, x + 7 = 11)
  const eqMatch = questionText.match(/(\d*)x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i)
  if (eqMatch) {
    const a = eqMatch[1] ? Number(eqMatch[1]) : 1
    const sign = eqMatch[2]
    const b = Number(eqMatch[3])
    const c = Number(eqMatch[4])
    const coeffStr = a > 1 ? `${a}x` : 'x'

    if (sign === '+') {
      const rhs = c - b
      const xVal = a > 0 ? rhs / a : rhs
      const step1 = `Subtract ${b} from both sides: ${coeffStr} = ${c} - ${b} = ${rhs}.`
      const step2 = a > 1
        ? `Divide by ${a}: x = ${rhs} ÷ ${a} = ${xVal}.`
        : `So, x = ${xVal}.`
      return [
        { label: 'Step 1', text: step1 },
        { label: 'Step 2', text: step2 },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || xVal) },
      ]
    } else {
      const rhs = c + b
      const xVal = a > 0 ? rhs / a : rhs
      const step1 = `Add ${b} to both sides: ${coeffStr} = ${c} + ${b} = ${rhs}.`
      const step2 = a > 1
        ? `Divide by ${a}: x = ${rhs} ÷ ${a} = ${xVal}.`
        : `So, x = ${xVal}.`
      return [
        { label: 'Step 1', text: step1 },
        { label: 'Step 2', text: step2 },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || xVal) },
      ]
    }
  }

  // 3. Simple multiplication equations (e.g. 3x = 15)
  const mulEqMatch = questionText.match(/(\d+)x\s*=\s*(\d+)/i)
  if (mulEqMatch) {
    const a = Number(mulEqMatch[1])
    const c = Number(mulEqMatch[2])
    const xVal = a > 0 ? c / a : c
    return [
      { label: 'Step 1', text: `Divide both sides by ${a}: x = ${c} ÷ ${a}.` },
      { label: 'Step 2', text: `Calculate: x = ${xVal}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || xVal) },
    ]
  }

  // 4. Missing numbers / Unknowns (□ + 7 = 12, 3 + ___ = 7, □ × 7 = 42)
  const boxAdd = questionText.match(/([□\?_]|\b[a-z]\b)\s*\+\s*(\d+)\s*=\s*(\d+)/i) || questionText.match(/(\d+)\s*\+\s*([□\?_]|\b[a-z]\b)\s*=\s*(\d+)/i)
  if (boxAdd) {
    const a = Number(boxAdd[2] || boxAdd[1])
    const c = Number(boxAdd[3])
    return [
      { label: 'Step 1', text: `Subtract ${a} from ${c} to find the unknown number: ${c} - ${a}.` },
      { label: 'Step 2', text: `Calculate: ${c} - ${a} = ${c - a}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || (c - a)) },
    ]
  }
  const boxSub = questionText.match(/([□\?_]|\b[a-z]\b)\s*-\s*(\d+)\s*=\s*(\d+)/i)
  if (boxSub) {
    const a = Number(boxSub[2])
    const c = Number(boxSub[3])
    return [
      { label: 'Step 1', text: `Add ${a} and ${c} to find the starting number: ${c} + ${a}.` },
      { label: 'Step 2', text: `Calculate: ${c} + ${a} = ${c + a}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || (c + a)) },
    ]
  }
  const boxMul = questionText.match(/([□\?_]|\b[a-z]\b)\s*[\*×]\s*(\d+)\s*=\s*(\d+)/i) || questionText.match(/(\d+)\s*[\*×]\s*([□\?_]|\b[a-z]\b)\s*=\s*(\d+)/i)
  if (boxMul) {
    const a = Number(boxMul[2] || boxMul[1])
    const c = Number(boxMul[3])
    return [
      { label: 'Step 1', text: `Divide ${c} by ${a} to find the unknown factor: ${c} ÷ ${a}.` },
      { label: 'Step 2', text: `Calculate: ${c} ÷ ${a} = ${c / a}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || (c / a)) },
    ]
  }

  // 5. Linear equation evaluation (e.g. y = 2x + 1 when x = 5)
  const evalMatch = questionText.match(/y\s*=\s*(\d*)x\s*([+\-])\s*(\d+).*?x\s*=\s*(\d+)/i)
  if (evalMatch) {
    const m = evalMatch[1] ? Number(evalMatch[1]) : 1
    const sign = evalMatch[2]
    const b = Number(evalMatch[3])
    const x = Number(evalMatch[4])
    const prod = m * x
    const yVal = sign === '+' ? prod + b : prod - b
    return [
      { label: 'Step 1', text: `Substitute x = ${x} into the equation: y = ${m > 1 ? `${m}(${x})` : x} ${sign} ${b}.` },
      { label: 'Step 2', text: `Calculate: ${prod} ${sign} ${b} = ${yVal}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || yVal) },
    ]
  }

  // 6. Slope-Intercept Form
  const isSlopeIntercept = /\b(slope-intercept|y-intercept|slope)\b/i.test(contextText)
  if (isSlopeIntercept) {
    if (qLower.includes('y-intercept') && questionText.match(/y\s*=\s*(-?\d*)x\s*([+\-])\s*(\d+)/i)) {
      const match = questionText.match(/y\s*=\s*(-?\d*)x\s*([+\-])\s*(\d+)/i)
      const bVal = match[2] === '-' ? `-${match[3]}` : match[3]
      return [
        { label: 'Step 1', text: 'In slope-intercept form (y = mx + b), the constant b represents the y-intercept.' },
        { label: 'Step 2', text: `In this equation, the constant term is ${bVal}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || bVal) },
      ]
    }
    if (qLower.includes('slope') && questionText.match(/y\s*=\s*(-?\d*)x/i)) {
      const match = questionText.match(/y\s*=\s*(-?\d*)x/i)
      const mVal = match[1] === '' ? '1' : match[1] === '-' ? '-1' : match[1]
      return [
        { label: 'Step 1', text: 'In slope-intercept form (y = mx + b), m is the slope (the coefficient of x).' },
        { label: 'Step 2', text: `In this equation, the slope m is ${mVal}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || mVal) },
      ]
    }
    if (qLower.includes('slope') && qLower.includes('intercept') && optValue) {
      return [
        { label: 'Step 1', text: 'Slope-intercept form is written as y = mx + b.' },
        { label: 'Step 2', text: `Substitute the slope m and y-intercept b to form the equation: ${optValue}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
      ]
    }
  }

  // 7. Statistics: Range, Median, Mean, Mode
  const isRange = /\brange\b/i.test(contextText) ||
    (/\bdifference\b/i.test(qLower) && /\b(largest|highest|greatest|maximum)\b/i.test(qLower) && /\b(smallest|lowest|least|minimum)\b/i.test(qLower))
  if (isRange && numbers.length >= 2) {
    const max = Math.max(...numbers)
    const min = Math.min(...numbers)
    const rangeVal = max - min
    return [
      { label: 'Step 1', text: `Find the largest (${max}) and smallest (${min}) numbers in the set.` },
      { label: 'Step 2', text: `Subtract the smallest from the largest: ${max} - ${min} = ${optValue || rangeVal}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || rangeVal) },
    ]
  }

  const isMedian = /\bmedian\b/i.test(contextText)
  if (isMedian && numbers.length >= 3) {
    const sorted = [...numbers].sort((a, b) => a - b)
    const midIdx = Math.floor(sorted.length / 2)
    const medianVal = sorted.length % 2 !== 0 ? sorted[midIdx] : (sorted[midIdx - 1] + sorted[midIdx]) / 2
    return [
      { label: 'Step 1', text: `Arrange numbers in order from least to greatest: ${sorted.join(', ')}.` },
      { label: 'Step 2', text: `The middle number is ${optValue || medianVal}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || medianVal) },
    ]
  }

  const isMean = /\b(?:mean|average)\b/i.test(contextText)
  if (isMean && numbers.length >= 2) {
    const sum = numbers.reduce((a, b) => a + b, 0)
    const count = numbers.length || 1
    const meanVal = (sum / count).toFixed(1).replace(/\.0$/, '')
    return [
      { label: 'Step 1', text: `Add all numbers together: ${numbers.join(' + ')} = ${sum}.` },
      { label: 'Step 2', text: `Divide by the count (${count}): ${sum} ÷ ${count} = ${optValue || meanVal}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || meanVal) },
    ]
  }

  const isMode = /\bmode\b/i.test(contextText)
  if (isMode && numbers.length >= 3) {
    const freq = {}
    numbers.forEach((n) => { freq[n] = (freq[n] || 0) + 1 })
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1])
    const topNum = entries[0] ? entries[0][0] : optValue
    const topCount = entries[0] ? entries[0][1] : 1
    return [
      { label: 'Step 1', text: `Count how often each number appears: [${numbers.join(', ')}].` },
      { label: 'Step 2', text: `${optValue || topNum} appears ${topCount} times, which is the most frequent.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || topNum) },
    ]
  }

  // 8. Pythagorean Theorem
  const isPythagoras = /\b(pythagor|hypotenuse)\b/i.test(contextText)
  if (isPythagoras) {
    if (numbers.length >= 2) {
      const sortedNums = [...numbers].sort((a, b) => a - b)
      const a = sortedNums[0]
      const b = sortedNums[1]
      const cSq = a * a + b * b
      const c = Math.sqrt(cSq)
      if (Number.isFinite(optNum) && Math.abs(c - optNum) < 0.01) {
        return [
          { label: 'Step 1', text: `Use the Pythagorean theorem (a² + b² = c²): ${a}² + ${b}² = ${a*a} + ${b*b} = ${cSq}.` },
          { label: 'Step 2', text: `Find the square root: √${cSq} = ${optValue}.` },
          { label: 'Conclusion', text: conclusionText },
        ]
      }
      const maxSide = Math.max(...numbers)
      const otherSide = Math.min(...numbers)
      const diffSq = maxSide * maxSide - otherSide * otherSide
      if (diffSq > 0) {
        const leg = Math.sqrt(diffSq)
        if (Number.isFinite(optNum) && Math.abs(leg - optNum) < 0.01) {
          return [
            { label: 'Step 1', text: `Use the Pythagorean theorem (b² = c² - a²): ${maxSide}² - ${otherSide}² = ${maxSide*maxSide} - ${otherSide*otherSide} = ${diffSq}.` },
            { label: 'Step 2', text: `Find the square root: √${diffSq} = ${optValue}.` },
            { label: 'Conclusion', text: conclusionText },
          ]
        }
      }
    }
    return [
      { label: 'Step 1', text: 'The Pythagorean theorem states that in a right triangle, a² + b² = c².' },
      { label: 'Step 2', text: `Solving for the unknown side gives ${optValue}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 9. Area & Volume & Perimeter
  const isVolume = /\bvolume\b/i.test(contextText)
  if (isVolume && numbers.length >= 3) {
    const [l, w, h] = numbers.slice(0, 3)
    const vol = l * w * h
    if (!Number.isFinite(optNum) || vol === optNum) {
      return [
        { label: 'Step 1', text: `Use the volume formula: Volume = Length × Width × Height (${l} × ${w} × ${h}).` },
        { label: 'Step 2', text: `Multiply the dimensions: ${l} × ${w} × ${h} = ${optValue}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
  }

  const isAreaTriangle = (/\barea\b/i.test(contextText) && /\btriangle\b/i.test(contextText)) || /\barea of triangles\b/i.test(contextText)
  if (isAreaTriangle && numbers.length >= 2) {
    const [b, h] = numbers.slice(0, 2)
    const area = (b * h) / 2
    if (!Number.isFinite(optNum) || area === optNum) {
      return [
        { label: 'Step 1', text: `Use the triangle area formula: Area = (Base × Height) ÷ 2.` },
        { label: 'Step 2', text: `Calculate: (${b} × ${h}) ÷ 2 = ${b * h} ÷ 2 = ${optValue}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
  }

  const isArea = /\barea\b/i.test(contextText)
  if (isArea && numbers.length >= 2) {
    const [l, w] = numbers.slice(0, 2)
    const area = l * w
    if (!Number.isFinite(optNum) || area === optNum) {
      return [
        { label: 'Step 1', text: `Use the area formula: Area = Length × Width (${l} × ${w}).` },
        { label: 'Step 2', text: `Multiply: ${l} × ${w} = ${optValue}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
  }

  const isPerimeter = /\bperimeter\b/i.test(contextText)
  if (isPerimeter) {
    if (numbers.length >= 2) {
      const [l, w] = numbers.slice(0, 2)
      const perim = 2 * (l + w)
      if (perim === optNum) {
        return [
          { label: 'Step 1', text: `Perimeter formula for rectangle: 2 × (Length + Width) = 2 × (${l} + ${w}).` },
          { label: 'Step 2', text: `Calculate: 2 × ${l + w} = ${optValue}.` },
          { label: 'Conclusion', text: conclusionText },
        ]
      }
      const sumSides = numbers.reduce((a, b) => a + b, 0)
      return [
        { label: 'Step 1', text: 'Perimeter is the total distance around the outside (add all sides).' },
        { label: 'Step 2', text: `Add the sides: ${numbers.join(' + ')} = ${optValue || sumSides}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
    return [
      { label: 'Step 1', text: 'Perimeter is the total boundary distance found by adding all outside sides.' },
      { label: 'Step 2', text: `Calculating the sum of all sides gives ${optValue}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 10. Probability
  const isProb = /\bprobabilit(y|ies)\b/i.test(contextText)
  if (isProb && numbers.length >= 2) {
    const sorted = [...numbers].sort((a, b) => a - b)
    const favorable = sorted[0]
    const total = sorted[sorted.length - 1]
    if (total > 0 && Number.isFinite(optNum) && Math.abs((favorable / total) - optNum) < 0.005) {
      return [
        { label: 'Step 1', text: `Use probability formula: Favorable Outcomes ÷ Total Trials (${favorable} ÷ ${total}).` },
        { label: 'Step 2', text: `Divide: ${favorable} ÷ ${total} = ${optValue}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
  }

  // 11. Place Value
  if (/\b(place\s+value|thousands|hundreds|tens|ones|digit)\b/i.test(contextText) && numbers.length >= 1) {
    const targetNum = String(numbers[0])
    let placeName = 'thousands'
    if (contextText.includes('hundreds')) placeName = 'hundreds'
    else if (contextText.includes('ten thousands')) placeName = 'ten thousands'
    else if (contextText.includes('tens')) placeName = 'tens'
    else if (contextText.includes('ones')) placeName = 'ones'
    return [
      { label: 'Step 1', text: `Look at the place value columns of ${targetNum}.` },
      { label: 'Step 2', text: `The digit in the ${placeName} place is ${optValue}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 12. Prime numbers & Square/Cube roots
  if (/\bprime\b/i.test(contextText) && optValue) {
    return [
      { label: 'Step 1', text: 'A prime number has exactly two distinct factors: 1 and itself.' },
      { label: 'Step 2', text: `${optValue} can only be divided evenly by 1 and ${optValue}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }
  if ((/\bsquare\s+root\b/i.test(contextText) || questionText.includes('√')) && optValue) {
    const sq = Number.isFinite(optNum) ? optNum * optNum : ''
    return [
      { label: 'Step 1', text: 'Find what number multiplied by itself gives the value inside the square root.' },
      { label: 'Step 2', text: `${optValue} × ${optValue} = ${sq || 'the number'}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 13. Unit Conversions
  const conversionRules = [
    { pattern: /\b(liters?|litres?)\b.*\bmilliliters?|\bmilliliters?.*\b(liters?|litres?)\b/i, from: 'liter', to: 'milliliters', factor: 1000 },
    { pattern: /\bkilograms?\b.*\bgrams?|\bgrams?.*\bkilograms?\b/i, from: 'kilogram', to: 'grams', factor: 1000 },
    { pattern: /\bmeters?\b.*\bcentimeters?|\bcentimeters?.*\bmeters?\b/i, from: 'meter', to: 'centimeters', factor: 100 },
    { pattern: /\bcentimeters?\b.*\bmillimeters?|\bmillimeters?.*\bcentimeters?\b/i, from: 'centimeter', to: 'millimeters', factor: 10 },
    { pattern: /\bhours?\b.*\bminutes?|\bminutes?.*\bhours?\b/i, from: 'hour', to: 'minutes', factor: 60 },
  ].find((rule) => rule.pattern.test(questionText))

  if (conversionRules && numbers.length >= 1) {
    const value = numbers[0]
    const converted = value * conversionRules.factor
    return [
      { label: 'Step 1', text: `Use conversion rule: 1 ${conversionRules.from} = ${conversionRules.factor} ${conversionRules.to}.` },
      { label: 'Step 2', text: `Multiply: ${value} × ${conversionRules.factor} = ${converted} ${conversionRules.to}.` },
      { label: 'Conclusion', text: formatConclusion(optLetter, optValue || converted) },
    ]
  }

  // 14. Patterns & Sequences: Geometric progression deduction (e.g. 2, 6 -> ratio 3 -> 162)
  if (numbers.length >= 2 && optValue && Number.isFinite(optNum)) {
    const n1 = numbers[0]
    const n2 = numbers[1]
    if (n1 > 0 && n2 > n1 && n2 % n1 === 0) {
      const r = n2 / n1
      let curr = n2
      const chain = [n1, n2]
      while (curr < optNum && chain.length < 8) {
        curr *= r
        chain.push(curr)
      }
      if (curr === optNum) {
        return [
          { label: 'Step 1', text: `Find the pattern: multiply by ${r} each time (${n1} × ${r} = ${n2}).` },
          { label: 'Step 2', text: `Follow the pattern: ${chain.slice(1).join(' → ')}.` },
          { label: 'Conclusion', text: conclusionText },
        ]
      }
    }
  }

  // 15. Patterns & Sequences: Arithmetic progression deduction (e.g. 7, 14, 21, 28, ___ -> 35)
  if (numbers.length >= 3 && optValue && Number.isFinite(optNum)) {
    const diff1 = numbers[1] - numbers[0]
    const diff2 = numbers[2] - numbers[1]
    if (diff1 === diff2 && diff1 !== 0) {
      const last = numbers[numbers.length - 1]
      if (last + diff1 === optNum) {
        return [
          { label: 'Step 1', text: `Find the pattern: add ${diff1} each time (${numbers[0]} + ${diff1} = ${numbers[1]}).` },
          { label: 'Step 2', text: `Add ${diff1} to the last number: ${last} + ${diff1} = ${optValue}.` },
          { label: 'Conclusion', text: conclusionText },
        ]
      }
    }
  }

  // 16. Smart Arithmetic combinations with numbers in the question
  if (numbers.length >= 2 && optValue && Number.isFinite(optNum)) {
    // Check total sum of all numbers
    const totalSum = numbers.reduce((a, b) => a + b, 0)
    if (totalSum === optNum && numbers.length > 2) {
      return [
        { label: 'Step 1', text: `Add all the given numbers together: ${numbers.join(' + ')}.` },
        { label: 'Step 2', text: `${numbers.join(' + ')} = ${optValue}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
      ]
    }

    // Check all pairs (i, j)
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        if (i === j) continue
        const n1 = numbers[i]
        const n2 = numbers[j]
        if (n1 + n2 === optNum) {
          return [
            { label: 'Step 1', text: `Add the numbers: ${n1} + ${n2}.` },
            { label: 'Step 2', text: `${n1} + ${n2} = ${optValue}.` },
            { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
          ]
        }
        if (n1 - n2 === optNum && n1 >= n2) {
          return [
            { label: 'Step 1', text: `Subtract: ${n1} - ${n2}.` },
            { label: 'Step 2', text: `${n1} - ${n2} = ${optValue}.` },
            { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
          ]
        }
        if (n1 * n2 === optNum && n1 > 1 && n2 > 1) {
          return [
            { label: 'Step 1', text: `Multiply: ${n1} × ${n2}.` },
            { label: 'Step 2', text: `${n1} × ${n2} = ${optValue}.` },
            { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
          ]
        }
        if (n2 !== 0 && n1 / n2 === optNum) {
          return [
            { label: 'Step 1', text: `Divide: ${n1} ÷ ${n2}.` },
            { label: 'Step 2', text: `${n1} ÷ ${n2} = ${optValue}.` },
            { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
          ]
        }
      }
    }
  }

  // 17. Comparison / Value ordering
  if (numbers.length >= 2 && optValue && Number.isFinite(optNum) && numbers.includes(optNum)) {
    const maxVal = Math.max(...numbers)
    const minVal = Math.min(...numbers)
    if (optNum === maxVal && /\b(largest|greatest|maximum|highest|most)\b/i.test(contextText)) {
      return [
        { label: 'Step 1', text: `Compare all the given numbers: ${[...numbers].sort((a, b) => a - b).join(', ')}.` },
        { label: 'Step 2', text: `The greatest value is ${optValue}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
      ]
    }
    if (optNum === minVal && /\b(smallest|least|minimum|lowest|fewest)\b/i.test(contextText)) {
      return [
        { label: 'Step 1', text: `Compare all the given numbers: ${[...numbers].sort((a, b) => a - b).join(', ')}.` },
        { label: 'Step 2', text: `The smallest value is ${optValue}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue) },
      ]
    }
  }

  // 18. Geometry & Shapes
  if (
    /\b(rectangle|triangle|circle|pentagon|square|hexagon|rhombus|shape|sides?|corners?|angles?|quadrilateral)\b/i.test(contextText) ||
    /\b(rectangle|triangle|circle|pentagon|square)\b/i.test(optValue)
  ) {
    if (/\bopposite sides equal\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: 'A rectangle has 4 sides with opposite sides equal in length.' },
        { label: 'Step 2', text: 'Compare shapes: Triangles have 3 sides, circles are curved, and a rectangle has opposite sides equal.' },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
    if (/\bfour equal sides|4 equal sides|square\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: 'A square has 4 equal sides and 4 right angles.' },
        { label: 'Step 2', text: 'Compare shapes: A square is the matching 4-sided shape.' },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
    if (/\bhow many sides\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: 'Count the straight sides of the shape.' },
        { label: 'Step 2', text: `The shape has ${optValue ? `${optValue} sides` : 'the matching number of sides'}.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
    if (/\bhow many (corners|angles)\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: 'Count the corners (vertices) where two sides meet.' },
        { label: 'Step 2', text: `The shape has ${optValue || 'the matching number of'} corners.` },
        { label: 'Conclusion', text: conclusionText },
      ]
    }
    return [
      { label: 'Step 1', text: `Check the geometric definition for ${optValue || 'the shape'}.` },
      { label: 'Step 2', text: 'Compare the properties to identify the correct figure.' },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 19. Fractions
  if (/\bfraction|shaded|equal parts\b/i.test(contextText)) {
    return [
      { label: 'Step 1', text: 'In a fraction, the numerator counts the selected parts and the denominator counts total equal parts.' },
      { label: 'Step 2', text: `Count the parts: ${optValue}.` },
      { label: 'Conclusion', text: conclusionText },
    ]
  }

  // 20. Word problems with operation keywords
  if (numbers.length >= 2) {
    const [n1, n2] = numbers
    if (/\b(total|altogether|in all|sum|combined|join)\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: `Add the amounts: ${n1} + ${n2}.` },
        { label: 'Step 2', text: `${n1} + ${n2} = ${optValue || n1 + n2}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || n1 + n2) },
      ]
    }
    if (/\b(left|remaining|difference|take away|fewer|less|how many more)\b/i.test(qLower)) {
      const diff = Math.abs(n1 - n2)
      return [
        { label: 'Step 1', text: `Subtract to find the difference: ${n1 > n2 ? `${n1} - ${n2}` : `${n2} - ${n1}`}.` },
        { label: 'Step 2', text: `${n1 > n2 ? `${n1} - ${n2}` : `${n2} - ${n1}`} = ${optValue || diff}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || diff) },
      ]
    }
    if (/\b(each|times|product|groups of)\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: `Multiply the number of groups by size of each group: ${n1} × ${n2}.` },
        { label: 'Step 2', text: `${n1} × ${n2} = ${optValue || n1 * n2}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || n1 * n2) },
      ]
    }
    if (/\b(shared|divided|split|equally|per)\b/i.test(qLower)) {
      return [
        { label: 'Step 1', text: `Divide into equal parts: ${n1} ÷ ${n2}.` },
        { label: 'Step 2', text: `${n1} ÷ ${n2} = ${optValue || n1 / n2}.` },
        { label: 'Conclusion', text: formatConclusion(optLetter, optValue || n1 / n2) },
      ]
    }
  }

  // 21. Safe, accurate fallback (NEVER pairs unrelated numbers!)
  let stepOne = ''
  let stepTwo = ''
  if (numbers.length > 0) {
    stepOne = `Look at the given numbers in the problem: ${numbers.slice(0, 4).join(', ')}.`
    stepTwo = optValue
      ? `Solve using the mathematical rule to get ${optValue}.`
      : 'Calculate using the mathematical rule to find the answer.'
  } else {
    stepOne = 'Read the question carefully to identify the core mathematical rule.'
    stepTwo = optValue
      ? `Applying the rule gives ${optValue}.`
      : 'Applying the rule gives the correct result.'
  }

  return [
    { label: 'Step 1', text: stepOne },
    { label: 'Step 2', text: stepTwo },
    { label: 'Conclusion', text: conclusionText },
  ]
}

export function parseExplanationSteps(explanation, correctOption = '', meta = {}) {
  const cleaned = formatKidFriendlyExplanation(explanation, correctOption, meta)
  if (!cleaned || /^(?:Therefore,\s*option\s+[A-D]\s+is\s+correct\.?|Option\s+[A-D]\s+is\s+correct\.?|Review the worked solution for this topic|Review the solution method for this topic|Read the question carefully|Identify the given values and formula|Use the operation shown in the problem)\b/i.test(cleaned.trim())) {
    return buildFallbackExplanationSteps(meta.question, correctOption, meta)
  }

  const explicitSteps = []
  const stepRegex = /(?:(?:Step|Marhala)\s*(\d+)|Conclusion|Nateeja):\s*([^]+?)(?=(?:(?:Step|Marhala)\s*\d+|Conclusion|Nateeja):|$)/gi
  let match
  while ((match = stepRegex.exec(explanation || '')) !== null) {
    const isConclusion = !match[1]
    explicitSteps.push({
      label: isConclusion ? 'Conclusion' : `Step ${match[1]}`,
      text: formatKidFriendlyExplanation(match[2], isConclusion ? correctOption : '', meta)
        .replace(/Therefore,\s*option\s+[A-D]\s+is\s+correct\.?$/i, '')
        .trim(),
    })
  }

  if (explicitSteps.length >= 2) {
    const optLetter = String(correctOption || '').trim().toUpperCase()
    const optVal = optLetter && meta.options?.[optLetter] ? ` (${String(meta.options[optLetter]).trim()})` : ''
    const last = explicitSteps[explicitSteps.length - 1]
    if (optLetter && last.label === 'Conclusion') {
      let cText = last.text
        .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+matches\s+the\s+answer\.?/gi, 'Option $1 ($2) is correct.')
        .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+satisfies\s+the\s+equation\.?/gi, 'Option $1 ($2) is correct.')
        .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+is\s+the\s+accurate\s+answer\.?/gi, 'Option $1 ($2) is correct.')
        .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\.?/gi, 'Option $1 is correct.')
        .trim()
      if (!cText.includes(optLetter)) {
        cText = `Option ${optLetter}${optVal} is correct.`
      }
      last.text = cText
    }
    return explicitSteps
  }

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)

  if (sentences.length <= 1) {
    return buildFallbackExplanationSteps(meta.question, correctOption, meta)
  }

  const result = []
  const conclusionIdx = sentences.findIndex(s => /therefore|correct option|accurate|option [A-D] is correct/i.test(s))

  if (conclusionIdx !== -1 && conclusionIdx > 0) {
    const preConclusion = sentences.slice(0, conclusionIdx)
    const conclusionText = sentences.slice(conclusionIdx).join(' ')

    preConclusion.forEach((sent, idx) => {
      result.push({ label: `Step ${idx + 1}`, text: sent })
    })
    const optLetter = String(correctOption || '').trim().toUpperCase()
    const optVal = optLetter && meta.options?.[optLetter] ? ` (${String(meta.options[optLetter]).trim()})` : ''
    let cleanConclusion = conclusionText
      .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+matches\s+the\s+answer\.?/gi, 'Option $1 ($2) is correct.')
      .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+satisfies\s+the\s+equation\.?/gi, 'Option $1 ($2) is correct.')
      .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\s+because\s+(.+?)\s+is\s+the\s+accurate\s+answer\.?/gi, 'Option $1 ($2) is correct.')
      .replace(/Therefore,\s*option\s+([A-D])\s+is\s+correct\.?/gi, 'Option $1 is correct.')
      .trim()
    if (optLetter && !cleanConclusion.includes(optLetter)) {
      cleanConclusion = `Option ${optLetter}${optVal} is correct.`
    }
    result.push({ label: 'Conclusion', text: cleanConclusion })
  } else {
    sentences.forEach((sent, idx) => {
      const isLast = idx === sentences.length - 1
      result.push({
        label: isLast ? 'Conclusion' : `Step ${idx + 1}`,
        text: sent,
      })
    })
  }

  return result
}
