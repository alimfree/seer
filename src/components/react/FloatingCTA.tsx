import { useState, useEffect } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

export default function FloatingCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = Math.abs(y - lastY)
        if (delta > 5) {
          const scrollingUp = y < lastY
          setShow(!scrollingUp && y > 100)
          lastY = y
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      {...(!show ? { inert: true } : {})}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '2.5rem',
        zIndex: 50,
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        transform: show ? 'translateY(0)' : 'translateY(-5rem)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transition: 'transform 300ms ease-in-out, opacity 300ms ease-in-out',
      }}
      className="sm:!right-[4rem] sm:!h-[5rem]"
    >
      <a
        href="https://calendly.com/ali-zaydhealth/discovery"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary px-6 py-2.5 text-on-primary font-medium rounded-sm"
        onClick={() => trackEvent('cta_click', { location: 'floating' })}
      >
        Schedule a Call
      </a>
    </nav>
  )
}
