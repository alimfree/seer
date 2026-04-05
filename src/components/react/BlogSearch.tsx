import { useState, useRef, useEffect, useCallback } from 'react'
import { trackEvent } from '../../hooks/useAnalytics'

interface SearchablePost {
  slug: string
  title: string
  description: string
  category: string
  image?: string
  url: string
  tags: string[]
}

interface Props {
  posts: SearchablePost[]
}

function searchPosts(posts: SearchablePost[], query: string): SearchablePost[] {
  if (!query.trim()) return []
  const terms = query.toLowerCase().trim().split(/\s+/)

  const scored = posts
    .map((post) => {
      const title = post.title.toLowerCase()
      const desc = post.description.toLowerCase()
      const tags = post.tags.join(' ').toLowerCase()

      let score = 0
      let allTermsMatch = true

      for (const term of terms) {
        const inTitle = title.includes(term)
        const inDesc = desc.includes(term)
        const inTags = tags.includes(term)

        if (!inTitle && !inDesc && !inTags) {
          allTermsMatch = false
          break
        }

        if (inTitle) score += 10
        if (inTags) score += 5
        if (inDesc) score += 3
      }

      return { post, score, match: allTermsMatch }
    })
    .filter((r) => r.match)
    .sort((a, b) => b.score - a.score)

  return scored.map((r) => r.post)
}

export default function BlogSearch({ posts }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchablePost[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (query.length >= 2) {
      const matches = searchPosts(posts, query).slice(0, 4)
      setResults(matches)
      setOpen(true)

      clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => {
        trackEvent('blog_search', { query, result_count: matches.length } as never)
      }, 800)
    } else {
      setResults([])
      setOpen(false)
    }
    return () => clearTimeout(searchTimer.current)
  }, [query, posts])

  const handleResultClick = useCallback((post: SearchablePost) => {
    trackEvent('blog_search_click', { query, result_title: post.title, post_slug: post.slug })
    setOpen(false)
    setQuery('')
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
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
          onFocus={() => query.length >= 2 && setOpen(true)}
          aria-label="Search articles"
          placeholder="Search articles..."
          className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus:border-tertiary transition-colors duration-300 rounded-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest shadow-ambient ghost-border rounded-sm z-50 overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map((post) => (
                <li key={post.slug}>
                  <a
                    href={post.url}
                    onClick={() => handleResultClick(post)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors duration-150"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        className="w-12 h-12 rounded-sm object-cover flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{post.title}</p>
                      <p className="text-xs text-on-surface-variant truncate">{post.description}</p>
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
