import { useState } from 'react'
import { ArrowRight, Mail, MapPin, Phone, CheckCircle2, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { apiRequest } from '../utils/api'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@educheck.com',
    href: 'mailto:support@educheck.com',
  },
  {
    icon: Phone,
    title: 'Call Us Directly',
    value: '0319 4720 778',
    href: 'tel:+923194720778',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'EduCheck Learning Hub, Pakistan',
    href: '#',
  },
]

export default function Contact() {
  const { darkMode, user } = useApp()
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Support & Guidance', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await apiRequest('/contact', { method: 'POST', body: JSON.stringify({ ...formData, userId: user?.id }) })
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: 'Support & Guidance', message: '' })
    } catch (submitError) {
      setError(submitError.message || 'Unable to send your message right now. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 md:px-8 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <section className={`overflow-hidden rounded-4xl border p-8 md:p-12 lg:p-14 shadow-2xl backdrop-blur-2xl transition-colors duration-300 ${
        darkMode ? 'border-white/10 bg-slate-950/70 shadow-slate-950/80' : 'border-slate-200 bg-white shadow-slate-200/50'
      }`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-start space-y-5">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              We’re Here to Support Your Child’s{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Learning Journey.
              </span>
            </h1>

            <p className={`max-w-lg text-base sm:text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Have a question about our math assessments, need guidance understanding a student report, or simply want to share your feedback? Send us a message.
            </p>

            <div className="space-y-4 pt-2">
              {contactMethods.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                    darkMode
                      ? 'border-white/10 bg-slate-900/60 hover:border-cyan-400/40 hover:bg-slate-900'
                      : 'border-slate-200 bg-slate-50/80 hover:border-cyan-400 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-400">
                    <Icon size={20} />
                  </div>
                  <div>
                    {title ? <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{title}</p> : null}
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${
            darkMode ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
          }`}>
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
            <p className={`mt-1 text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Fill in your details below and our team will personally get back to you within 24 hours.
            </p>

            {submitted && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                <CheckCircle2 size={20} className="shrink-0" />
                <span>Thank you so much! Your message has been sent successfully. We will reach out to you shortly.</span>
              </div>
            )}
            {error && <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name (Parent or Student)"
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                    darkMode
                      ? 'border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                    darkMode
                      ? 'border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="E.g. Assessment question, feedback, or general inquiry"
                  className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                    darkMode
                      ? 'border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Message *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                    darkMode
                      ? 'border-white/10 bg-slate-950/80 text-white placeholder:text-slate-500'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:scale-105 active:scale-95"
              >
                <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
