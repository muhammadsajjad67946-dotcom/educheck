export const dashboardStrandOrder = [
  { name: 'Number & Operations', key: 'Number & Operations', color: 'from-sky-400 to-indigo-500' },
  { name: 'Algebra', key: 'Algebra', color: 'from-cyan-400 to-teal-500' },
  { name: 'Geometry', key: 'Geometry', color: 'from-emerald-400 to-lime-500' },
  { name: 'Measurement', key: 'Measurement', color: 'from-violet-400 to-fuchsia-500' },
  { name: 'Data Analysis', key: 'Data Analysis', color: 'from-amber-400 to-orange-500' },
]

export function getWeakStrands(assessment) {
  const breakdown = assessment?.topicBreakdown || []

  return breakdown
    .filter((topic) => Number(topic.percentage || 0) < 70)
    .map((topic) => ({
      name: topic.topic,
      percentage: Number(topic.percentage || 0),
    }))
    .filter((topic) => topic.name)
}

export function getProgressTrend(assessmentHistory = [], assessmentResult = null) {
  const entries = [...(assessmentHistory || [])]

  if (assessmentResult && !entries.some((entry) => entry.submittedAt === assessmentResult.submittedAt)) {
    entries.push(assessmentResult)
  }

  return entries
    .filter((entry) => Number(entry?.percentage || 0) >= 0)
    .slice(-6)
    .map((entry, index) => ({
      label: `A${index + 1}`,
      value: Number(entry.percentage || 0),
      timestamp: entry.submittedAt || null,
    }))
}

export function getStudentPerformanceTrend(assessmentHistory = [], assessmentResult = null) {
  const entries = [...(assessmentHistory || [])]

  if (assessmentResult && !entries.some((entry) => entry.submittedAt === assessmentResult.submittedAt)) {
    entries.push(assessmentResult)
  }

  return entries
    .filter((entry) => Number(entry?.percentage || 0) >= 0)
    .slice(-10)
    .map((entry, index, arr) => ({
      label: index === arr.length - 1 ? 'Latest' : `M${index + 1}`,
      value: Number(entry.percentage || 0),
      timestamp: entry.submittedAt || null,
    }))
}

export function getMathPerformance(assessmentHistory = [], assessmentResult = null) {
  const entries = [...(assessmentHistory || [])]

  if (assessmentResult && !entries.some((entry) => entry.submittedAt === assessmentResult.submittedAt)) {
    entries.push(assessmentResult)
  }

  const mathEntries = entries.filter((entry) => {
    const subject = String(entry?.subject || entry?.strand || entry?.reportData?.studentName || '').toLowerCase()
    const hasMathName = subject.includes('math') || subject.includes('mathematics')
    const hasMathTag = entry?.reportData?.subjects?.some((subjectItem) =>
      String(subjectItem?.name || '').toLowerCase().includes('math') || String(subjectItem?.name || '').toLowerCase().includes('mathematics')
    )

    return hasMathName || hasMathTag || (!entry?.subject && !entry?.strand && !entry?.reportData?.subjects)
  })

  if (!mathEntries.length) {
    return 0
  }

  const latestMath = mathEntries[mathEntries.length - 1]
  return Number(latestMath.percentage || 0)
}
