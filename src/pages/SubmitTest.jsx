import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Layers,
  Award,
  Loader2,
  FileCheck2
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateCompleteAssessmentResult } from '../utils/scoring'
import { updateStudentAfterAssessment } from '../utils/studentRecords'
import { validateQuestionBank } from '../utils/questionBankValidation'
import { apiRequest } from '../utils/api'
import { getUserStorageKey } from '../utils/userStorage'
import { buildSubtopicTickCrossReport } from '../utils/subtopicTickCrossReport'

export default function SubmitTest() {
  const navigate = useNavigate()
  const { testState, setAssessmentResult, setAssessmentHistory, user, updateProfile, darkMode } = useApp()

  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(15)
  const [statusText, setStatusText] = useState('Evaluating answers and calculating grade benchmark...')

  const questions = testState.questions || []
  const answers = testState.answers || {}
  const totalQuestions = questions.length
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== ''
  ).length
  const unansweredCount = Math.max(0, totalQuestions - answeredCount)
  const selectedTargetGrade = Number(testState.selectedTargetGrade || String(user.grade || '').match(/\d+/)?.[0] || 8)

  useEffect(() => {
    if (!submitting) return undefined

    const t1 = setTimeout(() => {
      setProgress(45)
      setStatusText('Diagnosing prerequisite subtopics and foundational gaps...')
    }, 400)

    const t2 = setTimeout(() => {
      setProgress(75)
      setStatusText('Synthesizing step-by-step guidance and mastery tables...')
    }, 900)

    const t3 = setTimeout(() => {
      setProgress(95)
      setStatusText('Finalizing diagnostic report...')
    }, 1500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [submitting])

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setProgress(20)
    setStatusText('Processing assessment data...')

    const persistedUser = JSON.parse(localStorage.getItem('educheck_user') || 'null')
    const studentId = Number(user?.id ?? persistedUser?.id)

    // Validate inputs
    if (!Array.isArray(questions) || questions.length === 0) {
      alert('Error: No questions found. Please start the assessment again.')
      setSubmitting(false)
      return
    }

    try {
      // 1. Generate comprehensive scoring result locally
      const reportData = generateCompleteAssessmentResult(questions, answers, selectedTargetGrade, {
        name: user.name || 'Student',
        age: user.age || '',
        studentAge: user.age || '',
        testDate: new Date().toISOString(),
      })

      const subtopicTickCrossReport = buildSubtopicTickCrossReport(questions, answers, selectedTargetGrade)
      reportData.subtopicTickCrossReport = subtopicTickCrossReport
      reportData.weaknessMap = testState.adaptiveState?.weaknessMap || {}
      reportData.probeHistory = testState.adaptiveState?.probeHistory || []
      reportData.questionReview = questions.map((question) => {
        const selectedAnswer = answers[question.id]
        const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== ''
        const correctAnswer = question.correct_answer || question.answer || question.correctAnswer || question.correct_option
        const isCorrect = isAnswered && String(selectedAnswer).toUpperCase() === String(correctAnswer).toUpperCase()

        return {
          questionId: question.id,
          grade: question.grade,
          topic: question.topic,
          subtopic: question.subtopic || 'General',
          question: question.question,
          options: question.options || {
            A: question.option_a,
            B: question.option_b,
            C: question.option_c,
            D: question.option_d,
          },
          selectedAnswer: selectedAnswer || null,
          correctAnswer,
          status: !isAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Wrong',
          explanation: question.explanation || 'Review the worked solution for this topic.',
        }
      }).filter((question) => question.status === 'Wrong')

      // 2. Request AI enhancements without cancelling normal Gemini responses too early.
      try {
        const geminiPromise = apiRequest('/reports/gemini', {
          method: 'POST',
          body: JSON.stringify({
            studentGrade: selectedTargetGrade,
            accuracy: reportData.accuracy,
            questionReview: reportData.questionReview.slice(0, 5),
          }),
        })
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 12000))
        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise])

        if (geminiResponse?.report) {
          reportData.geminiReport = geminiResponse.report
          const feedbackByQuestion = new Map(
            (geminiResponse.report?.questionFeedback || []).map((item) => [String(item.questionId), item])
          )
          reportData.questionReview = reportData.questionReview.map((question) => ({
            ...question,
            ...(feedbackByQuestion.get(String(question.questionId)) || {}),
          }))
        }
      } catch (aiError) {
        console.warn('AI report generation fallback activated for fast completion:', aiError.message)
      }

      const questionBankReport = validateQuestionBank(questions)
      reportData.questionBankCoverage = questionBankReport.coverage
      reportData.incompleteQuestionGroups = questionBankReport.incompleteGroups
      reportData.weakPoints = testState.adaptiveState?.weakPoints?.length ? testState.adaptiveState.weakPoints : reportData.gaps
      reportData.strongPoints = testState.adaptiveState?.strongPoints?.length ? testState.adaptiveState.strongPoints : reportData.strengths

      // Calculate totals
      const total = questions.length
      const correctCount = questions.filter(
        (question) => String(answers[question.id] || '').toUpperCase() === String(question.correct_answer || question.answer || question.correctAnswer || question.correct_option || '').toUpperCase()
      ).length
      const wrongCount = total - correctCount
      const unanswered = questions.filter((question) => {
        const answer = answers[question.id]
        return answer === undefined || answer === null || answer === ''
      }).length
      const percentage = total ? Math.round((correctCount / total) * 100) : 0

      reportData.totalQuestions = total
      reportData.totalAttempted = total
      reportData.totalCorrect = correctCount
      reportData.totalWrong = wrongCount
      reportData.totalUnanswered = unanswered
      reportData.accuracy = total ? correctCount / total : 0

      const currentGradeNumber = Number(String(user.grade || '').match(/\d+/)?.[0] || selectedTargetGrade)
      const passedGrade = percentage >= 70
      const promotedGrade = passedGrade && currentGradeNumber < 8 ? `Grade ${currentGradeNumber + 1}` : user.grade
      const estimatedGrade = reportData.demonstratedMathLevel.toFixed(2)

      // Build difficulty breakdown
      const difficultyBreakdown = ['Low', 'Medium', 'High'].map((difficulty) => {
        const diffQuestions = questions.filter((q) => q.difficulty === difficulty)
        const correctDiff = diffQuestions.filter(
          (q) => String(answers[q.id] || '').toUpperCase() === String(q.correct_answer || q.answer || q.correctAnswer || q.correct_option || '').toUpperCase()
        ).length
        return {
          difficulty,
          total: diffQuestions.length,
          correct: correctDiff,
          percentage: diffQuestions.length ? Math.round((correctDiff / diffQuestions.length) * 100) : 0,
        }
      })

      // Build topic breakdown
      const topicMap = {}
      questions.forEach((question) => {
        if (!topicMap[question.topic]) {
          topicMap[question.topic] = { questions: [] }
        }
        topicMap[question.topic].questions.push(question)
      })

      const topicBreakdown = Object.entries(topicMap).map(([topicName, data]) => {
        const correctInTopic = data.questions.filter(
          (q) => String(answers[q.id] || '').toUpperCase() === String(q.correct_answer || q.answer || q.correctAnswer || q.correct_option || '').toUpperCase()
        ).length
        return {
          topic: topicName,
          total: data.questions.length,
          correct: correctInTopic,
          percentage: data.questions.length ? Math.round((correctInTopic / data.questions.length) * 100) : 0,
        }
      })

      updateProfile({ actualGrade: estimatedGrade })

      // Create result entry
      const resultEntry = {
        total,
        correct: correctCount,
        wrong: wrongCount,
        unanswered,
        percentage,
        score: correctCount,
        studentName: user.name || 'Student',
        subject: questions[0]?.topic || 'General Assessment',
        grade: user.grade,
        passedGrade,
        promotedGrade,
        gradeRange: selectedTargetGrade === 1 ? 'Grade 1' : `Grades 1–${selectedTargetGrade}`,
        difficulty: testState.selectedDifficulty || 'Medium',
        estimatedGrade,
        strand: questions[0]?.topic || null,
        topicBreakdown,
        difficultyBreakdown,
        gradePerformance: reportData.gradePerformance || [],
        questions,
        answers,
        subtopicReport: subtopicTickCrossReport,
        weaknessMap: testState.adaptiveState?.weaknessMap || {},
        probeHistory: testState.adaptiveState?.probeHistory || [],
        reportData,
        submittedAt: new Date().toISOString(),
      }

      // Persist in background to database
      if (studentId) {
        apiRequest('/assessment-attempts', {
          method: 'POST',
          body: JSON.stringify({
            studentId,
            attemptId: testState.assessmentAttemptId || null,
            questions,
            answers,
            selectedTargetGrade,
            estimatedGrade,
            reportData,
            topicBreakdown,
          }),
        }).catch((err) => console.warn('Background assessment save notice:', err.message))
      }

      // Save results to state and localStorage
      setAssessmentResult(resultEntry)
      setAssessmentHistory((prev) => [...prev, resultEntry])

      localStorage.setItem(getUserStorageKey('educheck_assessmentResult', user), JSON.stringify(resultEntry))
      localStorage.setItem(
        getUserStorageKey('educheck_assessmentHistory', user),
        JSON.stringify([
          ...JSON.parse(localStorage.getItem(getUserStorageKey('educheck_assessmentHistory', user)) || '[]'),
          resultEntry,
        ])
      )

      try {
        const savedStudents = JSON.parse(localStorage.getItem('educheck_students') || '[]')
        const updatedStudents = updateStudentAfterAssessment(savedStudents, {
          name: user.name || resultEntry.studentName || 'Student',
          email: user.email || '',
          percentage: resultEntry.percentage,
          grade: user.grade || resultEntry.grade || 'Grade 6',
        })
        localStorage.setItem('educheck_students', JSON.stringify(updatedStudents))
      } catch (err) {
        console.error('Failed to update student performance:', err)
      }

      setProgress(100)
      setStatusText('Report generated! Opening your diagnostic summary...')

      setTimeout(() => {
        navigate('/summary-report')
      }, 300)
    } catch (error) {
      console.error('Assessment submission failed:', error)
      alert(`Error submitting assessment: ${error.message || 'Unknown error occurred'}`)
      setSubmitting(false)
    }
  }

  // --- Submitting / Loading Screen ---
  if (submitting) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className={`relative flex w-full flex-col items-center rounded-3xl border p-8 sm:p-12 shadow-2xl backdrop-blur-2xl transition-all ${
          darkMode ? 'border-white/10 bg-slate-900/90 shadow-sky-950/40' : 'border-slate-200 bg-white/95 shadow-slate-200'
        }`}>
          {/* Glowing Animated Icon */}
          <div className="relative mb-6">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 opacity-60 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-xl">
              <Brain size={40} className="animate-bounce" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generating Diagnostic Report
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md">
            Our AI engine is analyzing your mathematical strengths, gaps, and grade benchmark.
          </p>

          {/* Progress Bar Container */}
          <div className="mt-8 w-full max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-400">
              <span className="flex items-center gap-1.5 text-sky-500 font-bold">
                <Loader2 size={13} className="animate-spin" /> {statusText}
              </span>
              <span className="font-mono text-sky-400">{progress}%</span>
            </div>
            <div className={`h-3 w-full overflow-hidden rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500 ease-out shadow-sm shadow-sky-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Micro Checklist */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-md text-[11px] font-medium text-slate-400">
            <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 ${
              progress >= 30 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/5 bg-slate-800/30'
            }`}>
              <CheckCircle2 size={13} /> Accuracy Analysis
            </div>
            <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 ${
              progress >= 70 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/5 bg-slate-800/30'
            }`}>
              <CheckCircle2 size={13} /> Subtopic Mastery
            </div>
            <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 ${
              progress >= 95 ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/5 bg-slate-800/30'
            }`}>
              <CheckCircle2 size={13} /> Step Solutions
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Attractive Confirmation Screen ---
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-4 py-8">
      <div className={`relative w-full rounded-[2.5rem] border p-7 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all ${
        darkMode
          ? 'border-white/10 bg-slate-900/80 shadow-[0_30px_100px_-30px_rgba(56,189,248,0.25)]'
          : 'border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/80'
      }`}>
        {/* Glow Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 opacity-50 blur-lg" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white shadow-lg">
              <FileCheck2 size={32} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 mb-3">
            <Sparkles size={13} /> Assessment Completed
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to submit your assessment?
          </h2>
        </div>

        {/* Quick Test Summary Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className={`rounded-2xl border p-3 text-center ${darkMode ? 'border-white/5 bg-slate-950/40' : 'border-slate-200/80 bg-slate-50'}`}>
            <Layers size={18} className="mx-auto text-sky-400 mb-1" />
            <div className="text-lg font-bold text-sky-500">{totalQuestions}</div>
            <div className="text-[11px] font-semibold text-slate-400">Total MCQs</div>
          </div>

          <div className={`rounded-2xl border p-3 text-center ${darkMode ? 'border-white/5 bg-slate-950/40' : 'border-slate-200/80 bg-slate-50'}`}>
            <CheckCircle2 size={18} className="mx-auto text-emerald-400 mb-1" />
            <div className="text-lg font-bold text-emerald-500">{answeredCount}</div>
            <div className="text-[11px] font-semibold text-slate-400">Answered</div>
          </div>

          <div className={`rounded-2xl border p-3 text-center ${darkMode ? 'border-white/5 bg-slate-950/40' : 'border-slate-200/80 bg-slate-50'}`}>
            <HelpCircle size={18} className={`mx-auto mb-1 ${unansweredCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
            <div className={`text-lg font-bold ${unansweredCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{unansweredCount}</div>
            <div className="text-[11px] font-semibold text-slate-400">Unanswered</div>
          </div>

          <div className={`rounded-2xl border p-3 text-center ${darkMode ? 'border-white/5 bg-slate-950/40' : 'border-slate-200/80 bg-slate-50'}`}>
            <Award size={18} className="mx-auto text-violet-400 mb-1" />
            <div className="text-lg font-bold text-violet-500">Grade {selectedTargetGrade}</div>
            <div className="text-[11px] font-semibold text-slate-400">Target Level</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Submit & View AI Report</span>
            <ArrowRight size={17} />
          </button>

          <Link
            to="/start-test"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition hover:bg-white/5 ${
              darkMode ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700 bg-white'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Review Answers</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
