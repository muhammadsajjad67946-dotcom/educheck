import { ArrowRight, BrainCircuit, ChartNoAxesCombined, ClipboardCheck, GraduationCap, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const services = [
  {
    icon: BrainCircuit,
    title: 'Adaptive Diagnostic Assessment',
    description: 'Dynamic testing starting directly at the student’s target grade (e.g. Grade 8), branching Low ➔ Medium ➔ High to measure true ability level.',
    features: ['Multi-Topic Diagnostic Coverage', 'Dynamic Difficulty Engine', 'Grade 7 Foundational Tracing'],
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Step-by-Step Guidance',
    description: 'Instant contextual AI explanations for every mistake: "Here is how to solve this correctly: Step 1... Step 2... The correct option is X".',
    features: ['Step-by-Step Solutions', 'Root Misconception Analysis', 'Remediation Steps'],
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Demonstrated Grade & Matrix',
    description: 'Accurate calculation of true math grade level vs chosen target grade, supported by complete subtopic tick/cross breakdown tables.',
    features: ['Actual Math Level Calculation', 'High Diagnostic Confidence', 'Subtopic Tick/Cross Matrix'],
  },
  {
    icon: ClipboardCheck,
    title: 'Comprehensive PDF Reports',
    description: 'Instant downloadable Summary and Detailed Subtopic PDF sheets for offline review by students, parents, and private tutors.',
    features: ['Summary PDF Download', 'Detailed Subtopic PDF Sheet', 'Instant Print Format'],
  },
]

export default function Services() {
  const { darkMode } = useApp()

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-12 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header Card */}
      <section className={`rounded-4xl border p-8 md:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl transition-colors duration-300 ${
        darkMode ? 'border-white/10 bg-slate-950/70 shadow-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-5">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
            darkMode ? 'border-violet-400/30 bg-violet-500/10 text-violet-300' : 'border-violet-300 bg-violet-50 text-violet-700'
          }`}>
            <Sparkles size={14} />
            Our Core Services
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Built to Support Smarter{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Math Learning.
            </span>
          </h1>
          <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            From intelligent adaptive diagnostic assessments to instant Gemini AI step-by-step tutoring guidance, EduCheck provides the complete toolset for academic success.
          </p>

          <div className="pt-2">
            <Link
              to="/start-test"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/25 transition duration-300 hover:scale-105 active:scale-95 hover:shadow-sky-500/40"
            >
              Start Assessment
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, description, features: cardFeatures }) => (
            <div
              key={title}
              className={`rounded-3xl border p-7 shadow-lg transition duration-300 hover:-translate-y-1 ${
                darkMode
                  ? 'border-white/10 bg-slate-900/60 hover:border-sky-400/40 hover:bg-slate-900/80'
                  : 'border-slate-200 bg-slate-50/80 hover:border-sky-300 hover:bg-white hover:shadow-xl'
              }`}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-400 shadow-sm">
                <Icon size={26} />
              </div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>

              <div className="mt-5 space-y-2 border-t pt-4 dark:border-white/10 border-slate-200">
                {cardFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
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
