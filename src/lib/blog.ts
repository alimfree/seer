export const CATEGORY_MAP: Record<string, string> = {
  billing: 'billing',
  compliance: 'compliance',
  operations: 'operations',
  denials: 'billing',
  revenue: 'billing',
  brokers: 'operations',
  dispatch: 'operations',
  medicaid: 'compliance',
  credentialing: 'compliance',
}

export const CATEGORIES = ['billing', 'compliance', 'operations'] as const

/** Returns only categories that have at least one published post. Call at build time. */
export function getVisibleCategories(publishedPosts: Array<{ data: { tags: string[] } }>): Category[] {
  const populated = new Set<Category>()
  for (const post of publishedPosts) {
    populated.add(resolveCategory(post.data.tags))
  }
  return CATEGORIES.filter((cat) => populated.has(cat))
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  billing: 'Denial reasons, broker billing rules, payer requirements, and revenue strategies for NEMT operators.',
  compliance: 'State Medicaid regulations, credentialing, licensing, and audit preparation for NEMT operators.',
  operations: 'Dispatch, broker portals, driver management, and scaling strategies for NEMT fleets.',
}
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  billing: 'Billing Guides',
  compliance: 'Compliance',
  operations: 'Operations',
}

export function resolveCategory(tags: string[]): Category {
  for (const tag of tags) {
    const mapped = CATEGORY_MAP[tag.toLowerCase()]
    if (mapped) return mapped as Category
  }
  return 'operations'
}

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 225))
}

export function getPostUrl(category: string, slug: string): string {
  return `/resources/${category}/${slug}`
}

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    headings.push({ id, text, level: match[1].length })
  }
  return headings
}

export interface FaqItem {
  question: string
  answer: string
}

/** Parses "**Question?**\nAnswer" pairs out of a "## Frequently asked questions" section. */
export function extractFaq(markdown: string): FaqItem[] {
  const headingMatch = /^##\s+Frequently asked questions\s*$/im.exec(markdown)
  if (!headingMatch) return []

  const rest = markdown.slice(headingMatch.index + headingMatch[0].length)
  const nextHeadingMatch = /^##\s+/m.exec(rest)
  const sectionText = nextHeadingMatch ? rest.slice(0, nextHeadingMatch.index) : rest

  const items: FaqItem[] = []
  for (const paragraph of sectionText.trim().split(/\n\s*\n/)) {
    const qaMatch = /^\*\*(.+?)\*\*\s*\n([\s\S]+)$/.exec(paragraph.trim())
    if (!qaMatch) continue
    const question = qaMatch[1].trim()
    const answer = qaMatch[2].replace(/\s+/g, ' ').trim()
    if (question && answer) items.push({ question, answer })
  }
  return items
}

export function paginatePosts<T>(
  posts: T[],
  page: number,
  perPage: number = 6
): { posts: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage))
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const start = (currentPage - 1) * perPage
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage,
  }
}

/** Lightweight post metadata for search index (no body content) */
export interface SearchablePost {
  slug: string
  title: string
  description: string
  category: string
  image?: string
  url: string
  tags: string[]
}

/** Build search index from collection entries — call once per page */
export function buildSearchIndex(entries: Array<{ id: string; data: { title: string; description: string; tags: string[]; image?: string; status: string } }>): SearchablePost[] {
  return entries
    .filter((p) => p.data.status === 'published')
    .map((p) => {
      const category = resolveCategory(p.data.tags)
      return {
        slug: p.id,
        title: p.data.title,
        description: p.data.description,
        category,
        image: p.data.image,
        url: getPostUrl(category, p.id),
        tags: p.data.tags,
      }
    })
}
