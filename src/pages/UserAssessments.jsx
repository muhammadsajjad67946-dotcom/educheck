import { useEffect, useState } from 'react'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function UserAssessments() {
  const { user } = useApp()
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const studentId = user?.id
    if (!studentId) {
      setError('Please sign in to view your assessment history.')
      setLoading(false)
      return
    }

    apiRequest(`/assessments?studentId=${studentId}`)
      .then((data) => setAssessments(Array.isArray(data) ? data : []))
      .catch((loadError) => setError(loadError.message || 'Unable to load your assessments.'))
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white">
          <BarChart3 size={22} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">My Assessments</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your assessment history</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading assessments...</div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-rose-500/30 bg-rose-500/10 p-8 text-rose-300">{error}</div>
      ) : assessments.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
            <CheckCircle2 size={22} />
          </div>
          <h2 className="text-xl font-semibold text-white">No assessment attempts found</h2>
          <p className="mt-2 text-slate-400">Your completed assessment records will appear here once you submit a test.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Attempt ID</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Correct</th>
                  <th className="px-6 py-4">Wrong</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((attempt) => (
                  <tr key={attempt.id} className="border-t border-white/10">
                    <td className="px-6 py-4 font-medium text-white">#{attempt.id}</td>
                    <td className="px-6 py-4 text-white">{Number(attempt.score || 0).toFixed(0)}</td>
                    <td className="px-6 py-4 text-cyan-300">{Number(attempt.percentage || 0)}%</td>
                    <td className="px-6 py-4 text-emerald-300">{Number(attempt.correct_answers || 0)}</td>
                    <td className="px-6 py-4 text-rose-300">{Number(attempt.wrong_answers || 0)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${attempt.status === 'submitted' ? 'bg-emerald-500/15 text-emerald-300' : attempt.status === 'in_progress' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}`}>
                        {attempt.status || 'submitted'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
