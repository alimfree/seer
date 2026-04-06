#!/usr/bin/env node
import sharp from 'sharp'
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const BLOG_DIR = 'src/content/blog'
const OUTPUT_DIR = 'public/og'
const WIDTH = 1200
const HEIGHT = 630
const BG_COLOR = '#000b13'
const TEXT_COLOR = '#f8f9ff'
const ACCENT_COLOR = '#4B3111'
const SUBTITLE_COLOR = '#6B8FA8'

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

  // Skip if already exists and blog file hasn't changed
  if (existsSync(outPath)) {
    skipped++
    continue
  }

  const raw = readFileSync(join(BLOG_DIR, file), 'utf-8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) continue

  const fm = match[1]
  const titleMatch = fm.match(/title:\s*"([^"]+)"/)
  const descMatch = fm.match(/description:\s*"([^"]+)"/)
  const categoryMatch = fm.match(/tags:\s*\[([^\]]+)\]/)

  const title = titleMatch ? titleMatch[1] : slug
  const category = categoryMatch
    ? categoryMatch[1].replace(/"/g, '').split(',')[0].trim().toUpperCase()
    : 'GUIDE'

  const titleLines = wrapText(title, 35)
  const titleY = 200
  const lineHeight = 60

  const titleSvg = titleLines.map((line, i) =>
    `<text x="80" y="${titleY + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="300" fill="${TEXT_COLOR}" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('\n    ')

  const svg = `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG_COLOR}" />

    <!-- Accent bar -->
    <rect x="80" y="80" width="48" height="3" fill="${ACCENT_COLOR}" />

    <!-- Category label -->
    <text x="80" y="120" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" fill="${SUBTITLE_COLOR}" letter-spacing="3" text-transform="uppercase">${escapeXml(category)}</text>

    <!-- Title -->
    ${titleSvg}

    <!-- Bottom bar -->
    <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="${ACCENT_COLOR}" />

    <!-- Logo text -->
    <text x="80" y="${HEIGHT - 50}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="300" fill="${TEXT_COLOR}" letter-spacing="-0.5">Zayd Health</text>

    <!-- Tagline -->
    <text x="80" y="${HEIGHT - 28}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="${SUBTITLE_COLOR}">RPM Billing Compliance Platform</text>

    <!-- URL -->
    <text x="${WIDTH - 80}" y="${HEIGHT - 36}" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="${SUBTITLE_COLOR}" text-anchor="end">zaydhealth.com</text>
  </svg>`

  await sharp(Buffer.from(svg)).png().toFile(outPath)
  generated++
}

console.log(`OG images: ${generated} generated, ${skipped} skipped (already exist).`)
