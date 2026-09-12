import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Home,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  MessageSquare,
  CreditCard,
  Layers3,
  Mail,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'
import { applyTheme } from '../utils/theme'
import EduCheckLogo from '../components/EduCheckLogo'

const adminMenuItems = [
  { label: 'Dashboard', icon: Home, href: '/admin/dashboard', id: 'dashboard' },
  { label: 'Students', icon: Users, href: '/admin/students', id: 'students' },
  { label: 'Subjects', icon: BookOpen, href: '/admin/subjects', id: 'subjects' },
  { label: 'Topics', icon: Layers3, href: '/admin/topics', id: 'topics' },
  { label: 'Question Bank', icon: FileText, href: '/admin/questions', id: 'questions' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports', id: 'reports' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', id: 'analytics' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments', id: 'payments' },
  { label: 'Feedback', icon: MessageSquare, href: '/admin/feedback', id: 'feedback' },
  { label: 'Contacts', icon: Mail, href: '/admin/contacts', id: 'contacts' },
]

const ADMIN_NOTIFICATION_READ_KEY = 'educheck_admin_read_notifications_v1'

function readNotificationIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_NOTIFICATION_READ_KEY) || '[]')
    return new Set(Array.isArray(stored) ? stored : [])
  } catch {
    return new Set()
  }
}

function writeNotificationIds(ids) {
  localStorage.setItem(ADMIN_NOTIFICATION_READ_KEY, JSON.stringify([...ids]))
}

export default function AdminLayout() {
  const { user, resetAppState, darkMode, setDarkMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchData, setSearchData] = useState({ students: [], questions: [], topics: [], payments: [] })
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const loadNotifications = async () => {
    try {
      const [dashboard, students] = await Promise.all([
        apiRequest('/admin/dashboard'),
        apiRequest('/admin/students'),
      ])
      const nextNotifications = [
        ...(dashboard.payments || []).slice(0, 5).map((payment) => ({
          id: `payment-${payment.id}`,
          text: `${payment.studentName} made a payment`,
          detail: `PKR ${Number(payment.amount || 0).toLocaleString()}`,
          href: '/admin/payments',
        })),
        ...(dashboard.assessments || []).map((assessment) => ({
          id: `assessment-${assessment.id}`,
          text: `${assessment.student} completed an assessment`,
          detail: `${assessment.score}% score`,
          href: '/admin/reports',
        })),
        ...(students || []).map((student) => ({
          id: `student-${student.id}`,
          text: `${student.name} joined EduCheck`,
          detail: student.email,
          href: '/admin/students',
        })),
      ].slice(0, 20)

      const readIds = readNotificationIds()
      const knownIds = new Set(nextNotifications.map((notification) => notification.id))
      const hasBaseline = localStorage.getItem(ADMIN_NOTIFICATION_READ_KEY) !== null
      if (!hasBaseline) {
        nextNotifications.forEach((notification) => readIds.add(notification.id))
        writeNotificationIds(readIds)
        setNotifications([])
        return
      }

      setNotifications(nextNotifications.filter((notification) => !readIds.has(notification.id)).slice(0, 8))
      writeNotificationIds(new Set([...readIds].filter((id) => knownIds.has(id))))
    } catch {
      // Keep notifications unchanged if load fails
    }
  }

  // Sync dark theme
  useEffect(() => {
    applyTheme(darkMode)
  }, [darkMode])

  // Redirect non-admins
  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const isActive = (itemId) => {
    const pathSegments = location.pathname.split('/')
    return pathSegments.includes(itemId)
  }

  const getPageTitle = () => {
    const activeItem = adminMenuItems.find((item) => isActive(item.id))
    return activeItem?.label || 'Admin Console'
  }

  const handleLogout = () => {
    resetAppState()
    navigate('/')
  }

  useEffect(() => {
    Promise.all([
      apiRequest('/admin/students'),
      apiRequest('/questions'),
      apiRequest('/admin/topics'),
      apiRequest('/admin/payments'),
    ])
      .then(([students, questions, topics, payments]) => {
        setSearchData({ students, questions, topics, payments })
      })
      .catch(() => {})

    const initialNotificationTimer = window.setTimeout(loadNotifications, 0)
    const notificationTimer = window.setInterval(loadNotifications, 30000)
    return () => {
      window.clearTimeout(initialNotificationTimer)
      window.clearInterval(notificationTimer)
    }
  }, [])

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const searchResults = normalizedSearch
    ? [
        ...searchData.students
          .filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(normalizedSearch))
          .slice(0, 4)
          .map((item) => ({
            id: `student-${item.id}`,
            label: item.name,
            detail: item.email,
            href: '/admin/students',
            category: 'Student',
          })),
        ...searchData.questions
          .filter((item) => item.question.toLowerCase().includes(normalizedSearch))
          .slice(0, 4)
          .map((item) => ({
            id: `question-${item.id}`,
            label: item.question,
            detail: 'Question Bank',
            href: '/admin/questions',
            category: 'Question',
          })),
        ...searchData.topics
          .filter((item) => `${item.name} ${item.parentName || ''}`.toLowerCase().includes(normalizedSearch))
          .slice(0, 4)
          .map((item) => ({
            id: `topic-${item.id}`,
            label: item.name,
            detail: item.parentName ? `Subtopic of ${item.parentName}` : 'Topic',
            href: '/admin/topics',
            category: 'Curriculum',
          })),
        ...searchData.payments
          .filter((item) =>
            `${item.studentName} ${item.email} ${item.paymentReference}`.toLowerCase().includes(normalizedSearch),
          )
          .slice(0, 4)
          .map((item) => ({
            id: `payment-${item.id}`,
            label: item.paymentReference || `Payment ${item.id}`,
            detail: item.studentName,
            href: '/admin/payments',
            category: 'Payment',
          })),
      ].slice(0, 8)
    : []

  return (
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/80 text-slate-800'}`}>
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r transition-all duration-300 lg:static lg:h-full lg:translate-x-0 ${
          darkMode
            ? 'border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-black/50'
            : 'border-slate-200/90 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 shadow-xl'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Section */}
        <div className="border-b border-white/10 px-5 py-6">
          <EduCheckLogo size="md" darkMode={true} showTagline={false} />
          <div className="mt-3 flex items-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Executive Console
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {adminMenuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.id)
            return (
              <a
                key={item.id}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'border border-sky-500/40 bg-gradient-to-r from-sky-500/25 via-cyan-500/20 to-indigo-500/20 text-white shadow-lg shadow-sky-500/10 font-bold'
                    : 'border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                <Icon
                  size={18}
                  className={`${
                    active ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-400'
                  } transition-colors duration-200`}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <div className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400" />
                  </div>
                )}
              </a>
            )
          })}
        </nav>

        {/* Profile Card & Footer Actions */}
        <div className="border-t border-white/10 p-3.5 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-left transition duration-200 hover:bg-white/[0.08] hover:border-sky-400/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-sky-500/20">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] font-medium text-sky-400">Master Admin</p>
            </div>
            <ChevronRight size={14} className="text-slate-500" />
          </button>

          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <a
              href="/admin/settings"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Settings size={14} />
              <span>Settings</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOP NAVBAR (Glassmorphism + Dark Mode Toggle) */}
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
            darkMode
              ? 'border-slate-800/80 bg-slate-900/80 shadow-md shadow-black/20'
              : 'border-slate-200/90 bg-white/85 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`rounded-xl p-2 transition lg:hidden ${
                  darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {getPageTitle()}
                </h2>
                <p className={`text-xs font-medium hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  EduCheck Unified Adaptive Administration
                </p>
              </div>
            </div>

            {/* Right: Search, Dark Mode Switch, Notifications, Avatar */}
            <div className="flex items-center gap-3">
              {/* Universal Search Bar */}
              <div
                className={`relative hidden sm:flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition duration-200 md:w-64 lg:w-72 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-950/70 text-slate-200 focus-within:border-sky-400/80 focus-within:ring-2 focus-within:ring-sky-500/20'
                    : 'border-slate-200 bg-slate-100 text-slate-900 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/20'
                }`}
              >
                <Search size={16} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
                <input
                  type="text"
                  placeholder="Search students, questions, topics..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400 text-xs"
                />
                {searchTerm && (
                  <div
                    className={`absolute right-0 top-11 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border shadow-2xl ${
                      darkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <div className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider border-b ${
                      darkMode ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
                    }`}>
                      Search Results
                    </div>
                    {searchResults.length ? (
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => {
                              navigate(result.href)
                              setSearchTerm('')
                            }}
                            className={`block w-full px-4 py-3 text-left transition ${
                              darkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className={`truncate text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                                {result.label}
                              </p>
                              <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                                {result.category}
                              </span>
                            </div>
                            <p className="truncate text-[11px] text-slate-400 mt-0.5">{result.detail}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-4 py-4 text-xs text-slate-400 text-center">No matching records found</p>
                    )}
                  </div>
                )}
              </div>

              {/* DARK MODE TOGGLE BUTTON */}
              <button
                type="button"
                aria-label="Toggle theme mode"
                onClick={() => setDarkMode((value) => !value)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 shadow-sm shadow-yellow-400/20 hover:bg-yellow-400/20'
                    : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700'
                }`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Notifications Center */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                    darkMode
                      ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  aria-label="View notifications"
                >
                  <Bell size={17} />
                  {notifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-sm">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className={`absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden rounded-2xl border shadow-2xl ${
                      darkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b px-4 py-3 ${
                      darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'
                    }`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity & Alerts</p>
                      <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                        {notifications.length} New
                      </span>
                    </div>
                    {notifications.length ? (
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                              const readIds = readNotificationIds()
                              readIds.add(notification.id)
                              writeNotificationIds(readIds)
                              setNotifications((current) => current.filter((item) => item.id !== notification.id))
                              navigate(notification.href)
                              setNotificationsOpen(false)
                            }}
                            className={`block w-full px-4 py-3 text-left transition ${
                              darkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'
                            }`}
                          >
                            <p className={`text-xs font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                              {notification.text}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{notification.detail}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">
                        <Sparkles size={20} className="mx-auto mb-2 text-slate-500" />
                        No unread activity alerts
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Avatar Pill */}
              <div
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-1.5 transition ${
                  darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 text-xs font-bold text-white shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden text-left md:block">
                  <p className={`text-xs font-bold leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-500 mt-0.5">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className={`min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
          darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/70 text-slate-900'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
