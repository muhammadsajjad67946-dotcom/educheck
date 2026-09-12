import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  BookOpen,
  Award,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Sparkles,
  ArrowRight,
  Layers3,
  Activity,
  TrendingUp,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../utils/api'
import { TopicWaveChart } from './AdminAnalytics'

// Statistics Card Component
function StatCard({ icon: Icon, label, value, change, isPositive, color, subtitle, darkMode }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        darkMode
          ? 'border-slate-800/90 bg-slate-900/80 text-white shadow-black/40 hover:border-slate-700'
          : 'border-slate-200/90 bg-white text-slate-900 shadow-slate-200/50 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={22} />
        </div>
        {change !== null && change !== undefined ? (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}%
          </div>
        ) : (
          <span
            className={`h-2 w-2 rounded-full ${
              darkMode ? 'bg-slate-700 group-hover:bg-sky-400' : 'bg-slate-200 group-hover:bg-sky-500'
            } transition-colors`}
          />
        )}
      </div>

      <div className="mt-4">
        <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </p>
        <p className={`mt-1 text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className={`mt-1 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// Quick Action Button
function QuickActionBtn({ icon: Icon, label, description, onClick, accent = 'sky', darkMode }) {
  const accentStyles = {
    sky: 'from-sky-500 to-cyan-600 text-white shadow-sky-500/25',
    purple: 'from-violet-500 to-indigo-600 text-white shadow-purple-500/25',
    emerald: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    slate: 'from-slate-700 to-slate-900 text-white shadow-slate-700/25',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        darkMode
          ? 'border-slate-800/90 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-slate-200/50'
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accentStyles[accent]} shadow-md transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-base font-bold transition-colors group-hover:text-sky-400 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          {label}
        </p>
        {description && (
          <p className={`text-xs truncate mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {description}
          </p>
        )}
      </div>
    </button>
  )
}

// Chart Component
function PerformanceChart({ trend = [], darkMode }) {
  const maxValue = Math.max(...trend.map((entry) => entry.value), 1)
  const chartWidth = 640
  const chartHeight = 260
  const chartLeft = 44
  const chartRight = 16
  const chartTop = 18
  const chartBottom = 42
  const plotWidth = chartWidth - chartLeft - chartRight
  const plotHeight = chartHeight - chartTop - chartBottom
  const points = trend.map((entry, index) => ({
    x: trend.length === 1 ? chartLeft + plotWidth / 2 : chartLeft + (index / (trend.length - 1)) * plotWidth,
    y: chartTop + plotHeight - (entry.value / maxValue) * plotHeight,
    ...entry,
  }))
  const pointString = points.map((point) => `${point.x},${point.y}`).join(' ')
  const formatDate = (value) => {
    if (!value) return ''
    try {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    } catch {
      // ignore
    }
    return String(value).slice(0, 10)
  }

  const gridLineColor = darkMode ? '#334155' : '#e2e8f0'
  const textColor = darkMode ? '#94a3b8' : '#64748b'

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition-colors ${
        darkMode ? 'border-slate-800/90 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Diagnostic Test Frequency</h3>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Volume of student assessments over time</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
          <Activity size={16} /> Live Trend
        </div>
      </div>

      {trend.length === 0 ? (
        <div
          className={`flex h-64 items-center justify-center rounded-xl border border-dashed text-sm ${
            darkMode
              ? 'border-slate-800 bg-slate-950/40 text-slate-500'
              : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          No assessment trend data available yet.
        </div>
      ) : (
        <div className="relative h-64 w-full">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" role="img" aria-label="Test frequency over time">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartTop + plotHeight * (1 - ratio)
              const tick = Math.round(maxValue * ratio)

              return (
                <g key={ratio}>
                  <line x1={chartLeft} x2={chartWidth - chartRight} y1={y} y2={y} stroke={gridLineColor} strokeDasharray="5 6" />
                  <text x={chartLeft - 10} y={y + 4} textAnchor="end" fill={textColor} className="text-[11px] font-medium">
                    {tick}
                  </text>
                </g>
              )
            })}
            <polyline
              points={pointString}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point) => (
              <g key={point.label}>
                <title>{`${point.value} test${point.value === 1 ? '' : 's'} on ${formatDate(point.label)}`}</title>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={darkMode ? '#0f172a' : '#ffffff'}
                  stroke="#0ea5e9"
                  strokeWidth="3.5"
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  fill={darkMode ? '#f8fafc' : '#1e293b'}
                  className="text-[11px] font-bold"
                >
                  {point.value}
                </text>
                <text
                  x={point.x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fill={textColor}
                  className="text-[11px]"
                >
                  {formatDate(point.label)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}

// Recent Tests Table
function RecentTestsTable({ assessments = [], darkMode }) {
  const localRows = useMemo(
    () =>
      assessments
        .map((item, index) => ({
          id: item?.id || `${item?.student || 'student'}-${index}`,
          student: item?.student || 'Student',
          subject: 'Mathematics',
          grade: item?.grade || 'N/A',
          score: item?.score ?? 0,
          status: item?.status || 'Needs Work',
          date: item?.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Recently',
        }))
        .slice(0, 6),
    [assessments],
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
      case 'Good':
        return 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
      case 'Average':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
      case 'Needs Work':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
    }
  }

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm transition-colors ${
        darkMode ? 'border-slate-800/90 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Recent Student Assessments</h3>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live diagnostic submissions from students</p>
        </div>
        <a
          href="/admin/reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
        >
          View All Submissions <ArrowRight size={14} />
        </a>
      </div>

      {localRows.length === 0 ? (
        <div
          className={`rounded-xl border border-dashed px-4 py-10 text-center text-sm ${
            darkMode
              ? 'border-slate-800 bg-slate-950/40 text-slate-500'
              : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          No recent assessments yet. Student submissions will appear here automatically.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b text-xs uppercase tracking-wider font-bold ${
                darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm ${darkMode ? 'divide-slate-800/80' : 'divide-slate-100'}`}>
              {localRows.map((test) => (
                <tr
                  key={test.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-slate-850/60 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white text-xs font-bold shadow-sm">
                        {test.student.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {test.student}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium">{test.subject}</td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-sky-400">{test.grade}</td>
                  <td className="px-4 py-3.5 font-bold">{test.score}%</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(test.status)}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3.5 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {test.date}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to={`/student-performance/${encodeURIComponent(test.id)}`}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-sky-400 hover:bg-sky-500/10 transition"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { darkMode } = useApp()
  const [dashboardData, setDashboardData] = useState({ stats: null, payments: [], assessments: [], topicCandles: [] })
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([apiRequest('/admin/dashboard'), apiRequest('/admin/analytics')])
      .then(([dashboard, analytics]) => setDashboardData({ ...dashboard, topicCandles: analytics.topicCandles || [] }))
      .catch((error) => setLoadError(error.message || 'Unable to load dashboard data.'))
  }, [])

  const stats = useMemo(() => {
    const databaseStats = dashboardData.stats || {}

    return {
      students: { value: databaseStats.students || 0, change: null, isPositive: true },
      questions: { value: databaseStats.questions || 0, change: null, isPositive: true },
      tests: { value: databaseStats.tests || 0, change: null, isPositive: true },
      avgScore: { value: databaseStats.averageScore || 0, change: null, isPositive: true },
      revenue: { value: databaseStats.revenue || 0, change: null, isPositive: true },
    }
  }, [dashboardData.stats])

  return (
    <div className="space-y-8 pb-10">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-xl border border-white/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Engine Status
            </div>
            <h1 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-white">
              Admin Command Center 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Real-time diagnostic analytics & student performance overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/admin/reports')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-[1.01]"
            >
              <BarChart3 size={15} /> Reports
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/questions')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:scale-[1.02] hover:shadow-sky-500/40"
            >
              <FileText size={15} /> Question Bank
            </button>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
          {loadError}
        </div>
      )}

      {/* Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-base font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
            Platform Core Metrics
          </h2>
          <span className="text-xs font-semibold text-sky-400">Updated Real-Time</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={Users}
            label="Total Students"
            value={stats.students.value}
            subtitle="Registered learners"
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={BookOpen}
            label="Total Questions"
            value={stats.questions.value}
            subtitle="Across 5 math strands"
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={Award}
            label="Completed Tests"
            value={stats.tests.value}
            subtitle="Diagnostic attempts"
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={BarChart3}
            label="Avg. Score"
            value={`${stats.avgScore.value}%`}
            subtitle="Overall proficiency"
            color="bg-gradient-to-br from-amber-500 to-orange-600"
            darkMode={darkMode}
          />
          <StatCard
            icon={DollarSign}
            label="Revenue"
            value={`PKR ${Number(stats.revenue.value || 0).toLocaleString()}`}
            subtitle="Subscription billing"
            color="bg-gradient-to-br from-rose-500 to-pink-600"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className={`mb-4 text-base font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
          Quick Actions & Management
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionBtn
            icon={Users}
            label="Students"
            description="Manage learners & grades"
            accent="sky"
            onClick={() => navigate('/admin/students')}
            darkMode={darkMode}
          />
          <QuickActionBtn
            icon={Layers3}
            label="Curriculum Topics"
            description="5 Strands & 184 Subtopics"
            accent="purple"
            onClick={() => navigate('/admin/topics')}
            darkMode={darkMode}
          />
          <QuickActionBtn
            icon={FileText}
            label="Question Bank"
            description="Calibrate 655 MCQs"
            accent="emerald"
            onClick={() => navigate('/admin/questions')}
            darkMode={darkMode}
          />
          <QuickActionBtn
            icon={BarChart3}
            label="Analytics & Reports"
            description="Diagnostic gap audits"
            accent="slate"
            onClick={() => navigate('/admin/reports')}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart trend={dashboardData.performanceTrend || []} darkMode={darkMode} />
        </div>
        <div
          className={`rounded-2xl border p-6 shadow-sm transition-colors ${
            darkMode ? 'border-slate-800/90 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold tracking-tight">Performance by Topic</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Average student accuracy across 5 math topics
            </p>
          </div>
          {dashboardData.topicCandles.length === 0 ? (
            <p className={`mt-8 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No topic performance data available yet.
            </p>
          ) : (
            <TopicWaveChart topics={dashboardData.topicCandles} darkMode={darkMode} />
          )}
        </div>
      </div>

      {/* Recent Tests Table */}
      <RecentTestsTable assessments={dashboardData.assessments} darkMode={darkMode} />
    </div>
  )
}
