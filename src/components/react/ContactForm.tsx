import { useState, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'
import { addContact, RateLimitError } from '../../lib/brevo'
import Turnstile from './Turnstile'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [practice, setPractice] = useState('')
  const [message, setMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate-limited'>('idle')

  const onVerify = useCallback((token: string) => setCaptchaToken(token), [])
  const onExpire = useCallback(() => setCaptchaToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !captchaToken) return

    setStatus('loading')

    try {
      const nameParts = name.trim().split(/\s+/)
      const titles = ['dr.', 'dr', 'mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms']
      const hasTitle = titles.includes(nameParts[0].toLowerCase())
      const titlePrefix = hasTitle ? nameParts[0] + ' ' : ''
      const rest = hasTitle ? nameParts.slice(1) : nameParts
      await addContact(email, 'contact', {
        FIRSTNAME: titlePrefix + (rest[0] || ''),
        LASTNAME: rest.slice(1).join(' ') || undefined,
        PRACTICE: practice || undefined,
        MESSAGE: message || undefined,
      }, captchaToken)
      setStatus('success')
      trackEvent('contact_form_submit')
    } catch (err) {
      setStatus(err instanceof RateLimitError ? 'rate-limited' : 'error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12" role="status">
        <span className="material-symbols-outlined text-5xl text-tertiary mb-4 block" aria-hidden="true">check_circle</span>
        <h3 className="font-headline text-2xl mb-4">We'll be in touch.</h3>
        <p className="text-on-surface-variant">
          Thanks, {name}. We'll reach out within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-body font-medium text-on-surface mb-2">
            Name
          </label>
          <input
            id="contact-name"
            className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300"
            placeholder="Sarah Ahmed"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-body font-medium text-on-surface mb-2">
            Email
          </label>
          <input
            id="contact-email"
            className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300"
            placeholder="sarah@nemtfleet.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-practice" className="block text-sm font-body font-medium text-on-surface mb-2">
          Company Name
        </label>
        <input
          id="contact-practice"
          className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300"
          placeholder="North Texas Medical Transport"
          type="text"
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-body font-medium text-on-surface mb-2">
          Message <span className="normal-case font-normal text-on-surface-variant/60">(optional)</span>
        </label>
        <textarea
          id="contact-message"
          className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300 resize-none"
          placeholder="Tell us about your practice or ask a question..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Turnstile onVerify={onVerify} onExpire={onExpire} />
      {(status === 'error' || status === 'rate-limited') && (
        <p className="text-tertiary text-sm" role="alert">
          {status === 'rate-limited'
            ? 'Please wait a moment before trying again.'
            : 'Something went wrong. Please try again.'}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading' || !captchaToken}
        className="btn-secondary w-full sm:w-auto px-10 py-4 text-on-secondary font-bold rounded-sm disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Get in Touch'}
      </button>
    </form>
  )
}
