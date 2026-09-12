import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import InAppPaymentModal from '../components/InAppPaymentModal'

export default function Payment() {
  const navigate = useNavigate()
  const { user, paymentStatus, darkMode } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePayment = () => {
    setIsModalOpen(true)
  }

  const isPaid = paymentStatus === 'paid'

  return (
    <div className="mx-auto max-w-3xl px-2 py-4 sm:py-6">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
          darkMode
            ? 'border-white/10 bg-slate-950/90 text-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.9)]'
            : 'border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-200/60'
        }`}
      >
        {/* Top Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Complete Your Payment
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
            Adaptive Mathematics Assessment
          </h1>
        </div>

        {/* 4 Cards Grid - Compact, Sleek & Neat */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Student Card */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              darkMode
                ? 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
                : 'border-slate-200 bg-slate-50 hover:border-cyan-400 hover:bg-white'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Student
            </p>
            <p className="mt-1 text-base font-semibold truncate">
              {user?.name || 'Student'}
            </p>
          </div>

          {/* 2. Selected Grade Card */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              darkMode
                ? 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
                : 'border-slate-200 bg-slate-50 hover:border-cyan-400 hover:bg-white'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Selected Grade
            </p>
            <p className="mt-1 text-base font-semibold truncate">
              {user?.grade || 'Grade 5'}
            </p>
          </div>

          {/* 3. Assessment Type Card */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              darkMode
                ? 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
                : 'border-slate-200 bg-slate-50 hover:border-cyan-400 hover:bg-white'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Assessment Type
            </p>
            <p className="mt-1 text-base font-semibold truncate">
              Adaptive Mathematics Assessment
            </p>
          </div>

          {/* 4. Payment Status Card */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
              darkMode
                ? 'border-white/10 bg-slate-900/70 hover:border-cyan-500/40 hover:bg-slate-900/90'
                : 'border-slate-200 bg-slate-50 hover:border-cyan-400 hover:bg-white'
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Payment Status
            </p>
            <div className="mt-1 flex items-center gap-2">
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 size={16} /> Paid & Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Summary Box */}
        <div
          className={`mt-4 rounded-2xl border p-4 sm:p-5 transition-all ${
            darkMode
              ? 'border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 shadow-inner'
              : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Payment Summary
              </p>
              <p className="mt-1 text-base sm:text-lg font-semibold">
                Monthly subscription
              </p>
            </div>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
              PKR
            </span>
          </div>

          <div className={`mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-4 ${
            darkMode ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                30-day access
              </p>
              <p className="mt-0.5 text-2xl font-bold text-cyan-400">
                PKR 3,500
              </p>
            </div>
            <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium ${
              darkMode ? 'border-white/10 bg-slate-900/60 text-slate-300' : 'border-slate-200 bg-white text-slate-600'
            }`}>
              <ShieldCheck size={15} className="text-emerald-400" />
              Secure Payment via Stripe
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handlePayment}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition duration-200 hover:brightness-110 active:scale-[0.99] cursor-pointer"
          >
            <span>{isPaid ? 'Pay Again' : 'Pay Now (In-App)'}</span>
            <ArrowRight size={16} />
          </button>
          <Link
            to="/dashboard"
            className={`inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition duration-200 ${
              darkMode
                ? 'border-white/10 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Back to Dashboard
          </Link>
        </div>

        <p className={`mt-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Secure in-app Stripe Elements checkout. Pay directly without leaving this website.
        </p>
      </div>

      <InAppPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentComplete={() => navigate('/start-test')}
      />
    </div>
  )
}
