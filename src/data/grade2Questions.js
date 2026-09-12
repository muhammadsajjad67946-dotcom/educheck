const makeOptions = (answer) => {
  const values = [answer, answer + 1, answer + 2, Math.max(0, answer - 1)]
  const options = [...new Set(values)].slice(0, 4)
  while (options.length < 4) options.push(options[options.length - 1] + 1)
  const answerIndex = options.indexOf(answer)
  return {
    options: Object.fromEntries(options.map((value, index) => [String.fromCharCode(65 + index), String(value)])),
    answer: String.fromCharCode(65 + answerIndex),
  }
}

const wordProblems = [
  [12, 5, '+', 'apples'], [18, 6, '-', 'pencils'], [14, 5, '+', 'balloons'], [20, 7, '-', 'toy cars'], [23, 10, '+', 'oranges'],
  [35, 10, '-', 'books'], [16, 4, '+', 'marbles'], [29, 9, '-', 'birds'], [15, 13, '+', 'students'], [31, 11, '-', 'stickers'],
  [27, 18, '+', 'balls'], [52, 24, '-', 'candies'], [36, 27, '+', 'books'], [68, 25, '-', 'students'], [45, 26, '+', 'beads'],
  [74, 32, '-', 'eggs'], [38, 24, '+', 'flowers'], [91, 47, '-', 'pencils'], [56, 19, '+', 'cards'], [83, 36, '-', 'crayons'],
  [28, 24, '-', 'students', 15], [35, 18, '+', 'stickers', 12], [86, 29, '-', 'apples', 17], [24, 16, '+', 'toy cars', 9], [47, 28, '-', 'balloons', 15],
  [75, 18, '+', 'books', 23], [63, 25, '-', 'marbles'], [72, 45, '-', 'candies'], [54, 29, '-', 'pencils'], [46, 17, '+', 'cards'],
  [38, 17, '-', 'passengers', 12], [36, 28, '+', 'cans', 19], [64, 18, '-', 'birds', 12], [95, 37, '-', 'pencils'], [27, 15, '+', 'toy cars'],
  [48, 35, '+', 'apples', 26], [42, 18, '-', 'students'], [90, 35, '-', 'toys', 20], [32, 19, '+', 'animals', 14], [58, 16, '-', 'pencils'],
]

const generatedWordProblems = wordProblems.map(([first, second, operator, item, third], index) => {
  const base = operator === '+' ? first + second : first - second
  const answer = third == null ? base : (index % 2 === 0 ? base - third : base + third)
  const expression = third == null ? `${first} ${operator} ${second}` : `${first} ${operator} ${second} ${index % 2 === 0 ? '-' : '+'} ${third}`
  return {
    id: 101 + index,
    grade: 2,
    topic: 'Algebra',
    subtopic: 'Addition & Subtraction Word Problems',
    difficulty: index < 10 ? 'Low' : index < 20 ? 'Medium' : 'High',
    question: `A word problem has ${expression}. How many ${item} are there?`,
    ...makeOptions(answer),
  }
})

const withinTwenty = Array.from({ length: 30 }, (_, index) => {
  const first = 6 + (index % 14)
  const second = 3 + (index % 8)
  const subtract = index % 2 === 1
  const answer = subtract ? first - second : first + second
  return {
    id: 141 + index,
    grade: 2,
    topic: 'Number & Operations',
    subtopic: 'Mental Addition & Subtraction',
    difficulty: index < 10 ? 'Low' : index < 20 ? 'Medium' : 'High',
    question: `${first} ${subtract ? '-' : '+'} ${second} = ?`,
    ...makeOptions(answer),
  }
})

const oddEven = Array.from({ length: 30 }, (_, index) => {
  const number = 3 + index
  const even = number % 2 === 0
  return {
    id: 171 + index,
    grade: 2,
    topic: 'Number & Operations',
    subtopic: 'Counting & Number Representation',
    difficulty: index < 10 ? 'Low' : index < 20 ? 'Medium' : 'High',
    question: `Is ${number} odd or even?`,
    options: { A: 'Odd', B: 'Even', C: 'Both', D: 'Neither' },
    answer: even ? 'B' : 'A',
  }
})

const arrays = Array.from({ length: 30 }, (_, index) => {
  const rows = 2 + (index % 4)
  const columns = 2 + ((index + 1) % 4)
  const answer = rows * columns
  return {
    id: 201 + index,
    grade: 2,
    topic: 'Number & Operations',
    subtopic: 'Equal Groups & Rectangular Arrays',
    difficulty: index < 8 ? 'Low' : index < 18 ? 'Medium' : 'High',
    question: `An array has ${rows} rows and ${columns} objects in each row. How many objects are there?`,
    ...makeOptions(answer),
  }
})

export const grade2Questions = [...generatedWordProblems, ...withinTwenty, ...oddEven, ...arrays]
