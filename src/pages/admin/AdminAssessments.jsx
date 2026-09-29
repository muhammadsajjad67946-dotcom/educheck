import { useEffect, useState } from 'react'
import { ClipboardList, Plus, Users, Award, Calendar, CheckCircle2 } from 'lucide-react'
import { apiRequest } from '../../utils/api'

const ASSESSMENTS_KEY = 'educheck_assessments'

const DEFAULT_ASSESSMENTS = [
  { id: 1, title: 'Adaptive Diagnostic Math Assessment', grade: 'Grade 1-8', duration: '45', status: 'Published', createdAt: '2026-01-01' },
  { id: 2, title: 'Foundational Arithmetic Screener', grade: 'Grade 1-4', duration: '30', status: 'Published', createdAt: '2026-01-15' },
  { id: 3, title: 'Algebra & Geometry Readiness Test', grade: 'Grade 6-8', duration: '40', status: 'Draft', createdAt: '2026-02-01' },
]

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState(() => {
    try {
      const stored = localStorage.getItem(ASSESSMENTS_KEY)
      return stored ? JSON.parse(stored) : DEFAULT_ASSESSMENTS
    } catch {
      return DEFAULT_ASSESSMENTS
    }
  })
  const [recentAttempts, setRecentAttempts] = useState([])
  const [attemptStats, setAttemptStats] = useState({ total: 0, averageScore: 0, completionRate: 0 })
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', grade: 'Grade 5', duration: '30', status: 'Draft' })

  useEffect(() => {
    let isMounted = true
    setIsLoadingAttempts(true)
    apiRequest('/admin/reports')
      .then((data) => {
        if (!isMounted) return
        setRecentAttempts(data.reports || [])
        setAttemptStats(data.stats || { total: 0, averageScore: 0, completionRate: 0 })
      })
      .catch((err) => {
        console.error('Failed to load assessment attempts from DB:', err)
      })
      .finally(() => {
        if (isMounted) setIsLoadingAttempts(false)
      })
    return () => { isMounted = false }
  }, [])

  const saveAssessment = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const next = [...assessments, { id: Date.now(), ...form, title: form.title.trim(), createdAt: new Date().toISOString() }]
    setAssessments(next)
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(next))
    setForm({ title: '', grade: 'Grade 5', duration: '30', status: 'Draft' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assessments</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Create, configure, and monitor adaptive assessments & live attempts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition"
        >
          <Plus size={19} /> Create Assessment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Configured Tests</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <ClipboardList size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{assessments.length}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {assessments.filter((a) => a.status === 'Published').length} Published · {assessments.filter((a) => a.status === 'Draft').length} Drafts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed Attempts (DB)</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {isLoadingAttempts ? '...' : attemptStats.total || recentAttempts.length}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Real student submissions from database
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg. Score</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            {isLoadingAttempts ? '...' : `${attemptStats.averageScore || 0}%`}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {attemptStats.completionRate || 0}% completion rate
          </p>
        </div>
      </div>

      {/* Configured Assessments Section */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configured Assessments</h2>
        </div>
        {assessments.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No assessments configured. Create the first assessment above.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {assessments.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.grade} · {item.duration} minutes
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'Published'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Attempts (Real DB Data) */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Student Attempts (Live Database)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real tests completed and recorded in MySQL</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
            <CheckCircle2 size={13} />
            Live Sync
          </span>
        </div>

        {isLoadingAttempts ? (
          <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading assessment attempts from database...
          </div>
        ) : recentAttempts.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Student attempts will appear here after tests are submitted in the database.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentAttempts.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.student || 'Student'}</p>
                    {item.email && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">({item.email})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{item.subject || 'Math'}</span>
                    <span>·</span>
                    <span>Level: {item.level || item.grade || 'N/A'}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {item.date || (item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recent')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        Number(item.score || 0) >= 80
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                          : Number(item.score || 0) >= 60
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50'
                      }`}
                    >
                      {Number(item.score || 0)}%
                    </span>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      {item.correct || 0} / {(item.correct || 0) + (item.wrong || 0) + (item.unanswered || 0)} correct
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={saveAssessment}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Assessment</h2>
            <input
              required
              placeholder="Assessment title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <select
                value={form.grade}
                onChange={(event) => setForm({ ...form, grade: event.target.value })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                  <option key={grade} value={`Grade ${grade}`}>
                    Grade {grade}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="5"
                placeholder="Duration (mins)"
                value={form.duration}
                onChange={(event) => setForm({ ...form, duration: event.target.value })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none"
              />
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white hover:bg-sky-500 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
