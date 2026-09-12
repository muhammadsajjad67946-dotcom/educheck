import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function NotFound() {
  const { darkMode } = useApp()

  return (
    <div className={`mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border p-10 text-center transition-all duration-300 ${darkMode ? 'border-white/10 bg-white/10 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)]' : 'border-slate-400 bg-slate-200 shadow-lg'} backdrop-blur-xl`}>
      <div className={`rounded-full border p-4 transition-all duration-300 ${darkMode ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-amber-300 bg-amber-100 text-amber-600'}`}>
        <LogOut size={32} />
      </div>
      <h2 className={`mt-5 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Are you sure that the page you are looking for is not found?</h2>
      <p className={`mt-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>You can return to the homepage anytime.</p>
      <Link 
        to="/" 
        className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white hover:shadow-lg hover:shadow-sky-500/30' : 'bg-gradient-to-r from-sky-400 to-violet-500 text-white hover:shadow-lg hover:shadow-sky-300/40'}`}
      >
        Yes, log out <LogOut size={18} />
      </Link>
    </div>
  )
}
