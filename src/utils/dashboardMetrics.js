export function buildDashboardMetrics({
  assessments = [],
  payments = [],
  userGrade = 'Grade 6',
  fallbackAssessment = null,
} = {}) {
  const rawEntries = Array.isArray(assessments) ? assessments.filter(Boolean) : []

  const isExcludedStatus = (entry) => {
    const status = String(entry?.status || '').toLowerCase().trim()
    return status === 'abandoned' || status === 'in_progress'
  }

  const validEntries = rawEntries.filter((entry) => !isExcludedStatus(entry))
  const fallbackValid = fallbackAssessment && !isExcludedStatus(fallbackAssessment) ? fallbackAssessment : null

  const entries = validEntries.length > 0
    ? validEntries
    : (fallbackValid ? [fallbackValid] : [])

  const totalAssessments = entries.length

  const averageAccuracy = totalAssessments > 0
    ? Math.round(entries.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / totalAssessments)
    : (fallbackValid?.percentage != null ? Math.round(Number(fallbackValid.percentage)) : 0)

  const selectedGradeNumber = (() => {
    const match = String(userGrade || '').match(/Grade\s*(\d+)/i)
    return match ? Number(match[1]) : 6
  })()

  const latestEntry = entries[0] || fallbackValid
  const assessedGradeRaw = latestEntry?.estimated_grade ??
    latestEntry?.estimatedGrade ??
    latestEntry?.demonstratedMathLevel ??
    latestEntry?.reportData?.demonstratedMathLevel

  const parsedAssessedGrade = assessedGradeRaw != null && assessedGradeRaw !== '' ? Number(assessedGradeRaw) : null

  const currentGradeLevel = totalAssessments > 0
    ? (Number.isFinite(parsedAssessedGrade) && parsedAssessedGrade > 0
        ? Number(parsedAssessedGrade.toFixed(1))
        : Number((1 + (averageAccuracy / 100) * Math.max(0, selectedGradeNumber - 1)).toFixed(1)))
    : 0

  const paymentStatus = Array.isArray(payments) && payments.some((payment) => String(payment?.status || '').toLowerCase() === 'paid') ? 'paid' : 'pending'

  return {
    totalAssessments,
    averageAccuracy,
    currentGradeLevel,
    paymentStatus,
  }
}
