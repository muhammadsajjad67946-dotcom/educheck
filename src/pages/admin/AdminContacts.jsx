import { useEffect, useMemo, useState } from 'react'
import { Mail, Trash2, RefreshCw, Search, Eye, Inbox, X, Check } from 'lucide-react'
import { apiRequest } from '../../utils/api'

const STATUS_CONFIG = {
  new: {
    label: 'New',
    badge: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50',
    dot: 'bg-sky-500',
  },
  in_progress: {
    label: 'In Progress',
    badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
    dot: 'bg-amber-500',
  },
  resolved: {
    label: 'Resolved',
    badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
    dot: 'bg-emerald-500',
  },
  archived: {
    label: 'Archived',
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingContact, setViewingContact] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const loadContacts = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/contact')
      setContacts(Array.isArray(data) ? data : [])
      setError('')
    } catch (loadError) {
      setError(loadError.message || 'Unable to load contact messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleStatusChange = async (contactId, nextStatus) => {
    setUpdatingId(contactId)
    try {
      const target = contacts.find((c) => c.id === contactId)
      const updated = await apiRequest(`/contact/${contactId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: nextStatus,
          adminNotes: target?.adminNotes || '',
        }),
      })

      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: updated.status || nextStatus } : c))
      )

      if (viewingContact && viewingContact.id === contactId) {
        setViewingContact((prev) => ({ ...prev, status: updated.status || nextStatus }))
      }
    } catch (err) {
      setError(err.message || 'Failed to update message status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteContact = async (contact) => {
    if (!window.confirm(`Delete message from "${contact.name}"?`)) return
    try {
      await apiRequest(`/contact/${contact.id}`, { method: 'DELETE' })
      setContacts((prev) => prev.filter((item) => item.id !== contact.id))
      if (viewingContact?.id === contact.id) setViewingContact(null)
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete contact message.')
    }
  }

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.message || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'All' || item.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [contacts, searchTerm, filterStatus])

  const counts = useMemo(() => {
    return {
      total: contacts.length,
      new: contacts.filter((c) => c.status === 'new').length,
      in_progress: contacts.filter((c) => c.status === 'in_progress').length,
      resolved: contacts.filter((c) => c.status === 'resolved').length,
    }
  }, [contacts])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Review student enquiries, reply directly, and manage resolutions</p>
        </div>
        <button
          type="button"
          onClick={loadContacts}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Inquiries</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">New Messages</p>
          <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">{counts.new}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">{counts.in_progress}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Resolved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{counts.resolved}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by sender name, email, subject, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 text-slate-900 dark:text-slate-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden backdrop-blur-sm">
        {error && (
          <p className="border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-6 py-3 text-sm font-medium text-red-700 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sender</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject & Message</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-sky-500" />
                    Loading contact messages...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Inbox className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No contact messages found</p>
                    <p className="mt-1 text-sm text-slate-400">Try changing your search term or filter.</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const cfg = STATUS_CONFIG[contact.status] || STATUS_CONFIG.new
                  return (
                    <tr
                      key={contact.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => setViewingContact(contact)}
                    >
                      {/* Sender */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white text-xs font-bold shadow-sm">
                            {(contact.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {contact.name}
                            </p>
                            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject & Message Preview */}
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {contact.subject || 'No Subject'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {contact.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={contact.status}
                          disabled={updatingId === contact.id}
                          onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer transition focus:outline-none ${cfg.badge}`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingContact(contact)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition"
                            title="View Full Message"
                          >
                            <Eye size={17} />
                          </button>
                          <a
                            href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || 'Support Request')}`}
                            className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition"
                            title="Reply via Email"
                          >
                            <Mail size={17} />
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteContact(contact)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 dark:text-slate-400 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Delete Message"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md transition">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl transition">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold mb-2 ${STATUS_CONFIG[viewingContact.status]?.badge || ''}`}>
                  {STATUS_CONFIG[viewingContact.status]?.label || viewingContact.status}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {viewingContact.subject || 'No Subject'}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {viewingContact.createdAt ? new Date(viewingContact.createdAt).toLocaleString() : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sender Info */}
            <div className="my-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/50 p-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{viewingContact.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{viewingContact.email}</p>
              </div>
              <a
                href={`mailto:${viewingContact.email}?subject=Re: ${encodeURIComponent(viewingContact.subject || 'Support Request')}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition shadow-sm"
              >
                <Mail size={14} /> Send Email
              </a>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</label>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {viewingContact.message}
              </div>
            </div>

            {/* Status Change in Modal */}
            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Status:</span>
                <select
                  value={viewingContact.status}
                  onChange={(e) => handleStatusChange(viewingContact.id, e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => deleteContact(viewingContact)}
                  className="rounded-xl border border-rose-200 dark:border-rose-900/50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setViewingContact(null)}
                  className="rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
