import { ArrowRight } from 'lucide-react'

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = 'from-sky-500/20 to-violet-500/20',
  shadow = '',
  darkMode = true,
}) {
  return (
    <div
      className={`group rounded-[28px] border p-6 text-center shadow-md transition duration-300 hover:-translate-y-1.5 ${
        darkMode
          ? 'border-white/10 bg-slate-900/60 shadow-[0_20px_60px_-30px_rgba(96,165,250,0.3)] hover:border-sky-400/40 hover:bg-slate-900/90'
          : 'border-slate-200 bg-white shadow-slate-200/60 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100/50'
      }`}
    >
      <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br ${gradient} text-white ${shadow} transition-transform transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className={`mb-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <p className={`mb-5 text-sm leading-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
      <div className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold transition duration-200 ${darkMode ? 'text-sky-400 group-hover:text-cyan-300' : 'text-sky-600 group-hover:text-sky-700'}`}>
        Explore <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  )
}
