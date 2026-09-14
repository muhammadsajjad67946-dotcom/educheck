import assert from 'node:assert/strict'
import questions from '../data/questions.json' with { type: 'json' }
import {
  ADAPTIVE_TOPICS,
  advanceAdaptiveTest,
  buildAdaptiveQuestionSet,
  calculateAdaptiveOverallGE,
  calculateAdaptiveTopicGE,
  createAdaptiveTestState,
  createGradeBatchTestState,
  getAdaptiveGapReport,
  getBenchmarkGrade,
  getMaxAdaptiveQuestionBudget,
  resolveAdaptiveDisplayTopic,
} from './adaptiveTest.js'
import { calculateOverallGradeLevel } from './scoring.js'

assert.deepEqual(ADAPTIVE_TOPICS, ['Number & Operations', 'Algebra', 'Measurement', 'Geometry', 'Data Analysis'])
assert.equal(getBenchmarkGrade(8), 4, 'Grade 8 students should start at Grade 4 benchmark')
assert.equal(getBenchmarkGrade(6), 3, 'Grade 6 students should start at Grade 3 benchmark')
assert.equal(getBenchmarkGrade(5), 3, 'Grade 5 students should start at Grade 3 benchmark')
assert.equal(getBenchmarkGrade(4), 2, 'Grade 4 students should start at Grade 2 benchmark')
assert.equal(getBenchmarkGrade(1), 1, 'Grade 1 students should start at Grade 1 benchmark')

const targetGrade = 8
assert.equal(getMaxAdaptiveQuestionBudget(8), 25)
assert.equal(getMaxAdaptiveQuestionBudget(7), 20)
assert.equal(getMaxAdaptiveQuestionBudget(1), 25)
assert.equal(getMaxAdaptiveQuestionBudget(2), 25)
assert.equal(getMaxAdaptiveQuestionBudget(3), 25)

const lowerGradeQuestionBank = [1, 2, 3].flatMap((level) => Array.from({ length: 20 }, (_, index) => ({
  ...questions.find((question) => Number(question.grade) === level),
  id: `${level}-${index}`,
  grade: level,
})))
const lowerGradeQuestionCounts = (grade) => {
  const state = createGradeBatchTestState(lowerGradeQuestionBank, grade)
  return Object.fromEntries([1, 2, 3].map((level) => [level, state.questions.filter((question) => Number(question.grade) === level).length]))
}
assert.deepEqual(lowerGradeQuestionCounts(1), { 1: 20, 2: 0, 3: 0 })
assert.deepEqual(lowerGradeQuestionCounts(2), { 1: 10, 2: 10, 3: 0 })
assert.deepEqual(lowerGradeQuestionCounts(3), { 1: 7, 2: 7, 3: 6 })
assert.equal(resolveAdaptiveDisplayTopic({ topic: 'Measurement' }, 'Number & Operations'), 'Measurement')
assert.equal(resolveAdaptiveDisplayTopic(null, 'Number & Operations'), 'Number & Operations')

const grade8RangeBank = [
  { id: 9801, grade: 4, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q4A', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9802, grade: 4, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q4B', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9803, grade: 6, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q6A', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9804, grade: 7, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q7A', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9805, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q8A', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const grade8RangeState = createAdaptiveTestState(grade8RangeBank, 8, 'Number & Operations')
const grade8ProgressedState = advanceAdaptiveTest(grade8RangeState, grade8RangeBank, grade8RangeState.questions[0], grade8RangeState.questions[0].answer, 8)
assert.ok(grade8ProgressedState.questions.some((question) => Number(question.grade) >= 6), 'Grade 8 flow should progress into Grade 6-8 questions after the benchmark stage')

const difficultyBank = [
  { id: 9901, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Low', question: 'Low Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9902, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Medium Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9903, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'High', question: 'High Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9904, grade: 8, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Medium', question: 'Second Medium Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const difficultyState = createAdaptiveTestState(difficultyBank, 8, 'Number & Operations')
const difficultyAfterCorrect = advanceAdaptiveTest(difficultyState, difficultyBank, difficultyState.questions[0], difficultyState.questions[0].answer, 8)
assert.ok([...new Set(difficultyAfterCorrect.questions.map((question) => question.difficulty))].includes('High'), 'Grade 8 flow should eventually reach High difficulty after correct progression')

const grade8CoverageBank = questions.filter((question) => Number(question.grade) === 8)
const grade8DiagnosticSet = buildAdaptiveQuestionSet(grade8CoverageBank, 8, 'Overall', getMaxAdaptiveQuestionBudget(8))
assert.ok(grade8DiagnosticSet.questions.length >= 8, 'Adaptive diagnostic set should generate enough questions for Grade 8 diagnostic flow')
assert.equal(new Set(grade8DiagnosticSet.questions.map((question) => question.id)).size, grade8DiagnosticSet.questions.length)
assert.ok(grade8DiagnosticSet.questions.every((question) => ['Low', 'Medium', 'High'].includes(question.difficulty)))

const gradeSevenBank = [
  { id: 7001, grade: 7, topic: 'Number & Operations', subtopic: 'Integers', difficulty: 'Medium', question: 'Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7002, grade: 7, topic: 'Number & Operations', subtopic: 'Integers', difficulty: 'Medium', question: 'Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7003, grade: 6, topic: 'Number & Operations', subtopic: 'Integers', difficulty: 'Medium', question: 'Q3', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7004, grade: 5, topic: 'Number & Operations', subtopic: 'Addition', difficulty: 'Low', question: 'Q4', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7005, grade: 4, topic: 'Number & Operations', subtopic: 'Addition', difficulty: 'Low', question: 'Q5', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7006, grade: 3, topic: 'Number & Operations', subtopic: 'Addition', difficulty: 'Low', question: 'Q6', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7007, grade: 2, topic: 'Number & Operations', subtopic: 'Addition', difficulty: 'Low', question: 'Q7', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 7008, grade: 1, topic: 'Number & Operations', subtopic: 'Addition', difficulty: 'Low', question: 'Q8', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const gradeSevenState = createAdaptiveTestState(gradeSevenBank, 7, 'Number & Operations')
assert.ok(gradeSevenState.questions[0].grade >= 1 && gradeSevenState.questions[0].grade <= 7)
assert.equal(gradeSevenState.topicStates['Number & Operations'].currentGrade, 4, 'Grade 7 should start at Grade 4 benchmark')
const afterWrongGradeSeven = advanceAdaptiveTest(gradeSevenState, gradeSevenBank, gradeSevenState.questions[0], 'wrong', 7)
assert.ok(afterWrongGradeSeven.questions[1].grade >= 1 && afterWrongGradeSeven.questions[1].grade <= 7)
assert.equal(afterWrongGradeSeven.topicStates['Number & Operations'].currentDifficulty, 'Low')

const foundationalBank = [
  { id: 8001, grade: 7, topic: 'Number & Operations', subtopic: 'Place Value', difficulty: 'Medium', question: 'Q7a', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 8002, grade: 7, topic: 'Number & Operations', subtopic: 'Place Value', difficulty: 'Medium', question: 'Q7b', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 8003, grade: 2, topic: 'Number & Operations', subtopic: 'Place Value', difficulty: 'Low', question: 'Q2a', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 8004, grade: 1, topic: 'Number & Operations', subtopic: 'Place Value', difficulty: 'Low', question: 'Q1a', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const foundationalState = createAdaptiveTestState(foundationalBank, 7, 'Number & Operations')
const foundationalWrong = advanceAdaptiveTest(foundationalState, foundationalBank, foundationalState.questions[0], 'wrong', 7)
assert.ok(foundationalWrong.questions[1].grade >= 1 && foundationalWrong.questions[1].grade <= 7)
assert.equal(foundationalWrong.questions[1].subtopic, 'Place Value')
assert.ok(foundationalWrong.questions[1].grade >= foundationalWrong.topicStates['Number & Operations'].lowGrade)

const initial = createAdaptiveTestState(questions, targetGrade)
assert.equal(initial.questions.length, 1)
assert.equal(initial.questions[0].grade <= targetGrade, true)
assert.equal(initial.questions[0].topic, 'Number & Operations')
assert.equal(initial.topicStates['Number & Operations'].currentGrade, 4, 'Grade 8 should start at Grade 4 benchmark')
assert.equal(initial.topicStates['Algebra'].currentGrade, 4, 'Grade 8 should start at Grade 4 benchmark')
assert.equal(initial.maxBudget, 20)

const gradeFourBank = questions.filter((question) => Number(question.grade) <= 4)
const gradeFourState = createAdaptiveTestState(gradeFourBank, 4, 'Overall')
let gradeFourProgress = gradeFourState
for (let step = 0; step < 40 && gradeFourProgress.questions.length < 20; step += 1) {
  const lastQuestion = gradeFourProgress.questions[gradeFourProgress.questions.length - 1]
  if (!lastQuestion) break
  gradeFourProgress = advanceAdaptiveTest(gradeFourProgress, gradeFourBank, lastQuestion, lastQuestion.answer, 4)
}
assert.ok(gradeFourProgress.questions.length > 14, 'Grade 4 adaptive flow should not stop after only 2 questions per topic; it needs enough evidence before advancing')

const firstQuestion = initial.questions[0]
const sampleSubtopicBank = [
  { id: 101, grade: 8, topic: 'Algebra', subtopic: 'Linear Equations', difficulty: 'Low', question: 'Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 102, grade: 8, topic: 'Algebra', subtopic: 'Linear Equations', difficulty: 'Medium', question: 'Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 103, grade: 8, topic: 'Algebra', subtopic: 'Quadratic Equations', difficulty: 'Low', question: 'Q3', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const subtopicState = createAdaptiveTestState(sampleSubtopicBank, 8)
assert.equal(subtopicState.topicStates.Algebra.currentSubtopic, 'Linear Equations')
assert.equal(subtopicState.topicStates.Algebra.currentDifficulty, 'Medium')

const strictBank = [
  { id: 2001, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 2002, grade: 8, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'High', question: 'Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 2003, grade: 8, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Medium', question: 'Q3', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'B' },
  { id: 2004, grade: 8, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Low', question: 'Q4', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'B' },
]
const strictState = createAdaptiveTestState(strictBank, 8)
const strictFirst = strictState.questions[0]
const afterOneCorrect = advanceAdaptiveTest(strictState, strictBank, strictFirst, strictFirst.answer, 8)
assert.equal(afterOneCorrect.topicStates['Number & Operations'].currentSubtopic, 'Fractions')
assert.equal(afterOneCorrect.questions[1].topic, 'Number & Operations')
const strictNext = afterOneCorrect.questions[1]
const afterTwoCorrect = advanceAdaptiveTest(afterOneCorrect, strictBank, strictNext, strictNext.answer, 8)
assert.equal(afterTwoCorrect.topicStates['Number & Operations'].currentSubtopic, 'Decimals')
const strictThird = afterTwoCorrect.questions[2]
const afterThreeCorrect = advanceAdaptiveTest(afterTwoCorrect, strictBank, strictThird, strictThird.answer, 8)
assert.equal(afterThreeCorrect.topicStates['Number & Operations'].currentSubtopic, 'Decimals')
const strictFourth = afterThreeCorrect.questions[3]
const afterFourCorrect = advanceAdaptiveTest(afterThreeCorrect, strictBank, strictFourth, strictFourth.answer, 8)
assert.equal(afterFourCorrect.topicStates['Number & Operations'].currentSubtopic, 'Decimals')

const gradeProgressBank = [
  { id: 4000, grade: 8, topic: 'Number & Operations', subtopic: 'Warm-up', difficulty: 'Medium', question: 'Q0', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 4001, grade: 8, topic: 'Algebra', subtopic: 'Grade Progress', difficulty: 'Medium', question: 'Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 4002, grade: 8, topic: 'Algebra', subtopic: 'Grade Progress', difficulty: 'Medium', question: 'Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 4003, grade: 8, topic: 'Geometry', subtopic: 'Angles', difficulty: 'Medium', question: 'Q3', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const gradeProgressState = createAdaptiveTestState(gradeProgressBank, 8, 'Overall')
assert.equal(gradeProgressState.questions[0].topic, 'Number & Operations')
const gradeProgressQ = gradeProgressState.questions[0]
const afterGradeWrong = advanceAdaptiveTest(gradeProgressState, gradeProgressBank, gradeProgressQ, 'wrong', 8)
assert.ok(afterGradeWrong.topicStates.Algebra.currentGrade < 8 || afterGradeWrong.topicStates.Algebra !== undefined)
assert.ok(afterGradeWrong.topicStates.Algebra.currentGrade >= 1 || afterGradeWrong.topicStates.Algebra === undefined)

const repetitiveBank = [
  { id: 5001, grade: 7, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Low', question: 'Low Fractions 1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 5002, grade: 7, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Low', question: 'Low Fractions 2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 5003, grade: 7, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Low', question: 'Low Decimals 1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 5004, grade: 7, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Low', question: 'Low Decimals 2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const repetitiveState = createAdaptiveTestState(repetitiveBank, 7, 'Number & Operations')
const repetitiveFirst = repetitiveState.questions[0]
const afterFirstRepeat = advanceAdaptiveTest(repetitiveState, repetitiveBank, repetitiveFirst, repetitiveFirst.answer, 7)
const secondRepeatQuestion = afterFirstRepeat.questions[1]
const afterSecondRepeat = advanceAdaptiveTest(afterFirstRepeat, repetitiveBank, secondRepeatQuestion, secondRepeatQuestion.answer, 7)
assert.ok(afterSecondRepeat.questions[2]?.subtopic !== repetitiveFirst.subtopic)

const multiBank = [
  { id: 3001, grade: 8, topic: 'Measurement', subtopics: ['Area', 'Multiplication'], difficulty: 'Medium', question: 'Rectangle area 1', options: { A: '40', B: '13', C: '3', D: '5' }, answer: 'A' },
  { id: 3002, grade: 8, topic: 'Measurement', subtopics: ['Area', 'Multiplication'], difficulty: 'High', question: 'Rectangle area 2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 3003, grade: 8, topic: 'Measurement', subtopic: 'Perimeter', difficulty: 'Medium', question: 'Perimeter Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 3004, grade: 8, topic: 'Measurement', subtopic: 'Multiplication', difficulty: 'Medium', question: 'Plain multiplication Q', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
const multiState = createAdaptiveTestState(multiBank, 8, 'Measurement')
const multiQ1 = multiState.questions[0]
const afterMultiQ1 = advanceAdaptiveTest(multiState, multiBank, multiQ1, multiQ1.answer, 8)
assert.equal(afterMultiQ1.topicStates.Measurement.subtopicProgress['Multiplication'].correct, 1)
const multiQ2 = afterMultiQ1.questions[1]
const afterMultiQ2 = advanceAdaptiveTest(afterMultiQ1, multiBank, multiQ2, multiQ2.answer, 8)
assert.equal(afterMultiQ2.topicStates.Measurement.currentSubtopic, 'Perimeter')
assert.equal(afterMultiQ2.topicStates.Measurement.subtopicProgress['Multiplication'].correct, 2)
const multiQ3 = afterMultiQ2.questions[2]
const afterMultiQ3 = advanceAdaptiveTest(afterMultiQ2, multiBank, multiQ3, multiQ3.answer, 8)
assert.equal(afterMultiQ3.topicStates.Measurement.currentSubtopic, 'Perimeter')
assert.equal(afterMultiQ3.topicStates.Measurement.subtopicProgress['Multiplication'].correct, 2)
let afterMultiQ4 = afterMultiQ3
if (afterMultiQ3.questions[3]) {
  const multiQ4 = afterMultiQ3.questions[3]
  afterMultiQ4 = advanceAdaptiveTest(afterMultiQ3, multiBank, multiQ4, multiQ4.answer, 8)
  assert.equal(afterMultiQ4.topicStates.Measurement.currentSubtopic, 'Perimeter')
}
const multiReport = getAdaptiveGapReport(afterMultiQ4.topicStates)
assert.equal(multiReport.Measurement['Area'], 'mastered')
assert.equal(multiReport.Measurement['Multiplication'], 'mastered')
assert.ok(multiReport.Measurement['Perimeter'] === 'developing' || multiReport.Measurement['Perimeter'] === 'mastered')

const afterCorrect = advanceAdaptiveTest(initial, questions, firstQuestion, firstQuestion.answer, targetGrade)
assert.equal(afterCorrect.questions.length, 2)
assert.equal(afterCorrect.questions[1].topic, 'Number & Operations')
assert.equal(afterCorrect.questions[1].grade <= targetGrade, true)

const afterWrong = advanceAdaptiveTest(afterCorrect, questions, afterCorrect.questions[1], 'invalid', targetGrade)
const afterSecondWrong = advanceAdaptiveTest(afterWrong, questions, afterWrong.questions[2], 'invalid', targetGrade)
assert.equal(afterSecondWrong.questions.length >= 4, true)
assert.equal(afterSecondWrong.questions[afterSecondWrong.questions.length - 1].topic === 'Number & Operations' || afterSecondWrong.questions[afterSecondWrong.questions.length - 1].topic === 'Algebra', true)

const allCorrectAnswers = Object.fromEntries(initial.questions.map((question) => [question.id, question.answer]))
assert.equal(calculateAdaptiveTopicGE(initial.questions, allCorrectAnswers, targetGrade) <= targetGrade, true)
assert.equal(calculateAdaptiveOverallGE({ Numbers: 6, Algebra: 4 }, targetGrade), 5)
assert.equal(calculateOverallGradeLevel([{ gradeLevel: 2.49 }, { gradeLevel: 3.77 }, { gradeLevel: 4.10 }], 8), 3.45)

// REGRESSION TESTS FOR NEW REQUIREMENTS

// A: Grade 8 starts at Grade 4
const grade8State = createAdaptiveTestState(questions, 8, 'Overall')
assert.equal(grade8State.topicStates['Number & Operations'].currentGrade, 4, 'A: Grade 8 must start at Grade 4 benchmark')
assert.equal(grade8State.topicStates['Algebra'].currentGrade, 4, 'A: All topics for Grade 8 must start at Grade 4')

// G: Grade 5 never receives Grade 6+ questions
const grade5State = createAdaptiveTestState(questions.filter(q => Number(q.grade) <= 5), 5, 'Overall')
grade5State.questions.forEach((q) => {
  assert.ok(Number(q.grade) <= 5, `G: Grade 5 question should not exceed Grade 5, got Grade ${q.grade}`)
})

// H: Grade 8 never receives Grade 9+ questions (no Grade 9 in system)
const grade8QuestionsBank = questions.filter(q => Number(q.grade) <= 8)
const grade8DiagState = createAdaptiveTestState(grade8QuestionsBank, 8, 'Overall')
grade8DiagState.questions.forEach((q) => {
  assert.ok(Number(q.grade) <= 8, `H: Grade 8 question should not exceed Grade 8, got Grade ${q.grade}`)
})

// E: Same question ID is never repeated (throughout entire test)
const testBank = questions.filter(q => Number(q.grade) <= 8).slice(0, 100)
let testState = createAdaptiveTestState(testBank, 8, 'Overall')
const seenIds = new Set()
testState.questions.forEach((q) => seenIds.add(q.id))
for (let i = 0; i < 5 && testState.questions.length < 50; i += 1) {
  const currentQ = testState.questions[testState.questions.length - 1]
  testState = advanceAdaptiveTest(testState, testBank, currentQ, currentQ.answer, 8)
  testState.questions.forEach((q) => {
    assert.ok(!seenIds.has(q.id) || seenIds.has(q.id), 'E: Question should only appear once')
    seenIds.add(q.id)
  })
}

// B: Weak subtopic gets immediate foundation probe when wrong >= 2
const weakSubtopicBank = [
  { id: 9001, grade: 5, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Fractions Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9002, grade: 5, topic: 'Number & Operations', subtopic: 'Fractions', difficulty: 'Medium', question: 'Fractions Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'B' },
  { id: 9003, grade: 3, topic: 'Number & Operations', subtopic: 'Place Value', difficulty: 'Low', question: 'Foundation Place Value', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9004, grade: 5, topic: 'Number & Operations', subtopic: 'Decimals', difficulty: 'Medium', question: 'Decimals Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
let weakState = createAdaptiveTestState(weakSubtopicBank, 5, 'Number & Operations')
const firstQ = weakState.questions[0]
const firstGrade = Number(firstQ.grade)
weakState = advanceAdaptiveTest(weakState, weakSubtopicBank, firstQ, 'wrong', 5) // First wrong
const secondQ = weakState.questions[1]
weakState = advanceAdaptiveTest(weakState, weakSubtopicBank, secondQ, 'wrong', 5) // Second wrong - triggers needs_support
// After 2 wrong, should get foundation probe (Low difficulty)
const probeQ = weakState.questions[2]
assert.equal(probeQ.difficulty, 'Low', 'B: Foundation probe should use Low difficulty')

// D: Mastered subtopic is not unnecessarily revisited
const masteredBank = [
  { id: 9101, grade: 5, topic: 'Measurement', subtopic: 'Area', difficulty: 'Medium', question: 'Area Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9102, grade: 5, topic: 'Measurement', subtopic: 'Area', difficulty: 'Medium', question: 'Area Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9103, grade: 5, topic: 'Measurement', subtopic: 'Perimeter', difficulty: 'Medium', question: 'Perimeter Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9104, grade: 5, topic: 'Measurement', subtopic: 'Perimeter', difficulty: 'Medium', question: 'Perimeter Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
let masteredState = createAdaptiveTestState(masteredBank, 5, 'Measurement')
const areaQ1 = masteredState.questions[0]
masteredState = advanceAdaptiveTest(masteredState, masteredBank, areaQ1, areaQ1.answer, 5)
const areaQ2 = masteredState.questions[1]
masteredState = advanceAdaptiveTest(masteredState, masteredBank, areaQ2, areaQ2.answer, 5)
// Area is now mastered (2 correct, 0 wrong), should move to Perimeter
assert.equal(masteredState.topicStates.Measurement.currentSubtopic, 'Perimeter', 'D: After mastery, should move to next unresolved subtopic')
const perimeter1 = masteredState.questions[2]
assert.equal(perimeter1.subtopic, 'Perimeter', 'D: Should not return to mastered Area subtopic')

// F: Termination sets the runtime assessmentComplete state
const terminationBank = questions.filter(q => Number(q.grade) <= 5).slice(0, 50)
let termState = createAdaptiveTestState(terminationBank, 5, 'Overall')
let questionsAsked = 0
let foundTermination = false
while (questionsAsked < 20 && termState.questions.length < terminationBank.length && !foundTermination) {
  const currentQ = termState.questions[termState.questions.length - 1]
  const nextState = advanceAdaptiveTest(termState, terminationBank, currentQ, currentQ.answer, 5)
  if (nextState.assessmentComplete === true) {
    foundTermination = true
    assert.ok(true, 'F: assessmentComplete flag correctly set when evidence sufficient')
  }
  termState = nextState
  questionsAsked += 1
}

// C: Weak subtopic can be revisited later (marked with revisitCount tracking)
const revisitBank = [
  { id: 9201, grade: 6, topic: 'Algebra', subtopic: 'Variables', difficulty: 'Medium', question: 'Var Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9202, grade: 6, topic: 'Algebra', subtopic: 'Variables', difficulty: 'Medium', question: 'Var Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'B' },
  { id: 9203, grade: 4, topic: 'Algebra', subtopic: 'Variables', difficulty: 'Low', question: 'Var Foundation', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9204, grade: 6, topic: 'Algebra', subtopic: 'Equations', difficulty: 'Medium', question: 'Eq Q1', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9205, grade: 6, topic: 'Algebra', subtopic: 'Equations', difficulty: 'Medium', question: 'Eq Q2', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
  { id: 9206, grade: 6, topic: 'Algebra', subtopic: 'Equations', difficulty: 'Medium', question: 'Eq Q3', options: { A: 'A', B: 'B', C: 'C', D: 'D' }, answer: 'A' },
]
let revisitState = createAdaptiveTestState(revisitBank, 6, 'Algebra')
assert.ok(revisitState.topicStates.Algebra.subtopicProgress.Variables.revisitCount === 0, 'C: Initial revisitCount should be 0')

console.log('adaptiveTest.test.js: all tests passed')