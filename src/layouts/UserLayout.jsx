import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BarChart3, BookOpenCheck, Clock3, Cpu, CreditCard, MessageCircleMore, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

const sidebarItems = [
  { label: 'Dashboard', icon: Sparkles, href: '/dashboard' },
  { label: 'Start Assessment', icon: BookOpenCheck, href: '/start-test' },
  { label: 'My Assessments', icon: Cpu, href: '/user/assessments' },
  { label: 'Diagnostic Reports', icon: BarChart3, href: '/summary-report' },
  { label: 'Payments', icon: CreditCard, href: '/user/payments' },
  { label: 'Feedback', icon: MessageCircleMore, href: '/feedback' },
  { label: 'Logout', icon: Clock3, href: '/logout' },
]

export default function UserLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, paymentStatus, setPendingRetake, darkMode } = useApp()
  const [subscriptionActive, setSubscriptionActive] = useState(false)

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    apiRequest(`/subscription/status?userId=${user.id}`)
      .then((subscription) => {
        if (active) setSubscriptionActive(Boolean(subscription?.active))
      })
      .catch(() => {
        if (active) setSubscriptionActive(false)
      })
    return () => {
      active = false
    }
  }, [user?.id])

  const isPaid = subscriptionActive || paymentStatus === 'paid'

  const handleStartAssessment = async (event) => {
    event.preventDefault()
    let hasActiveSubscription = isPaid
    if (!hasActiveSubscription && user?.id) {
      try {
        const subscription = await apiRequest(`/subscription/status?userId=${user.id}`)
        hasActiveSubscription = Boolean(subscription?.active)
        setSubscriptionActive(hasActiveSubscription)
      } catch {
        hasActiveSubscription = false
      }
    }

    if (!hasActiveSubscription) {
      setPendingRetake(true)
      navigate('/payment')
      return
    }
    setPendingRetake(false)
    navigate('/start-test')
  }

  return (
    <div className="user-layout-shell">
      <aside className={`user-sidebar overflow-y-auto max-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100dvh-6.5rem)] rounded-[2rem] border p-4 sm:p-5 transition-colors duration-300 ${
        darkMode
          ? 'border-white/10 bg-slate-950/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]'
          : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'
      }`}>
        <div className={`group mb-5 flex items-center gap-3.5 rounded-3xl p-3.5 transition duration-200 ${
          darkMode
            ? 'bg-gradient-to-r from-sky-500/15 via-cyan-500/10 to-violet-500/15 text-slate-100 hover:from-sky-500/25 hover:to-violet-500/25'
            : 'bg-gradient-to-r from-sky-100/60 via-cyan-50 to-violet-100/60 text-slate-800 hover:bg-slate-100'
        }`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20 transition duration-200 group-hover:scale-105">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-500">Student Hub</p>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>EduCheck</h2>
          </div>
        </div>

        <nav className="space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            const isStartAssessment = item.label === 'Start Assessment'
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={isStartAssessment ? handleStartAssessment : undefined}
                className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition duration-200 ${
                  isActive
                    ? 'border-sky-400/40 bg-gradient-to-r from-sky-500/25 via-cyan-500/20 to-violet-500/25 text-sky-400 dark:text-white'
                    : darkMode
                    ? 'border-white/10 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-500'} transition duration-200`} />
                {item.label}
              </a>
            )
          })}
        </nav>

        <button
          onClick={() => navigate('/profile')}
          className={`mt-5 flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
            darkMode
              ? 'border-white/10 bg-slate-900/80 hover:bg-slate-800'
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 font-bold text-white shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
            <p className="text-xs text-slate-400">Student Account</p>
          </div>
        </button>
      </aside>

      <div className="user-page-content min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
