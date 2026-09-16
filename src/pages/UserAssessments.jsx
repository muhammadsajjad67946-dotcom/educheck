import { useEffect, useState } from 'react'
import { BarChart3, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function UserAssessments() {
  const { user, darkMode } = useApp()
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
    <div className={`mx-auto max-w-6xl rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-md">
          <BarChart3 size={22} />
        </div>
        <div>
          <p className={`text-sm uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>My Assessments</p>
          <h1 className={`mt-2 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your assessment history</h1>
        </div>
      </div>

      {loading ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>Loading assessments...</div>
      ) : error ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{error}</div>
      ) : assessments.length === 0 ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'bg-slate-800 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
            <CheckCircle2 size={22} />
          </div>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No assessment attempts found</h2>
          <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your completed assessment records will appear here once you submit a test.</p>
        </div>
      ) : (
        <div className={`overflow-hidden rounded-[1.5rem] border ${darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-left text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <thead className={`text-xs uppercase tracking-[0.2em] font-semibold ${darkMode ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-50 text-slate-600 border-b border-slate-200'}`}>
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
                  <tr key={attempt.id} className={`border-t transition-colors ${darkMode ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50/80'}`}>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>#{attempt.id}</td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-slate-900 font-medium'}`}>{Number(attempt.score || 0).toFixed(0)}</td>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>{Number(attempt.percentage || 0)}%</td>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{Number(attempt.correct_answers || 0)}</td>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-rose-300' : 'text-rose-600'}`}>{Number(attempt.wrong_answers || 0)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        attempt.status === 'submitted'
                          ? darkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : attempt.status === 'in_progress'
                            ? darkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100 text-amber-800 border border-amber-200'
                            : darkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {attempt.status || 'submitted'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : 'N/A'}</td>
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
