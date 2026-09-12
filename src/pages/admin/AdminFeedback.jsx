import { useEffect, useMemo } from 'react'
import { MessageCircleMore, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../utils/api'

export default function AdminFeedback() {
  const { feedback, setFeedback } = useApp()

  useEffect(() => {
    apiRequest('/feedback').then(setFeedback).catch(() => setFeedback([]))
  }, [setFeedback])

  const averageRating = useMemo(() => feedback.length ? (feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / feedback.length).toFixed(1) : '0.0', [feedback])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Feedback</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">View and analyze student reviews, ratings, and learning feedback</p>
      </div>
      
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Feedback</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{feedback.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Rating</p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-amber-500">{averageRating} <Star size={24} fill="currentColor" /></p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">5-Star Reviews</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{feedback.filter((item) => Number(item.rating) === 5).length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm backdrop-blur-sm">
        {feedback.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircleMore className="mx-auto text-slate-300 dark:text-slate-600" size={44} />
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No feedback yet</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Student feedback will appear here after submission.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {feedback.slice().reverse().map((item) => (
              <div key={item.id || item.createdAt} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name || 'Student'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= Number(item.rating) ? 'currentColor' : 'none'} />
                    ))}
                    <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
                <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.suggestion || 'No written suggestion.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
