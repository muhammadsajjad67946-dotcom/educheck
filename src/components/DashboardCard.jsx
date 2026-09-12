import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardCard({ title, description, href, accent }) {
  return (
    <Link to={href} className={`rounded-3xl border border-white/10 p-6 shadow-lg transition hover:-translate-y-1 hover:border-white/25 ${accent}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <ArrowRight size={18} className="text-slate-200" />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </Link>
  )
}
