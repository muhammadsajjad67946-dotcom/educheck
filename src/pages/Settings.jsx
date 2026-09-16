import { Edit3, Mail, Sparkles, UserRound, X, Check, Moon, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/api'

export default function Settings() {
  const { user, darkMode, setDarkMode, updateProfile } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    fatherName: user.fatherName || '',
    age: user.age || '',
    grade: user.grade || 'Grade 5',
  })

  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      fatherName: user.fatherName || '',
      age: user.age || '',
      grade: user.grade || 'Grade 5',
    })
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    updateProfile(formData)
    setIsEditing(false)
    if (user?.id) {
      try {
        await apiRequest('/profile', {
          method: 'PUT',
          body: JSON.stringify({ userId: user.id, ...formData }),
        })
      } catch (err) {
        console.warn('Settings save to database note:', err.message)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      fatherName: user.fatherName || '',
      age: user.age || '',
      grade: user.grade || 'Grade 5',
    })
    setIsEditing(false)
  }

  return (
    <div className={`mx-auto max-w-4xl rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
      {/* Profile Section */}
      <div className={`rounded-[1.5rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>Account settings</p>
            <h2 className={`mt-2 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Manage your profile</h2>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${darkMode ? 'border-white/10 text-white hover:border-sky-400/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20' : 'border-slate-300 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 shadow-sm'}`}>
              <Edit3 size={16} /> Edit profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-slate-700'}`}>Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-sky-400/40 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-slate-700'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-sky-400/40 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-slate-700'}`}>Father name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-sky-400/40 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-slate-700'}`}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-sky-400/40 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none shadow-sm'}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-slate-700'}`}>Selected grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-xl border px-4 py-2.5 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900 text-white focus:border-sky-400/40 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-none shadow-sm'}`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                    <option key={g} value={`Grade ${g}`}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleCancel}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${darkMode ? 'border-white/10 text-white hover:bg-red-500/10 hover:border-red-400/30' : 'border-slate-300 bg-white text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300 shadow-sm'}`}
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${darkMode ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50' : 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}
              >
                <Check size={16} /> Save changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><UserRound size={16} /> Full name</div>
              <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><Mail size={16} /> Email</div>
              <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.email}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><UserRound size={16} /> Father name</div>
              <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.fatherName || 'Not added'}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><Sparkles size={16} /> Age</div>
              <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.age || 'Not added'}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 sm:col-span-2 ${darkMode ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/30 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><Sparkles size={16} /> Selected grade</div>
              <p className={`mt-2 text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.grade}</p>
              {user.actualGrade ? <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Estimated actual grade: {user.actualGrade}</p> : null}
            </div>
          </div>
        )}
      </div>

      {/* Theme Settings Section */}
      <div className={`mt-6 rounded-[1.5rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}>Appearance</p>
        <h3 className={`mt-2 text-2xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Theme settings</h3>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => setDarkMode(true)}
            className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              darkMode
                ? 'border-sky-400/30 bg-sky-500/20 text-sky-300 ring-2 ring-sky-400/20 shadow-sm'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400 shadow-sm'
            }`}
          >
            <Moon size={18} /> Dark Mode
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              !darkMode
                ? 'border-amber-500/50 bg-amber-50 text-amber-800 ring-2 ring-amber-400/20 shadow-sm'
                : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sun size={18} /> Light Mode
          </button>
        </div>

        <p className={`mt-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Current theme: <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </p>
      </div>
    </div>
  )
}
