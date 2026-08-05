import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { readdirSync, readFileSync } from 'fs'

// Build a slug → lastmod map and find categories with published posts
const postDates = {}
const populatedCategories = new Set()
const CATEGORY_MAP = { billing: 'billing', compliance: 'compliance', operations: 'operations', denials: 'billing', revenue: 'billing', brokers: 'operations', dispatch: 'operations', medicaid: 'compliance', credentialing: 'compliance' }
const blogDir = './src/content/blog'
for (const file of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(`${blogDir}/${file}`, 'utf-8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) continue
  const slug = file.replace(/\.md$/, '')
  const frontmatter = match[1]
  const lastModMatch = frontmatter.match(/lastModified:\s*"?([^"\n]+)"?/)
  const dateMatch = frontmatter.match(/date:\s*"?([^"\n]+)"?/)
  const date = lastModMatch ? lastModMatch[1].trim() : dateMatch ? dateMatch[1].trim() : null
  if (date) postDates[slug] = date
  // Track which categories have published posts
  const statusMatch = frontmatter.match(/status:\s*"?([^"\n]+)"?/)
  if (statusMatch && statusMatch[1].trim() === 'published') {
    const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]+)\]/)
    if (tagsMatch) {
      const tags = tagsMatch[1].replace(/"/g, '').split(',').map((t) => t.trim())
      for (const tag of tags) {
        if (CATEGORY_MAP[tag]) { populatedCategories.add(CATEGORY_MAP[tag]); break }
      }
    }
  }
}

export default defineConfig({
  site: 'https://www.seermobility.com',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        if (page.includes('/api/')) return false
        if (page.includes('/page/')) return false
        // Exclude empty category pages from sitemap
        const categoryMatch = page.match(/\/resources\/(billing|compliance|operations)/)
        if (categoryMatch && !populatedCategories.has(categoryMatch[1])) return false
        return true
      },
      serialize: (item) => {
        const url = item.url

        // Homepage
        if (url === 'https://www.seermobility.com/') {
          return { ...item, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 }
        }
        // Blog listing pages
        if (url.match(/\/resources\/?$/) || url.match(/\/resources\/(billing|compliance|operations)\/?$/)) {
          return { ...item, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 }
        }
        // Individual blog posts — match slug to get lastmod from frontmatter
        if (url.includes('/resources/')) {
          const slug = url.replace(/\/$/, '').split('/').pop()
          const date = slug && postDates[slug]
          return {
            ...item,
            lastmod: date ? new Date(date).toISOString() : undefined,
            changefreq: 'monthly',
            priority: 0.7,
          }
        }
        // Tools (calculator)
        if (url.includes('/tools/')) {
          return { ...item, lastmod: '2026-03-15T00:00:00.000Z', changefreq: 'monthly', priority: 0.6 }
        }
        // Legal pages
        if (url.includes('/privacy') || url.includes('/terms')) {
          return { ...item, lastmod: '2026-04-03T00:00:00.000Z', changefreq: 'yearly', priority: 0.2 }
        }

        return item
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeRaw, rehypeSlug],
  },
})
