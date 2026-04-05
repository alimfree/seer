export const CATEGORY_MAP: Record<string, string> = {
  clinical: 'clinical',
  billing: 'billing',
  compliance: 'compliance',
  operations: 'operations',
  ccm: 'billing',
  revenue: 'billing',
  devices: 'operations',
  technology: 'operations',
  rpm: 'operations',
}

export const CATEGORIES = ['clinical', 'billing', 'compliance', 'operations'] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  clinical: 'Clinical Guides',
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
