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
    <div className={`mx-auto max-w-4xl rounded-[2rem] border p-8 ${darkMode ? 'border-white/10 bg-white/10 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-300 bg-slate-100 shadow-lg'} backdrop-blur-xl`}>
      {/* Profile Section */}
      <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-300 bg-[#8a929b]'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Account settings</p>
            <h2 className={`mt-2 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>Manage your profile</h2>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${darkMode ? 'border-white/10 text-white hover:border-sky-400/30 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20' : 'border-slate-200 text-white hover:border-slate-100 hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-400/30'}`}>
              <Edit3 size={16} /> Edit profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-lg border px-4 py-2 transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-sky-400/30 focus:bg-white/20 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-sky-300 focus:outline-none'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-lg border px-4 py-2 transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-sky-400/30 focus:bg-white/20 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-sky-300 focus:outline-none'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Father name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-lg border px-4 py-2 transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-sky-400/30 focus:bg-white/20 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-sky-300 focus:outline-none'}`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-lg border px-4 py-2 transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-sky-400/30 focus:bg-white/20 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:border-sky-300 focus:outline-none'}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={`text-sm font-semibold ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Selected grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`mt-2 w-full rounded-lg border px-4 py-2 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900 text-white focus:border-sky-400/30 focus:outline-none' : 'border-slate-300 bg-white text-slate-900 focus:border-sky-300 focus:outline-none'}`}
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
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${darkMode ? 'border-white/10 text-white hover:bg-red-500/10 hover:border-red-400/30' : 'border-slate-300 text-slate-900 hover:bg-red-100 hover:border-red-300'}`}
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${darkMode ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50' : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:border-emerald-400'}`}
              >
                <Check size={16} /> Save changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-white/10 hover:border-sky-400/30 hover:bg-white/20 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-300 bg-[#9fa8b0] hover:border-slate-200 hover:bg-[#8f9ba3] hover:shadow-lg hover:shadow-slate-400/20'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><UserRound size={16} /> Full name</div>
              <p className={`mt-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>{user.name}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-white/10 hover:border-sky-400/30 hover:bg-white/20 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-300 bg-[#9fa8b0] hover:border-slate-200 hover:bg-[#8f9ba3] hover:shadow-lg hover:shadow-slate-400/20'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><Mail size={16} /> Email</div>
              <p className={`mt-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>{user.email}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-white/10 hover:border-sky-400/30 hover:bg-white/20 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-300 bg-[#9fa8b0] hover:border-slate-200 hover:bg-[#8f9ba3] hover:shadow-lg hover:shadow-slate-400/20'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><UserRound size={16} /> Father name</div>
              <p className={`mt-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>{user.fatherName || 'Not added'}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${darkMode ? 'border-white/10 bg-white/10 hover:border-sky-400/30 hover:bg-white/20 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-300 bg-[#9fa8b0] hover:border-slate-200 hover:bg-[#8f9ba3] hover:shadow-lg hover:shadow-slate-400/20'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><Sparkles size={16} /> Age</div>
              <p className={`mt-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>{user.age || 'Not added'}</p>
            </div>
            <div className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer sm:col-span-2 ${darkMode ? 'border-white/10 bg-white/10 hover:border-sky-400/30 hover:bg-white/20 hover:shadow-lg hover:shadow-sky-500/10' : 'border-slate-300 bg-[#9fa8b0] hover:border-slate-200 hover:bg-[#8f9ba3] hover:shadow-lg hover:shadow-slate-400/20'}`}>
              <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><Sparkles size={16} /> Selected grade</div>
              <p className={`mt-3 text-lg font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>{user.grade}</p>
              {user.actualGrade ? <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-100'}`}>Estimated actual grade: {user.actualGrade}</p> : null}
            </div>
          </div>
        )}
      </div>

      {/* Theme Settings Section */}
      <div className={`mt-6 rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-300 bg-[#8a929b]'}`}>
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}>Appearance</p>
        <h3 className={`mt-2 text-2xl font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>Theme settings</h3>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => setDarkMode(true)}
            className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              darkMode
                ? 'border-sky-400/30 bg-sky-500/10 text-sky-300 hover:border-sky-400/50 hover:bg-sky-500/20'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Moon size={18} /> Dark Mode
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              !darkMode
                ? 'border-amber-400/30 bg-amber-500/10 text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/20'
                : 'border-white/10 text-white hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <Sun size={18} /> Light Mode
          </button>
        </div>

        <p className={`mt-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-100'}`}>
          Current theme: <span className="font-semibold">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </p>
      </div>
    </div>
  )
}
