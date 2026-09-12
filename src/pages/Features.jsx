import { ArrowRight, Brain, FileText, Lightbulb, Sparkles, Target, TrendingUp, GraduationCap, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import studentImage from '../assets/educheck-student.png'

const features = [
  {
    icon: Brain,
    title: 'Adaptive assessment',
    description: 'Questions adjust by student ability so each learner gets a fair and focused assessment experience.',
    tag: 'Core Engine',
    accentColor: 'from-sky-500 to-cyan-400',
    glowColor: 'rgba(56, 189, 248, 0.18)',
    borderHover: 'hover:border-sky-400/50',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  {
    icon: FileText,
    title: 'Instant reports',
    description: 'Students and teachers receive immediate feedback and clear summaries after every test.',
    tag: 'AI Diagnostic',
    accentColor: 'from-violet-500 to-indigo-500',
    glowColor: 'rgba(139, 92, 246, 0.18)',
    borderHover: 'hover:border-violet-400/50',
    badgeClass: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Progress tracking',
    description: 'Follow performance over time with meaningful trend insights and visible learning growth.',
    tag: 'Growth Analytics',
    accentColor: 'from-emerald-500 to-teal-400',
    glowColor: 'rgba(16, 185, 129, 0.18)',
    borderHover: 'hover:border-emerald-400/50',
    badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  {
    icon: Target,
    title: 'Personalized goals',
    description: 'Target weak topics with a setup that promotes realistic and measurable learning gains.',
    tag: 'Targeted Remediation',
    accentColor: 'from-amber-500 to-rose-400',
    glowColor: 'rgba(245, 158, 11, 0.18)',
    borderHover: 'hover:border-amber-400/50',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Smart recommendations',
    description: 'Get useful guidance on where to focus next and what concept areas need additional practice.',
    tag: 'Personalized Path',
    accentColor: 'from-cyan-400 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.18)',
    borderHover: 'hover:border-cyan-400/50',
    badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
  {
    icon: Sparkles,
    title: 'Student-friendly experience',
    description: 'A clean, motivating flow helps students stay focused and confident throughout the process.',
    tag: 'Easy & Accessible',
    accentColor: 'from-fuchsia-500 to-pink-500',
    glowColor: 'rgba(217, 70, 239, 0.18)',
    borderHover: 'hover:border-fuchsia-400/50',
    badgeClass: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
  },
]

export default function Features() {
  const { darkMode } = useApp()

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 overflow-hidden">
      {/* Soft Ambient Glow Orbs (Feather Lights in Background) */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-violet-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

      <section className={`relative z-10 rounded-[2.5rem] border p-6 md:p-12 lg:p-14 backdrop-blur-2xl transition-all duration-300 ${
        darkMode
          ? 'border-white/10 bg-slate-950/80 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.9)]'
          : 'border-slate-200 bg-white/90 shadow-2xl'
      }`}>
        {/* Header section */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-sky-400 shadow-sm shadow-sky-500/10">
              <Sparkles size={14} className="animate-spin-slow text-sky-400" />
              Platform Capabilities
            </div>
            <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Everything needed for{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                smarter learning.
              </span>
            </h1>
            <p className={`mt-3 max-w-2xl text-base sm:text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              An intelligent assessment suite designed to accurately uncover foundational knowledge gaps, elevate student confidence, and drive mastery.
            </p>
          </div>

          {/* Grade 1 to Grade 8 Student Specific Visual Card with Graceful Hover Feather */}
          <div className="group relative w-full md:w-auto md:max-w-sm shrink-0 cursor-pointer">
            {/* Ambient Feather Glow on Card Hover */}
            <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-sky-500/30 via-cyan-400/25 to-violet-500/30 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100" />

            <div className={`relative overflow-hidden rounded-2xl border p-3.5 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_50px_-20px_rgba(56,189,248,0.4)] ${
              darkMode
                ? 'border-white/10 bg-slate-900/80 group-hover:border-sky-400/50'
                : 'border-slate-200 bg-white group-hover:border-sky-300'
            }`}>
              {/* Image Container with Soft Gradient Overlay */}
              <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={studentImage}
                  alt="EduCheck Grade 1 to 8 Student"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                {/* Floating Top Badge */}
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/75 px-3 py-1 text-[11px] font-bold text-sky-300 backdrop-blur-md shadow-sm">
                  <GraduationCap size={13} className="text-sky-400" />
                  <span>Grades 1 – 8 Math</span>
                </div>

                {/* Floating Bottom Status */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold drop-shadow-sm">Personalized Student Journey</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Adaptive
                  </span>
                </div>
              </div>

              {/* Grade 1 to 8 Interactive Badges */}
              <div className="mt-3 flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((gradeNum) => (
                  <span
                    key={gradeNum}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-200 ${
                      darkMode
                        ? 'bg-slate-800 text-slate-300 border border-white/5 group-hover:border-sky-400/40 group-hover:text-sky-300 group-hover:bg-slate-800/90'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-sky-50 group-hover:text-sky-700 group-hover:border-sky-300'
                    }`}
                  >
                    G{gradeNum}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon: Icon, title, description, tag, accentColor, glowColor, borderHover, badgeClass }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-[2rem] border p-7 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? `border-white/10 bg-slate-900/50 hover:bg-slate-900/80 ${borderHover}`
                  : `border-slate-200 bg-white hover:bg-slate-50 ${borderHover}`
              }`}
            >
              {/* Soft Feather Glow Backdrop on Hover */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: glowColor }}
              />
              <div
                className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: glowColor }}
              />

              {/* Card Header with Icon and Tag */}
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accentColor} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon size={26} className="drop-shadow-sm" />
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${badgeClass}`}>
                  {tag}
                </span>
              </div>

              {/* Title & Description */}
              <div className="relative z-10">
                <h2 className={`text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-sky-300 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {title}
                </h2>
                <p className={`mt-3 text-sm leading-relaxed ${
                  darkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600'
                }`}>
                  {description}
                </p>
              </div>

              {/* Bottom Subtle Interaction Arrow */}
              <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-semibold text-sky-400 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                <span>Explore capability</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
