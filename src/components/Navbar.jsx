import { NavLink, Link } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

import EduCheckLogo from './EduCheckLogo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { authenticated, darkMode, setDarkMode } = useApp()

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-2xl transition-colors ${darkMode ? 'border-white/10 bg-slate-950/85 shadow-[0_18px_60px_-35px_rgba(56,189,248,0.45)]' : 'border-slate-200/80 bg-white/85 shadow-[0_18px_50px_-35px_rgba(14,116,144,0.35)]'}`}>
      <div className="mx-auto flex min-h-[5.25rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400/70">
          <EduCheckLogo size="md" darkMode={darkMode} showTagline={false} />
        </Link>

        <nav className={`hidden items-center gap-1 rounded-2xl border p-1 md:flex ${darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50/80'}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? (darkMode ? 'bg-sky-400/10 text-sky-300 shadow-inner shadow-sky-400/10' : 'bg-white text-sky-700 shadow-sm') : darkMode ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode((value) => !value)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:-translate-y-0.5 ${darkMode ? 'border-white/10 bg-white/[0.04] text-yellow-300 hover:border-yellow-300/40 hover:bg-yellow-300/10' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            {authenticated ? (
              <Link to="/dashboard" className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-sky-500/30">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${darkMode ? 'border-white/10 text-slate-200 hover:border-sky-400/60 hover:bg-white/[0.05] hover:text-white' : 'border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-slate-900'}`}>Login</Link>
                <Link to="/register" className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-sky-500/30">Register</Link>
              </>
            )}
          </div>

          <button aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} className={`rounded-xl border p-2.5 transition hover:-translate-y-0.5 md:hidden ${darkMode ? 'border-white/10 bg-white/[0.04] text-slate-100 hover:border-sky-400/50' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300'}`} onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={`border-t px-4 pb-5 pt-3 md:hidden ${darkMode ? 'border-white/10 bg-slate-950/95' : 'border-slate-200 bg-white/95'}`}>
          <div className={`flex flex-col gap-1 rounded-2xl border p-2 ${darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? (darkMode ? 'bg-sky-400/10 text-sky-300' : 'bg-white text-sky-700 shadow-sm') : darkMode ? 'text-slate-300 hover:bg-white/[0.06] hover:text-white' : 'text-slate-700 hover:bg-white hover:text-slate-950'}`} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {authenticated ? (
              <Link to="/dashboard" className="mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20" onClick={() => setOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className={`mt-2 rounded-xl border px-4 py-3 text-center text-sm font-semibold ${darkMode ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-700'}`} onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
