import { useEffect, useState } from 'react'
import { Edit3, Layers3, Plus, Search, Trash2, X } from 'lucide-react'
import { apiRequest } from '../../utils/api'

const emptyForm = { name: '', parentTopicId: '' }
const strandStyles = {
  'Number & Operations': 'border-sky-200 dark:border-sky-900/60 from-sky-50/70 dark:from-sky-950/40 to-white dark:to-slate-900 text-sky-700 dark:text-sky-300',
  Algebra: 'border-violet-200 dark:border-violet-900/60 from-violet-50/70 dark:from-violet-950/40 to-white dark:to-slate-900 text-violet-700 dark:text-violet-300',
  Geometry: 'border-emerald-200 dark:border-emerald-900/60 from-emerald-50/70 dark:from-emerald-950/40 to-white dark:to-slate-900 text-emerald-700 dark:text-emerald-300',
  Measurement: 'border-amber-200 dark:border-amber-900/60 from-amber-50/70 dark:from-amber-950/40 to-white dark:to-slate-900 text-amber-700 dark:text-amber-300',
  'Data Analysis': 'border-rose-200 dark:border-rose-900/60 from-rose-50/70 dark:from-rose-950/40 to-white dark:to-slate-900 text-rose-700 dark:text-rose-300',
}

export default function AdminTopics() {
  const [topics, setTopics] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    apiRequest('/admin/topics').then(setTopics).catch((error) => setFormError(error.message))
  }, [])

  const parentTopics = topics.filter((topic) => !topic.parentTopicId)
  const visibleTopics = (parentId) => topics.filter((item) => item.parentTopicId === parentId && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const openAdd = (parentTopicId = '') => {
    setEditingTopic(null)
    setForm({ name: '', parentTopicId: String(parentTopicId || '') })
    setFormError('')
    setShowModal(true)
  }
  const openEdit = (topic) => {
    setEditingTopic(topic)
    setForm({ name: topic.name, parentTopicId: String(topic.parentTopicId || '') })
    setFormError('')
    setShowModal(true)
  }
  const saveTopic = async (event) => {
    event.preventDefault()
    setFormError('')
    try {
      const saved = await apiRequest(editingTopic ? `/admin/topics/${editingTopic.id}` : '/admin/topics', { method: editingTopic ? 'PUT' : 'POST', body: JSON.stringify({ name: form.name, parentTopicId: form.parentTopicId || null }) })
      setTopics((previous) => editingTopic ? previous.map((topic) => topic.id === saved.id ? saved : topic) : [...previous, saved])
      setShowModal(false)
    } catch (error) {
      setFormError(error.message)
    }
  }
  const deleteTopic = async (topic) => {
    if (!window.confirm(`Delete ${topic.name}? Its subtopics will also be deleted.`)) return
    try {
      await apiRequest(`/admin/topics/${topic.id}`, { method: 'DELETE' })
      setTopics((previous) => previous.filter((item) => item.id !== topic.id && item.parentTopicId !== topic.id))
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Topics Management</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Organize topics and subtopics used across assessments and analytics</p>
        </div>
        <button
          type="button"
          onClick={() => openAdd()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          <Plus size={18} /> Add Topic
        </button>
      </div>
      {formError && !showModal && <p className="text-sm font-medium text-red-500">{formError}</p>}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3 shadow-sm backdrop-blur-sm">
        <Search size={18} className="ml-2 text-slate-400 dark:text-slate-500" />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search subtopics..."
          className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {parentTopics.map((topic) => (
          <section
            key={topic.id}
            className={`overflow-hidden rounded-2xl border bg-gradient-to-br shadow-sm transition hover:shadow-md ${strandStyles[topic.name] || 'border-slate-200 dark:border-slate-800 from-slate-50/70 dark:from-slate-900/60 to-white dark:to-slate-900 text-slate-700 dark:text-slate-300'}`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white dark:bg-slate-800 p-2.5 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-100 dark:border-slate-700/60">
                  <Layers3 size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{topic.name}</h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{visibleTopics(topic.id).length} subtopics</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(topic)}
                  className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-sky-950/60 hover:text-sky-700 dark:hover:text-sky-300 transition"
                  title="Edit topic"
                >
                  <Edit3 size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTopic(topic)}
                  className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Delete topic"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto pr-1">
                {visibleTopics(topic.id).map((child) => (
                  <div key={child.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-lg transition">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">├─ {child.name}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(child)}
                        className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition"
                        title="Edit subtopic"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTopic(child)}
                        className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition"
                        title="Delete subtopic"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {!visibleTopics(topic.id).length && <p className="px-3 py-4 text-sm text-slate-400 dark:text-slate-500">No matching subtopics.</p>}
              <button
                type="button"
                onClick={() => openAdd(topic.id)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition"
              >
                <Plus size={15} /> Add Subtopic
              </button>
            </div>
          </section>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingTopic ? 'Edit Topic' : 'Add Topic'}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a parent topic to create a subtopic.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveTopic} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Topic name</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="e.g. Fractions"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Parent topic</span>
                <select
                  value={form.parentTopicId}
                  onChange={(event) => setForm((previous) => ({ ...previous, parentTopicId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                >
                  <option value="">No parent (main strand/topic)</option>
                  {parentTopics.filter((topic) => topic.id !== editingTopic?.id).map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </label>
              {formError && <p className="text-sm font-medium text-red-500">{formError}</p>}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition"
                >
                  {editingTopic ? 'Update Topic' : 'Save Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
