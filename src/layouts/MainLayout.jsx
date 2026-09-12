import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useApp } from '../context/AppContext'

export default function MainLayout() {
  const location = useLocation()
  const { darkMode } = useApp()
  const isAuthScreen = ['/login', '/register', '/dashboard', '/payment', '/start-test', '/submit-test', '/loading', '/summary-report', '/standard-report', '/retake-test', '/profile', '/feedback', '/logout'].includes(location.pathname)
  const isUserArea = location.pathname.startsWith('/user/') || ['/dashboard', '/subscription', '/payment', '/payment-success', '/payment-failed', '/start-test', '/submit-test', '/loading', '/summary-report', '/standard-report', '/student-performance', '/retake-test', '/profile', '/settings', '/feedback', '/logout'].includes(location.pathname)

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-900'}`}>
      <Navbar />
      <main className={`flex-1 mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 ${isUserArea ? 'user-main' : 'max-w-7xl'} ${isAuthScreen ? 'pt-20' : 'pt-24'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
