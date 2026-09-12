import { useEffect, useState } from 'react'
import { BarChart3, Award, Users, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../utils/api'

function PerformanceTrendChart({ trend, darkMode }) {
  const chartWidth = Math.max(680, trend.length * 90)
  const chartHeight = 260
  const padding = { top: 24, right: 24, bottom: 48, left: 42 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom
  const points = trend.map((entry, index) => ({
    ...entry,
    x: trend.length === 1 ? padding.left + plotWidth / 2 : padding.left + (index * plotWidth) / (trend.length - 1),
    y: padding.top + ((100 - Math.min(100, Math.max(0, entry.score))) / 100) * plotHeight,
  }))
  const line = points.map((point) => `${point.x},${point.y}`).join(' ')
  const gridLineColor = darkMode ? '#334155' : '#e2e8f0'
  const textColor = darkMode ? '#94a3b8' : '#64748b'

  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <div style={{ minWidth: `${chartWidth}px` }}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-auto w-full" role="img" aria-label="Assessment performance trend">
          {[0, 25, 50, 75, 100].map((value) => {
            const y = padding.top + ((100 - value) / 100) * plotHeight

            return (
              <g key={value}>
                <line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} stroke={gridLineColor} strokeDasharray="4 5" />
                <text x={padding.left - 10} y={y + 4} textAnchor="end" fill={textColor} className="text-[11px] font-medium">
                  {value}%
                </text>
              </g>
            )
          })}
          <polyline points={line} fill="none" stroke="#0ea5e9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => (
            <g key={point.id}>
              <title>{`${point.label}: ${point.score}% - ${point.topics}`}</title>
              <circle cx={point.x} cy={point.y} r="6" fill={darkMode ? '#0f172a' : '#ffffff'} stroke="#0ea5e9" strokeWidth="3" />
              <text x={point.x} y={point.y - 13} textAnchor="middle" fill={darkMode ? '#f8fafc' : '#1e293b'} className="text-[11px] font-bold">
                {point.score}%
              </text>
            </g>
          ))}
        </svg>
        <div className="grid grid-flow-col auto-cols-[90px] justify-between gap-0 px-8">
          {points.map((point) => (
            <div key={point.id} className="min-w-0 text-center">
              <p className={`truncate text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} title={`Attempt #${point.id}`}>
                {point.label}
              </p>
              <p className={`mt-1 truncate text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} title={point.topics}>
                {point.topics}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TopicWaveChart({ topics, darkMode }) {
  const chartWidth = 700
  const chartHeight = 280
  const padding = { top: 24, right: 20, bottom: 58, left: 42 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom
  const y = (value) => padding.top + ((100 - value) / 100) * plotHeight
  const points = topics.map((topic, index) => ({
    ...topic,
    score: Number(topic.close || 0),
    x: topics.length === 1 ? padding.left + plotWidth / 2 : padding.left + (index * plotWidth) / (topics.length - 1),
    y: y(Number(topic.close || 0)),
  }))
  const wavePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const midpoint = (previous.x + point.x) / 2
    return `${path} C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`
  }, '')
  const areaPath = points.length ? `${wavePath} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z` : ''
  const gridLineColor = darkMode ? '#334155' : '#e2e8f0'
  const textColor = darkMode ? '#94a3b8' : '#64748b'

  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="min-w-[620px] w-full" role="img" aria-label="Performance percentage by topic">
        {[0, 25, 50, 75, 100].map((value) => (
          <g key={value}>
            <line x1={padding.left} x2={chartWidth - padding.right} y1={y(value)} y2={y(value)} stroke={gridLineColor} strokeDasharray="4 5" />
            <text x={padding.left - 8} y={y(value) + 4} textAnchor="end" fill={textColor} className="text-[11px] font-medium">
              {value}%
            </text>
          </g>
        ))}
        <path d={areaPath} fill="#0284c7" fillOpacity={darkMode ? '0.2' : '0.1'} />
        <path d={wavePath} fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
        {points.map((point) => {
          return (
            <g key={point.topic}>
              <title>{`${point.topic}: latest ${point.score}%, range ${point.low}% - ${point.high}% across ${point.assessments} test${point.assessments === 1 ? '' : 's'}`}</title>
              <circle cx={point.x} cy={point.y} r="6" fill={darkMode ? '#0f172a' : '#ffffff'} stroke="#0ea5e9" strokeWidth="3" />
              <text x={point.x} y={point.y - 12} textAnchor="middle" fill={darkMode ? '#f8fafc' : '#1e293b'} className="text-[11px] font-bold">
                {point.score}%
              </text>
              <text x={point.x} y={chartHeight - 32} textAnchor="middle" fill={darkMode ? '#e2e8f0' : '#1e293b'} className="text-[11px] font-semibold">
                {point.topic}
              </text>
              <text x={point.x} y={chartHeight - 16} textAnchor="middle" fill={textColor} className="text-[10px]">
                {point.assessments} tests
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function AdminAnalytics() {
  const { darkMode } = useApp()
  const [analytics, setAnalytics] = useState({ stats: {}, trend: [], topicCandles: [] })
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiRequest('/admin/analytics')
      .then(setAnalytics)
      .catch((error) => setLoadError(error.message || 'Unable to load analytics data.'))
  }, [])

  const { stats, trend, topicCandles } = analytics

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Analytics & Insights
        </h1>
        <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Comprehensive diagnostic trends and learning mastery analytics
        </p>
        {loadError && <p className="mt-2 text-sm font-medium text-red-500">{loadError}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Assessments', stats.assessments || 0, BarChart3, 'bg-sky-500/10 text-sky-400 border-sky-500/30'],
          ['Average Score', `${stats.averageScore || 0}%`, TrendingUp, 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'],
          ['Highest Score', `${stats.highestScore || 0}%`, Award, 'bg-amber-500/10 text-amber-400 border-amber-500/30'],
          ['Students Tested', stats.studentsTested || 0, Users, 'bg-violet-500/10 text-violet-400 border-violet-500/30'],
        ].map(([label, value, Icon, badgeStyle]) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 ${
              darkMode ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className={`inline-flex p-2.5 rounded-xl border ${badgeStyle}`}>
              <Icon size={20} />
            </div>
            <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {label}
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            darkMode ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          <h2 className="text-lg font-bold tracking-tight">Performance Trend</h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sequential assessment score trajectory</p>
          {trend.length === 0 ? (
            <p className={`mt-8 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No assessment data available yet.
            </p>
          ) : (
            <PerformanceTrendChart trend={trend} darkMode={darkMode} />
          )}
        </div>
        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            darkMode ? 'border-slate-800 bg-slate-900/80 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          <h2 className="text-lg font-bold tracking-tight">Performance by Topic</h2>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Score distribution across 5 core Math strands</p>
          {topicCandles.length === 0 ? (
            <p className={`mt-8 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              No topic data available yet.
            </p>
          ) : (
            <TopicWaveChart topics={topicCandles} darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  )
}
