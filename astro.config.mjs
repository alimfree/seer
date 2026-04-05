import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  site: 'https://www.zaydhealth.com',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
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
