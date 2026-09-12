import { RotateCcw, Sparkles, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function RetakeTest() {
  const { setTestState, assessmentResult, assessmentHistory } = useApp()

  const handleRetakeFresh = () => {
    const latest = assessmentResult || assessmentHistory?.[assessmentHistory.length - 1] || null
    let weakTopics = []

    if (latest) {
      // 1. Weak topics from topicBreakdown (< 70% accuracy)
      const lowAccuracyTopics = (latest.topicBreakdown || [])
        .filter((t) => Number(t.percentage || 0) < 70)
        .map((t) => t.topic)

      // 2. Weak points identified in report
      const reportGaps = latest.reportData?.weakPoints || latest.reportData?.gaps || []

      // 3. Topics from wrong questions
      const storedQuestions = latest.questions || []
      const storedAnswers = latest.answers || {}
      const wrongQuestionTopics = storedQuestions
        .filter((q) => {
          const ans = storedAnswers[q.id]
          return !ans || String(ans).toUpperCase() !== String(q.correct_answer || q.answer || q.correctAnswer || '').toUpperCase()
        })
        .map((q) => q.subtopic || q.topic)

      weakTopics = [...new Set([...lowAccuracyTopics, ...reportGaps, ...wrongQuestionTopics].filter(Boolean))]
    }

    // Clear old test data and focus specifically on student's weak points
    setTestState((prev) => ({
      ...prev,
      questions: [],
      answers: {},
      score: 0,
      adaptiveState: null,
      retakeMode: true,
      focusTopics: weakTopics,
      startFresh: true,
    }))
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white">
          <RotateCcw size={24} />
        </div>
        <h2 className="mt-5 text-3xl font-semibold text-white">Retake or start a fresh assessment</h2>
        <p className="mt-3 text-slate-300">Choose the path that fits your learning goal.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link to="/start-test" onClick={handleRetakeFresh} className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left transition hover:border-sky-400/40">
            <div className="flex items-center gap-2 text-sky-300"><PlayCircle size={18} /> Retake current grade test</div>
            <p className="mt-3 text-sm text-slate-300">Start another round of the current grade-level diagnostic with different questions.</p>
          </Link>
          <Link to="/payment" className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-violet-500/10 p-5 text-left">
            <div className="flex items-center gap-2 text-sky-200"><Sparkles size={18} /> Start new test</div>
            <p className="mt-3 text-sm text-slate-300">Begin a fresh assessment for a different grade level or learning focus.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
