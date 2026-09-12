import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'

function GitHubIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.42 11.42 0 0 1 12 6.7c1.02 0 2.04.14 3 .41 2.28-1.55 3.28-1.23 3.28-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.48 5.91.43.37.81 1.09.81 2.2v3.26c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function LinkedInIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.4a1.56 1.56 0 0 1 0 3.1ZM5.5 9.8h2.9V18H5.5V9.8Zm5 0h2.78v1.13h.04c.39-.74 1.34-1.52 2.77-1.52 2.96 0 3.51 1.95 3.51 4.48V18h-2.9v-16.8c0-1.43-.03-3.26-1.98-3.26-1.99 0-2.29 1.55-2.29 3.14V18h-2.9V9.8Z" />
    </svg>
  )
}

function FacebookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V7.3c0-.9.25-1.5 1.56-1.5H16V2.9c-.28-.04-1.23-.1-2.34-.1-2.32 0-3.9 1.42-3.9 4.02V10.8H7v3.2h2.76v8h3.74Z" />
    </svg>
  )
}

function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 2h3.4l-7.4 8.5L22.7 22h-6.7l-5.2-7.2L5.8 22H2.4l7.9-9.1L1.3 2h6.9l4.7 6.6L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-500/10 bg-slate-950/95 px-4 py-14 text-slate-200 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[2rem] border border-slate-700/60 bg-slate-900/80 p-8 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.9)] backdrop-blur-xl lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-violet-500/20 text-sky-200 shadow-lg shadow-sky-500/10">
                <GraduationCap size={20} className="text-sky-300" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[0.06em] text-white">EduCheck</p>
                <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">Premium adaptive math diagnostics, instant insights, and personalized learning pathways for every student.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { href: 'https://github.com', label: 'GitHub', icon: GitHubIcon, buttonClasses: 'hover:border-sky-300/30 hover:bg-sky-500/10' },
                { href: 'https://linkedin.com', label: 'LinkedIn', icon: LinkedInIcon, buttonClasses: 'hover:border-cyan-300/30 hover:bg-cyan-500/10' },
                { href: 'https://facebook.com', label: 'Facebook', icon: FacebookIcon, buttonClasses: 'hover:border-indigo-300/30 hover:bg-indigo-500/10' },
                { href: 'https://instagram.com', label: 'Instagram', icon: InstagramIcon, buttonClasses: 'hover:border-fuchsia-300/30 hover:bg-fuchsia-500/10' },
                { href: 'https://twitter.com', label: 'X', icon: XIcon, buttonClasses: 'hover:border-slate-100/30 hover:bg-slate-100/10' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-slate-300 transition duration-200 ${item.buttonClasses}`}
                    aria-label={item.label}
                  >
                    <Icon className="h-[18px] w-[18px] transition duration-200 group-hover:text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Navigation</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><RouterLink to="/" className="transition hover:text-white hover:translate-x-0.5">Home</RouterLink></li>
              <li><RouterLink to="/about" className="transition hover:text-white hover:translate-x-0.5">About</RouterLink></li>
              <li><RouterLink to="/services" className="transition hover:text-white hover:translate-x-0.5">Services</RouterLink></li>
              <li><RouterLink to="/features" className="transition hover:text-white hover:translate-x-0.5">Features</RouterLink></li>
              <li><RouterLink to="/contact" className="transition hover:text-white hover:translate-x-0.5">Contact</RouterLink></li>
              <li><RouterLink to="/register" className="transition hover:text-white hover:translate-x-0.5">Register</RouterLink></li>
              <li><RouterLink to="/login" className="transition hover:text-white hover:translate-x-0.5">Login</RouterLink></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Product</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="transition hover:text-white hover:translate-x-0.5">Adaptive Assessments</li>
              <li className="transition hover:text-white hover:translate-x-0.5">Instant Reports</li>
              <li className="transition hover:text-white hover:translate-x-0.5">Progress Tracking</li>
              <li className="transition hover:text-white hover:translate-x-0.5">Personalized Plans</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-300" />
                <a href="mailto:hello@educheck.com" className="transition hover:text-white">hello@educheck.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-violet-300" />
                <a href="tel:+923194720778" className="transition hover:text-white">0319 4720 778</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-sky-300" />
                <span className="text-slate-400">EduCheck Tech Hub, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-500/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EduCheck. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <RouterLink to="/privacy" className="transition hover:text-white">Privacy Policy</RouterLink>
            <span className="text-slate-600">|</span>
            <RouterLink to="/terms" className="transition hover:text-white">Terms</RouterLink>
            <span className="text-slate-600">|</span>
            <RouterLink to="/cookies" className="transition hover:text-white">Cookie Policy</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
