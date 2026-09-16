import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BarChart2,
  Binary,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Ruler,
  Shapes,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'
import { buildDashboardMetrics, parseGradeNumber } from '../utils/dashboardMetrics'

const strandOrder = [
  { name: 'Number & Operations', key: 'Number & Operations', icon: Calculator, color: 'from-sky-400 to-indigo-500', textLight: 'text-sky-400' },
  { name: 'Measurement', key: 'Measurement', icon: Ruler, color: 'from-amber-400 to-orange-500', textLight: 'text-amber-400' },
  { name: 'Data Analysis', key: 'Data Analysis', icon: BarChart2, color: 'from-rose-400 to-red-500', textLight: 'text-rose-400' },
  { name: 'Geometry', key: 'Geometry', icon: Shapes, color: 'from-emerald-400 to-teal-500', textLight: 'text-emerald-400' },
  { name: 'Algebra', key: 'Algebra', icon: Binary, color: 'from-purple-400 to-pink-500', textLight: 'text-purple-400' },
]

export default function Dashboard() {
  const { user, paymentStatus, assessmentResult, assessmentHistory, updateProfile, darkMode } = useApp()
  const [liveDashboardMetrics, setLiveDashboardMetrics] = useState({
    totalAssessments: 0,
    averageAccuracy: 0,
    currentGradeLevel: 0,
    paymentStatus: paymentStatus || 'pending',
  })
  const [liveAssessments, setLiveAssessments] = useState([])
  const [subscriptionActive, setSubscriptionActive] = useState(false)

  const effectivePaymentStatus = subscriptionActive || liveDashboardMetrics.paymentStatus === 'paid' || paymentStatus === 'paid' ? 'paid' : 'pending'
  const startAssessmentHref = effectivePaymentStatus === 'paid' ? '/start-test' : '/payment'

  useEffect(() => {
    if (!user?.id) {
      setLiveDashboardMetrics(buildDashboardMetrics({
        assessments: assessmentHistory || [],
        payments: [],
        userGrade: user?.grade || 'Grade 6',
        fallbackAssessment: assessmentResult || assessmentHistory?.[assessmentHistory.length - 1] || null,
        userName: user?.name,
      }))
      return
    }

    let isMounted = true

    Promise.all([
      apiRequest(`/assessments?studentId=${user.id}`),
      apiRequest(`/payments?studentId=${user.id}`),
      apiRequest(`/subscription/status?userId=${user.id}`),
      apiRequest(`/users/${user.id}/profile`).catch(() => null),
    ])
      .then(([assessmentResponse, paymentResponse, subscriptionResponse, profileResponse]) => {
        if (!isMounted) return

        const assessments = Array.isArray(assessmentResponse) ? assessmentResponse : []
        const payments = Array.isArray(paymentResponse) ? paymentResponse : paymentResponse?.value || paymentResponse?.rows || []
        setSubscriptionActive(Boolean(subscriptionResponse?.active))
        setLiveAssessments(assessments)

        const actualGrade = profileResponse?.grade || user.grade || 'Grade 1'
        if (profileResponse?.grade && profileResponse.grade !== user.grade) {
          updateProfile({ grade: profileResponse.grade })
        }

        const nextMetrics = buildDashboardMetrics({
          assessments,
          payments,
          userGrade: actualGrade,
          fallbackAssessment: assessmentResult || assessments[0] || assessmentHistory?.[assessmentHistory.length - 1] || null,
          userName: user?.name,
        })

        setLiveDashboardMetrics({
          ...nextMetrics,
          paymentStatus: nextMetrics.paymentStatus || paymentStatus || 'pending',
        })
      })
      .catch(() => {
        if (!isMounted) return

        setLiveDashboardMetrics(buildDashboardMetrics({
          assessments: assessmentHistory || [],
          payments: [],
          userGrade: user.grade || 'Grade 6',
          fallbackAssessment: assessmentResult || assessmentHistory?.[assessmentHistory.length - 1] || null,
          userName: user?.name,
        }))
      })

    return () => {
      isMounted = false
    }
  }, [assessmentHistory, assessmentResult, paymentStatus, updateProfile, user?.grade, user?.id, user?.name])

  const latestAssessment = useMemo(() => {
    if (assessmentResult) return assessmentResult
    const validLive = (liveAssessments || []).filter(
      (a) => !['abandoned', 'in_progress'].includes(String(a?.status || '').toLowerCase().trim())
    )
    if (validLive.length > 0) {
      const sortedLive = [...validLive].sort((a, b) => {
        const timeA = new Date(a.submittedAt || a.submitted_at || a.testDate || a.created_at || a.createdAt || 0).getTime() || Number(a.id || 0)
        const timeB = new Date(b.submittedAt || b.submitted_at || b.testDate || b.created_at || b.createdAt || 0).getTime() || Number(b.id || 0)
        return timeB - timeA
      })
      return sortedLive[0]
    }
    const validHistory = (assessmentHistory || []).filter(
      (a) => !['abandoned', 'in_progress'].includes(String(a?.status || '').toLowerCase().trim())
    )
    return validHistory[validHistory.length - 1] || null
  }, [assessmentHistory, assessmentResult, liveAssessments])

  const fallbackAverageAccuracy = useMemo(() => {
    const rawEntries = assessmentHistory.length ? assessmentHistory : assessmentResult ? [assessmentResult] : []
    const entries = rawEntries.filter(
      (e) => !['abandoned', 'in_progress'].includes(String(e?.status || '').toLowerCase().trim())
    )
    if (!entries.length) return 0
    const total = entries.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0)
    return Math.round(total / entries.length)
  }, [assessmentHistory, assessmentResult])

  const latestAccuracy = Number.isFinite(liveDashboardMetrics.latestAccuracy)
    ? liveDashboardMetrics.latestAccuracy
    : (latestAssessment?.percentage != null
        ? Math.round(Number(latestAssessment.percentage))
        : (assessmentResult?.percentage != null ? Math.round(Number(assessmentResult.percentage)) : fallbackAverageAccuracy))

  const totalAssessments = Number.isFinite(liveDashboardMetrics.totalAssessments) && liveDashboardMetrics.totalAssessments > 0
    ? liveDashboardMetrics.totalAssessments
    : assessmentHistory.length || (assessmentResult ? 1 : 0)

  const displayAccuracy = totalAssessments > 0 ? latestAccuracy : 0
  const averageAccuracy = Number.isFinite(liveDashboardMetrics.averageAccuracy) ? liveDashboardMetrics.averageAccuracy : fallbackAverageAccuracy

  const fallbackCurrentGradeLevel = useMemo(() => {
    const targetAssessment = assessmentResult || latestAssessment
    if (targetAssessment) {
      const raw = targetAssessment.demonstratedMathLevel ??
        targetAssessment.estimated_grade ??
        targetAssessment.estimatedGrade ??
        targetAssessment.reportData?.demonstratedMathLevel ??
        targetAssessment.reportData?.overallResult?.demonstratedMathLevel
      const parsed = parseGradeNumber(raw)
      if (Number.isFinite(parsed) && parsed > 0) return Number(parsed.toFixed(1))
    }

    const rawEntries = assessmentHistory.length ? assessmentHistory : assessmentResult ? [assessmentResult] : []
    const entries = rawEntries.filter(
      (e) => !['abandoned', 'in_progress'].includes(String(e?.status || '').toLowerCase().trim())
    )
    if (!entries.length) return 0

    for (let i = entries.length - 1; i >= 0; i--) {
      const entry = entries[i]
      const assessedGradeRaw = entry?.demonstratedMathLevel ??
        entry?.estimated_grade ??
        entry?.estimatedGrade ??
        entry?.reportData?.demonstratedMathLevel ??
        entry?.reportData?.overallResult?.demonstratedMathLevel
      const parsedAssessed = parseGradeNumber(assessedGradeRaw)
      if (Number.isFinite(parsedAssessed) && parsedAssessed > 0) return Number(parsedAssessed.toFixed(1))
    }

    const selectedGradeNumber = Number(String(user?.grade || '').match(/Grade\s*(\d+)/i)?.[1] || 1)
    const accuracy = displayAccuracy / 100
    return Number((1 + accuracy * Math.max(0, selectedGradeNumber - 1)).toFixed(1))
  }, [assessmentHistory, assessmentResult, displayAccuracy, latestAssessment, user?.grade])

  const currentGradeLevel = Number.isFinite(liveDashboardMetrics.currentGradeLevel) && liveDashboardMetrics.currentGradeLevel > 0
    ? liveDashboardMetrics.currentGradeLevel
    : fallbackCurrentGradeLevel

  const strandPerformance = useMemo(() => {
    const latestResult = latestAssessment || assessmentResult || null
    let detailedTopicScores = latestResult?.reportData?.topicWisePerformance
      ? latestResult.reportData.topicWisePerformance
      : latestResult?.topicBreakdown
        ? latestResult.topicBreakdown
        : []

    if (!detailedTopicScores.length && latestResult?.topic_breakdown) {
      detailedTopicScores = Array.isArray(latestResult.topic_breakdown)
        ? latestResult.topic_breakdown
        : []
    }

    const matchStrandScore = (scoreMap, strandKey) => {
      if (scoreMap[strandKey] !== undefined) return scoreMap[strandKey]
      const sLower = strandKey.toLowerCase()
      for (const [key, val] of Object.entries(scoreMap)) {
        const kLower = key.toLowerCase()
        if (kLower === sLower) return val
        if (sLower.includes('number') && kLower.includes('number')) return val
        if (sLower.includes('measure') && kLower.includes('measure')) return val
        if (sLower.includes('data') && (kLower.includes('data') || kLower.includes('statistic') || kLower.includes('probability'))) return val
        if (sLower.includes('geometry') && kLower.includes('geometry')) return val
        if (sLower.includes('algebra') && kLower.includes('algebra')) return val
      }
      return undefined
    }

    if (detailedTopicScores.length) {
      const scoreMap = {}
      detailedTopicScores.forEach((item) => {
        const topicName = item.topicName || item.topic || item.name || item.subject || ''
        const value = Number(item.masteryPercentage ?? item.percentage ?? item.score ?? 0)
        scoreMap[topicName] = value
      })

      return strandOrder.map((strand) => {
        const matched = matchStrandScore(scoreMap, strand.key) ?? matchStrandScore(scoreMap, strand.name)
        const computed = matched !== undefined ? Math.round(matched) : 0
        return { ...strand, value: `${computed}%`, percentage: computed }
      })
    }

    const validLive = (liveAssessments || []).filter(
      (a) => !['abandoned', 'in_progress'].includes(String(a?.status || '').toLowerCase().trim())
    )
    const validLocal = (assessmentHistory.length ? assessmentHistory : assessmentResult ? [assessmentResult] : []).filter(
      (a) => !['abandoned', 'in_progress'].includes(String(a?.status || '').toLowerCase().trim())
    )
    const entries = validLive.length ? validLive.map((entry) => ({
      percentage: Number(entry.percentage || 0),
      topicBreakdown: Array.isArray(entry.topicBreakdown) ? entry.topicBreakdown : (Array.isArray(entry.topic_breakdown) ? entry.topic_breakdown : []),
    })) : validLocal

    const totals = Object.fromEntries(strandOrder.map((strand) => [strand.key, { total: 0, sum: 0 }]))
    const hasDetailedBreakdown = entries.some((entry) => Array.isArray(entry.topicBreakdown) && entry.topicBreakdown.length > 0)

    if (!hasDetailedBreakdown) {
      const overallPercentage = entries.length
        ? Math.round(entries.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / entries.length)
        : Math.round(averageAccuracy)

      return strandOrder.map((strand) => ({ ...strand, value: `${overallPercentage}%`, percentage: overallPercentage }))
    }

    entries.forEach((entry) => {
      ;(entry.topicBreakdown || []).forEach((topic) => {
        const tName = topic.topic || topic.name || topic.topicName || ''
        const targetStrand = strandOrder.find((s) => {
          const sLower = s.key.toLowerCase()
          const tLower = tName.toLowerCase()
          return sLower === tLower ||
            (sLower.includes('number') && tLower.includes('number')) ||
            (sLower.includes('measure') && tLower.includes('measure')) ||
            (sLower.includes('data') && (tLower.includes('data') || tLower.includes('statistic'))) ||
            (sLower.includes('geometry') && tLower.includes('geometry')) ||
            (sLower.includes('algebra') && tLower.includes('algebra'))
        })
        const strandKey = targetStrand ? targetStrand.key : tName

        if (!totals[strandKey]) {
          totals[strandKey] = { total: 0, sum: 0 }
        }
        totals[strandKey].total += 1
        totals[strandKey].sum += Number(topic.percentage ?? topic.masteryPercentage ?? topic.score ?? 0)
      })
    })

    return strandOrder.map((strand) => {
      const record = totals[strand.key]
      const value = record && record.total ? Math.round(record.sum / record.total) : 0
      return { ...strand, value: `${value}%`, percentage: value }
    })
  }, [assessmentHistory, assessmentResult, averageAccuracy, displayAccuracy, latestAssessment, liveAssessments])

  const radius = 46
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, displayAccuracy))) / 100

  return (
    <div className="space-y-6">
      {/* 1. Header Hero Banner: Student Identity & Status */}
      <section className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all ${
        darkMode
          ? 'border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 text-white shadow-slate-950/50'
          : 'border-slate-200 bg-gradient-to-r from-white via-sky-50/40 to-white text-slate-900 shadow-slate-200/50'
      }`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-indigo-600 font-extrabold text-2xl text-white shadow-lg shadow-sky-500/25">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome, <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">{user?.name || 'Student'}</span> 👋
                </h1>
              </div>
              <p className={`mt-1 text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Adaptive Mathematics Diagnostic Assessment & Performance Portal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Grade Level Badge */}
            <div className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs font-semibold shadow-sm ${
              darkMode ? 'border-white/10 bg-slate-900/80 text-slate-200' : 'border-slate-200 bg-white text-slate-700'
            }`}>
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                <GraduationCap size={16} />
              </div>
              <div>
                <span className="text-[10px] block uppercase tracking-wider text-slate-400 leading-none">Curriculum</span>
                <span className="text-xs font-bold leading-tight">{user?.grade || 'Grade 4'}</span>
              </div>
            </div>

            {/* Access Status Badge */}
            <div className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2 text-xs font-semibold shadow-sm ${
              effectivePaymentStatus === 'paid'
                ? darkMode
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : darkMode
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}>
              <div className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                effectivePaymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {effectivePaymentStatus === 'paid' ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
              </div>
              <div>
                <span className="text-[10px] block uppercase tracking-wider opacity-75 leading-none">Access</span>
                <span className="text-xs font-bold leading-tight">
                  {effectivePaymentStatus === 'paid' ? '30-Day Active Pass' : 'Payment Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Primary Recommended Action (Direct sequence of what the student should do next) */}
      <section className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 shadow-xl transition-all ${
        darkMode
          ? 'border-sky-500/30 bg-gradient-to-br from-slate-900/90 via-sky-950/20 to-slate-950/90'
          : 'border-sky-200 bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/30'
      }`}>
        {effectivePaymentStatus === 'paid' ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wider">
                <Sparkles size={13} /> Recommended Next Step
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Ready to Start Your Diagnostic Assessment?
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-medium">
                <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border ${
                  darkMode ? 'bg-slate-800/80 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <Target size={13} className="text-cyan-500 dark:text-cyan-400" /> Instant Skill Diagnostic
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 border ${
                  darkMode ? 'bg-slate-800/80 border-white/5 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <TrendingUp size={13} className="text-emerald-500 dark:text-emerald-400" /> Subtopic Gap Analysis
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                to={startAssessmentHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-sky-500/40 active:scale-[0.98] cursor-pointer"
              >
                <span>Start Assessment Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                <Clock3 size={13} /> Enrollment Pending
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Unlock 30 Days of Unlimited Diagnostic Tests
              </h2>
            </div>

            <div className="shrink-0">
              <Link
                to="/payment"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-sky-500/40 active:scale-[0.98] cursor-pointer"
              >
                <span>Unlock Access</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 3. Performance & Diagnostic Metrics: 4 Graceful, Balanced Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`flex items-center gap-2 text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles size={17} className="text-cyan-500 dark:text-cyan-400" />
            Performance Overview
          </h2>
          {totalAssessments > 0 && (
            <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Based on {totalAssessments} completed {totalAssessments === 1 ? 'assessment' : 'assessments'}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Curriculum Grade */}
          <div className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 ${
            darkMode
              ? 'border-white/10 bg-slate-900/70 hover:border-sky-500/40 hover:bg-slate-900/90'
              : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-slate-200/60 shadow-slate-100'
          }`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <span className={`min-w-0 text-xs font-bold uppercase leading-tight tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Curriculum Grade</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-400 transition-transform duration-200 group-hover:scale-110">
                <GraduationCap size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {user?.grade || 'Grade 4'}
              </div>
              <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enrolled Standard Level</p>
            </div>
          </div>

          {/* Card 2: Assessed Skill Level */}
          <div className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 ${
            darkMode
              ? 'border-white/10 bg-slate-900/70 hover:border-violet-500/40 hover:bg-slate-900/90'
              : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-slate-200/60 shadow-slate-100'
          }`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <span className={`min-w-0 text-xs font-bold uppercase leading-tight tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Assessed Skill Level</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 dark:text-violet-400 transition-transform duration-200 group-hover:scale-110">
                <Award size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {totalAssessments > 0 ? `Grade ${currentGradeLevel.toFixed(1)}` : 'Pending'}
              </div>
              <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {totalAssessments > 0 ? 'Evaluated Benchmark' : 'Take test to evaluate'}
              </p>
            </div>
          </div>

          {/* Card 3: Assessments Completed */}
          <div className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 ${
            darkMode
              ? 'border-white/10 bg-slate-900/70 hover:border-emerald-500/40 hover:bg-slate-900/90'
              : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-slate-200/60 shadow-slate-100'
          }`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <span className={`min-w-0 text-xs font-bold uppercase leading-tight tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tests Completed</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {totalAssessments}
              </div>
              <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {totalAssessments === 1 ? '1 assessment finished' : `${totalAssessments} assessments finished`}
              </p>
            </div>
          </div>

          {/* Card 4: Overall Accuracy */}
          <div className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 ${
            darkMode
              ? 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
              : 'border-slate-200 bg-white hover:border-cyan-300 hover:shadow-slate-200/60 shadow-slate-100'
          }`}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <span className={`min-w-0 text-xs font-bold uppercase leading-tight tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Overall Accuracy</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 transition-transform duration-200 group-hover:scale-110">
                <Target size={20} />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {totalAssessments > 0 ? `${displayAccuracy}%` : '—'}
              </div>
              <p className={`mt-1 text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {totalAssessments > 0 ? 'Overall diagnostic score' : 'Calculated after test'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curriculum Strand Mastery Breakdown */}
      <section className={`rounded-3xl border p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all ${
        darkMode
          ? 'border-white/10 bg-slate-950/80'
          : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4 ${
          darkMode ? 'border-white/5' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Curriculum Strand Mastery</h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Diagnostic accuracy breakdown across the 5 core mathematics strands</p>
          </div>
          {totalAssessments > 0 ? (
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              darkMode ? 'bg-sky-500/10 border-sky-400/20 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-700'
            }`}>
              Live Diagnostic
            </span>
          ) : (
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
              darkMode ? 'bg-slate-800 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              Baseline Ready
            </span>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-center">
          {/* Circular Mastery Donut Chart */}
          <div className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center ${
            darkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-200/80 bg-slate-50/80'
          }`}>
            <div className="relative flex items-center justify-center">
              <svg className="h-40 w-40 -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)'}
                  strokeWidth="8"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="url(#masteryGradient)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="masteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {totalAssessments > 0 ? `${displayAccuracy}%` : '0%'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">Mastery</span>
              </div>
            </div>
            <p className={`mt-4 text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Overall Diagnostic Accuracy</p>
            <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Calibrated across answered strands</p>
          </div>

          {/* 5 Strand Progress Bars with Dedicated Icons */}
          <div className="space-y-3.5">
            {strandPerformance.map((strand) => {
              const numVal = strand.percentage ?? (parseInt(strand.value, 10) || 0)
              const StrandIcon = strand.icon || Sparkles
              return (
                <div
                  key={strand.name}
                  className={`group rounded-2xl border p-4 transition-all duration-200 ${
                    darkMode
                      ? 'border-white/5 bg-slate-900/50 hover:border-white/15 hover:bg-slate-900/80'
                      : 'border-slate-200/80 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        darkMode ? 'bg-white/5' : 'bg-white shadow-sm border border-slate-200/60'
                      } ${strand.textLight || 'text-sky-500'}`}>
                        <StrandIcon size={16} />
                      </div>
                      <span className={`text-sm font-semibold transition-colors ${
                        darkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>
                        {strand.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {totalAssessments > 0 ? strand.value : '0%'}
                      </span>
                    </div>
                  </div>
                  <div className={`h-2.5 w-full overflow-hidden rounded-full ${darkMode ? 'bg-slate-800/90' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${strand.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${totalAssessments > 0 ? Math.min(100, Math.max(0, numVal)) : 0}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {totalAssessments === 0 && (
          <div className={`mt-6 flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs ${
            darkMode ? 'border-sky-500/20 bg-sky-500/5 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700'
          }`}>
            <Sparkles size={15} className="shrink-0 text-sky-500" />
            <span>Complete your first diagnostic test to view your strand-by-strand skill diagnostic analysis here.</span>
          </div>
        )}
      </section>
    </div>
  )
}
