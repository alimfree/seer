import { useState, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'
import { addContact } from '../../lib/brevo'
import Turnstile from './Turnstile'

export default function Calculator() {
  const [patients, setPatients] = useState('')
  const [hours, setHours] = useState('')
  const [email, setEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onVerify = useCallback((token: string) => setCaptchaToken(token), [])
  const onExpire = useCallback(() => setCaptchaToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!patients || !email || !captchaToken) return

    setStatus('loading')
    setErrorMsg('')

    try {
      await addContact(email, 'calculator', {
        Patients: Number(patients),
        Hours: Number(hours),
        Source: 'calculator',
      }, captchaToken)
      setStatus('success')
      trackEvent('calculator_submit', { patients: Number(patients) })
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email us directly.')
    }
  }

  return (
    <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-sm shadow-ambient ghost-border">
      {status === 'success' ? (
        <div className="text-center py-12" role="status">
          <span className="material-symbols-outlined text-5xl text-tertiary mb-4 block" aria-hidden="true">check_circle</span>
          <h3 className="font-headline text-2xl mb-4">Check your inbox.</h3>
          <p className="text-on-surface-variant mb-8">
            We've sent your personalized revenue analysis and a sample superbill to <strong>{email}</strong>.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-tertiary font-medium hover:underline underline-offset-4 transition-colors"
            onClick={() => trackEvent('cta_click', { location: 'calculator_success' })}
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">calendar_month</span>
            Want to walk through your results? Schedule a call
          </a>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="calc-patients" className="block text-sm font-body font-bold text-secondary uppercase tracking-wider mb-2">
              Number of Diabetic Patients
            </label>
            <input
              id="calc-patients"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="e.g. 50"
              type="number"
              min="1"
              required
              value={patients}
              onChange={(e) => setPatients(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="calc-hours" className="block text-sm font-body font-bold text-secondary uppercase tracking-wider mb-2">
              Clinical Staff Hours (Weekly)
            </label>
            <input
              id="calc-hours"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="e.g. 10"
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="calc-email" className="block text-sm font-body font-bold text-secondary uppercase tracking-wider mb-2">
              Work Email Address
            </label>
            <input
              id="calc-email"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="physician@practice.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-3 text-xs text-on-surface-variant/70 italic">
              We'll send your personalized revenue analysis and a sample superbill to this address.
            </p>
          </div>
          <Turnstile onVerify={onVerify} onExpire={onExpire} />
          {status === 'error' && (
            <p className="text-red-600 text-sm" role="alert">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading' || !captchaToken}
            className="btn-secondary w-full py-4 text-on-secondary font-bold rounded-sm disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Calculate My Opportunity'}
          </button>
        </form>
      )}
    </div>
  )
}
