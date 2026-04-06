import { useState, useCallback } from 'react'
import { useSmartNav } from '../../hooks/useSmartNav'
import { trackEvent } from '../../hooks/useAnalytics'

interface Props {
  currentPath: string
}

export default function Navbar({ currentPath }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { visible, atTop, suppress } = useSmartNav()

  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault()
      suppress()
      if (currentPath === '/') {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = `/#${hash}`
      }
    },
    [currentPath, suppress]
  )

  return (
    <header
      className={`fixed top-4 left-4 right-4 sm:left-8 sm:right-8 z-50 transition-all duration-300 ease-in-out rounded-2xl ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-[calc(100%+2rem)] opacity-0'
      } ${atTop ? 'bg-surface/40' : 'bg-surface/55 shadow-ambient'} backdrop-blur-3xl`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-sm">
        Skip to content
      </a>
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 sm:px-8 h-16 sm:h-20">
        <a href="/" className="block">
          <img src="/logo.svg" alt="Zayd Health" className="h-6 sm:h-8 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-10">
          <a className="text-on-surface-variant font-normal hover:text-tertiary transition-colors duration-300" href="/#how-it-works" onClick={(e) => scrollTo(e, 'how-it-works')}>
            How It Works
          </a>
          <a className="text-on-surface-variant font-normal hover:text-tertiary transition-colors duration-300" href="/#revenue-calculator" onClick={(e) => scrollTo(e, 'revenue-calculator')}>
            Calculator
          </a>
          <a className="text-on-surface-variant font-normal hover:text-tertiary transition-colors duration-300" href="/#faq" onClick={(e) => scrollTo(e, 'faq')}>
            FAQ
          </a>
          <a className="text-on-surface-variant font-normal hover:text-tertiary transition-colors duration-300" href="/resources">
            Resources
          </a>
          <a className="btn-primary px-6 py-2.5 text-on-primary font-medium rounded-sm" href="https://calendly.com/ali-zaydhealth/discovery" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { location: 'nav' })}>
            Schedule a Call
          </a>
        </div>
        <button
          className="md:hidden text-primary p-3"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="material-symbols-outlined text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
        {...(!mobileOpen ? { inert: true } : {})}
      >
        <div className="px-6 py-6 flex flex-col gap-2 bg-surface-container-lowest">
          <a className="text-on-surface-variant py-3 px-4 rounded-sm hover:bg-surface-container-low hover:text-tertiary transition-colors" href="/#how-it-works" onClick={(e) => { scrollTo(e, 'how-it-works'); setMobileOpen(false) }}>
            How It Works
          </a>
          <a className="text-on-surface-variant py-3 px-4 rounded-sm hover:bg-surface-container-low hover:text-tertiary transition-colors" href="/#revenue-calculator" onClick={(e) => { scrollTo(e, 'revenue-calculator'); setMobileOpen(false) }}>
            Calculator
          </a>
          <a className="text-on-surface-variant py-3 px-4 rounded-sm hover:bg-surface-container-low hover:text-tertiary transition-colors" href="/#faq" onClick={(e) => { scrollTo(e, 'faq'); setMobileOpen(false) }}>
            FAQ
          </a>
          <a className="text-on-surface-variant py-3 px-4 rounded-sm hover:bg-surface-container-low hover:text-tertiary transition-colors" href="/resources" onClick={() => setMobileOpen(false)}>
            Resources
          </a>
          <a className="btn-primary px-6 py-3 text-on-primary font-medium rounded-sm text-center mt-2" href="https://calendly.com/ali-zaydhealth/discovery" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
            Schedule a Call
          </a>
        </div>
      </div>
    </header>
  )
}
