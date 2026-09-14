import { ArrowRight, BrainCircuit, ChartNoAxesCombined, ClipboardCheck, GraduationCap, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const services = [
  {
    icon: BrainCircuit,
    title: 'Personalized Smart Quizzes',
    description: 'Questions adapt naturally to your child’s pace. Never overwhelming, never boring — keeping math fun and engaging.',
    features: ['Grade 1 to 8 tailored', 'Adapts to their comfort', 'Zero exam stress'],
  },
  {
    icon: Sparkles,
    title: 'Patient AI Math Helper',
    description: 'Whenever a mistake happens, our AI gently explains how to solve it step-by-step, just like a patient private tutor.',
    features: ['Simple explanations', 'Explains "Why" clearly', 'Encouraging tone'],
  },
  {
    icon: ChartNoAxesCombined,
    title: 'True Learning Progress',
    description: 'See your child’s actual learning level compared to their class, helping you spot weak concepts and celebrate real growth.',
    features: ['Real grade readiness', 'Catches gaps early', 'Clear learning roadmap'],
  },
  {
    icon: ClipboardCheck,
    title: 'Easy-to-Read Reports',
    description: 'Download colorful, simple PDF summaries anytime to track milestones or share directly with your child’s school teachers.',
    features: ['1-Click PDF download', 'Parent-friendly view', 'Great for teacher review'],
  },
]

export default function Services() {
  const { darkMode } = useApp()

  return (
    <div className={`mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-8 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header Card */}
      <section className={`rounded-3xl border p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-2xl transition-colors duration-300 ${
        darkMode ? 'border-white/10 bg-slate-950/70 shadow-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-4">
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
            darkMode ? 'border-violet-400/30 bg-violet-500/10 text-violet-300' : 'border-violet-300 bg-violet-50 text-violet-700'
          }`}>
            <Sparkles size={13} />
            What We Offer
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
            Everything Your Child Needs to{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Truly Understand & Enjoy Math.
            </span>
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            No pressure, no complicated jargon. Just gentle quizzes, patient step-by-step guidance, and clear insights so your child always feels encouraged to learn.
          </p>

          <div className="pt-1">
            <Link
              to="/start-test"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:scale-105 active:scale-95 hover:shadow-sky-500/30"
            >
              Start Free Assessment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 4 Compact Service Cards Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description, features: cardFeatures }) => (
            <div
              key={title}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 ${
                darkMode
                  ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/40 hover:bg-slate-900/80'
                  : 'border-slate-200/90 bg-slate-50/70 hover:border-sky-300 hover:bg-white hover:shadow-md'
              }`}
            >
              <div>
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/15 to-violet-500/15 text-sky-400 shadow-xs">
                  <Icon size={20} />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className={`mt-1.5 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
              </div>

              <div className="mt-4 space-y-1.5 border-t pt-3 dark:border-white/10 border-slate-200/80">
                {cardFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

