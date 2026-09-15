import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CheckCircle2, Lock, Loader2, ShieldCheck, X, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react'
import { apiRequest } from '../utils/api'
import { useApp } from '../context/AppContext'

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51U8YmjByHXvcCn91FVe6xv1pmeQVCxVJtoITBRhErrGhPCLphxxNmbdRM4cHYKiPLwaE2PjEkzLhOQQ5GnEjHUXx00dvATKrK2'
)

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('InAppPaymentModal error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-white">Payment Form Temporary Issue</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {this.state.error?.message || 'Embedded payment element could not be rendered.'}
          </p>
          {this.props.onFallbackCheckout && (
            <div className="pt-2">
              <button
                type="button"
                onClick={this.props.onFallbackCheckout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                <ExternalLink size={14} /> Pay via Stripe Hosted Checkout
              </button>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

function PaymentForm({ amountFormatted = 'PKR 3,500', onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setErrorMessage('')

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (result.error) {
        setErrorMessage(result.error.message || 'Payment could not be completed.')
        setProcessing(false)
        if (onError) onError(result.error)
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSucceeded(true)
        if (onSuccess) {
          await onSuccess(result.paymentIntent)
        }
      } else {
        setErrorMessage('Payment requires additional verification.')
        setProcessing(false)
      }
    } catch (err) {
      console.error('Stripe submit error:', err)
      setErrorMessage(err.message || 'An unexpected error occurred.')
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4 animate-bounce">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
        <p className="mt-2 text-sm text-slate-300">
          Your 30-day assessment access is now active. Opening diagnostic setup...
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs text-sky-400">
          <Loader2 size={16} className="animate-spin" />
          <span>Opening diagnostic assessment setup...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {processing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Pay {amountFormatted} & Start</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" />
          End-to-end encrypted by Stripe
        </span>
      </div>
    </form>
  )
}

export default function InAppPaymentModal({ isOpen, onClose, onPaymentComplete }) {
  const { user, darkMode, setPaymentStatus, setPaymentId } = useApp()
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState('')

  const handleFallbackCheckout = async () => {
    try {
      const studentId = user?.id || JSON.parse(localStorage.getItem('educheck_user') || '{}')?.id
      const { url } = await apiRequest('/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ studentId: Number(studentId) }),
      })
      if (url) window.location.assign(url)
    } catch (err) {
      console.error('Fallback checkout failed:', err)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setClientSecret('')
      setInitError('')
      return
    }

    let isMounted = true
    setLoading(true)
    setInitError('')

    const studentId = user?.id || JSON.parse(localStorage.getItem('educheck_user') || '{}')?.id

    if (!studentId) {
      setInitError('Please sign in to proceed with payment.')
      setLoading(false)
      return
    }

    apiRequest('/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ studentId: Number(studentId) }),
    })
      .then((data) => {
        if (isMounted) {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret)
          } else {
            setInitError('Failed to initialize Stripe in-app payment.')
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Payment intent init failed:', err)
          setInitError(err.message || 'Unable to connect to Stripe service.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, user?.id])

  if (!isOpen) return null

  const handleSuccess = async (paymentIntent) => {
    try {
      const studentId = user?.id || JSON.parse(localStorage.getItem('educheck_user') || '{}')?.id
      await apiRequest('/confirm-payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          studentId: Number(studentId),
        }),
      })

      setPaymentStatus('paid')
      setPaymentId(paymentIntent.id)

      setTimeout(() => {
        if (onPaymentComplete) onPaymentComplete(paymentIntent.id)
        if (onClose) onClose()
      }, 1200)
    } catch (err) {
      console.error('Confirm payment failed:', err)
      setPaymentStatus('paid')
      setPaymentId(paymentIntent.id)
      setTimeout(() => {
        if (onPaymentComplete) onPaymentComplete(paymentIntent.id)
        if (onClose) onClose()
      }, 1200)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex min-h-screen items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md transition-all duration-300">
      <div className={`relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-y-auto my-auto rounded-3xl border p-5 sm:p-7 md:p-8 shadow-2xl transition-all duration-300 ${
        darkMode
          ? 'border-white/10 bg-slate-950/95 text-white shadow-sky-500/10'
          : 'border-slate-200 bg-white text-slate-900 shadow-xl'
      }`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-400 w-fit">
          <Sparkles size={13} /> Secure In-App Payment
        </div>

        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Unlock Full Assessment Access
        </h2>

        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Pay once for 30 days of unlimited adaptive math diagnostics and reports. No external redirects required.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-xs">
          <div>
            <span className="text-slate-400">Student: </span>
            <span className="font-bold text-white">{user?.name || 'Student'}</span>
            {user?.grade && <span className="text-slate-400"> ({user.grade})</span>}
          </div>
          <div className="text-right">
            <span className="rounded-full bg-sky-500/10 border border-sky-400/30 px-3 py-1 font-bold text-sky-400">
              PKR 3,500
            </span>
          </div>
        </div>

        <ModalErrorBoundary
          onFallbackCheckout={handleFallbackCheckout}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300">
              <Loader2 size={32} className="animate-spin text-sky-400 mb-3" />
              <span className="text-sm font-medium">Initializing secure checkout...</span>
            </div>
          ) : initError ? (
            <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center space-y-3">
              <p className="text-sm text-rose-300">{initError}</p>
              <p className="text-xs text-slate-400">
                Please check connection or complete payment via Stripe Checkout below.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleFallbackCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  <ExternalLink size={14} /> Pay via Stripe Checkout (Hosted)
                </button>
              </div>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: darkMode ? 'night' : 'stripe',
                  variables: {
                    colorPrimary: '#38bdf8',
                    colorBackground: darkMode ? '#090d16' : '#ffffff',
                    colorText: darkMode ? '#ffffff' : '#0f172a',
                    colorDanger: '#f43f5e',
                    fontFamily: 'inherit',
                    borderRadius: '14px',
                  },
                },
              }}
              key={clientSecret}
            >
              <PaymentForm
                amountFormatted="PKR 3,500"
                onSuccess={handleSuccess}
              />
            </Elements>
          ) : null}
        </ModalErrorBoundary>
      </div>
    </div>
  )
}
