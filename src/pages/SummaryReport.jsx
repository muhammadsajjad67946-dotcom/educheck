import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  Printer,
  Sparkles,
  Brain,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Target,
  Compass,
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { useApp } from '../context/AppContext'
import { getDiagnosticConfidence } from '../utils/scoring'
import { calculateAdaptiveOverallGE, calculateAdaptiveTopicGE } from '../utils/adaptiveTest'
import { buildSubtopicTickCrossReport, formatSubtopicTitle } from '../utils/subtopicTickCrossReport'
import { formatKidFriendlyExplanation, parseExplanationSteps, generateWrongAnswerReason } from '../utils/formatExplanation'
import { apiRequest } from '../utils/api'

export default function SummaryReport() {
  const { user, assessmentResult, assessmentHistory, setTestState, darkMode } = useApp()
  const [topicDescriptions, setTopicDescriptions] = useState({})
  const [topicHierarchy, setTopicHierarchy] = useState({})
  const [profileAge, setProfileAge] = useState('')
  const [activeFilter, setActiveFilter] = useState('wrong')
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [dbAttemptData, setDbAttemptData] = useState(null)
  const [showAllGaps, setShowAllGaps] = useState(false)

  const latestAssessment = assessmentResult || assessmentHistory?.[assessmentHistory.length - 1] || null

  useEffect(() => {
    const attemptId = latestAssessment?.id || latestAssessment?.assessmentAttemptId
    if (attemptId && (!latestAssessment?.questions || latestAssessment.questions.length === 0)) {
      apiRequest(`/assessment-attempts/${attemptId}/answers`)
        .then((answersList) => {
          if (Array.isArray(answersList) && answersList.length > 0) {
            const reconstructedQuestions = answersList.map((a) => ({
              id: a.questionId,
              questionId: a.questionId,
              grade: a.grade,
              topic: a.topic || a.subject || 'General',
              subtopic: a.subtopic || 'General',
              micro_skill: a.micro_skill || null,
              prerequisite_grade: a.prerequisite_grade || null,
              prerequisite_concept: a.prerequisite_concept || null,
              distractor_diagnostics: a.distractor_diagnostics || null,
              question: a.question,
              options: a.options,
              answer: a.correctAnswer,
              correct_answer: a.correctAnswer,
              selectedAnswer: a.selectedAnswer,
              explanation: a.explanation || 'Worked solution available in review.',
            }))
            const reconstructedAnswers = Object.fromEntries(
              answersList.map((a) => [a.questionId, a.selectedAnswer])
            )
            const correctCount = answersList.filter((a) => a.isCorrect).length
            const wrongCount = answersList.length - correctCount
            const percent = answersList.length ? Math.round((correctCount / answersList.length) * 100) : 0

            setDbAttemptData({
              ...latestAssessment,
              questions: reconstructedQuestions,
              answers: reconstructedAnswers,
              total: answersList.length,
              totalQuestions: answersList.length,
              correct: correctCount,
              wrong: wrongCount,
              percentage: percent,
              score: correctCount,
              reportData: {
                ...(latestAssessment?.reportData || {}),
                totalQuestions: answersList.length,
                totalAttempted: answersList.length,
                totalCorrect: correctCount,
                totalWrong: wrongCount,
                accuracy: answersList.length ? correctCount / answersList.length : 0,
                selectedGrade: latestAssessment?.estimated_grade || user?.grade || 8,
              },
            })
          }
        })
        .catch((err) => console.warn('Could not restore attempt answers from DB:', err))
    }
  }, [latestAssessment?.id, latestAssessment?.assessmentAttemptId, latestAssessment?.questions?.length, user?.grade])

  const effectiveAssessment = (latestAssessment?.questions?.length ? latestAssessment : dbAttemptData) || latestAssessment

  const handleRetakeWeakAreas = () => {
    let weakTopics = []
    if (effectiveAssessment) {
      const lowAccuracy = (effectiveAssessment.topicBreakdown || [])
        .filter((t) => Number(t.percentage || 0) < 70)
        .map((t) => t.topic)
      const gaps = effectiveAssessment.reportData?.weakPoints || effectiveAssessment.reportData?.gaps || []
      const storedQuestions = effectiveAssessment.questions || []
      const storedAnswers = effectiveAssessment.answers || {}
      const wrongTopics = storedQuestions
        .filter((q) => {
          const ans = storedAnswers[q.id]
          return !ans || String(ans).toUpperCase() !== String(q.correct_answer || q.answer || q.correctAnswer || '').toUpperCase()
        })
        .map((q) => q.subtopic || q.topic)
      weakTopics = [...new Set([...lowAccuracy, ...gaps, ...wrongTopics].filter(Boolean))]
    }

    setTestState((prev) => ({
      ...prev,
      questions: [],
      answers: {},
      score: 0,
      adaptiveState: null,
      retakeMode: true,
      focusTopics: weakTopics,
      startFresh: true,
    }))
  }
  const report = effectiveAssessment?.reportData || {}

  const actualQuestionCount = Number(effectiveAssessment?.questions?.length || report.totalQuestions || report.totalAttempted || effectiveAssessment?.total || 0)
  const totalQuestions = Math.max(actualQuestionCount, Number(report.totalQuestions || 0), 1)
  const totalCorrect = Number(report.totalCorrect ?? effectiveAssessment?.correct ?? effectiveAssessment?.correct_answers ?? 0)
  const totalAttempted = Number(report.totalQuestions || effectiveAssessment?.total || report.totalAttempted || effectiveAssessment?.totalAttempted || totalQuestions)
  const totalWrong = Number(report.totalWrong ?? effectiveAssessment?.wrong ?? effectiveAssessment?.wrong_answers ?? Math.max(0, totalAttempted - totalCorrect))
  const scorePercent = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const diagnosticConfidence = getDiagnosticConfidence(
    totalAttempted,
    report.selectedGrade,
    totalQuestions,
    totalCorrect,
  )
  const displayedAge = report.studentAge || user.age || profileAge || '-'

  const targetGradeNum = Number(report.selectedGrade || String(user.grade || '').match(/\d+/)?.[0] || 8)
  const getCorrectAnswer = (question) => question?.correct_answer || question?.correctAnswer || question?.answer || question?.correct_option || null

  const reportQuestions = (effectiveAssessment?.questions?.length
    ? effectiveAssessment.questions
    : Array.isArray(report.questionReview) ? report.questionReview : [])
    .map((question) => ({
      ...question,
      answer: getCorrectAnswer(question),
    }))

  const reportAnswers = effectiveAssessment?.answers || Object.fromEntries(
    reportQuestions.map((question) => [question.id, question.selectedAnswer]),
  )

  const computedAdaptiveGrade = (() => {
    if (!reportQuestions.length) return null
    const topics = ['Number & Operations', 'Algebra', 'Geometry', 'Measurement', 'Data Analysis']
    const topicGEs = Object.fromEntries(topics.map((t) => [
      t,
      calculateAdaptiveTopicGE(reportQuestions.filter((q) => q.topic === t), reportAnswers, targetGradeNum),
    ]))
    const overall = calculateAdaptiveOverallGE(topicGEs, targetGradeNum)
    return overall !== null && Number.isFinite(overall) && overall >= 1.0 ? overall : null
  })()

  const demonstratedGradeRaw = report.demonstratedMathLevel ?? effectiveAssessment?.estimatedGrade ?? 0
  const fallbackDemonstrated = 1.0 + (scorePercent / 100) * Math.max(0, targetGradeNum - 1)
  const isOldInflated = demonstratedGradeRaw && scorePercent < 60 && Number(demonstratedGradeRaw) > (fallbackDemonstrated + 1.0)
  const effectiveRawGrade = isOldInflated
    ? (computedAdaptiveGrade ?? fallbackDemonstrated)
    : (demonstratedGradeRaw && Number(demonstratedGradeRaw) >= 1.0 ? Number(demonstratedGradeRaw) : (computedAdaptiveGrade ?? fallbackDemonstrated))
  const demonstratedGradeNum = Number(effectiveRawGrade.toFixed(1))
  const gradeGap = (demonstratedGradeNum - targetGradeNum).toFixed(1)

  const subtopicReport = reportQuestions.length
    ? buildSubtopicTickCrossReport(reportQuestions, reportAnswers, targetGradeNum, topicDescriptions, topicHierarchy)
    : assessmentResult?.subtopicReport || report.subtopicTickCrossReport || {}

  const geminiReport = report.geminiReport || null
  const geminiFeedbackMap = new Map(
    (geminiReport?.questionFeedback || []).map((item) => [String(item.questionId), item])
  )
  const rawQuestionReviewMap = new Map(
    (Array.isArray(report.questionReview) ? report.questionReview : []).map((item) => [String(item.questionId || item.id), item])
  )

  const allQuestionsList = (effectiveAssessment?.questions?.length ? effectiveAssessment.questions : (report.questionReview || []))

  const comprehensiveQuestions = allQuestionsList.map((question, index) => {
    const qId = question.id ?? question.questionId ?? (index + 1)
    const selectedAnswer = effectiveAssessment?.answers?.[qId] ?? question.selectedAnswer ?? null
    const correctAnswer = getCorrectAnswer(question)
    const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== ''
    const isCorrect = isAnswered && String(selectedAnswer).toUpperCase() === String(correctAnswer || '').toUpperCase()
    const geminiItem = geminiFeedbackMap.get(String(qId)) || {}
    const reportItem = rawQuestionReviewMap.get(String(qId)) || {}
    const options = question.options || {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    }

    const diagnostics = typeof question.distractor_diagnostics === 'string'
      ? (() => { try { return JSON.parse(question.distractor_diagnostics) } catch { return null } })()
      : question.distractor_diagnostics || reportItem.distractor_diagnostics || null
    const selectedKey = selectedAnswer ? String(selectedAnswer).toUpperCase() : ''
    const rawDistractorError = diagnostics?.[selectedKey]?.error || reportItem.diagnosedGap || null
    const distractorRemediation = diagnostics?.[selectedKey]?.remediation || reportItem.diagnosedRemediation || null
    const distractorError = rawDistractorError
      ? rawDistractorError.replace(/^[A-Za-z\s\-\/]+:\s*/, '').trim().replace(/^([a-z])/, (m) => m.toUpperCase())
      : null

    const rawReason = distractorError || geminiItem.reason || geminiItem.misconception || reportItem.reason || reportItem.misconception || question.misconception || question.reason || null
    const wrongReason = !isCorrect
      ? (distractorError || generateWrongAnswerReason({
          question: question.question || question.question_text,
          selectedAnswer,
          correctAnswer,
          options,
          topic: question.topic || question.topic_name,
          subtopic: question.subtopic || question.subtopic_name,
          existingReason: rawReason,
        }))
      : null

    return {
      ...question,
      id: qId,
      number: index + 1,
      grade: question.grade || targetGradeNum,
      difficulty: question.difficulty || 'Medium',
      topic: question.topic || question.topic_name || 'General Mathematics',
      subtopic: question.subtopic || question.subtopic_name || 'General',
      micro_skill: question.micro_skill || reportItem.micro_skill || null,
      prerequisite_grade: question.prerequisite_grade || null,
      prerequisite_concept: question.prerequisite_concept || null,
      question: question.question || question.question_text,
      options,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      status: !isAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Wrong',
      explanation: formatKidFriendlyExplanation(
        geminiItem.howToSolveCorrectly || reportItem.howToSolveCorrectly || question.explanation || reportItem.explanation,
        correctAnswer,
        {
          options,
          question: question.question || question.question_text,
          topic: question.topic || question.topic_name,
          subtopic: question.subtopic || question.subtopic_name,
        }
      ),
      reason: wrongReason,
      misconception: rawReason || wrongReason,
      subtopicFoundationalGap: geminiItem.subtopicFoundationalGap || reportItem.subtopicFoundationalGap || null,
      diagnosedGap: distractorError,
      diagnosedRemediation: distractorRemediation,
    }
  })

  const weaknessMap = effectiveAssessment?.weaknessMap
    || effectiveAssessment?.reportData?.weaknessMap
    || assessmentResult?.weaknessMap
    || assessmentResult?.reportData?.weaknessMap
    || {}

  function cleanConciseIssue(raw) {
    if (!raw) return null
    let str = String(raw).trim()
    // Filter out question context text — these are NOT misconceptions
    const looksLikeQuestionText = (
      /battery|pencil|drains|per hour|selected pencil|just selected|chose option|picked option|length of pencil/i.test(str) ||
      str.length > 90 ||
      /^the battery/i.test(str) ||
      /^student just/i.test(str)
    )
    if (looksLikeQuestionText) return null
    str = str.replace(/^the student\s+/i, '')
    if (str.includes(':')) str = str.split(':')[0].trim()
    str = str.replace(/\s*[\(\[].*?[\)\]]/g, '').trim()
    str = str.replace(/\s*=\s*\d+.*$/g, '').trim()
    if (/^\d+\s*[\+\-\*×÷\/]/.test(str)) return null
    if (str.length < 5) return null
    str = str.charAt(0).toUpperCase() + str.slice(1)
    if (!str.endsWith('.')) str += '.'
    return str
  }

  function cleanConciseFix(raw) {
    if (!raw) return 'Practice key problems in this area.'
    let str = String(raw).trim()
    str = str.replace(/^(Remember:?\s*|Practice\s+)/i, '')
    if (str.toLowerCase().startsWith('keep the numerator 1')) {
      return 'Keep first fraction, invert second, and multiply.'
    }
    if (str.length > 0) {
      str = str.charAt(0).toUpperCase() + str.slice(1)
    }
    if (!str.endsWith('.')) str += '.'
    return str
  }

  function getLadderConcepts(subtopicName, topicName, rootGrade, targetGrade, prereqConcept) {
    const cleanSub = formatSubtopicTitle(subtopicName)
    const norm = cleanSub.toLowerCase()
    const pGrade = Math.max(1, rootGrade - 1)

    if (prereqConcept && typeof prereqConcept === 'string' && prereqConcept.trim()) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Foundation',
        rootConcept: prereqConcept.trim(),
        targetConcept: cleanSub.split(' ')[0] || 'Target',
      }
    }

    if (norm.includes('fraction') && (norm.includes('divis') || norm.includes('divid'))) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Multiplication',
        rootConcept: 'Reciprocals',
        targetConcept: 'Division',
      }
    }
    if (norm.includes('fraction') && norm.includes('multipl')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Addition',
        rootConcept: 'Fractions',
        targetConcept: 'Multiplication',
      }
    }
    if (norm.includes('fraction')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Sharing',
        rootConcept: 'Reciprocals',
        targetConcept: 'Fractions',
      }
    }
    if (norm.includes('express') || norm.includes('algebra')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Operations',
        rootConcept: 'Variables',
        targetConcept: 'Expressions',
      }
    }
    if (norm.includes('inequal')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Comparison',
        rootConcept: 'Equations',
        targetConcept: 'Inequalities',
      }
    }
    if (norm.includes('decimal')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Place Value',
        rootConcept: 'Tenths',
        targetConcept: 'Decimals',
      }
    }
    if (norm.includes('ratio') || norm.includes('proport')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Fractions',
        rootConcept: 'Unit Rates',
        targetConcept: 'Proportions',
      }
    }
    if (norm.includes('angle') || norm.includes('shape') || norm.includes('geomet')) {
      return {
        prevGrade: pGrade,
        prevConcept: '2D Shapes',
        rootConcept: 'Angles',
        targetConcept: 'Geometry',
      }
    }
    if (norm.includes('perim') || norm.includes('area')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Counting',
        rootConcept: 'Perimeter',
        targetConcept: 'Area',
      }
    }
    if (norm.includes('integer') || norm.includes('negative')) {
      return {
        prevGrade: pGrade,
        prevConcept: 'Number Line',
        rootConcept: 'Absolute Value',
        targetConcept: 'Integers',
      }
    }

    const words = subtopicName.split(' ')
    return {
      prevGrade: pGrade,
      prevConcept: 'Basics',
      rootConcept: words[0] || 'Prerequisite',
      targetConcept: words.slice(-1)[0] || 'Core Skill',
    }
  }

  const getSubtopicDiagnosticInfo = (subtopicName, topicName, rowGrade = null) => {
    const rawSub = String(subtopicName || '').trim()
    const cleanSub = formatSubtopicTitle(rawSub)
    const normSub = rawSub.toLowerCase()
    const normClean = cleanSub.toLowerCase()
    const normTopic = String(topicName || '').trim().toLowerCase()
    const targetGrade = rowGrade ? Number(rowGrade) : targetGradeNum

    // 1. Check direct match in weaknessMap from adaptive bounce-back probes
    const directEntry = Object.entries(weaknessMap).find(([k]) => {
      const normK = String(k).trim().toLowerCase()
      const cleanK = formatSubtopicTitle(normK).toLowerCase()
      return normK === normSub || normK === normClean || cleanK === normClean ||
             normK.includes(normClean) || normClean.includes(normK) ||
             normSub.includes(normK)
    })
    const mapInfo = directEntry ? directEntry[1] : null

    // 2. Derive matching questions for specific misconception details
    const matchingWrongQuestions = comprehensiveQuestions.filter((q) => {
      if (q.isCorrect) return false
      const qSub = String(q.subtopic || '').trim().toLowerCase()
      const cleanQSub = formatSubtopicTitle(qSub).toLowerCase()
      const qTop = String(q.topic || '').trim().toLowerCase()
      const subtopicMatches = !qSub ||
        qSub === normSub || qSub === normClean || cleanQSub === normClean ||
        normSub.includes(qSub) || qSub.includes(normSub) ||
        normClean.includes(cleanQSub) || cleanQSub.includes(normClean) ||
        normClean.includes(qSub) || qSub.includes(normClean)
      const topicMatches = !qTop || !normTopic || qTop === normTopic || qTop.includes(normTopic) || normTopic.includes(qTop)
      return subtopicMatches && topicMatches
    }).sort((a, b) => {
      // Prioritize questions matching the actual row grade
      const aGradeMatch = Number(a.grade) === targetGrade ? 1 : 0
      const bGradeMatch = Number(b.grade) === targetGrade ? 1 : 0
      return bGradeMatch - aGradeMatch
    })

    const microSkill = matchingWrongQuestions.find((q) => q.micro_skill)?.micro_skill || null
    const prereqConcept = matchingWrongQuestions.find((q) => q.prerequisite_concept)?.prerequisite_concept || null
    // prereqGrade from DB column — this is the actual root concept grade
    const rawPrereqGrade = matchingWrongQuestions.find((q) => q.prerequisite_grade && Number(q.prerequisite_grade) >= 1)?.prerequisite_grade || null

    const primaryGap = matchingWrongQuestions.find((q) => q.diagnosedGap)?.diagnosedGap
      || matchingWrongQuestions[0]?.reason
      || null
    const primaryRemediation = matchingWrongQuestions.find((q) => q.diagnosedRemediation)?.diagnosedRemediation
      || 'Review this concept and practice similar problems.'

    // Determine actual tested grade
    const testedGrade = Number(matchingWrongQuestions[0]?.grade) || targetGrade || targetGradeNum

    // Sanity check: Prerequisite grade CANNOT be greater than tested grade
    let prereqGrade = rawPrereqGrade ? Number(rawPrereqGrade) : null
    if (prereqGrade && prereqGrade > testedGrade) {
      prereqGrade = testedGrade
    }

    // CASE A: Probe ran and found real weakness at a lower grade (weaknessMap has data)
    if (mapInfo && mapInfo.rootGrade) {
      const probeRootGrade = Number(mapInfo.rootGrade)
      const validProbeGrade = probeRootGrade >= 1 && probeRootGrade <= testedGrade
      const rootGrade = validProbeGrade ? probeRootGrade : testedGrade
      const gradesBehind = validProbeGrade ? Math.max(0, testedGrade - rootGrade) : 0
      return {
        rootGrade: testedGrade,
        gradesBehind,
        probeRan: true,
        probeDepth: mapInfo.probeDepth || 1,
        resolved: mapInfo.resolved,
        specificGap: primaryGap,
        remediation: primaryRemediation,
        microSkill,
        prereqConcept,
        prereqGrade: prereqGrade || rootGrade,
      }
    }

    // CASE B: No probe — use actual tested question grade
    if (matchingWrongQuestions.length > 0) {
      const gradesBehind = prereqGrade && prereqGrade < testedGrade ? testedGrade - prereqGrade : 0
      return {
        rootGrade: testedGrade,
        gradesBehind,
        probeRan: false,
        resolved: false,
        specificGap: primaryGap,
        remediation: primaryRemediation,
        microSkill,
        prereqConcept,
        prereqGrade: prereqGrade ? Number(prereqGrade) : null,
      }
    }

    return null
  }

  const flatSubtopicRows = Object.entries(subtopicReport || {}).flatMap(([gradeKey, topics]) =>
    Object.entries(topics || {}).flatMap(([topicName, subtopics]) =>
      Object.entries(subtopics || {})
        .filter(([, outcome]) => outcome !== '–')
        .map(([subtopicName, outcome]) => {
          const isSuccess = outcome === '\u2713' || outcome === 'Correct'
          const rowGrade = Number(String(gradeKey).replace(/\D+/g, '')) || targetGradeNum
          const diagnostic = !isSuccess ? getSubtopicDiagnosticInfo(subtopicName, topicName, rowGrade) : null
          return {
            gradeKey,
            topicName,
            subtopicName,
            outcome,
            isSuccess,
            diagnostic,
          }
        })
    )
  )

  const masteredSubtopics = flatSubtopicRows.filter((r) => r.isSuccess)
  const weakSubtopicGaps = flatSubtopicRows
    .filter((r) => !r.isSuccess)
    .sort((a, b) => (b.diagnostic?.gradesBehind || 0) - (a.diagnostic?.gradesBehind || 0))

  const wrongQuestions = comprehensiveQuestions.filter((q) => !q.isCorrect)

  const displayedQuestions = comprehensiveQuestions.filter((q) => {
    if (activeFilter === 'wrong') return !q.isCorrect
    if (activeFilter === 'correct') return q.isCorrect
    return true
  })

  const toggleQuestionExpand = (id) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    let active = true
    apiRequest('/admin/topics')
      .then((topics) => {
        if (!active || !Array.isArray(topics)) return
        const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        const hierarchy = {}
        topics.forEach((topic) => {
          if (!topic?.parentTopicId || !topic.parentName || !topic.name) return
          const parentKey = normalize(topic.parentName)
          hierarchy[parentKey] = [...(hierarchy[parentKey] || []), topic.name]
        })
        setTopicHierarchy(hierarchy)
        setTopicDescriptions(Object.fromEntries(
          topics
            .filter((topic) => topic?.name && topic?.description)
            .map((topic) => [topic.name, topic.description]),
        ))
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    apiRequest(`/profile?userId=${user.id}`)
      .then((profile) => {
        if (active && profile?.age != null && profile.age !== '') setProfileAge(profile.age)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user?.id])

  const handleDetailedDownload = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const pageHeight = pdf.internal.pageSize.getHeight()
      const contentWidth = pageWidth - margin * 2
      const text = (value, x, y, size = 8, color = [30, 41, 59], style = 'normal') => {
        pdf.setFont('helvetica', style)
        pdf.setFontSize(size)
        pdf.setTextColor(...color)
        const safeValue = String(value ?? '').replace(/[^\x20-\x7E]/g, ' ')
        pdf.text(safeValue, x, y)
      }

      let cursorY = 18
      text('EduCheck - Diagnostic Assessment System', margin, cursorY, 15, [15, 23, 42], 'bold')
      cursorY += 8
      text('Detailed Subtopic Diagnostic & Weak Points Report', margin, cursorY, 12, [71, 85, 105], 'bold')
      cursorY += 8
      text(`Student: ${user.name || report.studentName || 'Student'}  |  Target Grade: Grade ${targetGradeNum}  |  Demonstrated Level: Grade ${demonstratedGradeNum}`, margin, cursorY, 9)
      cursorY += 6
      text(`Assessment Date: ${new Date(report.testDate || Date.now()).toLocaleString()}  |  Score: ${totalCorrect}/${totalQuestions} (${scorePercent}%)`, margin, cursorY, 8)
      cursorY += 10

      if (wrongQuestions.length) {
        if (cursorY > pageHeight - 45) { pdf.addPage(); cursorY = 18 }
        text('Identified Weak Points & AI Guidance:', margin, cursorY, 10, [185, 28, 28], 'bold')
        cursorY += 6
        for (const item of wrongQuestions) {
          if (cursorY > pageHeight - 25) { pdf.addPage(); cursorY = 18 }
          const lines = pdf.splitTextToSize(`Q: ${item.topic} / ${item.subtopic}: ${item.question}`, contentWidth - 4)
          lines.slice(0, 2).forEach((line) => { text(line, margin + 2, cursorY, 7, [15, 23, 42], 'bold'); cursorY += 4 })
          text(`Student Selected: ${item.selectedAnswer || 'None'}  |  Correct Answer: ${item.correctAnswer || '-'}`, margin + 2, cursorY, 7, [185, 28, 28], 'bold')
          cursorY += 4
          if (item.reason) {
            const reasonLines = pdf.splitTextToSize(`Mistake Reason: ${item.reason}`, contentWidth - 4)
            reasonLines.slice(0, 2).forEach((line) => { text(line, margin + 2, cursorY, 6.5, [185, 28, 28]); cursorY += 3.5 })
          }
          const expLines = pdf.splitTextToSize(`Solution: ${item.explanation}`, contentWidth - 4)
          expLines.slice(0, 3).forEach((line) => { text(line, margin + 2, cursorY, 7, [71, 85, 105]); cursorY += 4 })
          cursorY += 2
        }
      }

      const grades = Object.keys(subtopicReport || {})
      if (grades.length) {
        if (cursorY > pageHeight - 35) { pdf.addPage(); cursorY = 18 }
        cursorY += 6
        text('Subtopic Mastery Breakdown (Tick / Cross)', margin, cursorY, 10, [15, 23, 42], 'bold')
        cursorY += 6

        const rows = grades.flatMap((gradeKey) => {
          const topics = subtopicReport[gradeKey]
          if (!topics || typeof topics !== 'object') return []
          return Object.entries(topics).flatMap(([topicName, subtopics]) => (
            Object.entries(subtopics || {}).map(([subtopicName, outcome]) => ({
              grade: gradeKey,
              topic: topicName,
              subtopic: formatSubtopicTitle(subtopicName),
              status: outcome === '\u2713' ? 'Mastered' : outcome === '\u2717' ? 'Needs Practice' : outcome,
            }))
          ))
        })

        const drawTableHeader = () => {
          const headerY = cursorY
          const columns = [margin, margin + 27, margin + 72, margin + 145]
          const widths = [27, 45, 73, contentWidth - 145]
          pdf.setFillColor(226, 232, 240)
          pdf.rect(margin, headerY - 5, contentWidth, 9, 'F')
          ;['Grade', 'Topic', 'Subtopic', 'Status'].forEach((label, index) => {
            text(label, columns[index] + 2, headerY + 1, 7, [30, 41, 59], 'bold')
            if (index < columns.length - 1) {
              pdf.setDrawColor(203, 213, 225)
              pdf.line(columns[index] + widths[index], headerY - 5, columns[index] + widths[index], headerY + 4)
            }
          })
          cursorY += 9
        }

        if (rows.length) {
          drawTableHeader()
          for (const row of rows) {
            if (cursorY > pageHeight - 18) {
              pdf.addPage()
              cursorY = 18
              drawTableHeader()
            }
            const columns = [margin, margin + 27, margin + 72, margin + 145]
            const widths = [27, 45, 73, contentWidth - 145]
            pdf.setDrawColor(226, 232, 240)
            pdf.line(margin, cursorY + 4, margin + contentWidth, cursorY + 4)
            ;[row.grade, row.topic, row.subtopic, row.status].forEach((value, index) => {
              const line = pdf.splitTextToSize(String(value), widths[index] - 4)[0]
              text(line, columns[index] + 2, cursorY, 7, index === 3 && value === 'Mastered' ? [5, 150, 105] : index === 3 ? [220, 38, 38] : [71, 85, 105], index === 3 ? 'bold' : 'normal')
            })
            cursorY += 7
          }
        }
      }

      pdf.save(`EduCheck_Detailed_Report_${(user.name || report.studentName || 'Student').replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Detailed PDF generation failed:', error)
      alert(`Error generating detailed report: ${error.message || 'Please try again.'}`)
    }
  }

  const handleDownload = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const contentWidth = pageWidth - margin * 2

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

      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, 297, 'F')
      text('EduCheck', margin, 13, 15, [15, 23, 42], 'bold')
      text('Adaptive Diagnostic Assessment System', margin, 19, 6, [71, 85, 105])
      text('Assessment Report', pageWidth - margin - 28, 11, 5, [71, 85, 105])
      text(new Date(report.testDate || Date.now()).toLocaleString(), pageWidth - margin - 42, 16, 5, [15, 23, 42])

      const half = (contentWidth - 4) / 2
      card(margin, 25, half, 16, 'STUDENT NAME', report.studentName || user.name || 'Student', [248, 250, 252])
      card(margin + half + 4, 25, half, 16, 'TARGET GRADE', `Grade ${targetGradeNum}`, [248, 250, 252])
      card(margin, 45, half, 16, 'DEMONSTRATED MATH LEVEL', `Grade ${demonstratedGradeNum}`, [240, 253, 250])
      card(margin + half + 4, 45, half, 16, 'DIAGNOSTIC CONFIDENCE', diagnosticConfidence, [248, 250, 252])

      const metricWidth = (contentWidth - 9) / 4
      card(margin, 66, metricWidth, 16, 'TOTAL MCQS', totalQuestions, [239, 246, 255])
      card(margin + metricWidth + 3, 66, metricWidth, 16, 'ACCURATE ANSWERS', totalCorrect, [236, 253, 245])
      card(margin + (metricWidth + 3) * 2, 66, metricWidth, 16, 'WRONG ANSWERS', totalWrong, [254, 242, 242])
      card(margin + (metricWidth + 3) * 3, 66, metricWidth, 16, 'OVERALL ACCURACY', `${scorePercent}%`, [254, 249, 195])

      const gradePerformanceRows = (report.gradePerformance || [])
        .filter((grade) => Number(grade.total || 0) > 0)
        .map((grade) => ({
          label: `Grade ${grade.gradeNumber}`,
          correct: Number(grade.correct || 0),
          total: Number(grade.total || 0),
        }))
      const topicPerformanceRows = (report.topicWisePerformance || [])
        .filter((topic) => Number(topic.totalAttempted || topic.attemptedQuestions || 0) > 0)
        .map((topic) => ({
          label: topic.topicName,
          correct: Number(topic.totalCorrect ?? topic.correctAnswers ?? 0),
          total: Number(topic.totalAttempted ?? topic.attemptedQuestions ?? 0),
        }))
      const drawPerformanceTable = (title, firstColumn, rows, startY) => {
        const tableHeight = 12 + Math.max(rows.length, 1) * 8
        if (startY + tableHeight > 280) {
          pdf.addPage()
          startY = 18
        }

        text(title, margin, startY, 10, [15, 23, 42], 'bold')
        const tableY = startY + 4
        const columnX = [margin, margin + contentWidth * 0.47, margin + contentWidth * 0.72]
        const columnWidths = [contentWidth * 0.47, contentWidth * 0.25, contentWidth * 0.28]
        pdf.setFillColor(241, 245, 249)
        pdf.setDrawColor(214, 222, 232)
        pdf.rect(margin, tableY, contentWidth, 9, 'FD')
        ;[firstColumn, 'Correct/Total', 'Accuracy'].forEach((label, index) => {
          text(label, columnX[index] + 3, tableY + 6, 8, [30, 41, 59], 'bold')
          if (index < 2) pdf.line(columnX[index] + columnWidths[index], tableY, columnX[index] + columnWidths[index], tableY + tableHeight - 3)
        })

        const tableRows = rows.length ? rows : [{ label: 'No data', correct: 0, total: 0 }]
        tableRows.forEach((row, index) => {
          const rowY = tableY + 9 + index * 8
          pdf.setDrawColor(226, 232, 240)
          pdf.line(margin, rowY + 8, margin + contentWidth, rowY + 8)
          const accuracy = row.total ? Math.round((row.correct / row.total) * 100) : 0
          text(row.label, columnX[0] + 3, rowY + 5.5, 8, [15, 23, 42], 'normal')
          text(`${row.correct}/${row.total}`, columnX[1] + 3, rowY + 5.5, 8, [15, 23, 42], 'normal')
          text(`${accuracy}%`, columnX[2] + 3, rowY + 5.5, 8, accuracy >= 70 ? [5, 150, 105] : accuracy >= 40 ? [180, 110, 10] : [220, 38, 38], 'bold')
        })
        return tableY + 9 + tableRows.length * 8 + 8
      }

      let performanceY = 116
      performanceY = drawPerformanceTable('Grade-wise Performance', 'Grade', gradePerformanceRows, performanceY)
      drawPerformanceTable('Topic-wise Performance', 'Topic', topicPerformanceRows, performanceY)

      pdf.save(`EduCheck_Report_${(report.studentName || user.name || 'Student').replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className={`mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Top Banner Card */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl backdrop-blur-xl ${
        darkMode ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Sparkles size={14} /> Diagnostic Assessment Report
            </div>
            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
              {user.name || report.studentName || 'Student'}
            </h1>
            <p className={`mt-1.5 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Completed {totalQuestions} Adaptive Questions • {new Date(report.testDate || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDetailedDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-105 active:scale-95"
            >
              <Download size={16} /> Download Detailed PDF
            </button>
            <button
              onClick={handleDownload}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:scale-105 active:scale-95 ${
                darkMode ? 'border-white/10 bg-slate-900/80 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Download size={16} /> Summary PDF
            </button>
            <button
              onClick={() => window.print()}
              className={`inline-flex items-center gap-2 rounded-xl border p-2.5 text-sm transition hover:scale-105 ${
                darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'
              }`}
              title="Print Report"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Overview & Growth Areas Banner */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-lg backdrop-blur-xl ${
        darkMode
          ? 'border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-slate-950/20'
          : 'border-slate-200 bg-gradient-to-br from-white via-sky-50/30 to-white shadow-slate-200/50'
      }`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25">
              <Target size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-0.5 text-xs font-bold text-sky-500 dark:text-sky-400">
                <Sparkles size={12} /> Personalized Learning Overview
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Learning Summary & Next Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                See the skills you have mastered and the exact areas to practice next.
              </p>
            </div>
          </div>

          {/* Clean Aligned 3-Stat Row (Guaranteed No Awkward Wrapping) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div className={`rounded-2xl border px-3.5 py-2.5 text-center ${
              darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Evaluated</div>
              <div className="text-base sm:text-lg font-extrabold text-sky-500">{flatSubtopicRows.length} Topics</div>
            </div>
            <div className={`rounded-2xl border px-3.5 py-2.5 text-center ${
              darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Mastered</div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-500">{masteredSubtopics.length} ✓</div>
            </div>
            <div className={`rounded-2xl border px-3.5 py-2.5 text-center ${
              darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">To Practice</div>
              <div className="text-base sm:text-lg font-extrabold text-rose-500">{weakSubtopicGaps.length}</div>
            </div>
          </div>
        </div>

        {/* Skills to Practice Next (Concise, Encouraging & Kid-Friendly) */}
        {weakSubtopicGaps.length > 0 ? (
          <div className="mt-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
              <Sparkles size={14} /> Skills to Practice Next
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(showAllGaps ? weakSubtopicGaps : weakSubtopicGaps.slice(0, 6)).map((item, idx) => {
                const actualGrade    = item.diagnostic?.rootGrade || targetGradeNum
                const prereqGrade    = item.diagnostic?.prereqGrade || null
                const behind         = item.diagnostic?.gradesBehind || 0
                const probeRan       = item.diagnostic?.probeRan || false
                const microSkill     = item.diagnostic?.microSkill || null
                const prereqConcept  = item.diagnostic?.prereqConcept || null
                const issue          = cleanConciseIssue(item.diagnostic?.specificGap)
                const fix            = cleanConciseFix(item.diagnostic?.remediation)
                const subtopicLabel  = formatSubtopicTitle(item.subtopicName)

                return (
                  <div
                    key={`gap-${idx}`}
                    className={`rounded-2xl border p-4 flex flex-col gap-3 transition hover:border-sky-400/40 shadow-sm ${
                      darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* ── HEADER: Topic label & Foundation Badge ─────────────── */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-sky-500 uppercase tracking-wider">
                        {item.topicName}
                      </span>
                      {prereqGrade && prereqGrade < actualGrade ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Needs Gr {prereqGrade} Foundation
                        </span>
                      ) : behind > 0 ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Foundation Review
                        </span>
                      ) : (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          Grade {actualGrade} Practice
                        </span>
                      )}
                    </div>

                    {/* ── WEAKNESS LOCATION BOX ─────────────── */}
                    <div className={`rounded-xl border p-3 space-y-2 ${
                      darkMode ? 'border-sky-500/20 bg-sky-950/30' : 'border-sky-200 bg-sky-50'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                        📍 Weakness Location
                      </div>

                      {/* Grade */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className={`w-16 shrink-0 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Grade:</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-slate-700 text-white text-[11px]">
                          Grade {actualGrade}
                        </span>
                        {prereqGrade && prereqGrade !== actualGrade && (
                          <span className={`text-[10px] font-medium ${darkMode ? 'text-amber-400/80' : 'text-amber-600'}`}>
                            (Prerequisite: Grade {prereqGrade})
                          </span>
                        )}
                      </div>

                      {/* Topic */}
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className={`w-16 shrink-0 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Topic:</span>
                        <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.topicName}</span>
                      </div>

                      {/* Subtopic */}
                      <div className="flex items-start gap-2 text-[11px]">
                        <span className={`w-16 shrink-0 font-semibold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subtopic:</span>
                        <span className={`font-semibold leading-snug ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{subtopicLabel}</span>
                      </div>

                      {/* Micro-Skill — THE EXACT WEAKNESS */}
                      {(microSkill || prereqConcept) && (
                        <div className={`flex items-start gap-2 text-[11px] pt-1.5 mt-0.5 border-t ${darkMode ? 'border-white/5' : 'border-sky-100'}`}>
                          <span className={`w-16 shrink-0 font-semibold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weak Skill:</span>
                          <span className="font-bold text-amber-400">
                            {microSkill || prereqConcept}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── PRACTICE RECOMMENDATION ──────────────────────── */}
                    {(microSkill || prereqConcept) && (
                      <div className={`mt-auto pt-2.5 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <span className="w-full inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-400 bg-sky-500/10 border border-sky-400/20 px-2.5 py-1.5 rounded-xl">
                          📚 Practice: Grade {prereqGrade || actualGrade} — {microSkill || prereqConcept}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}

            </div>

            {/* View All / Show Less Toggle Button */}
            {weakSubtopicGaps.length > 6 && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllGaps(!showAllGaps)}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-xs font-bold text-sky-500 hover:bg-sky-500/20 transition cursor-pointer"
                >
                  {showAllGaps ? (
                    <>
                      <ChevronUp size={14} /> Show Top 6 Priority Areas Only
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> View All {weakSubtopicGaps.length} Areas to Practice (See More)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm font-semibold text-emerald-400">
            ✓ Excellent performance! All evaluated concepts demonstrate strong grade-level mastery with no prerequisite knowledge gaps.
          </div>
        )}

        {/* Mastered Strengths Pill Bar */}
        {masteredSubtopics.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Mastered Concepts (Grade-Level Ready)
            </div>
            <div className="flex flex-wrap gap-2">
              {masteredSubtopics.map((m, idx) => (
                <span
                  key={`mastered-${idx}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  ✓ {formatSubtopicTitle(m.subtopicName)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gemini AI Diagnostic Guidance & Resolution Section */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${
        darkMode ? 'border-violet-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/40' : 'border-violet-200 bg-gradient-to-br from-white via-violet-50/40 to-white shadow-violet-100'
      }`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 to-sky-500 text-white shadow-md">
              <Brain size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Gemini AI Smart Feedback & Step-by-Step Solutions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Step-by-step worked solutions and conceptual remediation for each question:
              </p>
            </div>
          </div>
        </div>

        {geminiReport?.summary && (
          <div className={`mt-5 rounded-2xl border p-4 text-sm leading-relaxed ${
            darkMode ? 'border-violet-500/30 bg-violet-950/20 text-slate-200' : 'border-violet-200 bg-violet-50 text-slate-800'
          }`}>
            <p className="font-semibold text-violet-500 mb-1">AI Diagnostic Summary:</p>
            <p>{geminiReport.summary}</p>
          </div>
        )}

        {/* Filter Tabs for Question Review */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4 dark:border-white/10 border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('wrong')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
                activeFilter === 'wrong'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : darkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Needs Practice ({wrongQuestions.length})
            </button>
          </div>
          <span className="text-xs text-slate-500">
            Showing {displayedQuestions.length} questions
          </span>
        </div>

        {/* Question Review Cards */}
        <div className="mt-6 space-y-4">
          {displayedQuestions.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center border-dashed dark:border-white/10 border-slate-300">
              <p className="text-slate-500">No questions found for this filter.</p>
            </div>
          ) : (
            displayedQuestions.map((q) => {
              const isExpanded = expandedQuestions[q.id] !== false
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    !q.isCorrect
                      ? darkMode ? 'border-rose-500/30 bg-slate-950/60' : 'border-rose-200 bg-white'
                      : darkMode ? 'border-white/10 bg-slate-950/40' : 'border-slate-200 bg-white'
                  }`}
                >
                  {/* Question Header */}
                  <div
                    onClick={() => toggleQuestionExpand(q.id)}
                    className="flex cursor-pointer items-start justify-between gap-4 p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        !q.isCorrect ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        Q{q.number}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            darkMode ? 'bg-slate-800 text-sky-300' : 'bg-sky-100 text-sky-800'
                          }`}>
                            Grade {q.grade}
                          </span>
                          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            q.difficulty === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' :
                            q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          }`}>
                            {q.difficulty} Difficulty
                          </span>
                        </div>
                        <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        q.isCorrect
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      }`}>
                        {q.isCorrect ? 'Correct' : 'Needs Practice'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  {/* Question Body */}
                  {isExpanded && (
                    <div className={`border-t px-4 pb-5 pt-3 sm:px-5 sm:pb-5 ${darkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'}`}>
                      {/* MCQ Options Display */}
                      <div className="grid gap-2 sm:grid-cols-2 mt-2">
                        {['A', 'B', 'C', 'D'].map((letter) => {
                          const optionText = q.options?.[letter] || q.options?.[letter.toLowerCase()] || ''
                          if (!optionText) return null
                          const isStudentPick = String(q.selectedAnswer).toUpperCase() === letter
                          const isTheCorrectOption = String(q.correctAnswer).toUpperCase() === letter

                          return (
                            <div
                              key={letter}
                              className={`flex items-center gap-3 rounded-xl border p-2.5 text-xs sm:text-sm font-medium ${
                                isTheCorrectOption
                                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                  : isStudentPick && !q.isCorrect
                                  ? 'border-rose-500/60 bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                  : darkMode ? 'border-white/5 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                isTheCorrectOption
                                  ? 'bg-emerald-500 text-white'
                                  : isStudentPick && !q.isCorrect
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {letter}
                              </span>
                              <span className="flex-1">{optionText}</span>
                              {isTheCorrectOption && <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">✓ Accurate</span>}
                              {isStudentPick && !q.isCorrect && <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">✗ Wrong</span>}
                            </div>
                          )
                        })}
                      </div>

                      {/* Mistake Reason Callout (When Question is Wrong) */}
                      {!q.isCorrect && (q.reason || q.diagnosedGap) && (
                        <div className={`mt-3 rounded-xl border p-3.5 text-xs sm:text-sm ${
                          darkMode ? 'border-rose-500/30 bg-rose-950/30 text-rose-200' : 'border-rose-200 bg-rose-50/90 text-rose-950'
                        }`}>
                          <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                            <AlertCircle size={16} />
                            <span>
                              Why {q.selectedAnswer ? `Option ${String(q.selectedAnswer).toUpperCase()}` : 'Your Answer'} is Incorrect:
                            </span>
                          </div>
                          <p className="mt-1.5 leading-relaxed font-normal">
                            {q.diagnosedGap || q.reason}
                          </p>
                          {q.diagnosedRemediation && (
                            <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-900/60 flex items-start gap-1.5 text-sky-800 dark:text-sky-300 font-normal">
                              <strong className="font-semibold shrink-0 text-sky-900 dark:text-sky-200">Recommended Practice:</strong>
                              <span>{q.diagnosedRemediation}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step-by-Step AI Explanation Card */}
                      <div className={`mt-3 rounded-xl border p-4 text-xs sm:text-sm ${
                        !q.isCorrect
                          ? darkMode ? 'border-sky-500/30 bg-sky-950/30 text-sky-100' : 'border-sky-200 bg-sky-50/90 text-sky-950'
                          : darkMode ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-100' : 'border-emerald-200 bg-emerald-50/80 text-emerald-950'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400">
                          <Brain size={16} />
                          <span>How to Solve:</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {parseExplanationSteps(q.explanation, q.correctAnswer, {
                            options: q.options,
                            question: q.question,
                            subtopic: q.subtopic,
                            topic: q.topic,
                          }).map((step, sIdx) => {
                            const isConclusion = step.label.toLowerCase().includes('conclusion')
                            return (
                              <div
                                key={sIdx}
                                className={`flex items-start gap-2.5 rounded-xl p-3 border text-xs sm:text-sm leading-relaxed ${
                                  isConclusion
                                    ? darkMode
                                      ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-200'
                                      : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                                    : darkMode
                                    ? 'border-white/5 bg-slate-900/60 text-slate-200'
                                    : 'border-slate-200 bg-white text-slate-800'
                                }`}
                              >
                                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold shrink-0 shadow-sm ${
                                  isConclusion
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-sky-500 text-white'
                                }`}>
                                  {isConclusion ? 'Accurate Answer' : step.label}
                                </span>
                                <span className="flex-1 font-normal">
                                  {step.text}
                                </span>
                              </div>
                            )
                          })}
                        </div>

                        {q.subtopicFoundationalGap && (
                          <p className="mt-2.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <strong>Foundational Gap:</strong> {q.subtopicFoundationalGap}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Detailed Subtopic Tick/Cross Report Table */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-lg ${
        darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold">Detailed Subtopic Mastery Table (Tick / Cross)</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Review each grade and topic to see which subtopics are mastered and which require further practice
            </p>
          </div>
        </div>

        <div className={`overflow-x-auto rounded-2xl border ${darkMode ? 'border-white/10 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'}`}>
          <table className={`min-w-full text-left text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <thead className={darkMode ? 'bg-slate-900/90 text-slate-300 font-semibold' : 'bg-slate-100 text-slate-700 font-semibold'}>
              <tr>
                <th className="px-5 py-3.5">Grade Level</th>
                <th className="px-5 py-3.5">Topic</th>
                <th className="px-5 py-3.5">Subtopic & Identified Gap</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Root Level (Prerequisite)</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/5 divide-slate-200">
              {Object.entries(subtopicReport || {}).flatMap(([gradeKey, topics]) =>
                Object.entries(topics || {}).flatMap(([topicName, subtopics]) =>
                  Object.entries(subtopics || {})
                    .filter(([, outcome]) => outcome !== '–')
                    .map(([subtopicName, outcome]) => {
                      const isSuccess = outcome === '\u2713' || outcome === 'Correct'
                      const diag = !isSuccess ? getSubtopicDiagnosticInfo(subtopicName, topicName) : null
                      const rootG = diag?.rootGrade || targetGradeNum
                      const behind = diag?.gradesBehind || 0

                      return (
                        <tr key={`${gradeKey}-${topicName}-${subtopicName}`} className={darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/50'}>
                          <td className="px-5 py-3.5 font-bold text-sky-500">{gradeKey}</td>
                          <td className="px-5 py-3.5 font-medium">{topicName}</td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{formatSubtopicTitle(subtopicName)}</div>
                            {diag?.microSkill && (
                              <div className="text-[11px] font-medium text-sky-500 dark:text-sky-400">
                                ↳ {diag.microSkill}
                              </div>
                            )}
                            {!isSuccess && diag?.specificGap && (
                              <div className="mt-1 text-xs text-rose-500 dark:text-rose-400 font-normal">
                                <span className="font-bold uppercase tracking-wider text-[10px] text-rose-600 dark:text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded mr-1">Specific Gap</span>
                                {cleanConciseIssue(diag.specificGap)}
                              </div>
                            )}
                            {!isSuccess && diag?.remediation && (
                              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 italic">
                                💡 {cleanConciseFix(diag.remediation)}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              isSuccess
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}>
                              {isSuccess ? '✓ Mastered' : '✗ Needs Practice'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {isSuccess ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                                ✓ Grade Level
                              </span>
                            ) : behind > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                Grade {rootG} ⚠️ ({behind} {behind === 1 ? 'grade' : 'grades'} behind)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                Grade {targetGradeNum} (At Grade)
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    }),
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Link
          to="/dashboard"
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
            darkMode ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Back to Dashboard
        </Link>
        <Link
          to="/start-test"
          onClick={handleRetakeWeakAreas}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-105 active:scale-95"
        >
          <RotateCcw size={16} /> Retake Diagnostic Assessment <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
