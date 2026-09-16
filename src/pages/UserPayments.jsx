import { useEffect, useState } from 'react'
import { CreditCard, ReceiptText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function UserPayments() {
  const { user, darkMode } = useApp()
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
    <div className={`mx-auto max-w-6xl rounded-[2rem] border p-8 transition-all duration-300 ${darkMode ? 'border-white/10 bg-slate-950/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-md">
          <CreditCard size={22} />
        </div>
        <div>
          <p className={`text-sm uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>Payments</p>
          <h1 className={`mt-2 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Your payment history</h1>
        </div>
      </div>

      {loading ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>Loading payments...</div>
      ) : error ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{error}</div>
      ) : payments.length === 0 ? (
        <div className={`rounded-[1.5rem] border p-8 ${darkMode ? 'border-white/10 bg-slate-900/80 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${darkMode ? 'bg-slate-800 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
            <ReceiptText size={22} />
          </div>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No payments recorded yet</h2>
          <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Your payment entries will appear here once you complete an assessment payment.</p>
        </div>
      ) : (
        <div className={`overflow-hidden rounded-[1.5rem] border ${darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-left text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <thead className={`text-xs uppercase tracking-[0.2em] font-semibold ${darkMode ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-50 text-slate-600 border-b border-slate-200'}`}>
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
                  <tr key={payment.id} className={`border-t transition-colors ${darkMode ? 'border-white/10 hover:bg-white/[0.02]' : 'border-slate-100 hover:bg-slate-50/80'}`}>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>#{payment.id}</td>
                    <td className={`px-6 py-4 font-mono text-xs font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>{payment.payment_reference || payment.paymentReference || 'N/A'}</td>
                    <td className={`px-6 py-4 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>PKR {Number(payment.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        payment.status === 'paid'
                          ? darkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : payment.status === 'pending'
                            ? darkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100 text-amber-800 border border-amber-200'
                            : darkMode ? 'bg-rose-500/15 text-rose-300' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {payment.status || 'pending'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{payment.paid_at ? new Date(payment.paid_at).toLocaleString() : (payment.paidAt ? new Date(payment.paidAt).toLocaleString() : 'N/A')}</td>
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
