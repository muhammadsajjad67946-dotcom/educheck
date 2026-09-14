import { BarChart3, BookOpenCheck, Sparkles, AlertCircle, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getDiagnosticConfidence, getPerformanceStatus } from '../utils/scoring'
import { jsPDF } from 'jspdf'
import { findWeakestSubtopic } from '../utils/subtopicTickCrossReport'

export default function StandardReport({ downloadOnly = false }) {
  const { assessmentResult, assessmentHistory, user, darkMode } = useApp()
  const latestAssessment = assessmentResult || assessmentHistory?.[assessmentHistory.length - 1] || null

  // If no result, show placeholder
  if (!latestAssessment || !latestAssessment.reportData) {
    return (
      <div className={`mx-auto max-w-6xl rounded-[2rem] border p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl ${darkMode ? 'border-white/10 bg-white/10' : 'border-slate-200 bg-[#e7edf1]'}`}>
        <div className={`rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-[#dfe6ec]'}`}>
          <div className={`flex items-center gap-2 ${darkMode ? 'text-yellow-300' : 'text-amber-600'}`}>
            <AlertCircle size={18} /> No Assessment Data
          </div>
          <h2 className={`mt-3 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Complete an assessment first</h2>
          <p className={`${darkMode ? 'mt-3 text-slate-300' : 'mt-3 text-slate-700'}`}>Once you complete the adaptive assessment, a comprehensive report will appear here.</p>
        </div>
      </div>
    )
  }

  const report = latestAssessment.reportData
  
  // Validate report structure
  if (!report || typeof report !== 'object') {
    return (
      <div className={`mx-auto max-w-6xl rounded-[2rem] border p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl ${darkMode ? 'border-white/10 bg-white/10' : 'border-slate-200 bg-[#e7edf1]'}`}>
        <div className={`rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-[#dfe6ec]'}`}>
          <div className={`flex items-center gap-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            <AlertCircle size={18} /> Data Error
          </div>
          <h2 className={`mt-3 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Report data is corrupted</h2>
          <p className={`${darkMode ? 'mt-3 text-slate-300' : 'mt-3 text-slate-700'}`}>Please try taking the assessment again.</p>
        </div>
      </div>
    )
  }
  
  const gradePerformance = report.gradePerformance || []
  const weakestSubtopic = findWeakestSubtopic(latestAssessment.questions || [], latestAssessment.answers || {})
  const totalQuestions = Number(latestAssessment.questions?.length || report.totalQuestions || report.totalAttempted || 0)
  const storedQuestions = Array.isArray(latestAssessment.questions) ? latestAssessment.questions : []
  const storedAnswers = latestAssessment.answers || {}
  const answeredFromQuestions = storedQuestions.filter((question) => {
    const answer = storedAnswers[question.id]
    return answer !== undefined && answer !== null && answer !== ''
  })
  const totalCorrect = storedQuestions.length
    ? answeredFromQuestions.filter((question) => storedAnswers[question.id] === question.answer).length
    : Number(report.totalCorrect || 0)
  const totalAttempted = storedQuestions.length ? storedQuestions.length : Number(report.totalQuestions || report.totalAttempted || 0)
  const totalWrong = storedQuestions.length ? totalAttempted - totalCorrect : Number(report.totalWrong || 0)
  const totalUnanswered = Math.max(0, totalQuestions - totalAttempted)
  const overallAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const diagnosticConfidence = getDiagnosticConfidence(
    totalAttempted,
    report.selectedGrade,
    totalQuestions,
    totalCorrect,
  )
  const targetGradeNum = Number(report.selectedGrade || String(user?.grade || '').match(/\d+/)?.[0] || 1)
  const rawReportGrade = report.demonstratedMathLevel
  const fallbackGrade = totalQuestions ? 1.0 + (overallAccuracy / 100) * Math.max(0, targetGradeNum - 1) : 1.0
  const isOldInflated = rawReportGrade && overallAccuracy < 60 && Number(rawReportGrade) > (fallbackGrade + 1.0)
  const effectiveReportGrade = isOldInflated
    ? fallbackGrade
    : (rawReportGrade && Number(rawReportGrade) >= 1.0 ? Number(rawReportGrade) : fallbackGrade)
  const demonstratedMathLevel = Number(effectiveReportGrade.toFixed(1))

  const handleDownload = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const contentWidth = pageWidth - margin * 2
      const gradePerformance = report.gradePerformance || []
      const topics = report.topicWisePerformance || []
      const difficulties = Object.entries(report.difficultyPerformance || {})

      // Validate required data exists before generating PDF
      if (!Array.isArray(gradePerformance) || !Array.isArray(topics)) {
        alert('Error: Report data is incomplete. Unable to generate PDF.')
        return
      }

      const text = (value, x, y, size = 8, color = [30, 41, 59], style = 'normal') => {
        pdf.setFont('helvetica', style)
        pdf.setFontSize(size)
        pdf.setTextColor(...color)
        pdf.text(String(value ?? ''), x, y)
      }
      const card = (x, y, width, height, label, value, fill) => {
        pdf.setFillColor(...fill)
        pdf.setDrawColor(214, 222, 232)
        pdf.roundedRect(x, y, width, height, 3, 3, 'FD')
        text(label, x + 4, y + 5.5, 5.5, [71, 85, 105], 'bold')
        const lines = pdf.splitTextToSize(String(value ?? ''), width - 8).slice(0, 2)
        lines.forEach((line, index) => text(line, x + 4, y + 12 + index * 4, index ? 7 : 8, [15, 23, 42], 'bold'))
      }
      const statusColor = (status) => ({
        Strong: [187, 247, 208],
        Developing: [254, 240, 138],
        'Needs Improvement': [254, 215, 170],
        Weak: [254, 202, 202],
      }[status] || [241, 245, 249])

      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, 297, 'F')
      text('EduCheck', margin, 13, 15, [15, 23, 42], 'bold')
      text('Adaptive Diagnostic Assessment System', margin, 19, 6, [71, 85, 105])
      text('Assessment Report', pageWidth - margin - 28, 11, 5, [71, 85, 105])
      text(new Date(report.testDate || Date.now()).toLocaleString(), pageWidth - margin - 42, 16, 5, [15, 23, 42])

      const half = (contentWidth - 4) / 2
      card(margin, 25, half, 16, 'STUDENT NAME', report.studentName || user.name || 'Student', [248, 250, 252])
      card(margin + half + 4, 25, half, 16, 'SELECTED TARGET GRADE', `Grade ${report.selectedGrade || 1}`, [248, 250, 252])
      card(margin, 45, half, 16, 'AGE', report.studentAge || user.age || '-', [248, 250, 252])
      card(margin + half + 4, 45, half, 16, 'DEMONSTRATED MATH LEVEL', `Grade ${demonstratedMathLevel}`, [248, 250, 252])

      const metricWidth = (contentWidth - 9) / 4
      card(margin, 66, metricWidth, 16, 'TOTAL MCQS', totalQuestions, [239, 246, 255])
      card(margin + metricWidth + 3, 66, metricWidth, 16, 'ACCURATE ANSWERS', totalCorrect, [236, 253, 245])
      card(margin + (metricWidth + 3) * 2, 66, metricWidth, 16, 'WRONG ANSWERS', totalWrong, [254, 242, 242])
      card(margin + (metricWidth + 3) * 3, 66, metricWidth, 16, 'OVERALL ACCURACY', `${overallAccuracy}%`, [254, 249, 195])

      card(margin, 87, (contentWidth - 6) / 3, 16, 'DIAGNOSTIC CONFIDENCE', diagnosticConfidence, [248, 250, 252])
      card(margin + (contentWidth - 6) / 3 + 3, 87, (contentWidth - 6) / 3, 16, 'STRONG AREAS', report.strengths?.join(', ') || 'More evidence needed', [236, 253, 245])
      card(margin + ((contentWidth - 6) / 3 + 3) * 2, 87, (contentWidth - 6) / 3, 16, 'RECOMMENDED FOCUS', report.gaps?.join(', ') || 'Keep practising all topics', [254, 249, 195])

    const section = (title, y, height) => {
      pdf.setFillColor(248, 250, 252)
      pdf.setDrawColor(226, 232, 240)
      pdf.roundedRect(margin, y, contentWidth, height, 3, 3, 'FD')
      text(title, margin + 4, y + 7, 8, [15, 23, 42], 'bold')
    }
    const gradeSectionY = 108
    const gradeSectionHeight = Math.max(43, 25 + gradePerformance.length * 6)
    section('Grade-wise Performance', gradeSectionY, gradeSectionHeight)
    const gradeColumns = [margin + 4, margin + 38, margin + 72, margin + 112, margin + 145]
    pdf.setFillColor(226, 232, 240)
    pdf.rect(margin + 3, gradeSectionY + 9, contentWidth - 6, 7, 'F')
    ;['Grade', 'Score', 'Cumulative', 'Correct/Total', 'Status'].forEach((label, index) => text(label, gradeColumns[index], gradeSectionY + 12, 6, [71, 85, 105], 'bold'))
    gradePerformance.forEach((grade, index) => {
      const y = gradeSectionY + 19 + index * 6
      pdf.setDrawColor(226, 232, 240)
      pdf.line(margin + 3, y + 2, margin + contentWidth - 3, y + 2)
      pdf.setFillColor(...statusColor(grade.performanceStatus))
      pdf.rect(margin + 128, y - 4, contentWidth - 132, 6, 'F')
      text(`Grade ${grade.gradeNumber}`, gradeColumns[0], y, 6)
      text(grade.normalizedScore.toFixed(2), gradeColumns[1], y, 6)
      text(grade.cumulativeScore.toFixed(2), gradeColumns[2], y, 6)
      text(`${grade.correct}/${grade.total}`, gradeColumns[3], y, 6)
      text(grade.performanceStatus, gradeColumns[4], y, 6, [15, 23, 42], 'bold')
    })

    const scoreY = gradeSectionY + gradeSectionHeight + 5
    const scoreHeight = 30 + (topics.length + 1) * 6
    section('Score Range Summary', scoreY, scoreHeight)
    const gradeCount = Number(report.selectedGrade) || 1
    const topicStart = margin + 4
    const topicWidth = 39
    const scoreTableWidth = contentWidth - 6
    const gradeWidth = (scoreTableWidth - topicWidth - 38) / gradeCount
    pdf.setFillColor(226, 232, 240)
    pdf.rect(margin + 3, scoreY + 9, scoreTableWidth, 7, 'F')
    text('Topic Name', topicStart, scoreY + 15, 5, [71, 85, 105], 'bold')
    for (let grade = 1; grade <= gradeCount; grade += 1) text(`G${grade}`, topicStart + topicWidth + (grade - 1) * gradeWidth, scoreY + 15, 5, [71, 85, 105], 'bold')
    text('Raw', topicStart + topicWidth + gradeCount * gradeWidth + 2, scoreY + 15, 5, [71, 85, 105], 'bold')
    text('Level', topicStart + topicWidth + gradeCount * gradeWidth + 17, scoreY + 15, 5, [71, 85, 105], 'bold')
    topics.forEach((topic, topicIndex) => {
      const y = scoreY + 21 + topicIndex * 6
      pdf.setDrawColor(226, 232, 240)
      pdf.line(margin + 3, y + 2, margin + 3 + scoreTableWidth, y + 2)
      text(topic.topicName, topicStart, y, 5)
      for (let grade = 1; grade <= gradeCount; grade += 1) {
        const gradeData = topic.grades[grade]
        if (gradeData?.total) {
          pdf.setFillColor(...statusColor(getPerformanceStatus(gradeData.normalizedScore)))
          pdf.rect(topicStart + topicWidth + (grade - 1) * gradeWidth - 1, y - 4, gradeWidth, 6, 'F')
        }
        text(gradeData?.total ? gradeData.correct : '-', topicStart + topicWidth + (grade - 1) * gradeWidth + 2, y, 5)
      }
      text(topic.totalRawScore, topicStart + topicWidth + gradeCount * gradeWidth + 4, y, 5)
      text(topic.gradeLevel, topicStart + topicWidth + gradeCount * gradeWidth + 19, y, 5)
    })

    const totalY = scoreY + 21 + topics.length * 6
    pdf.setFillColor(226, 232, 240)
    pdf.rect(margin + 3, totalY - 4, scoreTableWidth, 6, 'F')
    text('Total', topicStart, totalY, 5, [15, 23, 42], 'bold')
    for (let grade = 1; grade <= gradeCount; grade += 1) {
      const totalCorrect = topics.reduce((sum, topic) => sum + (topic.grades[grade]?.correct || 0), 0)
      text(totalCorrect, topicStart + topicWidth + (grade - 1) * gradeWidth + 2, totalY, 5, [15, 23, 42], 'bold')
    }
    text(topics.reduce((sum, topic) => sum + (topic.totalRawScore || 0), 0), topicStart + topicWidth + gradeCount * gradeWidth + 4, totalY, 5, [15, 23, 42], 'bold')
    const averageLevel = topics.length ? topics.reduce((sum, topic) => sum + (topic.gradeLevel || 0), 0) / topics.length : 0
    text(averageLevel.toFixed(2), topicStart + topicWidth + gradeCount * gradeWidth + 19, totalY, 5, [15, 23, 42], 'bold')

    let difficultyY = scoreY + scoreHeight + 5
    if (difficultyY + 45 <= 285) {
      section('Difficulty Performance', difficultyY, 45)
      difficulties.forEach(([difficulty, data], index) => {
        const x = margin + 4 + index * 58
        text(`${difficulty} Difficulty`, x, difficultyY + 12, 6, [15, 23, 42], 'bold')
        text(data.total ? `${data.correct}/${data.total} correct` : 'No questions attempted', x, difficultyY + 19, 5, [71, 85, 105])
        text(data.total ? `${Math.round((data.correct / data.total) * 100)}%` : '-', x + 43, difficultyY + 19, 6, [15, 23, 42], 'bold')
        pdf.setFillColor(226, 232, 240)
        pdf.roundedRect(x, difficultyY + 22, 48, 2, 1, 1, 'F')
        pdf.setFillColor(248, 113, 113)
        pdf.roundedRect(x, difficultyY + 22, data.total ? (48 * data.correct) / data.total : 0, 2, 1, 1, 'F')
      })
      const weakestText = weakestSubtopic
        ? `Weakest: ${weakestSubtopic.topic} > ${weakestSubtopic.subtopic} | ${weakestSubtopic.correct}/${weakestSubtopic.attempts} correct | ${Math.round(weakestSubtopic.accuracy * 100)}%`
        : 'Weakest: No answered subtopic data available.'
      text(pdf.splitTextToSize(weakestText, contentWidth - 10)[0], margin + 5, difficultyY + 38, 6, [71, 85, 105], 'bold')
    }

    let summaryY = difficultyY + 55
    if (summaryY + 38 <= 285) {
      section('Assessment Summary', summaryY, 38)
      const summaryLines = pdf.splitTextToSize(
        report.assessmentSummary || 'Assessment summary is not available.',
        contentWidth - 10,
      )
      summaryLines.slice(0, 4).forEach((line, index) => text(line, margin + 5, summaryY + 15 + index * 5, 6, [71, 85, 105]))
      const focus = (report.recommendedLearningFocus || []).join(' | ') || 'Continue practising all assessed grades and topics.'
      text('Recommended Learning Focus', margin + 5, summaryY + 33, 6, [15, 23, 42], 'bold')
      text(pdf.splitTextToSize(focus, contentWidth - 58)[0], margin + 48, summaryY + 33, 6, [71, 85, 105])
    }

    for (let page = 1; page <= pdf.getNumberOfPages(); page += 1) {
      pdf.setPage(page)
      text(`EduCheck | Mathematics Diagnostic Assessment Report | Page ${page} of ${pdf.getNumberOfPages()}`, margin, 290, 5, [100, 116, 139])
    }

      pdf.save(`EduCheck_Report_${(report.studentName || user.name || 'Student').replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Error generating PDF. Please try again.')
    }
  }
  return (
    <>
      {downloadOnly && (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">Assessment submitted</h2>
          <p className="mt-2 text-slate-300">Your report is ready to download.</p>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/30"
          >
            <Download size={17} /> Download Report
          </button>
        </div>
      )}
      <div
        className={`${downloadOnly ? 'pointer-events-none absolute left-[-10000px] top-0 w-[1152px]' : 'mx-auto max-w-6xl'} rounded-[2rem] border p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl ${darkMode ? 'border-white/10 bg-white/10' : 'border-slate-200 bg-[#e7edf1]'}`}
      >
      {/* Header */}
      <div className={`rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-[#dfe6ec]'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
            <BarChart3 size={18} /> Assessment Report
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-sky-500/30"
          >
            <Download size={17} /> Download Report
          </button>
        </div>
        <h2 className={`mt-3 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Student Performance Overview</h2>
        <p className={`${darkMode ? 'mt-3 text-slate-300' : 'mt-3 text-slate-700'}`}>Mathematics diagnostic performance based on the submitted assessment.</p>
      </div>

      {/* Key Metrics */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-gradient-to-br from-sky-500/10 to-violet-500/10 hover:border-sky-400/30 hover:shadow-lg hover:shadow-sky-500/20 hover:from-sky-500/20 hover:to-violet-500/20' : 'border-slate-200 bg-[#dfeaf7] hover:border-sky-300 hover:shadow-lg hover:shadow-sky-200/30 hover:bg-[#d0dff0]'}`}>
          <div className={`${darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-700'}`}>Demonstrated Math Level</div>
          <div className={`mt-2 text-4xl font-bold ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>Grade {demonstratedMathLevel}</div>
          <div className={`${darkMode ? 'mt-2 text-xs text-slate-400' : 'mt-2 text-xs text-slate-600'}`}>Out of Grade {report.selectedGrade}</div>
        </div>

        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-gradient-to-br from-violet-500/10 to-purple-500/10 hover:border-violet-400/30 hover:shadow-lg hover:shadow-violet-500/20 hover:from-violet-500/20 hover:to-purple-500/20' : 'border-slate-200 bg-[#e2dff6] hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/30 hover:bg-[#d5d0ed]'}`}>
          <div className={`${darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-700'}`}>Cumulative Score</div>
          <div className={`mt-2 text-4xl font-bold ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>{(report.finalCumulativeScore).toFixed(2)}</div>
          <div className={`${darkMode ? 'mt-2 text-xs text-slate-400' : 'mt-2 text-xs text-slate-600'}`}>Sum of normalized grade scores</div>
        </div>

        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/20 hover:from-emerald-500/20 hover:to-teal-500/20' : 'border-slate-200 bg-[#dfeee8] hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-200/30 hover:bg-[#d0e5dd]'}`}>
          <div className={`${darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-700'}`}>Total MCQs</div>
          <div className={`mt-2 text-4xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>{totalQuestions}</div>
          <div className={`${darkMode ? 'mt-2 text-xs text-slate-400' : 'mt-2 text-xs text-slate-600'}`}>{totalCorrect} correct, {totalWrong} wrong, {totalUnanswered} unanswered</div>
        </div>

        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20' : 'border-slate-200 bg-[#f3e7d7] hover:border-amber-300 hover:shadow-lg hover:shadow-amber-200/30 hover:bg-[#eddbcb]'}`}>
          <div className={`${darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-700'}`}>Overall Accuracy</div>
          <div className={`mt-2 text-4xl font-bold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
            {overallAccuracy}%
          </div>
          <div className={`${darkMode ? 'mt-2 text-xs text-slate-400' : 'mt-2 text-xs text-slate-600'}`}>{totalCorrect} / {totalQuestions}</div>
        </div>
      </div>

      <div className={`mt-6 rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-[#dfe6ec]'}`}>
        <div className={`mb-4 flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
          <BarChart3 size={18} /> Grade-wise Performance
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/10 text-left' : 'border-slate-300 text-left'}`}>
                {['Grade', 'Score', 'Cumulative Score', 'Correct / Total', 'Status'].map((heading) => (
                  <th key={heading} className={`px-4 py-3 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradePerformance.map((grade) => (
                <tr key={grade.gradeNumber} className={darkMode ? 'border-b border-white/5' : 'border-b border-slate-300'}>
                  <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>Grade {grade.gradeNumber}</td>
                  <td className="px-4 py-3">{grade.normalizedScore.toFixed(2)}</td>
                  <td className="px-4 py-3">{grade.cumulativeScore.toFixed(2)}</td>
                  <td className="px-4 py-3">{grade.correct} / {grade.total}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      grade.performanceStatus === 'Strong' ? (darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                        grade.performanceStatus === 'Developing' ? (darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700') :
                          (darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700')
                    }`}>
                      {grade.performanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Topic-wise Performance Table - Main Summary */}
      <div className={`mt-6 rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-[#dfe6ec]'}`}>
        <div className={`mb-4 flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
          <BookOpenCheck size={18} /> Score Range Summary
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-slate-300'}`}>
                <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Topic Name</th>
                {Array.from({ length: report.selectedGrade }, (_, i) => (
                  <th key={`grade-${i + 1}`} className={`px-4 py-3 text-center font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Grade {i + 1}
                  </th>
                ))}
                <th className={`px-4 py-3 text-center font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Raw Score</th>
                <th className={`px-4 py-3 text-center font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Grade Level</th>
              </tr>
            </thead>
            <tbody>
              {report.topicWisePerformance && report.topicWisePerformance.map((topic, topicIdx) => (
                <tr key={topicIdx} className={darkMode ? 'border-b border-white/5 hover:bg-white/5 transition' : 'border-b border-slate-300 transition'}>
                  <td className={`px-4 py-3 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{topic.topicName}</td>
                  {Array.from({ length: report.selectedGrade }, (_, gradeIdx) => {
                    const grade = gradeIdx + 1
                    const gradeData = topic.grades[grade]
                    const statusColors = darkMode
                      ? {
                          Strong: 'bg-emerald-500/20 text-emerald-300',
                          Developing: 'bg-amber-500/20 text-amber-300',
                          'Needs Improvement': 'bg-orange-500/20 text-orange-300',
                          Weak: 'bg-red-500/20 text-red-300',
                        }
                      : {
                          Strong: 'bg-emerald-100 text-emerald-700',
                          Developing: 'bg-amber-100 text-amber-700',
                          'Needs Improvement': 'bg-orange-100 text-orange-700',
                          Weak: 'bg-red-100 text-red-700',
                        }

                    if (!gradeData || gradeData.total === 0) {
                      return (
                        <td key={`topic-${topicIdx}-grade-${grade}`} className={`px-4 py-3 text-center ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                          —
                        </td>
                      )
                    }

                    const status = getPerformanceStatus(gradeData.normalizedScore)
                    return (
                      <td
                        key={`topic-${topicIdx}-grade-${grade}`}
                        className={`px-4 py-3 text-center font-semibold rounded-lg ${statusColors[status] || (darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-200 text-slate-700')}`}
                      >
                        {gradeData.correct}
                      </td>
                    )
                  })}
                  <td className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>{topic.totalRawScore}</td>
                  <td className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>{topic.gradeLevel}</td>
                </tr>
              ))}
              {report.topicWisePerformance && (
                <tr className={darkMode ? 'border-t border-white/10 bg-white/5' : 'border-t border-slate-300 bg-slate-200/60'}>
                  <td className={`px-4 py-3 font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Total</td>
                  {Array.from({ length: report.selectedGrade }, (_, gradeIdx) => {
                    const grade = gradeIdx + 1
                    let totalForGrade = 0
                    report.topicWisePerformance.forEach((topic) => {
                      if (topic.grades[grade]) {
                        totalForGrade += topic.grades[grade].correct
                      }
                    })
                    return (
                      <td key={`total-grade-${grade}`} className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
                        {totalForGrade}
                      </td>
                    )
                  })}
                  <td className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>
                    {report.topicWisePerformance.reduce((sum, t) => sum + t.totalRawScore, 0)}
                  </td>
                  <td className={`px-4 py-3 text-center font-bold ${darkMode ? 'text-violet-300' : 'text-violet-700'}`}>
                    {(report.topicWisePerformance.reduce((sum, t) => sum + t.gradeLevel, 0) / report.topicWisePerformance.length).toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`mt-6 rounded-[1.5rem] border p-6 ${darkMode ? 'border-white/10 bg-slate-950/50' : 'border-slate-200 bg-[#dfe6ec]'}`}>
        <div className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-700'}`}>Difficulty Performance</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {Object.entries(report.difficultyPerformance || {}).map(([difficulty, data]) => {
            const hasQuestions = data.total > 0
            const percentage = hasQuestions ? Math.round((data.correct / data.total) * 100) : 0
            return (
              <div key={difficulty} className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-white/5 hover:border-sky-400/30 hover:bg-white/10 hover:shadow-lg hover:shadow-sky-500/20' : 'border-slate-200 bg-[#edf1f4] hover:border-sky-300 hover:bg-[#e5ebf1] hover:shadow-lg hover:shadow-sky-200/30'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{difficulty} Difficulty</span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{hasQuestions ? `${percentage}%` : 'No questions attempted'}</span>
                </div>
                <p className={`mt-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{hasQuestions ? `${data.correct}/${data.total} correct` : 'No questions attempted'}</p>
                <div className={`mt-3 h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-300'}`}>
                  <div className="h-2 rounded-full bg-sky-400" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className={`rounded-[1.5rem] border p-5 transition-all duration-300 cursor-pointer ${darkMode ? 'border-sky-400/20 bg-sky-500/10 hover:border-sky-400/40 hover:bg-sky-500/15 hover:shadow-lg hover:shadow-sky-500/20' : 'border-sky-200 bg-[#dbeaf3] hover:border-sky-300 hover:bg-[#cde1ed] hover:shadow-lg hover:shadow-sky-200/40'}`}>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Diagnostic Confidence</div>
          <div className={`mt-2 text-2xl font-bold ${darkMode ? 'text-sky-200' : 'text-sky-700'}`}>{diagnosticConfidence}</div>
          <p className={`mt-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Based on {report.totalAttempted} answered questions out of {report.totalQuestions || report.totalAttempted}.</p>
        </div>
        <div className={`rounded-[1.5rem] border p-5 transition-all duration-300 cursor-pointer ${darkMode ? 'border-emerald-400/20 bg-emerald-500/10 hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/20' : 'border-emerald-200 bg-[#dfeae3] hover:border-emerald-300 hover:bg-[#d0dfd7] hover:shadow-lg hover:shadow-emerald-200/40'}`}>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Strong Areas</div>
          <div className={`mt-2 text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`}>{report.strengths?.length ? report.strengths.join(', ') : 'More evidence needed'}</div>
        </div>
        <div className={`rounded-[1.5rem] border p-5 transition-all duration-300 cursor-pointer ${darkMode ? 'border-amber-400/20 bg-amber-500/10 hover:border-amber-400/40 hover:bg-amber-500/15 hover:shadow-lg hover:shadow-amber-500/20' : 'border-amber-200 bg-[#eae1d0] hover:border-amber-300 hover:bg-[#dfd3bc] hover:shadow-lg hover:shadow-amber-200/40'}`}>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>Recommended Focus</div>
          <div className={`mt-2 text-sm font-semibold ${darkMode ? 'text-amber-200' : 'text-amber-700'}`}>{report.gaps?.length ? report.gaps.join(', ') : 'Keep practising all topics'}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-slate-950/50 hover:border-sky-400/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-[#8a929b] hover:border-slate-300 hover:bg-[#7a8290] hover:shadow-lg hover:shadow-slate-400/20'}`}>
          <div className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Assessment Summary</div>
          <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-300' : 'text-slate-100'}`}>{report.assessmentSummary || 'Assessment summary is not available.'}</p>
        </div>
        <div className={`rounded-[1.5rem] border p-6 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-slate-950/50 hover:border-sky-400/30 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-[#8a929b] hover:border-slate-300 hover:bg-[#7a8290] hover:shadow-lg hover:shadow-slate-400/20'}`}>
          <div className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Recommended Learning Focus</div>
          <ul className={`mt-3 space-y-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-100'}`}>
            {(report.recommendedLearningFocus || []).length > 0
              ? report.recommendedLearningFocus.map((item) => <li key={item}>{item}</li>)
              : <li>Continue practising all assessed grades and topics.</li>}
          </ul>
        </div>
      </div>

      <div className={`mt-6 rounded-[1.5rem] border p-6 ${darkMode ? 'border-red-400/20 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
        <div className={`text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Weakest Topic &amp; Subtopic</div>
        {weakestSubtopic ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{weakestSubtopic.topic}</div>
              <div className={`mt-1 text-sm ${darkMode ? 'text-red-100' : 'text-red-800'}`}>{weakestSubtopic.subtopic}</div>
            </div>
            <div className={`text-right text-sm font-semibold ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
              <div>{weakestSubtopic.correct}/{weakestSubtopic.attempts} correct</div>
              <div>{Math.round(weakestSubtopic.accuracy * 100)}% accuracy</div>
            </div>
          </div>
        ) : (
          <p className={`mt-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>No answered subtopic data available.</p>
        )}
      </div>

      {/* Dynamic Footer */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
        <Sparkles size={16} className="text-sky-300" /> Report generated based on actual student performance across {report.selectedGrade} grade levels with {report.totalAttempted} questions covering all topics and difficulty levels.
      </div>
      </div>
    </>
  )
}
