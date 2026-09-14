import assert from 'node:assert/strict'
import { parseExplanationSteps, generateWrongAnswerReason } from './formatExplanation.js'

// Test 1: Arithmetic word problem fallback
const fallback = parseExplanationSteps('', 'B', {
  question: 'Ahmed has 8 toy cars. His brother gives him 5 more. How many toy cars does Ahmed have altogether?',
  options: { A: '10', B: '13', C: '12', D: '11' },
})

assert.ok(Array.isArray(fallback), 'parseExplanationSteps should return an array')
assert.ok(fallback.length >= 2, 'fallback should include at least two steps')
assert.equal(fallback[0].label, 'Step 1', 'first step should be Step 1')
assert.ok(/8.*5|5.*8|add/i.test(fallback[0].text), 'first step should explain the operation in simple words')
assert.equal(fallback[fallback.length - 1].label, 'Conclusion', 'final step should be Conclusion')
assert.ok(/option B is correct/i.test(fallback[fallback.length - 1].text), 'conclusion should mention the correct option')

// Test 2: Geometry shape question fallback (user's exact scenario)
const shapeFallback = parseExplanationSteps('', 'A', {
  question: 'Which shape has opposite sides equal in length?',
  options: { A: 'Rectangle', B: 'Circle', C: 'Triangle', D: 'Pentagon' },
})

assert.ok(Array.isArray(shapeFallback), 'shapeFallback should be an array')
assert.equal(shapeFallback[0].label, 'Step 1')
assert.ok(/rectangle|opposite sides|4-sided/i.test(shapeFallback[0].text), 'Step 1 should mention rectangle properties, not add/subtract')
assert.ok(/triangles?|circle|pentagon|compare/i.test(shapeFallback[1].text), 'Step 2 should compare the shapes')
assert.ok(/option A is correct/i.test(shapeFallback[2].text), 'Conclusion should mention Option A')

// Test 3: generateWrongAnswerReason for Triangle vs Rectangle
const wrongShapeReason = generateWrongAnswerReason({
  question: 'Which shape has opposite sides equal in length?',
  selectedAnswer: 'C',
  correctAnswer: 'A',
  options: { A: 'Rectangle', B: 'Circle', C: 'Triangle', D: 'Pentagon' },
})

assert.ok(/Option C/i.test(wrongShapeReason), 'Reason should state Option C was selected')
assert.ok(/triangle/i.test(wrongShapeReason), 'Reason should mention triangle')
assert.ok(/3 sides|3 angles/i.test(wrongShapeReason), 'Reason should explain triangle properties')
assert.ok(/rectangle/i.test(wrongShapeReason), 'Reason should contrast with rectangle')

// Test 4: generateWrongAnswerReason for Unanswered question
const unansweredReason = generateWrongAnswerReason({
  question: 'What is 5 + 5?',
  selectedAnswer: null,
  correctAnswer: 'B',
  options: { A: '9', B: '10', C: '11', D: '12' },
})
assert.ok(/unanswered/i.test(unansweredReason), 'Should note question was left unanswered')

// Test 5: Mathematical solution for algebraic equation 5x - 7 = 18 (user's exact scenario)
const algebraSteps = parseExplanationSteps('', 'C', {
  question: 'Solve for x: 5x - 7 = 18',
  options: { A: '2', B: '3', C: '5', D: '7' },
})
assert.ok(Array.isArray(algebraSteps), 'algebraSteps should be an array')
assert.ok(algebraSteps.length >= 2, 'should have at least 2 steps')
assert.ok(/Add 7|18 \+ 7|25/i.test(algebraSteps[0].text), 'Step 1 should show mathematical addition 18 + 7 = 25')
assert.ok(/25 ÷ 5|5/i.test(algebraSteps[1].text), 'Step 2 should show mathematical division by 5')
assert.ok(/option C is correct/i.test(algebraSteps[algebraSteps.length - 1].text), 'Conclusion should state option C is correct')

// Test 7: Sanitizing robotic image text to kid-friendly format
const roboticText = 'Step 1: Set up the mathematical operation using the problem values: 2 and 6.\nStep 2: Perform the calculation: the accurate mathematical result is 162.\nConclusion: Therefore, option B is correct because 162 matches the answer.'
const sanitized = parseExplanationSteps(roboticText, 'B', { options: { A: '100', B: '162' } })
assert.equal(sanitized[0].text, 'Look at the numbers: 2 and 6.')
assert.equal(sanitized[1].text, 'Calculate: 162.')
assert.ok(/Option B is correct: 162/i.test(sanitized[2].text))

// Test 8: Fallback geometric progression deduction
const sequenceFallback = parseExplanationSteps('', 'B', {
  question: 'In a sequence starting with 2 and 6, what is the 5th term?',
  options: { A: '100', B: '162' },
})
assert.ok(/multiply by 3/i.test(sequenceFallback[0].text))
assert.ok(/162/i.test(sequenceFallback[1].text))
assert.ok(/Option B is correct: 162/i.test(sequenceFallback[2].text))

// Test 9: Outlier question (User's exact scenario from image: "how 30 was obtained")
const outlierSteps = parseExplanationSteps('', 'D', {
  question: 'Which value is an outlier in this small data set: 10, 11, 10, 12, 30?',
  options: { A: '10', B: '11', C: '12', D: '30' },
  subtopic: 'Outliers',
})
assert.equal(outlierSteps[0].label, 'Step 1')
assert.ok(/outlier.*much higher.*lower/i.test(outlierSteps[0].text), 'Step 1 must explain outlier concept')
assert.ok(/10.*11.*12.*close together/i.test(outlierSteps[1].text), 'Step 2 must explain that 10, 11, 12 cluster together')
assert.ok(/30 is far away/i.test(outlierSteps[1].text), 'Step 2 must explain why 30 is far away')
assert.ok(/Option D is correct: 30 is the outlier/i.test(outlierSteps[2].text), 'Conclusion states 30 is outlier')

// Test 10: Wrong answer explanation for Outlier (student picked B: 11 instead of D: 30)
const outlierWrongReason = generateWrongAnswerReason({
  question: 'Which value is an outlier in this small data set: 10, 11, 10, 12, 30?',
  selectedAnswer: 'B',
  correctAnswer: 'D',
  options: { A: '10', B: '11', C: '12', D: '30' },
  subtopic: 'Outliers',
})
assert.ok(/Option B \(11\)/i.test(outlierWrongReason), 'Reason should state Option B (11) was selected')
assert.ok(/close to the other numbers/i.test(outlierWrongReason), 'Reason should explain 11 is close to other numbers')
assert.ok(/30 is the outlier because it is far away/i.test(outlierWrongReason), 'Reason should explain 30 is outlier')

// Test 11: Range question (Difference between largest and smallest)
const rangeSteps = parseExplanationSteps('', 'B', {
  question: 'A survey records 25, 30, 20, and 35 students. What is the difference between the largest and smallest values?',
  options: { A: '10', B: '15', C: '20', D: '25' },
  subtopic: 'Range',
})
assert.ok(/largest \(35\).*smallest \(20\)/i.test(rangeSteps[0].text), 'Step 1 identifies 35 and 20')
assert.ok(/35 - 20 = 15/i.test(rangeSteps[1].text), 'Step 2 calculates 35 - 20 = 15')
assert.ok(/Option B is correct: 15/i.test(rangeSteps[2].text), 'Conclusion is Option B: 15')

// Test 12: Mean question
const meanSteps = parseExplanationSteps('', 'B', {
  question: 'Find the mean of 4, 6, and 8.',
  options: { A: '5', B: '6', C: '7', D: '8' },
  subtopic: 'Mean',
})
assert.ok(/4 \+ 6 \+ 8 = 18/i.test(meanSteps[0].text), 'Step 1 adds 4 + 6 + 8 = 18')
assert.ok(/18 ÷ 3 = 6/i.test(meanSteps[1].text), 'Step 2 divides 18 by 3 = 6')
assert.ok(/Option B is correct: 6/i.test(meanSteps[2].text))

// Test 13: Slope-Intercept Form
const slopeSteps = parseExplanationSteps('', 'C', {
  question: 'What is the y-intercept in y = 2x + 7?',
  options: { A: '2', B: '5', C: '7', D: '9' },
  subtopic: 'Slope-Intercept Form',
})
assert.ok(/y-intercept/i.test(slopeSteps[0].text))
assert.ok(/7/i.test(slopeSteps[1].text))
assert.ok(/Option C is correct: 7/i.test(slopeSteps[2].text))

// Test 14: Volume of Rectangular Prism
const volumeSteps = parseExplanationSteps('', 'C', {
  question: 'A box is 5 cm long, 3 cm wide, and 2 cm high. What is its volume?',
  options: { A: '10 cm³', B: '20 cm³', C: '30 cm³', D: '40 cm³' },
  subtopic: 'Volume of Rectangular Prisms',
})
assert.ok(/5 × 3 × 2/i.test(volumeSteps[0].text), 'Step 1 shows length × width × height')
assert.ok(/30/i.test(volumeSteps[1].text), 'Step 2 calculates 30 cm³')
assert.ok(/Option C is correct: 30 cm³/i.test(volumeSteps[2].text))

// Test 15: Pythagorean Theorem
const pythagorasSteps = parseExplanationSteps('', 'A', {
  question: 'A right triangle has legs 3 cm and 4 cm. What is the hypotenuse?',
  options: { A: '5 cm', B: '6 cm', C: '7 cm', D: '8 cm' },
  subtopic: 'Pythagorean Theorem',
})
assert.ok(/3² \+ 4² = 9 \+ 16 = 25/i.test(pythagorasSteps[0].text), 'Step 1 shows 3² + 4² = 25')
assert.ok(/√25 = 5/i.test(pythagorasSteps[1].text), 'Step 2 shows √25 = 5')

console.log('All formatExplanation tests passed successfully!')


