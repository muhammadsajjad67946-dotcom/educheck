import { useEffect, useRef, useState } from 'react'
import { Search, Plus, Download, Upload, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiRequest } from '../../utils/api'

const emptyForm = {
  question: '',
  subject: 'Math',
  topic: 'Number & Operations',
  topicId: '',
  subtopic: '',
  subtopicId: '',
  grade: '1',
  difficulty: 'Low',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  answer: 'A',
}

// Difficulty Badge
function DifficultyBadge({ difficulty }) {
  const colors = {
    Low: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
    Medium: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
    High: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[difficulty] || colors.Medium}`}>
      {difficulty}
    </span>
  )
}

// Status Badge
function StatusBadge({ status }) {
  const colors = {
    Active: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
    Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700',
    Archived: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
  }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || colors.Active}`}>
      {status}
    </span>
  )
}

export default function AdminQuestions() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterGrade, setFilterGrade] = useState('All')
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [questions, setQuestions] = useState([])
  const [topics, setTopics] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [allQuestionsLoaded, setAllQuestionsLoaded] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState('')
  const [selectedSubtopicId, setSelectedSubtopicId] = useState('')
  const importInputRef = useRef(null)

  const parentTopics = topics.filter((topic) => !topic.parentTopicId)
  const subtopics = selectedTopicId ? topics.filter((topic) => Number(topic.parentTopicId) === Number(selectedTopicId)) : []

  useEffect(() => {
    apiRequest('/admin/topics')
      .then(setTopics)
      .catch((error) => setFormError(error.message))
  }, [])

  useEffect(() => {
    if (!selectedTopicId && parentTopics.length) {
      setSelectedTopicId(String(parentTopics[0].id))
    }
  }, [parentTopics, selectedTopicId])

  useEffect(() => {
    const chosenTopic = topics.find((topic) => String(topic.id) === String(selectedTopicId))
    const chosenSubtopic = topics.find((topic) => String(topic.id) === String(selectedSubtopicId))

    updateForm('topicId', selectedTopicId || '')
    updateForm('subtopicId', selectedSubtopicId || '')
    updateForm('topic', chosenTopic ? chosenTopic.name : '')
    updateForm('subtopic', chosenSubtopic ? chosenSubtopic.name : '')
  }, [selectedTopicId, selectedSubtopicId, topics])

  const loadAllQuestions = async () => {
    setIsLoadingAll(true)
    try {
      const data = await apiRequest('/questions?minGrade=1&maxGrade=8&limit=10000')
      setQuestions(data.map((question) => ({ ...question, status: 'Active' })))
      setAllQuestionsLoaded(true)
      setCurrentPage(1)
      setFormError('')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsLoadingAll(false)
    }
  }

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }))

  const handleAddQuestion = async (event) => {
    event.preventDefault()
    const topicToSave = topics.find((topic) => String(topic.id) === String(selectedTopicId))
    const subtopicToSave = topics.find((topic) => String(topic.id) === String(selectedSubtopicId))

    if (!topicToSave) {
      setFormError('Please choose a valid topic before saving.')
      return
    }

    if (subtopicToSave && Number(subtopicToSave.parentTopicId) !== Number(topicToSave.id)) {
      setFormError('The selected subtopic must belong to the chosen topic.')
      return
    }

    const options = {
      A: form.optionA.trim(),
      B: form.optionB.trim(),
      C: form.optionC.trim(),
      D: form.optionD.trim(),
    }

    if (!form.question.trim() || Object.values(options).some((option) => !option)) {
      setFormError('Question and all four options are required.')
      return
    }

    setIsSaving(true)
    try {
      const newQuestion = await apiRequest(editingQuestionId ? `/admin/questions/${editingQuestionId}` : '/admin/questions', {
        method: editingQuestionId ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...form,
          topic: topicToSave.name,
          subtopic: subtopicToSave ? subtopicToSave.name : '',
          topicId: topicToSave.id,
          subtopicId: subtopicToSave ? subtopicToSave.id : null,
          grade: Number(form.grade),
          options,
        }),
      })
      setQuestions((previous) => editingQuestionId
        ? previous.map((item) => item.id === editingQuestionId ? { ...item, ...newQuestion, correctAnswer: newQuestion.answer } : item)
        : [...previous, newQuestion])
      setForm(emptyForm)
      setEditingQuestionId(null)
      setSelectedTopicId(parentTopics[0]?.id ? String(parentTopics[0].id) : '')
      setSelectedSubtopicId('')
      setFormError('')
      setShowAddModal(false)
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const openAddModal = () => {
    setForm(emptyForm)
    setEditingQuestionId(null)
    setSelectedTopicId(parentTopics[0]?.id ? String(parentTopics[0].id) : '')
    setSelectedSubtopicId('')
    setFormError('')
    setShowAddModal(true)
  }

  const openEditModal = (question) => {
    const topic = topics.find((item) => String(item.id) === String(question.topicId || question.parentTopicId))
    const subtopic = topics.find((item) => String(item.id) === String(question.subtopicId))
    const gradeNumber = Number(question.gradeId || String(question.grade).match(/\d+/)?.[0] || 1)
    setForm({
      question: question.question || '',
      subject: question.subject || 'Math',
      topic: topic?.name || question.topic || '',
      topicId: topic?.id || '',
      subtopic: subtopic?.name || question.subtopic || '',
      subtopicId: subtopic?.id || '',
      grade: String(gradeNumber),
      difficulty: question.difficulty || 'Low',
      optionA: question.options?.A || '',
      optionB: question.options?.B || '',
      optionC: question.options?.C || '',
      optionD: question.options?.D || '',
      answer: (question.correctAnswer || 'A').toUpperCase(),
    })
    setSelectedTopicId(topic?.id ? String(topic.id) : '')
    setSelectedSubtopicId(subtopic?.id ? String(subtopic.id) : '')
    setEditingQuestionId(question.id)
    setFormError('')
    setShowAddModal(true)
  }

  const handleDeleteQuestion = (questionId) => {
    setQuestions((previous) => previous.filter((question) => question.id !== questionId))
  }

  const escapeCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportQuestions = allQuestionsLoaded
        ? filteredQuestions
        : (await apiRequest('/questions?minGrade=1&maxGrade=8&limit=10000')).filter((question) => {
          const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesSubject = filterSubject === 'All' || filterSubject === 'All Subjects' || question.subject === filterSubject
          const matchesGrade = filterGrade === 'All' || filterGrade === 'All Grades' || question.grade === filterGrade
          const matchesDifficulty = filterDifficulty === 'All' || filterDifficulty === 'All Difficulty' || question.difficulty === filterDifficulty
          return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty
        })

      const headers = ['ID', 'Question', 'Subject', 'Topic ID', 'Topic', 'Subtopic ID', 'Subtopic', 'Grade', 'Difficulty', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Explanation']
      const rows = exportQuestions.map((question) => [
        question.id,
        question.question,
        question.subject,
        question.topicId,
        question.topic,
        question.subtopicId,
        question.subtopic,
        question.grade,
        question.difficulty,
        question.options?.A,
        question.options?.B,
        question.options?.C,
        question.options?.D,
        question.correctAnswer,
        question.explanation,
      ])
      const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n')
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `educheck-question-bank-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setFormError('')
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsExporting(false)
    }
  }

  const parseCsv = (text) => {
    const records = []
    let row = []
    let value = ''
    let quoted = false
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index]
      if (character === '"' && quoted && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (character === '"') {
        quoted = !quoted
      } else if (character === ',' && !quoted) {
        row.push(value)
        value = ''
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && text[index + 1] === '\n') index += 1
        row.push(value)
        if (row.some((cell) => cell.trim())) records.push(row)
        row = []
        value = ''
      } else {
        value += character
      }
    }
    if (value || row.length) {
      row.push(value)
      if (row.some((cell) => cell.trim())) records.push(row)
    }
    if (records.length < 2) return []
    const headers = records[0].map((header) => header.trim().toLowerCase())
    return records.slice(1).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])))
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsImporting(true)
    try {
      const content = await file.text()
      const parsed = file.name.toLowerCase().endsWith('.csv')
        ? parseCsv(content)
        : JSON.parse(content)
      const sourceQuestions = Array.isArray(parsed) ? parsed : parsed.questions
      if (!Array.isArray(sourceQuestions) || !sourceQuestions.length) throw new Error('The file contains no questions.')

      const importedQuestions = []
      const failedQuestions = []
      for (const [index, item] of sourceQuestions.entries()) {
        const options = item.options || {}
        const rawGrade = item.grade || item.grade_id || item['grade id'] || 1
        const gradeMatch = String(rawGrade).match(/\d+/)
        const rawDifficulty = String(item.difficulty || item.difficulty_level || 'Medium').toLowerCase()
        const difficulty = rawDifficulty.includes('easy') || rawDifficulty.includes('low') ? 'Low' : rawDifficulty.includes('hard') || rawDifficulty.includes('high') ? 'High' : 'Medium'
        const rawAnswer = String(item.answer || item.correctAnswer || item.correct_answer || item['correct answer'] || item.correct_option || 'A').trim().toUpperCase()
        const payload = {
          question: item.question || item.question_text || item.text,
          subject: item.subject || 'Math',
          topic: item.topic || item.topic_name,
          topicId: item.topicId || item.topic_id || item['topic id'] || '',
          subtopic: item.subtopic || item.subtopic_name,
          subtopicId: item.subtopicId || item.subtopic_id || item['subtopic id'] || null,
          grade: Number(gradeMatch?.[0] || 1),
          difficulty,
          options: {
            A: options.A || options.a || item.option_a || item['option a'],
            B: options.B || options.b || item.option_b || item['option b'],
            C: options.C || options.c || item.option_c || item['option c'],
            D: options.D || options.d || item.option_d || item['option d'],
          },
          answer: rawAnswer.slice(0, 1),
          explanation: item.explanation || null,
        }
        try {
          const saved = await apiRequest('/admin/questions', { method: 'POST', body: JSON.stringify(payload) })
          importedQuestions.push(saved)
        } catch (error) {
          const preview = String(payload.question || '').trim().slice(0, 80) || 'Question text missing'
          failedQuestions.push(`Row ${index + 2}: ${error.message} (${preview})`)
        }
      }

      setQuestions((previous) => [...previous, ...importedQuestions])
      if (failedQuestions.length) {
        const shownErrors = failedQuestions.slice(0, 5).join(' | ')
        const remaining = failedQuestions.length > 5 ? ` | ...and ${failedQuestions.length - 5} more` : ''
        setFormError(`Imported ${importedQuestions.length} question${importedQuestions.length === 1 ? '' : 's'}, but ${failedQuestions.length} failed: ${shownErrors}${remaining}`)
      } else {
        setFormError(`Successfully imported ${importedQuestions.length} question${importedQuestions.length === 1 ? '' : 's'}.`)
      }
    } catch (error) {
      setFormError(`Import failed: ${error.message}`)
    } finally {
      setIsImporting(false)
    }
  }

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === 'All' || q.subject === filterSubject
    const matchesGrade = filterGrade === 'All' || q.grade === filterGrade
    const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty
    return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty
  })
  const pageSize = 25
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize))
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterSubject, filterGrade, filterDifficulty])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Question Bank</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Manage and organize all assessment questions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input ref={importInputRef} type="file" accept=".json,.csv,application/json,text/csv" onChange={handleImport} className="hidden" />
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition disabled:cursor-wait disabled:opacity-60"
          >
            <Upload size={18} />
            {isImporting ? 'Importing...' : 'Import'}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition disabled:cursor-wait disabled:opacity-60"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Subjects</option>
            <option>Math</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Grades</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option>All Difficulty</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Questions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{questions.length}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Filtered Results</p>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{filteredQuestions.length}</p>
          </div>
          <button
            type="button"
            onClick={loadAllQuestions}
            disabled={isLoadingAll || allQuestionsLoaded}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-sky-600 dark:bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 dark:hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 transition"
          >
            {isLoadingAll ? 'Loading...' : allQuestionsLoaded ? '✓ All Questions Loaded' : 'Load All Questions'}
          </button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Question</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Topic</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Difficulty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <p className="max-w-md text-sm font-medium text-slate-900 dark:text-white truncate" title={question.question}>
                      {question.question}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{question.subject}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{question.topic}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{String(question.grade).startsWith('Grade') ? question.grade : `Grade ${question.grade}`}</td>
                  <td className="px-6 py-4">
                    <DifficultyBadge difficulty={question.difficulty} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={question.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition">
                        <Eye size={18} />
                      </button>
                      <button type="button" onClick={() => openEditModal(question)} title="Edit question" className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 transition">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDeleteQuestion(question.id)} disabled className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredQuestions.length ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredQuestions.length)}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredQuestions.length}</span> questions
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700/80 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="min-w-20 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700/80 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingQuestionId ? 'Edit MCQ' : 'Add MCQ'}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{editingQuestionId ? 'Update this question and its answer options.' : 'Create a question with four answer options.'}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Question</span>
                <textarea
                  required
                  rows="3"
                  value={form.question}
                  onChange={(event) => updateForm('question', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="Enter your MCQ question"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</span>
                  <select
                    value={form.subject}
                    onChange={(event) => updateForm('subject', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Topic</span>
                  <select
                    value={selectedTopicId}
                    onChange={(event) => setSelectedTopicId(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    {parentTopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Subtopic</span>
                  <select
                    value={selectedSubtopicId}
                    onChange={(event) => setSelectedSubtopicId(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option value="">No subtopic</option>
                    {subtopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Grade</span>
                  <select
                    value={form.grade}
                    onChange={(event) => updateForm('grade', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</span>
                  <select
                    value={form.difficulty}
                    onChange={(event) => updateForm('difficulty', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option}>
                    <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Option {option}</span>
                    <input
                      required
                      value={form[`option${option}`]}
                      onChange={(event) => updateForm(`option${option}`, event.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder={`Answer option ${option}`}
                    />
                  </label>
                ))}
              </div>

              <label className="block max-w-xs">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Correct Answer</span>
                <select
                  value={form.answer}
                  onChange={(event) => updateForm('answer', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </label>

              {formError && <p className="text-sm font-medium text-red-500">{formError}</p>}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingQuestionId(null) }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 disabled:cursor-wait disabled:opacity-60 transition"
                >
                  {isSaving ? 'Saving...' : editingQuestionId ? 'Update MCQ' : 'Save MCQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
