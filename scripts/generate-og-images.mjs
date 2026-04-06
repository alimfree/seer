#!/usr/bin/env node
import sharp from 'sharp'
import { readdirSync, readFileSync, existsSync, mkdirSync, statSync } from 'fs'
import { join } from 'path'

const BLOG_DIR = 'src/content/blog'
const IMAGE_DIR = 'public/blog'
const OUTPUT_DIR = 'public/og'
const WIDTH = 1200
const HEIGHT = 630

mkdirSync(OUTPUT_DIR, { recursive: true })

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function wrapText(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      lines.push(current.trim())
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current.trim()) lines.push(current.trim())
  return lines
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

let generated = 0
let skipped = 0

for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const outPath = join(OUTPUT_DIR, `${slug}.png`)

  const raw = readFileSync(join(BLOG_DIR, file), 'utf-8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) continue

  const fm = match[1]
  const statusMatch = fm.match(/status:\s*"([^"]+)"/)
  if (!statusMatch || statusMatch[1] !== 'published') continue

  const titleMatch = fm.match(/title:\s*"([^"]+)"/)
  const imageMatch = fm.match(/image:\s*"([^"]+)"/)

  if (!titleMatch || !imageMatch) continue

  const title = titleMatch[1]
  const imagePath = join('public', imageMatch[1])

  // Skip if OG image exists and is newer than both the blog post and source image
  if (existsSync(outPath)) {
    const ogStat = statSync(outPath)
    const mdStat = statSync(join(BLOG_DIR, file))
    const imgStat = existsSync(imagePath) ? statSync(imagePath) : null
    if (ogStat.mtimeMs > mdStat.mtimeMs && (!imgStat || ogStat.mtimeMs > imgStat.mtimeMs)) {
      skipped++
      continue
    }
  }

  if (!existsSync(imagePath)) {
    console.log(`Skipping ${slug}: image not found at ${imagePath}`)
    continue
  }

  // Resize blog photo to fill the OG card
  const photo = await sharp(imagePath)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .toBuffer()

  // Title bar height depends on number of lines
  const titleLines = wrapText(title, 38)
  const lineHeight = 48
  const barHeight = 140 + (titleLines.length - 1) * lineHeight
  const titleStartY = HEIGHT - barHeight + 60

  const titleSvg = titleLines.map((line, i) =>
    `<text x="60" y="${titleStartY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="300" fill="#f8f9ff" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('\n    ')

  const overlay = Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="85%" cy="25%" r="60%" fx="85%" fy="25%">
        <stop offset="0%" stop-color="#0a2a3d" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#000b13" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Dark overlay bar at bottom with gradient accent -->
    <rect x="0" y="${HEIGHT - barHeight}" width="${WIDTH}" height="${barHeight}" fill="#000b13" opacity="0.94" />
    <rect x="0" y="${HEIGHT - barHeight}" width="${WIDTH}" height="${barHeight}" fill="url(#glow)" opacity="0.94" />

    <!-- Tertiary accent line -->
    <rect x="60" y="${HEIGHT - barHeight + 22}" width="48" height="3" fill="#4B3111" />

    <!-- Title text -->
    ${titleSvg}

  </svg>`)

  await sharp(photo)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toFile(outPath)

  generated++
  console.log(`Generated: og/${slug}.png`)
}

console.log(`\nOG images: ${generated} generated, ${skipped} skipped (up to date).`)
