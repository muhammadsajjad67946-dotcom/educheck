import { ArrowRight, BookOpen, BarChart3, Sparkles, ShieldCheck, Target, Brain, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const featureList = [
  {
    icon: Brain,
    title: 'Adaptive Diagnostic Engine',
    description: 'Starts tests directly at the student’s target grade (e.g. Grade 8), dynamically shifting between Low, Medium, and High difficulty.',
  },
  {
    icon: Target,
    title: 'Foundational Weak-Point Tracing',
    description: 'When an error occurs, the algorithm checks immediate lower grades (e.g. Grade 7) for that specific subtopic to locate the true root gap.',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Step-by-Step Guidance',
    description: 'Every incorrect answer is paired with clear, step-by-step guidance: "Here is how to solve this correctly: Step 1... Step 2...".',
  },
  {
    icon: BarChart3,
    title: 'Actionable Diagnostic Reports',
    description: 'Students and parents receive comprehensive diagnostic reports comparing Target Grade vs Actual Demonstrated Math Level.',
  },
]

export default function About() {
  const { darkMode } = useApp()

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-12 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Main Hero Card */}
      <section className={`overflow-hidden rounded-4xl border p-8 md:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl transition-colors duration-300 ${
        darkMode ? 'border-white/10 bg-slate-950/70 shadow-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
              darkMode ? 'border-sky-400/30 bg-sky-500/10 text-sky-300' : 'border-sky-300 bg-sky-50 text-sky-700'
            }`}>
              <Sparkles size={14} />
              About EduCheck
            </div>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Smarter Math Assessment for{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Every Learner.
              </span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              EduCheck was built to remove the guesswork from learning mathematics. Instead of traditional static tests, our adaptive diagnostic test dynamically adjusts question difficulty and zeroes in on the exact grade where conceptual misunderstandings started.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-105 active:scale-95"
              >
                Start Assessment
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-semibold transition hover:scale-105 active:scale-95 ${
                  darkMode ? 'border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Our Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-transparent blur-3xl" />
            <div className={`rounded-3xl border p-6 shadow-xl ${
              darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
            }`}>
              <div className="grid gap-4">
                {featureList.map(({ icon: Icon, title, description }) => (
                  <div key={title} className={`rounded-2xl border p-4 transition ${
                    darkMode ? 'border-white/10 bg-slate-950/70 hover:border-sky-400/40' : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-400">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                        <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
            <Target size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Our Mission</p>
          <h2 className="mt-2 text-xl font-bold">Measure & Trace Gaps</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            We empower students, parents, and educators by turning raw test results into clear, actionable, subtopic-level learning roadmaps.
          </p>
        </div>

        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 mb-4">
            <Brain size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-violet-500 font-bold">Our Approach</p>
          <h2 className="mt-2 text-xl font-bold">Adaptive Intelligence</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Rather than a flat grade-level score, our engine diagnoses whether an 8th grader’s weakness in Algebra is actually rooted in 7th-grade equations.
          </p>
        </div>

        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Our Commitment</p>
          <h2 className="mt-2 text-xl font-bold">Confident Growth</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            EduCheck combines instant Gemini AI explanations, downloadable PDF reports, and progress tracking to make learning transparent.
          </p>
        </div>
      </section>
    </div>
  )
}
