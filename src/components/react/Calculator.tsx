import { useState, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'
import { addContact, RateLimitError } from '../../lib/brevo'
import Turnstile from './Turnstile'

export default function Calculator() {
  const [trips, setTrips] = useState('')
  const [reimbursement, setReimbursement] = useState('')
  const [denialRate, setDenialRate] = useState('')
  const [email, setEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onVerify = useCallback((token: string) => setCaptchaToken(token), [])
  const onExpire = useCallback(() => setCaptchaToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!trips || !reimbursement || !email || !captchaToken) return

    setStatus('loading')
    setErrorMsg('')

    try {
      await addContact(email, 'calculator', {
        TRIPS: Number(trips),
        REIMBURSEMENT: Number(reimbursement),
        DENIAL_RATE: denialRate ? Number(denialRate) : undefined,
        SOURCE: 'calculator',
      }, captchaToken)
      setStatus('success')
      trackEvent('calculator_submit', { trips: Number(trips) })
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof RateLimitError
          ? 'Please wait a moment before trying again.'
          : 'Something went wrong. Please try again or email us directly.'
      )
    }
  }

  return (
    <div className="bg-surface-container-lowest p-8 sm:p-10 rounded-sm shadow-ambient ghost-border">
      {status === 'success' ? (
        <div className="text-center py-12" role="status">
          <span className="material-symbols-outlined text-5xl text-tertiary mb-4 block" aria-hidden="true">check_circle</span>
          <h3 className="font-headline text-2xl mb-4">Check your inbox.</h3>
          <p className="text-on-surface-variant mb-8">
            We've sent your personalized revenue recovery analysis to <strong>{email}</strong>.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 text-tertiary font-medium hover:underline underline-offset-4 transition-colors"
            onClick={() => trackEvent('cta_click', { location: 'calculator_success' })}
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">calendar_month</span>
            Want to walk through your results? Get in touch
          </a>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="calc-trips" className="block text-sm font-body font-medium text-on-surface mb-2">
              Monthly NEMT Trips
            </label>
            <input
              id="calc-trips"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="e.g. 2000"
              type="number"
              min="1"
              required
              value={trips}
              onChange={(e) => setTrips(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="calc-reimbursement" className="block text-sm font-body font-medium text-on-surface mb-2">
              Average Reimbursement per Trip ($)
            </label>
            <input
              id="calc-reimbursement"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="e.g. 45"
              type="number"
              min="1"
              step="0.01"
              required
              value={reimbursement}
              onChange={(e) => setReimbursement(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="calc-denial-rate" className="block text-sm font-body font-medium text-on-surface mb-2">
              Current Denial Rate (%)
            </label>
            <input
              id="calc-denial-rate"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="e.g. 15 (industry average is 10–20%)"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={denialRate}
              onChange={(e) => setDenialRate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="calc-email" className="block text-sm font-body font-medium text-on-surface mb-2">
              Work Email Address
            </label>
            <input
              id="calc-email"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="you@nemtfleet.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-3 text-xs text-on-surface-variant/70 italic">
              We'll send your personalized revenue recovery analysis to this address.
            </p>
          </div>
          <Turnstile onVerify={onVerify} onExpire={onExpire} />
          {status === 'error' && (
            <p className="text-tertiary text-sm" role="alert">{errorMsg}</p>
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
