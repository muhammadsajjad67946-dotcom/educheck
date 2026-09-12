import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  Binary,
  Calculator,
  Check,
  Clock3,
  Layers3,
  Ruler,
  Shapes,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'
import { advanceGradeBatchTest, createGradeBatchTestState, createWeakPointsRetakeState } from '../utils/adaptiveTest.js'
import InAppPaymentModal from '../components/InAppPaymentModal'

const STRAND_LABEL = 'Mathematics strand'
const DEFAULT_STRAND = 'Overall'

const ASSESSMENT_TOPICS = [
  {
    id: 'Overall',
    title: 'Overall Test',
    icon: Sparkles,
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'Number & Operations',
    title: 'Number & Operations',
    icon: Calculator,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'Measurement',
    title: 'Measurement',
    icon: Ruler,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'Data Analysis',
    title: 'Data Analysis',
    icon: BarChart2,
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'Geometry',
    title: 'Geometry',
    icon: Shapes,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'Algebra',
    title: 'Algebra',
    icon: Binary,
    gradient: 'from-purple-500 to-pink-600',
  },
]

function getGradeNumber(gradeLabel) {
  if (!gradeLabel) return null
  const match = String(gradeLabel).match(/(\d+)/)
  return match ? Number(match[1]) : null
}

function normalizeQuestionRecord(question, fallbackId = 0) {
  const gradeId = Number(question?.gradeId ?? question?.grade_id ?? question?.grade ?? 1)
  const difficultyValue = String(question?.difficulty || question?.difficulty_level || 'Medium').toLowerCase()
  const difficulty = difficultyValue === 'easy' || difficultyValue === 'low' ? 'Low' : difficultyValue === 'hard' || difficultyValue === 'high' ? 'High' : 'Medium'
  const options = question?.options && typeof question.options === 'object'
    ? question.options
    : {
        A: question?.option_a ?? question?.optionA ?? '',
        B: question?.option_b ?? question?.optionB ?? '',
        C: question?.option_c ?? question?.optionC ?? '',
        D: question?.option_d ?? question?.optionD ?? '',
      }

  const diagnostics = typeof question?.distractor_diagnostics === 'string'
    ? (() => { try { return JSON.parse(question.distractor_diagnostics) } catch { return null } })()
    : question?.distractor_diagnostics || null

  return {
    ...question,
    id: question?.id ?? fallbackId,
    grade: Number.isFinite(gradeId) ? gradeId : 1,
    gradeId: Number.isFinite(gradeId) ? gradeId : 1,
    difficulty,
    answer: String(question?.correct_answer ?? question?.answer ?? question?.correctAnswer ?? question?.correct_option ?? question?.correctOption ?? 'A').toUpperCase(),
    options,
    question: question?.question || question?.question_text || 'Question text unavailable',
    distractor_diagnostics: diagnostics,
  }
}

export default function StartTest() {
  const navigate = useNavigate()
  const { user, testState, assessmentHistory, setTestState, setPendingRetake, darkMode } = useApp()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState(user?.currentDifficulty || 'Low')
  const questionCount = 30
  const [selectedTopic, setSelectedTopic] = useState('Overall')
  const [hasStarted, setHasStarted] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const userGradeNumber = useMemo(() => {
    const num = getGradeNumber(user?.grade)
    return num && num >= 1 && num <= 8 ? num : 8
  }, [user?.grade])
  const [selectedGrade, setSelectedGrade] = useState(userGradeNumber)
  const effectiveGradeNumber = Math.min(Math.max(Number(selectedGrade) || 8, 1), 8)

  useEffect(() => {
    if (userGradeNumber) setSelectedGrade(userGradeNumber)
  }, [userGradeNumber])

  const [questionBank, setQuestionBank] = useState([])
  const previousTest = assessmentHistory[assessmentHistory.length - 1]
  const recommendedDifficulty = previousTest?.percentage >= 70
    ? previousTest.difficulty === 'Low' ? 'Medium' : previousTest.difficulty === 'Medium' ? 'High' : 'High'
    : null

  useEffect(() => {
    if (!hasStarted && recommendedDifficulty) setSelectedDifficulty(recommendedDifficulty)
  }, [hasStarted, recommendedDifficulty])

  useEffect(() => {
    if (!hasStarted) return undefined
    let ignore = false

    const startAssessment = async () => {
      setLoadingQuestions(true)
      try {
        const subscription = await apiRequest(`/subscription/status?userId=${Number(user?.id)}`)
        if (!subscription.active) {
          setLoadingQuestions(false)
          setHasStarted(false)
          setIsPaymentModalOpen(true)
          return
        }

        let payload = await apiRequest('/assessment-attempts/start', {
          method: 'POST',
          body: JSON.stringify({
            studentId: Number(user?.id),
            minGrade: 1,
            maxGrade: effectiveGradeNumber,
            topic: selectedTopic,
            difficulty: selectedDifficulty,
            questionCount,
          }),
        })

        // Fetch comprehensive questions across all relevant grades for selected topic
        const topicQuery = selectedTopic !== 'Overall' ? `&topic=${encodeURIComponent(selectedTopic)}` : ''
        const comprehensiveQuestions = await apiRequest(`/questions?studentId=${Number(user?.id)}&minGrade=1&maxGrade=${effectiveGradeNumber}&limit=1000${topicQuery}`).catch(() => [])
        const rawList = Array.isArray(comprehensiveQuestions) && comprehensiveQuestions.length > 0
          ? comprehensiveQuestions
          : (payload?.questions || [])

        if (!ignore) {
          const normalizedRows = rawList.map((question, index) => normalizeQuestionRecord(question, index + 1))
          setQuestionBank(normalizedRows)
          setTestState((prev) => ({
            ...prev,
            questions: [],
            adaptiveState: null,
            answers: {},
            score: 0,
            assessmentAttemptId: payload?.attemptId || null,
            selectedTargetGrade: effectiveGradeNumber,
            selectedDifficulty: payload?.difficulty || selectedDifficulty,
            selectedStrand: selectedTopic,
            startFresh: true,
          }))
        }
      } catch (error) {
        if (!ignore) {
          setQuestionBank([])
          setLoadError(error.message || 'Unable to load assessment questions.')
        }
        if (!ignore && (error.code === 'SUBSCRIPTION_REQUIRED' || error.status === 403)) {
          setHasStarted(false)
          setIsPaymentModalOpen(true)
        }
      } finally {
        if (!ignore) setLoadingQuestions(false)
      }
    }

    startAssessment()

    return () => {
      ignore = true
    }
  }, [effectiveGradeNumber, hasStarted, navigate, selectedDifficulty, selectedTopic, setPendingRetake, setTestState, user?.id])

  const adaptiveQuestionBank = useMemo(
    () => questionBank.filter((question) => Number(question.gradeId ?? question.grade) <= effectiveGradeNumber),
    [effectiveGradeNumber, questionBank],
  )

  const adaptiveInitialState = useMemo(() => {
    if (!effectiveGradeNumber || !adaptiveQuestionBank.length) return null
    if (testState.retakeMode && testState.focusTopics?.length) {
      return createWeakPointsRetakeState(adaptiveQuestionBank, effectiveGradeNumber, testState.focusTopics, questionCount)
    }
    return createGradeBatchTestState(adaptiveQuestionBank, effectiveGradeNumber, selectedTopic, questionCount)
  }, [adaptiveQuestionBank, effectiveGradeNumber, questionCount, testState.retakeMode, testState.focusTopics, selectedTopic])

  const selectedQuestions = useMemo(() => {
    if (adaptiveInitialState?.questions?.length) {
      return adaptiveInitialState.questions.slice(0, questionCount)
    }

    return adaptiveQuestionBank.slice(0, questionCount)
  }, [adaptiveInitialState, adaptiveQuestionBank, questionCount])

  const shouldInitializeQuestions =
    selectedQuestions.length > 0 &&
    (
      !testState.questions ||
      testState.questions.length === 0 ||
      Number(testState.adaptiveState?.targetGrade) !== effectiveGradeNumber ||
      !testState.adaptiveState ||
      testState.startFresh === true  // Force fresh start
    )

  useEffect(() => {
    if (shouldInitializeQuestions) {
      setTestState((prev) => ({
        ...prev,
        questions: selectedQuestions,
        adaptiveState: adaptiveInitialState,
        currentQuestion: 0,
        answers: {},
        score: 0,
        startFresh: false,  // Clear flag after initializing
      }))
      setIndex(0)
    }
  }, [shouldInitializeQuestions, selectedQuestions, setTestState, adaptiveInitialState])

  const current = testState.questions?.[index]
  const totalQuestions = testState.questions?.length ?? 0

  useEffect(() => {
    if (current?.id && testState.answers?.[current.id]) {
      setSelected(testState.answers[current.id])
    } else {
      setSelected('')
    }
  }, [current, testState.answers])

  const handleAnswerSelect = (optionKey) => {
    if (!current?.id || !current?.answer) return

    const currentBank = adaptiveQuestionBank.length ? adaptiveQuestionBank : questionBank
    const currentAdaptiveState = testState.adaptiveState || createGradeBatchTestState(currentBank, effectiveGradeNumber, testState.selectedStrand || selectedTopic || DEFAULT_STRAND, questionCount)
    const nextAdaptiveState = advanceGradeBatchTest(currentAdaptiveState, currentBank, current, optionKey)

    const answeredCount = Object.keys(testState.answers || {}).length + 1
    const shouldComplete = nextAdaptiveState.assessmentComplete === true || answeredCount >= questionCount
    const nextQuestions = nextAdaptiveState.questions.slice(0, questionCount)

    setSelected(optionKey)
    setAssessmentComplete(shouldComplete)
    setTestState((prev) => ({
      ...prev,
      questions: nextQuestions,
      adaptiveState: nextAdaptiveState,
      answers: {
        ...prev.answers,
        [current.id]: optionKey,
      },
    }))
  }

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const handleNext = () => {
    if (index < totalQuestions - 1) {
      setIndex(index + 1)
    }
  }

  if (!hasStarted) {
    return (
      <div className={`mx-auto max-w-5xl rounded-[2rem] border p-6 backdrop-blur-xl transition-all lg:p-10 ${
        darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(56,189,248,0.25)]' : 'border-slate-200 bg-white shadow-xl'
      }`}>
        <div className={`rounded-[1.75rem] border p-6 md:p-8 ${
          darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
            <Sparkles size={14} /> Diagnostic Assessment Setup
          </div>
          <h1 className={`mt-4 text-3xl font-bold tracking-tight md:text-4xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Start Mathematics Diagnostic Test
          </h1>

          {recommendedDifficulty && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
              <Sparkles size={16} className="shrink-0" />
              <span>
                You achieved a passing score on your previous test. Recommended starting difficulty: <strong>{recommendedDifficulty}</strong>.
              </span>
            </div>
          )}

          {/* Strand Selection Boxes: Overall Test, Number & Operations, Measurement, Data Analysis, Geometry, Algebra */}
          <div className="mt-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ASSESSMENT_TOPICS.map((item) => {
                const IconComponent = item.icon
                const isSelected = selectedTopic === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedTopic(item.id)}
                    className={`group relative flex flex-col items-center justify-center gap-3.5 rounded-2xl border p-5 text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? darkMode
                          ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/50 scale-[1.02]'
                          : 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/20 ring-2 ring-sky-500/40 scale-[1.02]'
                        : darkMode
                        ? 'border-white/10 bg-slate-950/60 hover:border-sky-400/40 hover:bg-slate-900/80 hover:scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50 hover:scale-[1.01]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white shadow">
                        <Check size={12} strokeWidth={3.5} />
                      </span>
                    )}

                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-110`}>
                      <IconComponent size={24} />
                    </div>

                    <span className={`text-sm font-bold leading-tight transition-colors ${
                      isSelected
                        ? darkMode ? 'text-white' : 'text-sky-950'
                        : darkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {loadError && (
            <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {loadError}
            </p>
          )}

          <div className="mt-8 flex items-center justify-start">
            <button
              type="button"
              onClick={() => { setLoadError(''); setHasStarted(true) }}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.98] cursor-pointer"
            >
              Start Assessment Now <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <InAppPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={() => {
            setIsPaymentModalOpen(false)
            setHasStarted(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className={`mx-auto max-w-5xl rounded-[2rem] border p-4 md:p-6 backdrop-blur-xl transition-all ${
      darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(56,189,248,0.25)]' : 'border-slate-200 bg-white shadow-xl'
    }`}>
      {/* Top Bar */}
      <div className={`flex flex-col gap-3 rounded-[1.25rem] border p-4 md:px-6 md:py-3 md:flex-row md:items-center md:justify-between ${
        darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'
      }`}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-500">
            {testState.selectedStrand && testState.selectedStrand !== 'Overall'
              ? `${testState.selectedStrand} Focus Diagnostic`
              : 'Adaptive Diagnostic Assessment'}
          </p>
          <h2 className={`mt-0.5 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Grade {current?.grade || effectiveGradeNumber} • {current?.topic || STRAND_LABEL}
          </h2>
          {current?.subtopic && (
            <p className="text-xs font-medium text-slate-400">Subtopic: {current.subtopic}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-bold text-sky-500">
            Question {Math.min(index + 1, totalQuestions || questionCount)} / {totalQuestions || questionCount}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
            Completed: {index}
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-400">
            Remaining: {Math.max(0, (totalQuestions || questionCount) - (index + 1))}
          </span>
          <span className={`rounded-full border px-3 py-1 ${
            current?.difficulty === 'High' ? 'border-rose-400/30 text-rose-400 bg-rose-500/10' :
            current?.difficulty === 'Medium' ? 'border-amber-400/30 text-amber-400 bg-amber-500/10' :
            'border-emerald-400/30 text-emerald-400 bg-emerald-500/10'
          }`}>
            {current?.difficulty || 'Medium'}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
            darkMode ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
          }`}>
            <Clock3 size={13} /> Diagnostic
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className={`mt-3.5 rounded-[1.5rem] border p-5 md:p-6 ${
        darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-slate-50/80'
      }`}>
        <div className="flex flex-wrap items-center gap-2.5 text-sky-500">
          <span className="flex items-center gap-2 font-bold text-sm"><Layers3 size={16} /> Question #{index + 1}</span>
          {current && (
            <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-bold text-sky-400">
              Grade {current.grade || effectiveGradeNumber}
            </span>
          )}
        </div>

        {current ? (
          <>
            <h3 className={`mt-2.5 text-lg md:text-xl font-semibold leading-relaxed ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {current.question}
            </h3>

            {/* MCQ Options A, B, C, D */}
            <div className="mt-5 grid gap-3">
              {['A', 'B', 'C', 'D'].map((optionKey) => {
                const optionText = current.options?.[optionKey]
                if (!optionText) return null
                const isSelected = selected === optionKey

                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() => handleAnswerSelect(optionKey)}
                    className={`group flex items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/15 shadow-md shadow-sky-500/15 ring-2 ring-sky-500/30'
                        : darkMode
                        ? 'border-white/10 bg-slate-950/60 hover:border-sky-400/40 hover:bg-slate-900'
                        : 'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/40'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow'
                          : darkMode
                          ? 'bg-slate-800 text-sky-400 group-hover:bg-sky-500/20'
                          : 'bg-slate-100 text-sky-600 border border-slate-200 group-hover:border-sky-300'
                      }`}
                    >
                      {optionKey}
                    </span>
                    <span className={`text-sm md:text-base font-medium ${
                      isSelected
                        ? darkMode ? 'text-white font-semibold' : 'text-slate-900 font-semibold'
                        : darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {optionText}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Navigation Buttons directly inside the question box */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={index === 0}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                  darkMode ? 'border-white/10 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                type="button"
                onClick={assessmentComplete || index >= totalQuestions - 1 ? () => navigate('/submit-test') : handleNext}
                disabled={!selected}
                className={`inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 ${
                  selected
                    ? 'bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 shadow-sky-500/30 hover:scale-[1.02] hover:shadow-xl cursor-pointer active:scale-[0.98]'
                    : 'bg-slate-700/60 text-slate-400 border border-white/5 cursor-not-allowed shadow-none'
                }`}
              >
                {assessmentComplete || index >= totalQuestions - 1 ? 'Submit Assessment' : 'Next Question'}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className={`mt-6 rounded-3xl border p-8 text-center ${
            darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'
          }`}>
            {loadingQuestions ? 'Loading adaptive question bank...' : `Questions unavailable for Grade ${effectiveGradeNumber}. Please try again.`}
          </div>
        )}
      </div>

      <InAppPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={() => {
          setIsPaymentModalOpen(false)
          setHasStarted(false)
        }}
      />
    </div>
  )
}
