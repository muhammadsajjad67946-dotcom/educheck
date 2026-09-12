import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, BookOpenCheck, Trophy, UserRound, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ALL_TOPICS } from '../utils/scoring'

export default function StudentPerformancePage() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { assessmentHistory, assessmentResult, user } = useApp()

  const selectedAssessment = useMemo(() => {
    const entries = [...(assessmentHistory || [])]

    if (assessmentResult && !entries.some((entry) => String(entry?.submittedAt || entry?.id) === String(assessmentId))) {
      entries.push(assessmentResult)
    }

    return entries.find((entry) => String(entry?.submittedAt || entry?.id) === String(assessmentId)) || entries[entries.length - 1] || assessmentResult || null
  }, [assessmentHistory, assessmentResult, assessmentId])

  const topicBreakdown = useMemo(() => {
    if (!selectedAssessment) return []

    if (Array.isArray(selectedAssessment.topicBreakdown) && selectedAssessment.topicBreakdown.length > 0) {
      return selectedAssessment.topicBreakdown
    }

    const gradePerformance = selectedAssessment.reportData?.gradePerformance || []
    return gradePerformance.flatMap((grade) => {
      const topicScores = grade?.topicScores || {}
      return Object.entries(topicScores).map(([topicName, score]) => ({
        topic: topicName,
        total: Number(score?.total || 0),
        correct: Number(score?.correct || 0),
        wrong: Number(score?.wrong || 0),
        unanswered: Number(score?.unanswered || 0),
        percentage: Math.round(Number(score?.normalizedScore || 0) * 100),
      }))
    })
  }, [selectedAssessment])

  const topicOptions = useMemo(() => {
    const map = new Map((topicBreakdown || []).map((topic) => [topic.topic, topic]))

    return ALL_TOPICS.map((topicName) => ({
      name: topicName,
      stats: map.get(topicName) || {
        topic: topicName,
        total: 0,
        correct: 0,
        wrong: 0,
        unanswered: 0,
        percentage: 0,
      },
    }))
  }, [topicBreakdown])

  const [selectedTopic, setSelectedTopic] = useState(topicOptions[0]?.name || null)

  const activeTopic = topicOptions.find((topic) => topic.name === selectedTopic) || topicOptions[0] || null

  if (!selectedAssessment) {
    return (
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6 text-center text-slate-200">
          <h2 className="text-3xl font-semibold text-white">No assessment selected</h2>
          <p className="mt-3 text-slate-300">Choose a saved assessment to view the student performance details.</p>
        </div>
      </div>
    )
  }

  const studentName = selectedAssessment.studentName || selectedAssessment.name || selectedAssessment.reportData?.studentName || user?.name || 'Student'
  const studentGrade = selectedAssessment.grade || selectedAssessment.estimatedGrade || (selectedAssessment.reportData?.selectedGrade ? `Grade ${selectedAssessment.reportData.selectedGrade}` : user?.grade || 'Grade 1')
  const assessmentDate = selectedAssessment.submittedAt
    ? new Date(selectedAssessment.submittedAt).toLocaleDateString()
    : selectedAssessment.reportData?.testDate
      ? new Date(selectedAssessment.reportData.testDate).toLocaleDateString()
      : 'N/A'
  const overallScore = Number(selectedAssessment.percentage ?? selectedAssessment.score ?? selectedAssessment.reportData?.overallResult?.finalCumulativeScore ?? 0)

  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800/60"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center gap-2 text-sky-300">
          <BarChart3 size={18} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Student Performance</span>
        </div>

        <h2 className="mt-4 text-3xl font-semibold text-white">Student Information</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400"><UserRound size={16} /> Student</div>
            <div className="mt-3 text-xl font-bold text-white">{studentName}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400"><BookOpenCheck size={16} /> Grade</div>
            <div className="mt-3 text-xl font-bold text-white">{studentGrade}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400"><CalendarDays size={16} /> Assessment Date</div>
            <div className="mt-3 text-xl font-bold text-white">{assessmentDate}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-400"><Trophy size={16} /> Overall Score</div>
            <div className="mt-3 text-xl font-bold text-white">{overallScore}%</div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-6">
        <div className="mb-5 flex items-center gap-2 text-sky-300">
          <BookOpenCheck size={18} />
          <span className="text-lg font-semibold text-white">Mathematics Topics</span>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {topicOptions.map((topic) => {
            const isActive = activeTopic?.name === topic.name

            return (
              <button
                key={topic.name}
                type="button"
                onClick={() => setSelectedTopic(topic.name)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {topic.name}
              </button>
            )
          })}
        </div>

        {activeTopic && (
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold text-white">{activeTopic.name}</h3>
              <span className="rounded-full bg-sky-500/15 px-3 py-1 text-sm font-semibold text-sky-200">{activeTopic.stats.percentage}%</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-sm text-slate-400">Correct</div>
                <div className="mt-2 text-2xl font-bold text-emerald-300">{activeTopic.stats.correct}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-sm text-slate-400">Wrong</div>
                <div className="mt-2 text-2xl font-bold text-red-300">{activeTopic.stats.wrong}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-sm text-slate-400">Unanswered</div>
                <div className="mt-2 text-2xl font-bold text-amber-300">{activeTopic.stats.unanswered}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-sm text-slate-400">Total</div>
                <div className="mt-2 text-2xl font-bold text-sky-300">{activeTopic.stats.total}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                <span>Topic performance</span>
                <span className="font-semibold text-white">{activeTopic.stats.percentage}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
                  style={{ width: `${Math.min(100, Math.max(0, activeTopic.stats.percentage))}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
