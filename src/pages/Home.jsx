import { ArrowRight, Brain, FileText, Lightbulb, Sparkles, Target, TrendingUp, UserPlus, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import educheckImage from '../assets/educheckimage.jpg'
import { useApp } from '../context/AppContext'

const howItWorks = [
  {
    title: 'Sign Up & Select Grade',
    description: 'Select your target grade (e.g. Grade 8). Test directly starts at your target syllabus level.',
    icon: UserPlus,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    shadow: 'shadow-orange-500/25',
  },
  {
    title: 'Take 30 Adaptive MCQs',
    description: 'Dynamic difficulty adjusts Low ➔ Medium ➔ High. Wrong answers trace lower grade subtopics.',
    icon: Brain,
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadow: 'shadow-sky-500/25',
  },
  {
    title: 'Weak Point Identification',
    description: 'System pinpoints the exact foundational gap (e.g. Grade 7 topics) causing the hurdle.',
    icon: Target,
    gradient: 'from-emerald-400 via-teal-500 to-green-600',
    shadow: 'shadow-teal-500/25',
  },
  {
    title: 'Gemini AI Step-by-Step Report',
    description: 'Get instant explanations: "Here is how to solve this correctly: Step 1... Step 2...", with PDF reports.',
    icon: FileText,
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
    shadow: 'shadow-purple-500/25',
  },
]

const features = [
  {
    icon: Brain,
    title: 'Adaptive Assessment Engine',
    description: 'Starts at student target grade and branches down to foundational grades when errors occur to find true level.',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    shadow: 'shadow-rose-500/25',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Explanations',
    description: 'Sample-based step-by-step walkthroughs for every mistake explaining what went wrong and how to fix it.',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    shadow: 'shadow-violet-500/25',
  },
  {
    icon: TrendingUp,
    title: 'Demonstrated Grade Level',
    description: 'Calculates the real mathematical competence level (e.g. Grade 6.8 vs Grade 8 target) with high confidence.',
    gradient: 'from-teal-400 via-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/25',
  },
  {
    icon: Lightbulb,
    title: 'Subtopic Tick / Cross Matrix',
    description: 'Exhaustive syllabus matrix showing exactly which subtopics are mastered and which need remediation.',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    shadow: 'shadow-amber-500/25',
  },
]

export default function Home() {
  const { darkMode } = useApp()

  return (
    <div className="space-y-20 px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className={`relative overflow-hidden rounded-4xl border p-8 shadow-2xl backdrop-blur-2xl lg:p-14 transition-colors duration-300 ${
        darkMode ? 'border-white/10 bg-slate-950/70 shadow-slate-950/80' : 'border-slate-200 bg-white/90 shadow-slate-200/60'
      }`}>
        {/* Glow ambient background circles */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-bold tracking-wider ${
              darkMode ? 'border-sky-400/30 bg-sky-500/10 text-sky-300' : 'border-sky-300 bg-sky-50 text-sky-700'
            }`}>
              <Sparkles size={16} className="animate-spin-slow text-sky-400" />
              <span>ADAPTIVE DIAGNOSTIC ASSESSMENT ENGINE</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Discover Every Student’s
              </span>
              <br />
              <span className={darkMode ? 'text-white' : 'text-slate-900'}>
                Actual Math Weak Points.
              </span>
            </h1>

            <p className={`max-w-xl text-base leading-relaxed sm:text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              EduCheck adapts dynamically to your learning speed. Starting straight at your target grade (e.g. Grade 8), it pinpoints lower-grade foundational gaps and provides <strong>Gemini AI step-by-step guidance</strong> for every mistake.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/30 transition duration-300 hover:scale-105 active:scale-95"
              >
                Start Diagnostic Test
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-7 py-4 text-base font-semibold transition duration-300 hover:scale-105 active:scale-95 ${
                  darkMode ? 'border-white/15 bg-slate-900/80 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Sign In
              </Link>
            </div>

            {/* Micro Feature Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Target Grade 8 Start</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                <span>Grade 7 Gap Tracing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-violet-500 shrink-0" />
                <span>Gemini AI Solutions</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.01]">
              <img
                src={educheckImage}
                alt="EduCheck Grades 1-8 Math Foundation Analysis"
                className="w-full h-auto object-contain rounded-3xl shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
            darkMode ? 'border-sky-400/30 bg-sky-500/10 text-sky-400' : 'border-sky-300 bg-sky-50 text-sky-700'
          }`}>
            <span>Intelligent Workflow</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              4 Simple Steps to Identify Weak Points
            </span>
          </h2>
          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            How our adaptive algorithm tests your target syllabus, traces foundational gaps, and explains mistakes step-by-step.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-4">
          {howItWorks.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.title}
                className={`group relative flex flex-col items-center rounded-3xl border p-7 text-center shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-2 ${
                  darkMode
                    ? 'border-white/10 bg-slate-900/60 text-white hover:border-sky-400/50 hover:bg-slate-900/90'
                    : 'border-slate-200 bg-white text-slate-900 hover:border-sky-400 hover:shadow-xl'
                }`}
              >
                <div className="absolute top-4 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300">
                  {index + 1}
                </div>
                <div className={`mb-5 mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr ${step.gradient} ${step.shadow} text-white transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={26} />
                </div>
                <h3 className={`mb-2 text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
            darkMode ? 'border-violet-400/30 bg-violet-500/10 text-violet-400' : 'border-violet-300 bg-violet-50 text-violet-700'
          }`}>
            <span>Core Capabilities</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Engineered for Diagnostics & Rapid Remediation
            </span>
          </h2>
          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Built specifically to answer: "Where did the student make a mistake and what foundational step fixes it?"
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} darkMode={darkMode} />
          ))}
        </div>
      </section>
    </div>
  )
}