import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'error-callback'?: () => void
        'expired-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
        size?: 'normal' | 'compact' | 'invisible'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (document.querySelector(`script[src="${TURNSTILE_SRC}"]`)) {
    // Script tag exists but hasn't loaded yet — poll for it
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.turnstile) { clearInterval(interval); resolve() }
      }, 100)
    })
  }
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = TURNSTILE_SRC
    script.async = true
    script.onload = () => {
      const interval = setInterval(() => {
        if (window.turnstile) { clearInterval(interval); resolve() }
      }, 50)
    }
    document.head.appendChild(script)
  })
}

export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    loadTurnstileScript().then(() => {
      if (cancelled || !el || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
        theme: 'light',
        size: 'normal',
      })
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current) } catch { /* already removed */ }
        widgetIdRef.current = null
      }
    }
  }, [onVerify, onExpire])

  return <div ref={containerRef} className="mt-2" />
}
