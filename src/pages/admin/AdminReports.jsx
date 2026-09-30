import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Download, Trash2 } from 'lucide-react'
import { apiRequest } from '../../utils/api'

export default function AdminReports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterGrade, setFilterGrade] = useState('All')
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({ total: 0, averageScore: 0, completionRate: 0, thisMonth: 0 })
  const [error, setError] = useState('')

  const loadReports = () => apiRequest('/admin/reports').then((data) => { setReports(data.reports); setStats(data.stats) }).catch((loadError) => setError(loadError.message))
  useEffect(() => { loadReports() }, [])

  const deleteReport = async (report) => {
    if (!window.confirm(`Delete the report for ${report.student}?`)) return
    setError('')
    try {
      await apiRequest(`/admin/reports/${report.id}`, { method: 'DELETE' })
      setReports((previous) => previous.filter((item) => item.id !== report.id))
      setStats((previous) => ({ ...previous, total: Math.max(0, previous.total - 1) }))
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete report.')
    }
  }

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.student.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === 'All' || r.subject === filterSubject
    const matchesGrade = filterGrade === 'All' || r.grade === filterGrade
    return matchesSearch && matchesSubject && matchesGrade
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Submissions & Reports</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">View detailed student assessment submissions and performance reports</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Assessments</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{reports.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg. Score</p>
          <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
            {stats.averageScore}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Completion Rate</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completionRate}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">This Month</p>
          <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.thisMonth}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Subjects</option>
            <option>Math</option>
            <option>Science</option>
            <option>English</option>
            <option>Computer</option>
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Grades</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden backdrop-blur-sm">
        {error && <p className="border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-6 py-3 text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">IRT Ability (θ)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accurate MCQs</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xs font-bold shadow-sm">
                        {report.student.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{report.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{report.subject}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">{report.grade}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                      θ = {report.level && report.level !== 'N/A' ? report.level : (report.score ? (report.score / 20).toFixed(2) : '0.00')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{report.correct}</span>
                    <span className="text-slate-400"> / {Number(report.correct || 0) + Number(report.wrong || 0)}</span>
                    <span className="ml-1 text-xs text-slate-400 font-medium">MCQs</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/student-performance/${report.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-500 hover:text-sky-400 hover:bg-sky-500/10 transition"
                      >
                        View Report
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteReport(report)}
                        className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition"
                        title="Delete report"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
