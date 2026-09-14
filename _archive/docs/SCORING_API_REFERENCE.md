# Scoring Functions API Reference

## Overview

All scoring and calculation functions are available from `src/utils/scoring.js`. This document provides a complete API reference for developers.

---

## Core Functions

### `calculateQuestionScore(question, selectedAnswer, correctAnswer)`

Calculates the score for a single question based on difficulty weight.

**Parameters:**
- `question` (Object): Question object with `difficulty` property
  - Must have `difficulty` property: 'Low', 'Medium', or 'High'
- `selectedAnswer` (any): Student's selected answer
- `correctAnswer` (any): Correct answer from question metadata

**Returns:**
```javascript
{
  isAnswered: boolean,
  isCorrect: boolean,
  rawScore: number,        // -3 to 3
  weight: number           // 1, 2, or 3
}
```

**Example:**
```javascript
const question = { difficulty: 'Medium', answer: 'B' };
const result = calculateQuestionScore(question, 'B', 'B');
// Returns: { isAnswered: true, isCorrect: true, rawScore: 2, weight: 2 }
```

---

### `calculateTopicScore(questions, answers)`

Calculates normalized score for a topic within a specific grade.

**Parameters:**
- `questions` (Array): Array of question objects for this topic
- `answers` (Object): Map of `{ questionId: selectedAnswer }`

**Returns:**
```javascript
{
  total: number,              // Total questions
  correct: number,
  wrong: number,
  unanswered: number,
  rawScore: number,           // Weighted sum
  maxPossible: number,        // Sum of all weights
  normalizedScore: number,    // 0.00 to 1.00
  performanceStatus: string   // 'Strong', 'Developing', 'Needs Improvement', 'Weak'
}
```

**Example:**
```javascript
const questions = [
  { id: 1, difficulty: 'Low', answer: 'A' },
  { id: 2, difficulty: 'Low', answer: 'B' },
  { id: 3, difficulty: 'Medium', answer: 'C' }
];
const answers = { 1: 'A', 2: 'C', 3: 'C' };
const result = calculateTopicScore(questions, answers);
// Returns normalized topic performance
```

---

### `calculateGradeScore(topicScores)`

Calculates combined score for all topics in a specific grade.

**Parameters:**
- `topicScores` (Object): Map of `{ topicName: topicScoreObject }`

**Returns:**
```javascript
{
  total: number,
  correct: number,
  wrong: number,
  unanswered: number,
  rawScore: number,
  maxPossible: number,
  normalizedScore: number,    // 0.00 to 1.00
  performanceStatus: string,
  topicScores: Object         // Original topicScores passed in
}
```

---

### `calculateCumulativeScores(gradeScores)`

Builds cumulative score progression across grades.

**Parameters:**
- `gradeScores` (Array): Array of grade score objects (in order)

**Returns:**
- Array of same objects with added properties:
```javascript
{
  ...gradeScore,
  gradeNumber: number,        // 1, 2, 3, etc.
  cumulativeScore: number     // Running total
}
```

**Example:**
```javascript
const grades = [
  { normalizedScore: 0.82, ... },
  { normalizedScore: 0.76, ... },
  { normalizedScore: 0.88, ... }
];
const cumulative = calculateCumulativeScores(grades);
// cumulative[0]: { ..., gradeNumber: 1, cumulativeScore: 0.82 }
// cumulative[1]: { ..., gradeNumber: 2, cumulativeScore: 1.58 }
// cumulative[2]: { ..., gradeNumber: 3, cumulativeScore: 2.46 }
```

---

### `calculateOverallResult(gradeScores, selectedTargetGrade)`

Calculates final overall results from cumulative grades.

**Parameters:**
- `gradeScores` (Array): Cumulative grade scores (from `calculateCumulativeScores`)
- `selectedTargetGrade` (number): Student's selected target grade (1-8)

**Returns:**
```javascript
{
  selectedTargetGrade: number,
  finalCumulativeScore: number,           // e.g., 3.83
  demonstratedMathLevel: number,          // 1 + finalCumulativeScore
  totalAttempted: number,
  totalCorrect: number,
  totalWrong: number,
  totalUnanswered: number,
  gradeScores: Array                      // Filtered to selectedTargetGrade
}
```

---

### `calculateDifficultyPerformance(questions, answers)`

Analyzes performance across difficulty levels.

**Parameters:**
- `questions` (Array): All attempted questions
- `answers` (Object): Map of `{ questionId: selectedAnswer }`

**Returns:**
```javascript
{
  'Low': {
    total: number,
    correct: number,
    wrong: number,
    unanswered: number,
    rawScore: number,
    maxPossible: number,
    normalizedScore: number  // 0.00 to 1.00
  },
  'Medium': { ... },
  'High': { ... }
}
```

---

### `calculateGradeResults(allQuestions, answers, selectedTargetGrade)`

Comprehensive grade-by-grade analysis for all selected grades.

**Parameters:**
- `allQuestions` (Array): All available questions
- `answers` (Object): Map of `{ questionId: selectedAnswer }`
- `selectedTargetGrade` (number): Student's selected target grade

**Returns:**
- Array of grade results with cumulative scores:
```javascript
[
  {
    gradeNumber: 1,
    normalizedScore: 0.82,
    cumulativeScore: 0.82,
    topicScores: { ... },
    ...otherMetrics
  },
  { gradeNumber: 2, ... },
  // ... continues to selectedTargetGrade
]
```

---

### `generateCompleteAssessmentResult(allQuestions, answers, selectedTargetGrade, studentInfo)`

Master function that generates entire assessment result object.

**Parameters:**
- `allQuestions` (Array): All questions from test
- `answers` (Object): Map of `{ questionId: selectedAnswer }`
- `selectedTargetGrade` (number): Student's selected target grade (1-8)
- `studentInfo` (Object, optional):
  ```javascript
  {
    name: string,
    age: string,
    testDate: ISO string  // Auto-generated if not provided
  }
  ```

**Returns:**
```javascript
{
  studentName: string,
  studentAge: string,
  testDate: ISO string,
  selectedGrade: number,
  demonstratedMathLevel: number,      // e.g., 3.83
  finalCumulativeScore: number,
  totalAttempted: number,
  totalCorrect: number,
  totalWrong: number,
  totalUnanswered: number,
  gradePerformance: Array,
  difficultyPerformance: Object
}
```

**Example:**
```javascript
import { generateCompleteAssessmentResult } from './utils/scoring';

const result = generateCompleteAssessmentResult(
  questions,
  { 1: 'A', 2: 'C', 3: 'B', ... },
  5,
  { name: 'John Doe', age: '10' }
);

console.log(result.demonstratedMathLevel);  // e.g., 3.83
console.log(result.gradePerformance[0].normalizedScore);  // e.g., 0.82
```

---

## Helper Functions

### `clamp(value, min, max)`

Clamps a value to a range.

**Parameters:**
- `value` (number): Value to clamp
- `min` (number, optional): Minimum (default: 0)
- `max` (number, optional): Maximum (default: 1)

**Returns:** `number`

---

### `getPerformanceStatus(score)`

Returns performance classification based on score.

**Parameters:**
- `score` (number): Normalized score (0.00 to 1.00)

**Returns:** 
- `'Strong'` (≥0.80)
- `'Developing'` (0.60-0.79)
- `'Needs Improvement'` (0.40-0.59)
- `'Weak'` (<0.40)

---

### `getPerformanceColor(score)`

Returns hex color code for performance visualization.

**Parameters:**
- `score` (number): Normalized score (0.00 to 1.00)

**Returns:** `string` (hex color code, e.g., '#10b981')

---

## Constants

### `PERFORMANCE_THRESHOLDS`

```javascript
{
  Strong: { min: 0.80, max: 1.0 },
  Developing: { min: 0.60, max: 0.79 },
  NeedsImprovement: { min: 0.4, max: 0.59 },
  Weak: { min: 0.0, max: 0.39 }
}
```

### `DIFFICULTY_WEIGHTS`

```javascript
{
  Low: 1,
  Medium: 2,
  High: 3
}
```

### `ALL_TOPICS`

```javascript
[
  'Data Analysis',
  'Number & Operations',
  'Algebra',
  'Measurement',
  'Geometry'
]
```

---

## Usage Patterns

### Pattern 1: Calculate Single Grade Score

```javascript
import { calculateGradeScore, calculateTopicScore, ALL_TOPICS } from './utils/scoring';

const topicScores = {};
ALL_TOPICS.forEach(topic => {
  const topicQuestions = gradeQuestions.filter(q => q.topic === topic);
  topicScores[topic] = calculateTopicScore(topicQuestions, answers);
});

const gradeScore = calculateGradeScore(topicScores);
console.log(gradeScore.normalizedScore);  // 0.00 to 1.00
```

### Pattern 2: Generate Full Assessment Report

```javascript
import { generateCompleteAssessmentResult } from './utils/scoring';

const reportData = generateCompleteAssessmentResult(
  testState.questions,
  testState.answers,
  testState.selectedTargetGrade,
  {
    name: user.name,
    age: user.age,
    testDate: new Date().toISOString()
  }
);

// Use reportData in report components
setAssessmentResult(reportData);
```

### Pattern 3: Analyze Difficulty Performance

```javascript
import { calculateDifficultyPerformance } from './utils/scoring';

const diffPerf = calculateDifficultyPerformance(questions, answers);

console.log(`Low: ${(diffPerf.Low.normalizedScore * 100).toFixed(0)}%`);
console.log(`Medium: ${(diffPerf.Medium.normalizedScore * 100).toFixed(0)}%`);
console.log(`High: ${(diffPerf.High.normalizedScore * 100).toFixed(0)}%`);
```

---

## Backward Compatibility

Legacy functions are still available for existing code:
- `computeTopicPercent(topicState)`
- `computeTopicGrade(topicState, Gmin, Gmax)`
- `computeOverallGrade(topicStates, weights, Gmin, Gmax)`
- `computeColor(grade, targetRange, attempted)`

---

## Performance Notes

- All functions are optimized for performance
- Use memoization (`useMemo`) in React components for expensive calculations
- Cumulative scores are calculated once and stored
- Topic scores are calculated only for attempted topics

---

## Error Handling

Functions handle edge cases gracefully:
- Empty question arrays → return 0 scores
- Unanswered questions → contribute 0 points
- Missing topics → score 0 but don't break calculations
- NaN values → clamped to valid range

---

## Integration Example

```javascript
import {
  generateCompleteAssessmentResult,
  getPerformanceStatus,
  PERFORMANCE_THRESHOLDS
} from '../utils/scoring';

export function AssessmentSubmission() {
  const { testState, user } = useApp();

  const handleSubmit = () => {
    const reportData = generateCompleteAssessmentResult(
      testState.questions,
      testState.answers,
      testState.selectedTargetGrade,
      { name: user.name, age: user.age }
    );

    // Access results
    const level = reportData.demonstratedMathLevel;
    const accuracy = reportData.totalCorrect / reportData.totalAttempted;

    reportData.gradePerformance.forEach(grade => {
      const status = getPerformanceStatus(grade.normalizedScore);
      console.log(`Grade ${grade.gradeNumber}: ${status}`);
    });

    // Save to context
    setAssessmentResult({ reportData, ...otherData });
  };

  return (
    <button onClick={handleSubmit}>
      Submit Assessment
    </button>
  );
}
```

---

## Testing Utilities

For testing in Node.js (CommonJS):

```javascript
const {
  calculateQuestionScore,
  calculateTopicScore,
  generateCompleteAssessmentResult
} = require('./utils/scoring');

// Use in tests
const result = calculateQuestionScore(
  { difficulty: 'High' },
  'A',
  'A'
);
console.assert(result.rawScore === 3, 'High difficulty correct = 3');
```

---

## Version History

- **v1.0** (Current): Full weighted scoring system with cumulative grades
  - Weighted difficulty scoring
  - Normalized 0-1 range per grade
  - Cumulative score progression
  - Comprehensive assessment reports
  - Dynamic performance classification

---

Last Updated: August 15, 2026  
Status: Production Ready ✅
