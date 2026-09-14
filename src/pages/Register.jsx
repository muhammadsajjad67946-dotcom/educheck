import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function Register() {
  const navigate = useNavigate()
  const { updateProfile, setAuthenticated, darkMode } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [grades, setGrades] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    fatherName: '',
    age: '',
    password: '',
    confirmPassword: '',
    grade: 'Grade 5',
  })

  useEffect(() => {
    apiRequest('/grades')
      .then((items) => setGrades(Array.isArray(items) ? items : []))
      .catch(() => setGrades([]))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setError('')
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Full name is required.')
      return false
    }
    if (!form.email.trim()) {
      setError('Email is required.')
      return false
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!form.fatherName.trim()) {
      setError('Father name is required.')
      return false
    }
    if (!form.age || form.age < 3) {
      setError('Please enter a valid age (minimum 3).')
      return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    const email = form.email.trim().toLowerCase()

    try {
      const trimmedName = form.name.trim()
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedFather = form.fatherName ? form.fatherName.trim() : ''
      const parsedAge = form.age ? Number(form.age) : null

      const account = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name: trimmedName, 
          email: trimmedEmail, 
          password: form.password, 
          fatherName: trimmedFather, 
          age: parsedAge, 
          grade: form.grade 
        }),
      })
      
      const nextProfile = {
        id: account.id,
        name: trimmedName,
        email: trimmedEmail,
        fatherName: trimmedFather,
        age: parsedAge || '',
        grade: form.grade,
        actualGrade: account.actualGrade || '',
        currentDifficulty: account.currentDifficulty || 'Low',
        role: 'student',
      }

      updateProfile(nextProfile)
      setAuthenticated(true)
      setSuccess('Registration successful! Redirecting to dashboard...')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1500)
    } catch (apiError) {
      const message = apiError.message.includes('Failed to fetch')
        ? 'Registration service is unavailable. Please try again later.'
        : apiError.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`mx-auto max-w-2xl rounded-[2rem] p-8 transition-all duration-300 ${darkMode ? 'bg-black shadow-[0_40px_120px_-40px_rgba(56,189,248,0.18)]' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-[0_25px_70px_-30px_rgba(14,116,144,0.35)]'} backdrop-blur-xl ring-1 ${darkMode ? 'ring-white/10' : 'ring-slate-200'}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className={`rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-slate-950/90 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.7)]' : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-[0_20px_60px_-30px_rgba(14,165,233,0.25)]'}`}>
          <div className="flex justify-center">
            <div className={`inline-flex cursor-pointer items-center justify-center rounded-full border px-6 py-3 text-sm font-bold uppercase tracking-[0.32em] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] ${darkMode ? 'border-cyan-400/30 bg-slate-900/80 text-cyan-300 shadow-lg shadow-cyan-500/15 hover:border-cyan-300 hover:shadow-cyan-500/25' : 'border-sky-200 bg-sky-50 text-sky-700 shadow-md shadow-sky-200/40 hover:border-sky-300 hover:shadow-sky-300/60'}`}>
              Create account
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`space-y-5 rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/85 shadow-[0_30px_90px_-30px_rgba(56,189,248,0.2)]' : 'border-slate-200 bg-white shadow-[0_20px_70px_-35px_rgba(59,130,246,0.35)]'}`}>
          {/* Full name and Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><User size={16} /> Full name</span>
              <input 
                type="text"
                name="name"
                required 
                value={form.name} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`} 
                placeholder="Name" 
              />
            </label>
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><Mail size={16} /> Email</span>
              <input 
                type="email" 
                name="email"
                required 
                value={form.email} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`} 
                placeholder="Email" 
              />
            </label>
          </div>

          {/* Father name and Age */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><User size={16} /> Father name</span>
              <input 
                type="text"
                name="fatherName"
                required 
                value={form.fatherName} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`} 
                placeholder="Father name" 
              />
            </label>
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Age</span>
              <input 
                type="number" 
                name="age"
                min="3" 
                required 
                value={form.age} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`} 
                placeholder="Age" 
              />
            </label>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid gap-4 md:grid-cols-2">
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><Lock size={16} /> Password</span>
              <input 
                type="password" 
                name="password"
                required 
                value={form.password} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                placeholder="Password"
              />
            </label>
            <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
              <span className={`mb-2 flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><Lock size={16} /> Confirm password</span>
              <input 
                type="password" 
                name="confirmPassword"
                required 
                value={form.confirmPassword} 
                onChange={handleChange}
                className={`w-full bg-transparent text-white outline-none ${darkMode ? 'placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                placeholder="Confirm password"
              />
            </label>
          </div>

          {/* Grade Level */}
          <label className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${darkMode ? 'border-slate-800/70 bg-slate-900/80 hover:border-sky-400/30 focus-within:border-sky-400/50 focus-within:bg-slate-800/90' : 'border-slate-300 bg-slate-50 hover:border-sky-300 focus-within:border-sky-400 focus-within:bg-white'}`}>
            <span className={`mb-2 block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Grade level</span>
            <select 
              name="grade"
              required 
              value={form.grade} 
              onChange={handleChange}
              className={`w-full bg-transparent outline-none transition-all duration-200 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {grades.map((grade) => (
                <option key={grade.id} value={grade.name} className={darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{grade.name}</option>
              ))}
            </select>
          </label>

          {/* Error and Success Messages */}
          {error && (
            <div className={`flex items-center gap-2 rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-red-300 bg-red-50 text-red-700'}`}>
              <AlertCircle size={18} className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className={`flex items-center gap-2 rounded-2xl border p-4 transition-all duration-300 ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-700'}`}>
              <CheckCircle size={18} className="flex-shrink-0" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed' : 'bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 shadow-lg shadow-sky-400/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed'}`}
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" /> Creating account...
              </>
            ) : (
              <>
                Register <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className={`text-center text-sm transition-all duration-300 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account? <Link to="/login" className={`font-semibold transition-all duration-200 ${darkMode ? 'text-cyan-300 hover:text-cyan-200' : 'text-sky-600 hover:text-sky-700'}`}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
