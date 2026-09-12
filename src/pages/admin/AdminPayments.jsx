import { useEffect, useState } from 'react'
import { apiRequest } from '../../utils/api'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/admin/payments')
      .then(setPayments)
      .catch((loadError) => setError(loadError.message || 'Unable to load payment records.'))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Manage student transactions, subscriptions, and revenue logs</p>
        {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm backdrop-blur-sm">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No payments recorded</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Completed student payments and transactions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Payment ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {payments.map((payment) => (
                  <tr key={payment.id} className="text-sm hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{payment.studentName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{payment.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{payment.grade || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{payment.paymentReference || payment.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">PKR {Number(payment.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
