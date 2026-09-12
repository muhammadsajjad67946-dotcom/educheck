import { useEffect, useMemo, useState } from 'react'
import { Mail, Trash2, Save, RefreshCw } from 'lucide-react'
import { apiRequest } from '../../utils/api'

const statuses = ['new', 'in_progress', 'resolved', 'archived']

const getStatusBadge = (status) => {
  const map = {
    new: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
    in_progress: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
    resolved: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
    archived: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700',
  }
  return map[status] || map.new
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('new')
  const [adminNotes, setAdminNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selected = useMemo(() => contacts.find((contact) => contact.id === selectedId) || null, [contacts, selectedId])

  const loadContacts = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/contact')
      setContacts(data)
      if (!selectedId && data[0]) setSelectedId(data[0].id)
      setError('')
    } catch (loadError) {
      setError(loadError.message || 'Unable to load contact messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadContacts() }, [])

  useEffect(() => {
    if (selected) {
      setStatus(selected.status)
      setAdminNotes(selected.adminNotes || '')
    }
  }, [selected])

  const saveContact = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await apiRequest(`/contact/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminNotes }),
      })
      setContacts((items) => items.map((item) => item.id === selected.id ? { ...item, ...updated } : item))
    } catch (saveError) {
      setError(saveError.message || 'Unable to update contact message.')
    } finally {
      setSaving(false)
    }
  }

  const deleteContact = async () => {
    if (!selected || !window.confirm('Delete this contact message?')) return
    try {
      await apiRequest(`/contact/${selected.id}`, { method: 'DELETE' })
      const remaining = contacts.filter((item) => item.id !== selected.id)
      setContacts(remaining)
      setSelectedId(remaining[0]?.id || null)
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete contact message.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Review enquiries, add internal notes, and track resolution status</p>
        </div>
        <button
          type="button"
          onClick={loadContacts}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm font-semibold text-rose-700 dark:text-rose-400">{error}</div>}

      <div className="grid min-h-[560px] gap-5 lg:grid-cols-[360px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{contacts.length} total messages</p>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading messages...</p>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Mail className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={36} />
              No contact messages yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[600px] overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setSelectedId(contact.id)}
                  className={`block w-full px-5 py-4 text-left transition ${
                    selectedId === contact.id
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(contact.status)}`}>
                      {contact.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">{contact.subject}</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{new Date(contact.createdAt).toLocaleString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm">
          {!selected ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-slate-400 dark:text-slate-500">
              Select a contact message to view it.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selected.name} &lt;{selected.email}&gt;</p>
                </div>
                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg transition"
                >
                  <Mail size={16} /> Reply
                </a>
              </div>

              <p className="whitespace-pre-wrap py-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selected.message}</p>

              <div className="grid gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 md:grid-cols-[180px_1fr]">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Admin notes
                  <textarea
                    rows="3"
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Internal follow-up notes..."
                  />
                </label>
              </div>

              <div className="mt-5 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={deleteContact}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  type="button"
                  onClick={saveContact}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-800 dark:hover:bg-sky-500 disabled:opacity-60 transition"
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
