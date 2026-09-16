import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

// Demo admin credentials for authentication
const ADMIN_CREDENTIALS = {
  email: 'admin@educheck.com',
  password: 'admin123'
}

export default function Login() {
  const navigate = useNavigate()
  const { authenticated, setAuthenticated, setUser, user, darkMode } = useApp()
  const [form, setForm] = useState({ email: '', password: '', userType: 'student' })
  const [error, setError] = useState('')



  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const email = form.email.trim()
    const password = form.password.trim()
    const userType = form.userType

    console.log('Login attempt:', { email, password, userType })

    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    // Admin login validation
    if (userType === 'admin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Setting admin user...')
        setUser({
          ...user,
          name: 'Admin',
          email: email,
          role: 'admin'
        })
        setAuthenticated(true)
        setTimeout(() => navigate('/admin/dashboard'), 100)
      } else {
        setError('Invalid admin credentials. Use: admin@educheck.com / admin123')
      }
    } 
    // Student login
    else {
      try {
        const account = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
        const loggedInUser = {
          ...user,
          id: account.id,
          name: account.name,
          email: account.email,
          grade: account.grade || user.grade,
          actualGrade: account.actualGrade || '',
          currentDifficulty: account.currentDifficulty || 'Low',
          role: account.role,
        }
        setUser(loggedInUser)
        setAuthenticated(true)
        setTimeout(() => navigate('/dashboard'), 100)
        return
      } catch (apiError) {
        if (!apiError.message.includes('Failed to fetch') && !apiError.message.includes('Unable to sign in')) {
          setError(apiError.message)
          return
        }
      }

      let registeredUser = null
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('educheck_users') || '[]')
        registeredUser = registeredUsers.find((account) => account.email.toLowerCase() === email && account.password === password)
      } catch (error) {
        console.error('Failed to read student accounts:', error)
      }

      if (!registeredUser && localStorage.getItem('educheck_users')) {
        setError('Invalid student email or password')
        return
      }

      console.log('Setting student user...')
      const loggedInUser = {
        ...user,
        id: registeredUser?.id || user.id,
        name: registeredUser?.name || user.name,
        email: email,
        grade: registeredUser?.grade || user.grade,
        role: 'student'
      }
      setUser(loggedInUser)
      setAuthenticated(true)
      setTimeout(() => navigate('/dashboard'), 100)
    }
  }

  return (
    <div className={`mx-auto max-w-2xl rounded-[2rem] p-8 transition-all duration-300 ${darkMode ? 'bg-black shadow-[0_40px_120px_-40px_rgba(56,189,248,0.18)]' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-[0_25px_70px_-30px_rgba(14,116,144,0.35)]'} backdrop-blur-xl ring-1 ${darkMode ? 'ring-white/10' : 'ring-slate-200'}`}>
      <div className="space-y-8">
        <div className={`rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-slate-950/90 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.7)]' : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-[0_20px_60px_-30px_rgba(14,165,233,0.25)]'}`}>
          <div className="flex justify-center">
            <div className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-[0.32em] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] ${darkMode ? 'border-cyan-400/30 bg-slate-900/80 text-cyan-300 shadow-lg shadow-cyan-500/15 hover:border-cyan-300 hover:shadow-cyan-500/25' : 'border-sky-200 bg-sky-50 text-sky-700 shadow-md shadow-sky-200/40 hover:border-sky-300 hover:shadow-sky-300/60'}`}>
              Welcome back
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`space-y-5 rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/85 shadow-[0_30px_90px_-30px_rgba(56,189,248,0.2)]' : 'border-slate-200 bg-white shadow-[0_20px_70px_-35px_rgba(59,130,246,0.35)]'}`}>
          <div className={`flex gap-4 rounded-2xl border p-4 ${darkMode ? 'border-slate-800/70 bg-slate-900/80' : 'border-slate-200 bg-slate-50'}`}>
            <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all ${form.userType === 'student' ? (darkMode ? 'bg-sky-500/20' : 'bg-sky-100') : ''}`}>
              <input
                type="radio"
                name="userType"
                value="student"
                checked={form.userType === 'student'}
                onChange={(e) => setForm({ ...form, userType: e.target.value })}
                className="h-4 w-4"
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Student Login</span>
            </label>
            <label className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all ${form.userType === 'admin' ? (darkMode ? 'bg-sky-500/20' : 'bg-sky-100') : ''}`}>
              <input
                type="radio"
                name="userType"
                value="admin"
                checked={form.userType === 'admin'}
                onChange={(e) => setForm({ ...form, userType: e.target.value })}
                className="h-4 w-4"
              />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Admin Login</span>
            </label>
          </div>

          <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-white hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 shadow-sm'}`}>
            <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Mail size={16} /> Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full bg-transparent outline-none ${darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
              placeholder="Email"
            />
          </label>

          <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-white hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 shadow-sm'}`}>
            <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Lock size={16} /> Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full bg-transparent outline-none ${darkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
              placeholder="Password"
            />
          </label>

          {error && (
            <div className={`rounded-2xl border px-4 py-3 text-sm ${darkMode ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-300 bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          <div className={`flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-start ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <label className="flex items-center gap-2">
              <input type="checkbox" className={`h-4 w-4 rounded border ${darkMode ? 'border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-400' : 'border-slate-300 bg-white text-sky-500 focus:ring-sky-300'}`} />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30' : 'bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 shadow-lg shadow-sky-400/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30'}`}
          >
            Login <ArrowRight size={18} />
          </button>

          <p className={`text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            New here? <Link to="/register" className={`font-semibold ${darkMode ? 'text-cyan-300 hover:text-white' : 'text-sky-600 hover:text-sky-700'}`}>Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
