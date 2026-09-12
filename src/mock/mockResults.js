// Mock assessment results with correct topicWisePerformance structure for StandardReport

export const mockResultStudentA = {
  total: 60,
  correct: 40,
  wrong: 15,
  percentage: 66,
  score: 40,
  submittedAt: new Date().toISOString(),
  reportData: {
    studentName: 'Student A (Test Data)',
    studentAge: '10',
    testDate: new Date().toISOString(),
    selectedGrade: 6,
    demonstratedMathLevel: 4.2,
    finalCumulativeScore: 25.2,
    totalAttempted: 60,
    totalCorrect: 40,
    totalWrong: 15,
    totalUnanswered: 5,
    topicWisePerformance: [
      {
        topicName: 'Number & Operations',
        grades: {
          1: { correct: 4, total: 5, normalizedScore: 0.8 },
          2: { correct: 3, total: 5, normalizedScore: 0.6 },
          3: { correct: 4, total: 5, normalizedScore: 0.8 },
          4: { correct: 3, total: 5, normalizedScore: 0.6 },
          5: { correct: 0, total: 0, normalizedScore: 0 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 14,
        totalAttempted: 20,
        totalCorrect: 14,
        gradeLevel: 4.2,
      },
      {
        topicName: 'Measurement',
        grades: {
          1: { correct: 3, total: 5, normalizedScore: 0.6 },
          2: { correct: 4, total: 5, normalizedScore: 0.8 },
          3: { correct: 3, total: 5, normalizedScore: 0.6 },
          4: { correct: 2, total: 5, normalizedScore: 0.4 },
          5: { correct: 0, total: 0, normalizedScore: 0 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 12,
        totalAttempted: 20,
        totalCorrect: 12,
        gradeLevel: 3.4,
      },
      {
        topicName: 'Data Analysis',
        grades: {
          1: { correct: 5, total: 5, normalizedScore: 1.0 },
          2: { correct: 4, total: 5, normalizedScore: 0.8 },
          3: { correct: 4, total: 5, normalizedScore: 0.8 },
          4: { correct: 3, total: 5, normalizedScore: 0.6 },
          5: { correct: 0, total: 0, normalizedScore: 0 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 16,
        totalAttempted: 20,
        totalCorrect: 16,
        gradeLevel: 4.2,
      },
      {
        topicName: 'Algebra',
        grades: {
          1: { correct: 3, total: 5, normalizedScore: 0.6 },
          2: { correct: 3, total: 5, normalizedScore: 0.6 },
          3: { correct: 4, total: 5, normalizedScore: 0.8 },
          4: { correct: 2, total: 5, normalizedScore: 0.4 },
          5: { correct: 0, total: 0, normalizedScore: 0 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 12,
        totalAttempted: 20,
        totalCorrect: 12,
        gradeLevel: 3.0,
      },
      {
        topicName: 'Geometry',
        grades: {
          1: { correct: 2, total: 5, normalizedScore: 0.4 },
          2: { correct: 2, total: 5, normalizedScore: 0.4 },
          3: { correct: 2, total: 5, normalizedScore: 0.4 },
          4: { correct: 2, total: 5, normalizedScore: 0.4 },
          5: { correct: 0, total: 0, normalizedScore: 0 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 8,
        totalAttempted: 20,
        totalCorrect: 8,
        gradeLevel: 2.8,
      },
    ],
    gradePerformance: [],
    difficultyPerformance: [],
  },
}

export const mockResultStudentB = {
  total: 60,
  correct: 50,
  wrong: 8,
  percentage: 83,
  score: 50,
  submittedAt: new Date().toISOString(),
  reportData: {
    studentName: 'Student B (Test Data)',
    studentAge: '12',
    testDate: new Date().toISOString(),
    selectedGrade: 8,
    demonstratedMathLevel: 6.4,
    finalCumulativeScore: 44.8,
    totalAttempted: 60,
    totalCorrect: 50,
    totalWrong: 8,
    totalUnanswered: 2,
    topicWisePerformance: [
      {
        topicName: 'Number & Operations',
        grades: {
          1: { correct: 5, total: 5, normalizedScore: 1.0 },
          2: { correct: 5, total: 5, normalizedScore: 1.0 },
          3: { correct: 4, total: 5, normalizedScore: 0.8 },
          4: { correct: 3, total: 5, normalizedScore: 0.6 },
          5: { correct: 2, total: 5, normalizedScore: 0.4 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
          7: { correct: 0, total: 0, normalizedScore: 0 },
          8: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 19,
        totalAttempted: 25,
        totalCorrect: 19,
        gradeLevel: 5.2,
      },
      {
        topicName: 'Measurement',
        grades: {
          1: { correct: 4, total: 5, normalizedScore: 0.8 },
          2: { correct: 5, total: 5, normalizedScore: 1.0 },
          3: { correct: 5, total: 5, normalizedScore: 1.0 },
          4: { correct: 4, total: 5, normalizedScore: 0.8 },
          5: { correct: 2, total: 5, normalizedScore: 0.4 },
          6: { correct: 0, total: 0, normalizedScore: 0 },
          7: { correct: 0, total: 0, normalizedScore: 0 },
          8: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 20,
        totalAttempted: 25,
        totalCorrect: 20,
        gradeLevel: 5.6,
      },
      {
        topicName: 'Data Analysis',
        grades: {
          1: { correct: 3, total: 5, normalizedScore: 0.6 },
          2: { correct: 4, total: 5, normalizedScore: 0.8 },
          3: { correct: 4, total: 5, normalizedScore: 0.8 },
          4: { correct: 4, total: 5, normalizedScore: 0.8 },
          5: { correct: 3, total: 5, normalizedScore: 0.6 },
          6: { correct: 2, total: 5, normalizedScore: 0.4 },
          7: { correct: 0, total: 0, normalizedScore: 0 },
          8: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 20,
        totalAttempted: 30,
        totalCorrect: 20,
        gradeLevel: 5.2,
      },
      {
        topicName: 'Algebra',
        grades: {
          1: { correct: 4, total: 5, normalizedScore: 0.8 },
          2: { correct: 4, total: 5, normalizedScore: 0.8 },
          3: { correct: 3, total: 5, normalizedScore: 0.6 },
          4: { correct: 3, total: 5, normalizedScore: 0.6 },
          5: { correct: 2, total: 5, normalizedScore: 0.4 },
          6: { correct: 1, total: 5, normalizedScore: 0.2 },
          7: { correct: 0, total: 0, normalizedScore: 0 },
          8: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 17,
        totalAttempted: 30,
        totalCorrect: 17,
        gradeLevel: 4.2,
      },
      {
        topicName: 'Geometry',
        grades: {
          1: { correct: 4, total: 5, normalizedScore: 0.8 },
          2: { correct: 4, total: 5, normalizedScore: 0.8 },
          3: { correct: 5, total: 5, normalizedScore: 1.0 },
          4: { correct: 4, total: 5, normalizedScore: 0.8 },
          5: { correct: 3, total: 5, normalizedScore: 0.6 },
          6: { correct: 2, total: 5, normalizedScore: 0.4 },
          7: { correct: 1, total: 5, normalizedScore: 0.2 },
          8: { correct: 0, total: 0, normalizedScore: 0 },
        },
        totalRawScore: 23,
        totalAttempted: 35,
        totalCorrect: 23,
        gradeLevel: 6.0,
      },
    ],
    gradePerformance: [],
    difficultyPerformance: [],
  },
}
// Helper function to load mock data into localStorage for testing
export function loadMockResultA() {
  try {
    localStorage.setItem('educheck_assessmentResult', JSON.stringify(mockResultStudentA))
    console.log('✓ Loaded Mock Result A - Reload page to see the report')
    return true
  } catch (e) {
    console.error('Failed to load mock result', e)
    return false
  }
}

export function loadMockResultB() {
  try {
    localStorage.setItem('educheck_assessmentResult', JSON.stringify(mockResultStudentB))
    console.log('✓ Loaded Mock Result B - Reload page to see the report')
    return true
  } catch (e) {
    console.error('Failed to load mock result', e)
    return false
  }
}

// Legacy function for backward compatibility
export function applyMockResult(result) {
  try {
    localStorage.setItem('educheck_assessmentResult', JSON.stringify(result))
    console.info('Mock assessmentResult saved to localStorage. Reload the app to view the report.')
  } catch (e) {
    console.error('Failed to save mock result', e)
  }
}
