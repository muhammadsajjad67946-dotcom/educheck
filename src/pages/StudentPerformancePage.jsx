import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, BookOpenCheck, Trophy, UserRound, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ALL_TOPICS } from '../utils/scoring'
import { apiRequest } from '../utils/api'

export default function StudentPerformancePage() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { assessmentHistory, assessmentResult, user, darkMode } = useApp()
  const [fetchedAssessment, setFetchedAssessment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const inMemoryAssessment = useMemo(() => {
    if (!assessmentId) return null
    const entries = [...(assessmentHistory || [])]

    if (assessmentResult && !entries.some((entry) => String(entry?.submittedAt || entry?.id) === String(assessmentId))) {
      entries.push(assessmentResult)
    }

    return entries.find((entry) => String(entry?.submittedAt || entry?.id) === String(assessmentId)) || null
  }, [assessmentHistory, assessmentResult, assessmentId])

  // Fetch assessment from backend if not already in memory
  useEffect(() => {
    if (!assessmentId) return
    if (inMemoryAssessment) return

    setIsLoading(true)
    apiRequest(`/assessments/${assessmentId}`)
      .then((data) => {
        if (data && data.id) setFetchedAssessment(data)
      })
      .catch((err) => {
        console.warn('Failed to load assessment by id:', err?.message)
        if (user?.id) {
          apiRequest(`/assessments?studentId=${user.id}`)
            .then((items) => {
              const match = (items || []).find((a) => String(a.id) === String(assessmentId))
              if (match) setFetchedAssessment(match)
            })
            .catch(() => {})
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [assessmentId, inMemoryAssessment, user?.id])

  const selectedAssessment = inMemoryAssessment || fetchedAssessment

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

  if (isLoading) {
    return (
      <div className={`mx-auto max-w-5xl rounded-[2rem] border p-12 text-center backdrop-blur-xl transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/80 text-white' : 'border-slate-200 bg-white text-slate-900 shadow-xl'}`}>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-r-transparent mb-4" />
        <h2 className="text-xl font-bold">Loading student performance report...</h2>
        <p className="mt-2 text-sm text-slate-400">Fetching assessment metrics from database</p>
      </div>
    )
  }

  if (!selectedAssessment) {
    return (
      <div className={`mx-auto max-w-5xl rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
        <div className={`rounded-[1.5rem] border p-6 text-center ${darkMode ? 'border-white/10 bg-slate-900/60 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
          <h2 className={`text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No assessment selected</h2>
          <p className={`mt-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Choose a saved assessment to view the student performance details.</p>
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
  const rawAbility = selectedAssessment.estimatedGrade || selectedAssessment.level || (selectedAssessment.percentage ? (Number(selectedAssessment.percentage) / 20).toFixed(2) : '0.00')
  const irtAbility = typeof rawAbility === 'string' && rawAbility.startsWith('Level ') ? rawAbility.replace('Level ', '') : rawAbility

  return (
    <div className={`mx-auto max-w-6xl rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${darkMode ? 'border-white/10 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'}`}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <div className={`flex items-center gap-2 font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>
          <BarChart3 size={18} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Student Performance</span>
        </div>

        <h2 className={`mt-4 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Student Information</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={`rounded-2xl border p-4 transition-all ${darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><UserRound size={16} /> Student</div>
            <div className={`mt-3 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{studentName}</div>
          </div>
          <div className={`rounded-2xl border p-4 transition-all ${darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><BookOpenCheck size={16} /> Grade</div>
            <div className={`mt-3 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{studentGrade}</div>
          </div>
          <div className={`rounded-2xl border p-4 transition-all ${darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><CalendarDays size={16} /> Assessment Date</div>
            <div className={`mt-3 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{assessmentDate}</div>
          </div>
          <div className={`rounded-2xl border p-4 transition-all ${darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Trophy size={16} /> IRT Ability (θ)</div>
            <div className="mt-3 text-xl font-bold text-sky-600 dark:text-sky-400">θ = {irtAbility}</div>
          </div>
        </div>
      </div>

      <div className={`mt-8 rounded-[1.5rem] border p-6 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className={`flex items-center gap-2 font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>
            <BookOpenCheck size={20} />
            <span className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Mathematics Topics</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
            Overview
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicOptions.map((topic) => {
            const { stats } = topic
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            return (
              <div
                key={topic.name}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {topic.name}
                  </h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    pct >= 80
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                      : pct >= 50
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                  }`}>
                    {pct}%
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Accurate MCQs
                  </span>
                  <div className="text-sm font-semibold">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.correct}</span>
                    <span className="text-slate-400"> / {stats.total} MCQs</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
