import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { resolveCategory, getPostUrl } from '../lib/blog'

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.status === 'published')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())

  return rss({
    title: 'Zayd Health Resources',
    description: 'Practical guides on RPM billing, compliance, and clinical workflows for your practice.',
    site: context.site!,
    items: posts.map((post) => {
      const category = resolveCategory(post.data.tags)
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: new Date(post.data.date),
        link: getPostUrl(category, post.id),
        categories: post.data.tags,
        author: post.data.author,
      }
    }),
  })
}
