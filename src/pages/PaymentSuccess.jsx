import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

export default function PaymentSuccess() {
  const { paymentStatus, pendingRetake, setPendingRetake, setPaymentStatus, setPaymentId } = useApp()
  const [, setVerifying] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (!sessionId) {
      setVerifying(false)
      if (paymentStatus === 'paid') {
        navigate('/start-test', { replace: true })
      } else {
        navigate('/payment', { replace: true })
      }
      return
    }

    apiRequest(`/checkout-session/${sessionId}`)
      .then(({ paid, paymentId: verifiedPaymentId }) => {
        if (!paid) return navigate('/payment-failed', { replace: true })
        setPaymentStatus('paid')
        setPaymentId(verifiedPaymentId)
        if (pendingRetake) setPendingRetake(false)
        navigate('/start-test', { replace: true })
      })
      .catch(() => navigate('/payment-failed', { replace: true }))
      .finally(() => setVerifying(false))
  }, [paymentStatus, navigate, setPaymentId, setPaymentStatus, pendingRetake, setPendingRetake])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-2xl font-bold text-white">Payment Confirmed!</h2>
      <p className="mt-2 text-sm text-slate-400">Opening diagnostic assessment setup...</p>
    </div>
  )
}
