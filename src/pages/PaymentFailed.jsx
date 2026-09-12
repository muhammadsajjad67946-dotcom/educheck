import { AlertTriangle, ArrowRight, ShieldClose } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PaymentFailed() {
  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-[0_30px_120px_-40px_rgba(96,165,250,0.4)] backdrop-blur-xl">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
          <div className="mb-6 flex items-center gap-3 text-rose-400">
            <AlertTriangle size={26} />
            <span className="text-sm uppercase tracking-[0.3em] text-rose-300">Payment Failed</span>
          </div>
          <h1 className="text-4xl font-semibold text-white">Oops! Your payment could not be processed.</h1>
          <p className="mt-4 text-slate-300">This is a demo payment flow, so please try again to complete your assessment unlock.</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/payment"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition duration-200 hover:scale-[1.02]"
            >
              Retry Payment
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition duration-200 hover:border-transparent hover:bg-slate-900/95 hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/95 via-rose-500/10 to-fuchsia-500/10 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-300 shadow-lg shadow-rose-500/20">
            <ShieldClose size={32} />
          </div>
          <div className="mt-6 space-y-4 text-slate-300">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need help?</p>
              <p className="mt-2 text-lg font-semibold text-white">No real payment gateway is in use.</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Demo mode</p>
              <p className="mt-2 text-lg font-semibold text-white">The retry button returns to the simulated payment flow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
