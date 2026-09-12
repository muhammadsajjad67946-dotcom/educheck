import { CreditCard, FileText, ShieldCheck, Sparkles, TrendingUp, ArrowRight, CircleDollarSign } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function Subscription() {
  const { user } = useApp()
  const location = useLocation()
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    apiRequest(`/subscription/status?userId=${Number(user?.id)}`)
      .then(setSubscription)
      .catch(() => setSubscription({ active: false, expiresAt: null, price: 3500 }))
  }, [user?.id])

  const expiresLabel = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString()
    : 'Not active'
  const invoices = [
    { id: 'Monthly plan', date: expiresLabel, amount: 'PKR 3,500', status: subscription?.active ? 'Active' : 'Expired' },
  ]

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.75)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Subscription & payments</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Manage your plan, billing, and premium access</h1>
            <p className="mt-4 max-w-2xl text-slate-300">View your current plan, payment history, secure invoices, and upgrade to premium with a modern checkout experience.</p>
            {location.state?.message && <p className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-200">{location.state.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-sky-500/10">
              <div className="flex items-center gap-3 text-sky-300"><ShieldCheck size={18} /> Secure payments</div>
              <p className="mt-3 text-sm text-slate-300">PCI-compliant billing with encrypted transactions and trusted payment flows.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-violet-500/10">
              <div className="flex items-center gap-3 text-violet-300"><Sparkles size={18} /> Premium support</div>
              <p className="mt-3 text-sm text-slate-300">Priority access to learning support and account management for premium members.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Current plan</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">EduCheck Premium</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm font-semibold text-cyan-200 border border-cyan-300/15">
              <CreditCard size={18} className="text-cyan-300" /> Active plan
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Payment status</p>
              <p className="mt-3 text-xl font-semibold text-white">{subscription?.active ? 'Active' : 'Expired'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Next invoice</p>
              <p className="mt-3 text-xl font-semibold text-white">{expiresLabel}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Plan cost</p>
              <p className="mt-3 text-xl font-semibold text-white">PKR 3,500 / month</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-cyan-400/10 p-5 shadow-lg shadow-sky-500/10">
              <p className="text-sm text-slate-400">Student</p>
              <p className="mt-2 text-lg font-semibold text-white">{user.name}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-5 shadow-lg shadow-violet-500/10">
              <p className="text-sm text-slate-400">Grade</p>
              <p className="mt-2 text-lg font-semibold text-white">{user.grade}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Billing</p>
                <h3 className="mt-2 text-xl font-semibold text-white">View subscription details</h3>
              </div>
              <Link
                to="/payment"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:opacity-95"
              >
                Upgrade now <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">Upgrade to Premium for uninterrupted access to all assessments, reports, and personalized learning plans.</p>
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Secure payment</p>
            <div className="mt-4 flex items-center gap-3 text-white">
              <CircleDollarSign size={20} className="text-sky-300" />
              <span className="font-semibold">Stripe-powered checkout</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">Your billing is handled securely through Stripe with built-in fraud protection.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Subscription badge</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400/10 to-sky-500/10 px-4 py-2 text-sm font-semibold text-white">
              <Sparkles size={16} className="text-sky-300" />
              Premium Member
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Usage summary</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Assessments completed</span>
                <span className="font-semibold text-white">12</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Average score</span>
                <span className="font-semibold text-white">87%</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Knowledge level</span>
                <span className="font-semibold text-white">Intermediate</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.8)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Invoice history</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Recent payments</h2>
          </div>
          <Link
            to="/payment"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:opacity-95"
          >
            View all invoices <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80">
          <div className="grid grid-cols-[1.8fr_1fr_1fr_1fr] bg-slate-900/80 px-5 py-4 text-xs uppercase tracking-[0.25em] text-slate-400 sm:grid-cols-[2.2fr_1fr_1fr_1fr]">
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/10">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-[1.8fr_1fr_1fr_1fr] px-5 py-4 text-sm text-slate-200 sm:grid-cols-[2.2fr_1fr_1fr_1fr]">
                <span className="font-medium text-white">{invoice.id}</span>
                <span>{invoice.date}</span>
                <span>{invoice.amount}</span>
                <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${invoice.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {invoice.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
