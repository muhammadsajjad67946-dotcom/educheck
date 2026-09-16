export function parseGradeNumber(val) {
  if (val == null || val === '') return null
  if (typeof val === 'number') return Number.isFinite(val) && val > 0 ? val : null
  const match = String(val).match(/(\d+(?:\.\d+)?)/)
  if (match) {
    const num = parseFloat(match[1])
    return Number.isFinite(num) && num > 0 ? num : null
  }
  return null
}

export function getEntryTimestamp(item) {
  if (!item) return 0
  const timeStr = item.submittedAt || item.submitted_at || item.testDate || item.reportData?.testDate
  if (timeStr) {
    const parsed = new Date(timeStr).getTime()
    if (!isNaN(parsed) && parsed > 0) return parsed
  }
  if (item.id && Number.isFinite(Number(item.id))) {
    return Number(item.id)
  }
  return 0
}

export function buildDashboardMetrics({
  assessments = [],
  payments = [],
  userGrade = 'Grade 6',
  fallbackAssessment = null,
  userName = null,
} = {}) {
  const rawEntries = Array.isArray(assessments) ? assessments.filter(Boolean) : []

  const isExcludedStatus = (entry) => {
    const status = String(entry?.status || '').toLowerCase().trim()
    return status === 'abandoned' || status === 'in_progress'
  }

  const validEntries = rawEntries.filter((entry) => !isExcludedStatus(entry))
  const fallbackValid = fallbackAssessment && !isExcludedStatus(fallbackAssessment) ? fallbackAssessment : null

  // If userName is provided, filter entries for this student if any match
  const matchingStudentEntries = userName
    ? validEntries.filter(
        (e) => !e.studentName || String(e.studentName).trim().toLowerCase() === String(userName).trim().toLowerCase()
      )
    : validEntries

  const entriesToUse = matchingStudentEntries.length > 0 ? matchingStudentEntries : validEntries

  // Collect all candidates
  const allCandidates = [
    ...(fallbackValid ? [fallbackValid] : []),
    ...entriesToUse,
  ]

  // Deduplicate candidates by id or timestamp
  const entryMap = new Map()
  for (const item of allCandidates) {
    const key = item.id ? `id_${item.id}` : (item.submittedAt || item.submitted_at || JSON.stringify(item.answers || item))
    if (!entryMap.has(key)) {
      entryMap.set(key, item)
    } else {
      const existing = entryMap.get(key)
      if (!existing.reportData && item.reportData) {
        entryMap.set(key, item)
      }
    }
  }
  const uniqueEntries = Array.from(entryMap.values())

  const totalAssessments = Math.max(entriesToUse.length, uniqueEntries.length)

  // Find latest entry:
  // Sort descending by timestamp
  const sorted = [...uniqueEntries].sort((a, b) => getEntryTimestamp(b) - getEntryTimestamp(a))
  let latestEntry = sorted[0] || fallbackValid || null

  if (fallbackValid) {
    // If fallbackValid is provided and has same or higher timestamp than sorted[0], prioritize fallbackValid
    if (!latestEntry || getEntryTimestamp(fallbackValid) >= getEntryTimestamp(latestEntry)) {
      latestEntry = fallbackValid
    }
  }

  const selectedGradeNumber = (() => {
    const match = String(userGrade || '').match(/Grade\s*(\d+)/i)
    return match ? Number(match[1]) : 6
  })()

  // Extract assessed grade safely
  const assessedGradeRaw = latestEntry?.demonstratedMathLevel ??
    latestEntry?.estimated_grade ??
    latestEntry?.estimatedGrade ??
    latestEntry?.reportData?.demonstratedMathLevel ??
    latestEntry?.reportData?.overallResult?.demonstratedMathLevel ??
    latestEntry?.reportData?.demonstratedGrade ??
    latestEntry?.actualGrade ??
    latestEntry?.actual_grade

  let parsedAssessedGrade = parseGradeNumber(assessedGradeRaw)

  if (parsedAssessedGrade == null && fallbackValid) {
    const fallbackRaw = fallbackValid.demonstratedMathLevel ??
      fallbackValid.estimated_grade ??
      fallbackValid.estimatedGrade ??
      fallbackValid.reportData?.demonstratedMathLevel
    parsedAssessedGrade = parseGradeNumber(fallbackRaw)
  }

  const latestAccuracy = latestEntry?.percentage != null
    ? Math.round(Number(latestEntry.percentage))
    : (fallbackValid?.percentage != null ? Math.round(Number(fallbackValid.percentage)) : 0)

  const averageAccuracy = uniqueEntries.length > 0
    ? Math.round(uniqueEntries.reduce((sum, entry) => sum + Number(entry.percentage || 0), 0) / uniqueEntries.length)
    : latestAccuracy

  // If still not found, compute reasonable grade level from accuracy
  const currentGradeLevel = totalAssessments > 0
    ? (Number.isFinite(parsedAssessedGrade) && parsedAssessedGrade > 0
        ? Number(parsedAssessedGrade.toFixed(1))
        : Number((1 + (latestAccuracy / 100) * Math.max(0, selectedGradeNumber - 1)).toFixed(1)))
    : 0

  const paymentStatus = Array.isArray(payments) && payments.some((payment) => String(payment?.status || '').toLowerCase() === 'paid') ? 'paid' : 'pending'

  return {
    totalAssessments,
    averageAccuracy,
    latestAccuracy,
    currentGradeLevel,
    paymentStatus,
    latestAssessment: latestEntry,
  }
}
