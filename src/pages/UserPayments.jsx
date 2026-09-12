import { useEffect, useState } from 'react'
import { CreditCard, ReceiptText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function UserPayments() {
  const { user } = useApp()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const studentId = user?.id
    if (!studentId) {
      setError('Please sign in to view your payment history.')
      setLoading(false)
      return
    }

    apiRequest(`/payments?studentId=${studentId}`)
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch((loadError) => setError(loadError.message || 'Unable to load your payment history.'))
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white">
          <CreditCard size={22} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Payments</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your payment history</h1>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading payments...</div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-rose-500/30 bg-rose-500/10 p-8 text-rose-300">{error}</div>
      ) : payments.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-8 text-slate-300">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
            <ReceiptText size={22} />
          </div>
          <h2 className="text-xl font-semibold text-white">No payments recorded yet</h2>
          <p className="mt-2 text-slate-400">Your payment entries will appear here once you complete an assessment payment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Paid on</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-white/10">
                    <td className="px-6 py-4 font-medium text-white">#{payment.id}</td>
                    <td className="px-6 py-4 font-mono text-xs text-cyan-300">{payment.payment_reference || payment.paymentReference || 'N/A'}</td>
                    <td className="px-6 py-4 text-white">PKR {Number(payment.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${payment.status === 'paid' ? 'bg-emerald-500/15 text-emerald-300' : payment.status === 'pending' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}`}>
                        {payment.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{payment.paid_at ? new Date(payment.paid_at).toLocaleString() : (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'N/A')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
