import { useState } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'
import { addContact, RateLimitError } from '../../lib/brevo'

interface EmailCaptureProps {
  minimal?: boolean
}

export default function EmailCapture({ minimal = false }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'rate-limited'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      await addContact(email, 'newsletter', { Source: 'blog' })
      setStatus('success')
      trackEvent('blog_subscribe')
    } catch (err) {
      setStatus(err instanceof RateLimitError ? 'rate-limited' : 'error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface-container-lowest rounded-sm p-8 text-center ghost-border" role="status">
        <span className="material-symbols-outlined text-4xl text-tertiary mb-3 block" aria-hidden="true">mark_email_read</span>
        <p className="font-headline text-xl text-on-background">You're on the list.</p>
        <p className="text-sm text-on-surface-variant mt-2">First issue lands next month. No spam, ever.</p>
      </div>
    )
  }

  const errorMessage = status === 'rate-limited'
    ? 'Please wait a moment before trying again.'
    : status === 'error'
      ? 'Something went wrong. Please try again.'
      : null

  if (minimal) {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="you@nemtfleet.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-surface-container-low border-none rounded-sm px-6 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-secondary px-8 py-4 text-on-secondary font-medium rounded-sm whitespace-nowrap disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {errorMessage && (
          <p className="text-tertiary text-sm mt-3" role="alert">{errorMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface-container-low rounded-sm p-6 sm:p-8 ghost-border">
      <p className="font-headline text-lg text-on-background mb-1">
        Don't miss the next one.
      </p>
      <p className="text-sm text-on-surface-variant mb-5">
        One email when we publish. NEMT billing changes, broker portal updates, and what's actually working in the field.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          placeholder="you@nemtfleet.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-surface-container border-none rounded-sm px-5 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-secondary px-6 py-3 text-on-secondary font-medium rounded-sm whitespace-nowrap disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {errorMessage && (
        <p className="text-tertiary text-sm mt-3" role="alert">{errorMessage}</p>
      )}
    </div>
  )
}
