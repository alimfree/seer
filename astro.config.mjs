import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { readdirSync, readFileSync } from 'fs'

// Build a slug → lastmod map from blog markdown frontmatter
const postDates = {}
const blogDir = './src/content/blog'
for (const file of readdirSync(blogDir).filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(`${blogDir}/${file}`, 'utf-8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) continue
  const slug = file.replace(/\.md$/, '')
  const lastModMatch = match[1].match(/lastModified:\s*"?([^"\n]+)"?/)
  const dateMatch = match[1].match(/date:\s*"?([^"\n]+)"?/)
  const date = lastModMatch ? lastModMatch[1].trim() : dateMatch ? dateMatch[1].trim() : null
  if (date) postDates[slug] = date
}

export default defineConfig({
  site: 'https://www.zaydhealth.com',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
      serialize: (item) => {
        const url = item.url

        // Homepage
        if (url === 'https://www.zaydhealth.com/') {
          return { ...item, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 }
        }
        // Blog listing pages
        if (url.match(/\/resources\/?$/) || url.match(/\/resources\/(clinical|billing|compliance|operations)\/?$/)) {
          return { ...item, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 }
        }
        // Pagination pages
        if (url.includes('/page/')) {
          return { ...item, changefreq: 'weekly', priority: 0.3 }
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
        // Specialty hub pages
        if (url.includes('/specialties')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 }
        }
        // Legal pages
        if (url.includes('/privacy') || url.includes('/terms')) {
          return { ...item, changefreq: 'yearly', priority: 0.2 }
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
