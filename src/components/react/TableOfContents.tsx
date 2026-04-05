import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -75% 0px', threshold: 0 }
    )

    for (const { id } of headings) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  // Auto-scroll the TOC list to keep active item visible (without scrolling the page)
  useEffect(() => {
    if (!activeId || !listRef.current) return
    const activeEl = listRef.current.querySelector(`[data-toc-id="${activeId}"]`) as HTMLElement | null
    if (!activeEl) return

    const list = listRef.current
    const elTop = activeEl.offsetTop
    const elBottom = elTop + activeEl.offsetHeight
    const listTop = list.scrollTop
    const listBottom = listTop + list.clientHeight

    if (elTop < listTop) {
      list.scrollTo({ top: elTop - 8, behavior: 'smooth' })
    } else if (elBottom > listBottom) {
      list.scrollTo({ top: elBottom - list.clientHeight + 8, behavior: 'smooth' })
    }
  }, [activeId])

  if (headings.length === 0) return null

  return (
    <aside className="hidden lg:block" aria-label="Table of contents">
      <div className="sticky top-28 flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
        <p className="text-xs font-body font-bold text-secondary uppercase tracking-widest mb-4 flex-shrink-0">
          Contents
        </p>
        <ul
          ref={listRef}
          className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(194,199,204,0.3) transparent' }}
        >
          {headings.map((h) => (
            <li key={h.id} data-toc-id={h.id} className={h.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${h.id}`}
                onClick={() => trackEvent('blog_toc_click', { heading: h.text })}
                className={`text-sm block transition-colors duration-200 ${
                  activeId === h.id
                    ? 'text-tertiary font-medium'
                    : 'text-on-surface-variant hover:text-tertiary'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex-shrink-0">
          <a
            href="#"
            className="text-sm text-on-surface-variant hover:text-tertiary transition-colors duration-200 inline-flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </aside>
  )
}
