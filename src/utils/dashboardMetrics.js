export function buildDashboardMetrics({
  assessments = [],
  payments = [],
  userGrade = 'Grade 6',
  fallbackAssessment = null,
} = {}) {
  const entries = Array.isArray(assessments) ? assessments.filter(Boolean) : []
  const totalAssessments = entries.length || (fallbackAssessment ? 1 : 0)

  const averageAccuracy = entries.length
    ? Math.round(entries.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / entries.length)
    : Number(fallbackAssessment?.percentage || 0)

  const selectedGradeNumber = (() => {
    const match = String(userGrade || '').match(/Grade\s*(\d+)/i)
    return match ? Number(match[1]) : 6
  })()

  const currentGradeLevel = totalAssessments
    ? Number((1 + (averageAccuracy / 100) * Math.max(0, selectedGradeNumber - 1)).toFixed(1))
    : 0
  const paymentStatus = Array.isArray(payments) && payments.some((payment) => String(payment?.status || '').toLowerCase() === 'paid') ? 'paid' : 'pending'

  return {
    totalAssessments,
    averageAccuracy,
    currentGradeLevel,
    paymentStatus,
  }
}
