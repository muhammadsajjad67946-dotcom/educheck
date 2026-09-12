import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, BookOpen, Grid3X3, List } from 'lucide-react'
import { apiRequest } from '../../utils/api'

// Subject Card Component
function SubjectCard({ subject, onEdit, onDelete, onView }) {
  return (
    <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{subject.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{subject.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subject.description}</p>
          </div>
        </div>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
          subject.status === 'Active'
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
        }`}>
          {subject.status}
        </span>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-3 gap-3 border-t border-b border-slate-100 dark:border-slate-800 py-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{subject.topics}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Topics</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{subject.questions}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Questions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{subject.grades}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Grades</p>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-30 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(subject)}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(subject.id)}
          className="rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800/80 px-4 py-2 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Hover View Button */}
      <button
        type="button"
        onClick={() => onView(subject)}
        className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <span className="rounded-xl bg-white dark:bg-slate-900 px-5 py-2.5 font-semibold text-slate-900 dark:text-white shadow-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition">
          View Details
        </span>
      </button>
    </div>
  )
}

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
      <BookOpen size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No subjects yet</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Create your first subject to get started</p>
    </div>
  )
}

export default function AdminSubjects() {
  const [viewMode, setViewMode] = useState('grid')
  const [subjects, setSubjects] = useState([])
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewingSubject, setViewingSubject] = useState(null)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' })

  const loadSubjects = () => {
    apiRequest('/admin/subjects').then(setSubjects).catch((error) => setLoadError(error.message || 'Unable to load subjects.'))
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({ name: subject.name, description: subject.description, icon: subject.icon })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    try {
      await apiRequest(`/admin/subjects/${id}`, { method: 'DELETE' })
      setSubjects(subjects.filter((subject) => subject.id !== id))
    } catch (error) {
      setLoadError(error.message || 'Unable to delete subject.')
    }
  }

  const handleAddSubject = () => {
    setEditingSubject(null)
    setFormData({ name: '', description: '', icon: '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return
    try {
      const savedSubject = await apiRequest(editingSubject ? `/admin/subjects/${editingSubject.id}` : '/admin/subjects', {
        method: editingSubject ? 'PUT' : 'POST',
        body: JSON.stringify({ name: formData.name, description: formData.description, status: editingSubject?.status || 'Active' }),
      })
      if (editingSubject) {
        setSubjects(subjects.map((subject) => subject.id === editingSubject.id ? { ...subject, ...savedSubject } : subject))
      } else {
        setSubjects([...subjects, savedSubject])
      }
      setShowModal(false)
      setLoadError('')
    } catch (error) {
      setLoadError(error.message || 'Unable to save subject.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Subjects</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Manage all subjects and their curriculum topics</p>
        </div>
        <button
          onClick={handleAddSubject}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>
      {loadError && <p className="text-sm font-medium text-red-500">{loadError}</p>}

      {/* View Toggle */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setViewMode('grid')}
          className={`rounded-lg p-2 transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          title="Grid view"
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`rounded-lg p-2 transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          title="List view"
        >
          <List size={18} />
        </button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={setViewingSubject}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {editingSubject ? 'Edit Subject' : 'Add Subject'}
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Subject description"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., 📐"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition"
              >
                {editingSubject ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-4xl">{viewingSubject.icon}</p>
                <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{viewingSubject.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{viewingSubject.description || 'No description available.'}</p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">{viewingSubject.status}</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-100 dark:border-slate-800 py-5 text-center">
              <div><p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{viewingSubject.topics}</p><p className="text-xs text-slate-500 dark:text-slate-400">Topics</p></div>
              <div><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{viewingSubject.questions}</p><p className="text-xs text-slate-500 dark:text-slate-400">Questions</p></div>
              <div><p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{viewingSubject.grades}</p><p className="text-xs text-slate-500 dark:text-slate-400">Grades</p></div>
            </div>
            <button
              type="button"
              onClick={() => setViewingSubject(null)}
              className="mt-6 w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
