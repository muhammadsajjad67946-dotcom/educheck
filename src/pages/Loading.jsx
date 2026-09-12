import { LoaderCircle, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/summary-report'), 1800)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/10 p-10 text-center shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
      <div className="rounded-full border border-sky-400/20 bg-sky-500/10 p-4 text-sky-300">
        <LoaderCircle size={32} className="animate-spin" />
      </div>
      <h2 className="mt-5 text-3xl font-semibold text-white">Generating Diagnostic Report...</h2>
      <p className="mt-3 max-w-xl text-slate-300">The system is analyzing your responses and preparing your personalized report.</p>
      <div className="mt-8 h-3 w-full max-w-md rounded-full bg-white/10">
        <div className="h-3 animate-pulse rounded-full bg-gradient-to-r from-sky-400 to-violet-500" style={{ width: '78%' }} />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-sky-200">
        <Sparkles size={16} /> Preparing strengths, gaps, and recommendations
      </div>
    </div>
  )
}
