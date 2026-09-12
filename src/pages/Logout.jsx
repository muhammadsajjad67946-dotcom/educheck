import { LogOut, XCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Logout() {
  const navigate = useNavigate()
  const { resetAppState } = useApp()

  const handleLogout = () => {
    resetAppState()
    navigate('/')
  }

  return (
    <div className="relative mx-auto flex min-h-[28rem] max-w-3xl items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 px-6 py-12 text-center shadow-[0_30px_120px_-40px_rgba(56,189,248,0.35)] backdrop-blur-xl sm:px-12">
      <div className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex max-w-xl flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-amber-300/30 bg-amber-400/10 text-amber-300 shadow-[0_0_45px_-12px_rgba(251,191,36,0.8)]">
          <LogOut size={32} strokeWidth={1.8} />
        </div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Session ending</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Are you sure you want to log out?</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-slate-300">Your progress is saved. You can return and continue your learning journey anytime.</p>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.03] px-6 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
          >
            <XCircle size={18} /> Return home
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-sky-300/70"
          >
            Yes, log out <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
