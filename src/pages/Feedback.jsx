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
    <div className={`mx-auto max-w-4xl rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-black shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-400 bg-black shadow-lg'} backdrop-blur-xl`}>
      <div className={`rounded-[1.5rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-black' : 'border-slate-500 bg-black'}`}>
        <div className={`flex items-center gap-2 ${darkMode ? 'text-sky-300' : 'text-sky-100'}`}><MessageCircleMore size={18} /> Feedback</div>
        <h2 className={`mt-3 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>Share your experience</h2>
        <p className={`mt-3 ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>Your feedback helps shape a more useful and polished assessment experience.</p>

        {isLoading && <p className="mt-6 text-sm text-slate-400">Loading your feedback...</p>}

        {!isLoading && savedFeedback && !isEditing && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-300">Feedback submitted</p>
                <div className="mt-3 flex gap-1 text-amber-300">
                  {[1, 2, 3, 4, 5].map((value) => <Star key={value} size={18} fill={value <= Number(savedFeedback.rating) ? 'currentColor' : 'none'} />)}
                </div>
              </div>
              <button type="button" onClick={() => { setIsEditing(true); setStatus({ type: '', message: '' }) }} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400/50 hover:bg-white/10">
                <Edit3 size={16} /> Edit feedback
              </button>
            </div>
            <p className="mt-4 text-slate-200">{savedFeedback.suggestion || 'No written suggestion.'}</p>
          </div>
        )}

        {!isLoading && (!savedFeedback || isEditing) && <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <p className={`mb-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button 
                  key={value} 
                  type="button" 
                  onClick={() => setRating(value)} 
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                    rating >= value 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : darkMode
                        ? 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        : 'border border-slate-500 bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <label className={`block rounded-2xl border p-3 transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-500 bg-slate-600'}`}>
            <span className={`mb-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-200'}`}>Suggestions</span>
            <textarea 
              value={suggestion} 
              onChange={(e) => setSuggestion(e.target.value)} 
              rows="4" 
              className={`w-full resize-none bg-transparent outline-none transition-all duration-300 ${darkMode ? 'text-white placeholder-slate-400' : 'text-white placeholder-slate-300'}`}
              placeholder="Tell us what worked well or what can be improved..." 
            />
          </label>
          <button 
            type="submit" 
            disabled={isSubmitting || !user?.id}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-sky-500 to-violet-500 hover:shadow-lg hover:shadow-sky-500/30' : 'bg-gradient-to-r from-sky-500 to-violet-500 hover:shadow-lg hover:shadow-sky-400/40'}`}
          >
            <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit feedback'}
          </button>
          {status.message && <p className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{status.message}</p>}
        </form>
        }
      </div>
    </div>
  )
}
