declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

type EventName =
  | 'cta_click'
  | 'calculator_submit'
  | 'contact_form_submit'
  | 'calendly_click'
  | 'faq_open'
  | 'blog_subscribe'
  | 'blog_search'
  | 'blog_search_click'
  | 'blog_toc_click'
  | 'blog_tag_click'
  | 'blog_post_view'
  | 'blog_read_more_click'
  | 'blog_pagination_click'
  | 'scroll_depth'

interface EventParams {
  location?: string
  question?: string
  patients?: number
  query?: string
  result_title?: string
  heading?: string
  tag?: string
  post_title?: string
  post_slug?: string
  page?: number
  depth?: string
  [key: string]: unknown
}

export function trackEvent(name: EventName, params?: EventParams) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}
