import { useState, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'
import Turnstile from './Turnstile'

export class RateLimitError extends Error {
  constructor() {
    super('Too many requests. Please wait a moment and try again.')
    this.name = 'RateLimitError'
  }
}

function formatPhoneInput(digits: string): string {
  const len = digits.length
  if (len === 0) return ''
  if (len <= 3) return len === 3 ? `(${digits}) ` : `(${digits}`
  if (len <= 6) return len === 6 ? `(${digits.slice(0, 3)}) ${digits.slice(3)}-` : `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export default function RequestCall() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [lineType, setLineType] = useState<'mobile' | 'landline'>('mobile')
  const [company, setCompany] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onVerify = useCallback((token: string) => setCaptchaToken(token), [])
  const onExpire = useCallback(() => setCaptchaToken(null), [])

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    let digits = raw.replace(/\D/g, '')
    if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
    digits = digits.slice(0, 10)

    // Backspacing over a formatting character (")" or "-") removes no digit on
    // its own — drop the preceding digit too so backspace always feels like it
    // deletes the last number typed.
    if (raw.length < phone.length && digits.length === phone.replace(/\D/g, '').length) {
      digits = digits.slice(0, -1)
    }

    setPhone(formatPhoneInput(digits))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !captchaToken) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/call-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, company, lineType, captchaToken }),
      })

      if (res.status === 429) throw new RateLimitError()
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error((error as { error?: string }).error || 'Failed to submit')
      }

      setStatus('success')
      trackEvent('call_request_submit', { location: 'homepage' })
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
          <span className="material-symbols-outlined text-5xl text-tertiary mb-4 block" aria-hidden="true">phone_in_talk</span>
          <h3 className="font-headline text-2xl mb-4">We've got your number.</h3>
          <p className="text-on-surface-variant">
            Thanks, {name}. We'll be in touch shortly to set up your live call with Seer.
          </p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="call-name" className="block text-sm font-body font-medium text-on-surface mb-2">
              Full Name
            </label>
            <input
              id="call-name"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="Sarah Ahmed"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="call-phone" className="block text-sm font-body font-medium text-on-surface mb-2">
              Phone Number
            </label>
            <input
              id="call-phone"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="(555) 123-4567"
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              inputMode="tel"
              maxLength={14}
            />
            <div className="flex gap-4 mt-2 text-sm text-on-surface-variant">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="line-type"
                  checked={lineType === 'mobile'}
                  onChange={() => setLineType('mobile')}
                />
                Mobile
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="line-type"
                  checked={lineType === 'landline'}
                  onChange={() => setLineType('landline')}
                />
                Office/landline
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="call-company" className="block text-sm font-body font-medium text-on-surface mb-2">
              Company Name
            </label>
            <input
              id="call-company"
              className="border-0 border-b border-outline-variant bg-transparent py-3 w-full text-lg focus:outline-none focus:border-tertiary transition-colors duration-300"
              placeholder="North Texas Medical Transport"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Turnstile onVerify={onVerify} onExpire={onExpire} />
          {status === 'error' && (
            <p className="text-tertiary text-sm" role="alert">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'loading' || !captchaToken}
            className="btn-secondary w-full py-4 text-on-secondary font-bold rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">phone_in_talk</span>
            {status === 'loading' ? 'Sending...' : 'Request My Live Call'}
          </button>
          <p className="text-xs text-on-surface-variant/70 italic text-center">
            No credit card required.
          </p>
        </form>
      )}
    </div>
  )
}
