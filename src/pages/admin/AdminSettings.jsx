import { useState } from 'react'
import { Save, Shield, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminSettings() {
  const { user, updateProfile } = useApp()
  const [name, setName] = useState(user?.name || 'Admin')
  const [saved, setSaved] = useState(false)

  const saveProfile = (event) => {
    event.preventDefault()
    updateProfile({ name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your administrative profile and workspace preferences</p>
      </div>

      <form onSubmit={saveProfile} className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm space-y-5">
        <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="rounded-xl bg-sky-50 dark:bg-sky-950/60 p-2.5 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/50">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admin Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update the administrative name shown throughout the dashboard.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Display Name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Admin Email
          </label>
          <input
            value={user?.email || 'admin@educheck.com'}
            readOnly
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 px-3.5 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          />
        </div>

        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition"
          >
            <Save size={16} /> Save Changes
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} /> Changes saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
