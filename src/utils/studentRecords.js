export function updateStudentAfterAssessment(students = [], assessmentData = {}) {
  const safeStudents = Array.isArray(students) ? students : []
  const studentName = String(assessmentData.name || assessmentData.studentName || '').trim()
  const studentEmail = String(assessmentData.email || '').trim().toLowerCase()
  const percentage = Number(assessmentData.percentage ?? 0)

  const existingIndex = safeStudents.findIndex((student) => {
    const sameName = studentName && student.name && student.name.toLowerCase() === studentName.toLowerCase()
    const sameEmail = studentEmail && student.email && student.email.toLowerCase() === studentEmail.toLowerCase()
    return sameName || sameEmail
  })

  if (existingIndex >= 0) {
    const existing = safeStudents[existingIndex]
    const currentTests = Number(existing.tests) || 0
    const currentAvg = Number(existing.avgScore) || 0
    const nextTests = currentTests + 1
    const nextAvg = Math.round(((currentAvg * currentTests) + percentage) / nextTests)

    const updated = [...safeStudents]
    updated[existingIndex] = {
      ...existing,
      name: existing.name || studentName || 'Student',
      email: existing.email || studentEmail || `${(existing.name || studentName || 'student').replace(/\s+/g, '').toLowerCase()}@example.com`,
      tests: nextTests,
      avgScore: nextAvg,
      status: 'Active',
      grade: existing.grade || assessmentData.grade || 'Grade 6',
      joinedDate: existing.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }

    return updated
  }

  const newStudent = {
    id: Date.now(),
    name: studentName || 'New Student',
    email: studentEmail || `${(studentName || 'student').replace(/\s+/g, '').toLowerCase()}@example.com`,
    grade: assessmentData.grade || 'Grade 6',
    tests: 1,
    avgScore: percentage || 0,
    status: 'Active',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }

  return [newStudent, ...safeStudents]
}
