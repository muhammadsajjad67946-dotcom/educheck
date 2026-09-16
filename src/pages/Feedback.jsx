import { useEffect, useState } from 'react'
import { Edit3, MessageCircleMore, Send, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function Feedback() {
  const { user, darkMode } = useApp()
  const [rating, setRating] = useState(5)
  const [suggestion, setSuggestion] = useState('')
  const [savedFeedback, setSavedFeedback] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(() => Boolean(user?.id))
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    apiRequest(`/feedback?studentId=${user.id}`)
      .then((feedback) => {
        const existingFeedback = feedback[0] || null
        setSavedFeedback(existingFeedback)
        if (existingFeedback) {
          setRating(Number(existingFeedback.rating))
          setSuggestion(existingFeedback.suggestion || '')
        }
      })
      .catch((error) => setStatus({ type: 'error', message: error.message }))
      .finally(() => setIsLoading(false))
  }, [user?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const response = await apiRequest(savedFeedback ? `/feedback/${savedFeedback.id}` : '/feedback', {
        method: savedFeedback ? 'PUT' : 'POST',
        body: JSON.stringify({ studentId: user.id, rating, suggestion: suggestion.trim() }),
      })
      setSavedFeedback(response)
      setIsEditing(false)
      setStatus({ type: 'success', message: savedFeedback ? 'Your feedback has been updated.' : 'Your feedback has been submitted successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`mx-auto max-w-4xl rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/80 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'} backdrop-blur-xl`}>
      <div className={`rounded-[1.5rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'}`}>
        <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-sky-300' : 'text-sky-600'}`}><MessageCircleMore size={18} /> Feedback</div>
        <h2 className={`mt-3 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Share your experience</h2>
        <p className={`mt-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Your feedback helps shape a more useful and polished assessment experience.</p>

        {isLoading && <p className={`mt-6 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading your feedback...</p>}

        {!isLoading && savedFeedback && !isEditing && (
          <div className={`mt-6 rounded-2xl border p-5 ${darkMode ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50/90 shadow-sm'}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Feedback submitted</p>
                <div className="mt-2 flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((value) => <Star key={value} size={18} fill={value <= Number(savedFeedback.rating) ? 'currentColor' : 'none'} />)}
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsEditing(true); setStatus({ type: '', message: '' }) }} 
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${darkMode ? 'border-white/10 text-white hover:border-sky-400/50 hover:bg-white/10' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'}`}
              >
                <Edit3 size={16} /> Edit feedback
              </button>
            </div>
            <p className={`mt-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{savedFeedback.suggestion || 'No written suggestion.'}</p>
          </div>
        )}

        {!isLoading && (!savedFeedback || isEditing) && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <p className={`mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button 
                    key={value} 
                    type="button" 
                    onClick={() => setRating(value)} 
                    className={`h-10 w-10 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
                      rating >= value 
                        ? 'bg-sky-500 text-white shadow-sm hover:bg-sky-600' 
                        : darkMode
                          ? 'border border-white/10 bg-slate-800/60 text-slate-300 hover:bg-white/10'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <label className={`block rounded-2xl border p-4 transition-all duration-200 ${darkMode ? 'border-white/10 bg-slate-900/80 focus-within:border-sky-400/40' : 'border-slate-300 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 shadow-sm'}`}>
              <span className={`mb-2 block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Suggestions</span>
              <textarea 
                value={suggestion} 
                onChange={(e) => setSuggestion(e.target.value)} 
                rows="4" 
                className={`w-full resize-none bg-transparent outline-none transition-all duration-200 ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                placeholder="Tell us what worked well or what can be improved..." 
              />
            </label>
            <button 
              type="submit" 
              disabled={isSubmitting || !user?.id}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-all duration-200 shadow-md ${darkMode ? 'bg-gradient-to-r from-sky-500 to-violet-500 hover:shadow-sky-500/30' : 'bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 hover:shadow-sky-500/20'} disabled:opacity-50`}
            >
              <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit feedback'}
            </button>
            {status.message && (
              <p className={`text-sm font-medium ${status.type === 'success' ? (darkMode ? 'text-emerald-300' : 'text-emerald-700') : (darkMode ? 'text-rose-300' : 'text-rose-700')}`}>
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
