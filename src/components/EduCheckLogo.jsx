import React from 'react'

export default function EduCheckLogo({
  size = 'md',
  showTagline = true,
  darkMode = true,
  className = '',
}) {
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'h-10 w-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'h-16 w-16', text: 'text-3xl', sub: 'text-sm' },
  }[size] || { icon: 'h-10 w-10', text: 'text-xl', sub: 'text-[10px]' }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Brand Icon */}
      <div className={`relative flex ${sizeClasses.icon} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-sky-500/20 transition-transform duration-300 hover:scale-105`}>
        <div className="flex h-full w-full items-center justify-center rounded-[0.95rem] bg-slate-950/40 backdrop-blur-sm">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3/4 w-3/4 text-white"
          >
            {/* Open Book Wings */}
            <path
              d="M7 28C11 25.5 16 25.5 20 28V12C16 9.5 11 9.5 7 12V28Z"
              fill="url(#logo_grad_left)"
              opacity="0.9"
            />
            <path
              d="M33 28C29 25.5 24 25.5 20 28V12C24 9.5 29 9.5 33 12V28Z"
              fill="url(#logo_grad_right)"
              opacity="0.9"
            />
            {/* Graduation Cap Peak / Diamond Sparkle */}
            <path
              d="M20 5L24 10L20 15L16 10L20 5Z"
              fill="#38BDF8"
            />
            {/* Center Checkmark */}
            <path
              d="M17 21L19.5 23.5L23.5 18"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="logo_grad_left" x1="7" y1="9.5" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="logo_grad_right" x1="33" y1="9.5" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${sizeClasses.text} ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Edu<span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">Check</span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        </div>
        {showTagline && (
          <span className={`font-bold uppercase tracking-widest text-sky-400/90 ${sizeClasses.sub} mt-1`}>
            AI Diagnostic System
          </span>
        )}
      </div>
    </div>
  )
}
