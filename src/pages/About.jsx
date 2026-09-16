import { ArrowRight, BookOpen, BarChart3, Sparkles, ShieldCheck, Target, HeartHandshake, Smile } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const featureList = [
  {
    icon: Smile,
    title: 'Adaptive & Stress-Free Quizzes',
    description: 'Quizzes start at your child’s grade and adapt naturally to their pace, keeping math encouraging and never overwhelming.',
  },
  {
    icon: Target,
    title: 'Finding the Real Learning Gaps',
    description: 'When a question feels tricky, we gently trace back to see which earlier concept needs a quick refresher.',
  },
  {
    icon: Sparkles,
    title: 'Helpful Step-by-Step Guidance',
    description: 'Whenever a mistake happens, clear and friendly explanations walk through the solution one simple step at a time.',
  },
  {
    icon: BarChart3,
    title: 'Clear, Simple Progress for Parents',
    description: 'Easy-to-read reports showing where your child excels and exactly what to practice next to build their confidence.',
  },
]

export default function About() {
  const { authenticated, user, darkMode } = useApp()

  return (
    <div className="space-y-16 px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl sm:p-12 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Sparkles size={14} /> Our Mission & Heart
            </div>

            <h1 className="text-left text-3xl font-black tracking-tight text-white sm:text-5xl sm:leading-tight">
              Helping Every Child Feel Confident in{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Mathematics.
              </span>
            </h1>

            <p className={`text-left text-base leading-relaxed sm:text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              We believe that no child is bad at math — they just need concepts explained in a way that truly connects. EduCheck replaces stressful tests with friendly, adaptive quizzes that pinpoint exactly where a student shines and where a little extra patience will help them succeed.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to={authenticated || user?.id ? "/start-test" : "/register"}
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

          <div className="relative min-w-0 w-full">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-transparent blur-3xl" />
            <div className={`w-full min-w-0 rounded-3xl border p-6 shadow-xl ${
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
                      <div className="min-w-0">
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
      </div>

      {/* 3 Value Pillars */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
            <Target size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-cyan-500 font-bold">Our Mission</p>
          <h2 className="mt-2 text-xl font-bold">Clarity Over Confusion</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            We turn test numbers into clear, friendly guidance — showing parents and teachers simple roadmaps to support their child’s unique learning journey.
          </p>
        </div>

        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 mb-4">
            <HeartHandshake size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-violet-500 font-bold">Our Approach</p>
          <h2 className="mt-2 text-xl font-bold">Meeting Kids Where They Are</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Every child learns differently. We identify the exact root of any difficulty so learning feels like an easy, encouraging step forward.
          </p>
        </div>

        <div className={`rounded-3xl border p-6 shadow-md ${
          darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Our Commitment</p>
          <h2 className="mt-2 text-xl font-bold">Growing Real Confidence</h2>
          <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            With gentle step-by-step guidance, clear PDF summaries, and steady encouragement, we help students build lasting confidence in math.
          </p>
        </div>
      </section>
    </div>
  )
}
