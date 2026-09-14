import { ArrowRight, Brain, FileText, Lightbulb, Sparkles, Target, TrendingUp, UserPlus, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import educheckImage from '../assets/educheckimage.jpg'
import { useApp } from '../context/AppContext'

const howItWorks = [
  {
    title: 'Pick Your Grade (1–8)',
    description: 'Select your child’s current grade. The assessment immediately personalizes questions to match their school syllabus.',
    icon: UserPlus,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    shadow: 'shadow-orange-500/25',
  },
  {
    title: 'Interactive Smart Quiz',
    description: 'Questions adjust naturally to their answers, never too overwhelming, never too boring, keeping learning fun and motivating.',
    icon: Brain,
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadow: 'shadow-sky-500/25',
  },
  {
    title: 'Find Hidden Learning Gaps',
    description: 'Instead of just saying right or wrong, EduCheck gently discovers the exact earlier concepts that need a little extra practice.',
    icon: Target,
    gradient: 'from-emerald-400 via-teal-500 to-green-600',
    shadow: 'shadow-teal-500/25',
  },
  {
    title: 'Friendly AI Guidance & Report',
    description: 'Get clear, encouraging step-by-step explanations for every mistake, plus an easy-to-read PDF report for parents and teachers.',
    icon: FileText,
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
    shadow: 'shadow-purple-500/25',
  },
]

const features = [
  {
    icon: Brain,
    title: 'Adaptive Learning Path',
    description: 'Just like a patient tutor, our smart test adjusts in real time to match each student’s unique pace and true capability.',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
    shadow: 'shadow-rose-500/25',
  },
  {
    icon: Sparkles,
    title: 'Friendly AI Explanations',
    description: 'Warm, easy-to-understand solutions that show students how to solve problems step-by-step without feeling discouraged.',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    shadow: 'shadow-violet-500/25',
  },
  {
    icon: TrendingUp,
    title: 'Real Grade Readiness',
    description: 'Discover your child’s actual learning level and see exactly how ready they are for their current school curriculum.',
    gradient: 'from-teal-400 via-emerald-500 to-green-600',
    shadow: 'shadow-emerald-500/25',
  },
  {
    icon: Lightbulb,
    title: 'Topic Mastery Breakdown',
    description: 'A visual, easy-to-read overview showing which math skills your child has mastered and where they can shine next.',
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
              <span>SMART MATH ASSESSMENT FOR GRADES 1–8</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Discover Every Student’s
              </span>
              <br />
              <span className={darkMode ? 'text-white' : 'text-slate-900'}>
                True Math Potential.
              </span>
            </h1>

            <p className={`max-w-xl text-base leading-relaxed sm:text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Every student learns at their own pace. EduCheck meets your child right at their grade level, gently uncovers the foundational concepts holding them back, and provides friendly step-by-step guidance so they can master math with confidence.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/30 transition duration-300 hover:scale-105 active:scale-95"
              >
                Start Free Diagnostic
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
                <span>Personalized for Grades 1–8</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                <span>Traces Learning Gaps</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-violet-500 shrink-0" />
                <span>Friendly AI Solutions</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.01]">
              <img
                src={educheckImage}
                alt="EduCheck Grades 1-8 Math Learning"
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
            <span>Simple & Easy</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              4 Easy Steps to Build Strong Math Skills
            </span>
          </h2>
          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            See how our friendly adaptive quiz helps students find their weak spots and learn from every mistake.
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
            <span>Why Families Love Us</span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Designed to Build Lifelong Confidence in Math
            </span>
          </h2>
          <p className={`mt-3 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            We don't just grade answers — we give students the clarity, encouragement, and foundational tools to genuinely improve.
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