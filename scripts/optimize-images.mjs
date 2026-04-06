#!/usr/bin/env node
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

const BLOG_DIR = 'public/blog'
const QUALITY = 80

// Responsive breakpoints: small (400px) and medium (800px)
const SIZES = [
  { dir: join(BLOG_DIR, 'sm'), width: 400 },
  { dir: join(BLOG_DIR, 'md'), width: 800 },
]

for (const { dir } of SIZES) mkdirSync(dir, { recursive: true })

const imageExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff'])

const files = readdirSync(BLOG_DIR).filter((f) => {
  const ext = extname(f).toLowerCase()
  return imageExts.has(ext) && !statSync(join(BLOG_DIR, f)).isDirectory()
})

let converted = 0
let compressed = 0
let resized = 0

for (const file of files) {
  const ext = extname(file).toLowerCase()
  const name = basename(file, ext)
  const srcPath = join(BLOG_DIR, file)
  const webpPath = join(BLOG_DIR, `${name}.webp`)

  // Convert non-webp to webp
  if (ext !== '.webp') {
    console.log(`Converting ${file} → ${name}.webp`)
    await sharp(srcPath)
      .webp({ quality: QUALITY })
      .toFile(webpPath)
    converted++
  }

  const inputPath = ext === '.webp' ? srcPath : webpPath
  const { size } = statSync(inputPath)
  const { width } = await sharp(inputPath).metadata()

  // Recompress if over 100KB
  if (ext === '.webp' && size > 102400) {
    console.log(`Compressing ${name}.webp (${Math.round(size / 1024)}KB)`)
    const buf = await sharp(inputPath).webp({ quality: QUALITY }).toBuffer()
    if (buf.length < size) {
      await sharp(buf).toFile(inputPath)
      compressed++
    }
  }

  // Generate responsive variants
  for (const { dir, width: targetWidth } of SIZES) {
    const outPath = join(dir, `${name}.webp`)
    const outExists = existsSync(outPath)
    const outNewer = outExists && statSync(outPath).mtimeMs > statSync(inputPath).mtimeMs

    if (!outNewer) {
      if (width && width > targetWidth) {
        console.log(`Resize: ${basename(dir)}/${name}.webp (${width}px → ${targetWidth}px)`)
        await sharp(inputPath)
          .resize(targetWidth)
          .webp({ quality: QUALITY })
          .toFile(outPath)
        resized++
      } else if (!outExists) {
        await sharp(inputPath).webp({ quality: QUALITY }).toFile(outPath)
        resized++
      }
    }
  }
}

console.log(`\nImage optimization complete: ${converted} converted, ${compressed} compressed, ${resized} responsive variants generated.`)
