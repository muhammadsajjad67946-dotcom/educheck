import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, BookOpenCheck, Trophy, UserRound, BarChart3 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ALL_TOPICS } from '../utils/scoring'

export default function StudentPerformancePage() {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const { assessmentHistory, assessmentResult, user, darkMode } = useApp()

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
  const overallScore = Number(selectedAssessment.percentage ?? selectedAssessment.score ?? selectedAssessment.reportData?.overallResult?.finalCumulativeScore ?? 0)

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
            <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Trophy size={16} /> Overall Score</div>
            <div className={`mt-3 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{overallScore}%</div>
          </div>
        </div>
      </div>

      <div className={`mt-8 rounded-[1.5rem] border p-6 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <div className={`mb-5 flex items-center gap-2 font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>
          <BookOpenCheck size={18} />
          <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Mathematics Topics</span>
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
                    ? darkMode
                      ? 'border-sky-400 bg-sky-500/20 text-sky-200'
                      : 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-400/20 shadow-sm'
                    : darkMode
                      ? 'border-white/10 bg-slate-800/60 text-slate-300 hover:bg-white/10'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {topic.name}
              </button>
            )
          })}
        </div>

        {activeTopic && (
          <div className={`rounded-[1.5rem] border p-6 transition-all ${darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeTopic.name}</h3>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${darkMode ? 'bg-sky-500/15 text-sky-200' : 'bg-sky-100 text-sky-800 border border-sky-200'}`}>{activeTopic.stats.percentage}%</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className={`rounded-2xl border p-4 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Correct</div>
                <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{activeTopic.stats.correct}</div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Wrong</div>
                <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-red-300' : 'text-rose-600'}`}>{activeTopic.stats.wrong}</div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Unanswered</div>
                <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-amber-300' : 'text-amber-600'}`}>{activeTopic.stats.unanswered}</div>
              </div>
              <div className={`rounded-2xl border p-4 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total</div>
                <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>{activeTopic.stats.total}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className={`mb-2 flex items-center justify-between text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <span className="font-medium">Topic performance</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeTopic.stats.percentage}%</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
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
