import { useState, useRef, useEffect, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

interface PagefindResult {
  url: string
  meta: {
    title?: string
    image?: string
    category?: string
  }
  excerpt: string
}

interface PagefindResponse {
  results: Array<{
    data: () => Promise<PagefindResult>
  }>
}

interface Pagefind {
  search: (query: string) => Promise<PagefindResponse>
  init: () => Promise<void>
}

export default function BlogSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pagefindRef = useRef<Pagefind | null>(null)

  // Lazy-load Pagefind on first search (runtime import, not bundled by Vite)
  const getPagefind = useCallback(async (): Promise<Pagefind | null> => {
    if (pagefindRef.current) return pagefindRef.current
    try {
      // Use new Function to create a dynamic import that Vite won't analyze
      const importPagefind = new Function('return import("/pagefind/pagefind.js")') as () => Promise<Pagefind>
      const pf = await importPagefind()
      await pf.init()
      pagefindRef.current = pf
      return pf
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(async () => {
      setLoading(true)
      const pf = await getPagefind()
      if (!pf) {
        setLoading(false)
        return
      }

      const response = await pf.search(query)
      const topResults = await Promise.all(
        response.results.slice(0, 4).map((r) => r.data())
      )
      setResults(topResults)
      setOpen(true)
      setLoading(false)

      trackEvent('blog_search', { query, result_count: topResults.length } as never)
    }, 300)

    return () => clearTimeout(searchTimer.current)
  }, [query, getPagefind])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
          aria-label="Search articles"
          placeholder="Search articles..."
          className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300 rounded-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); setResults([]) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest shadow-ambient ghost-border rounded-sm z-50 overflow-hidden">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    href={result.url}
                    onClick={() => {
                      trackEvent('blog_search_click', { query, result_title: result.meta.title || '' })
                      setOpen(false)
                      setQuery('')
                    }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors duration-150"
                  >
                    {result.meta.image && (
                      <img
                        src={result.meta.image}
                        alt=""
                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{result.meta.title}</p>
                      {result.meta.category && (
                        <p className="text-xs text-tertiary mb-0.5">{result.meta.category}</p>
                      )}
                      <p
                        className="text-xs text-on-surface-variant line-clamp-2 [&_mark]:bg-[#4B3111]/30 [&_mark]:text-on-background [&_mark]:font-semibold [&_mark]:rounded-[2px] [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{ __html: result.excerpt }}
                      />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
              No results for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
