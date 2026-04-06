#!/usr/bin/env node
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

const BLOG_DIR = 'public/blog'
const SM_DIR = join(BLOG_DIR, 'sm')
const QUALITY = 80
const MOBILE_WIDTH = 400

mkdirSync(SM_DIR, { recursive: true })

const imageExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff'])

const files = readdirSync(BLOG_DIR).filter((f) => {
  const ext = extname(f).toLowerCase()
  return imageExts.has(ext) && !statSync(join(BLOG_DIR, f)).isDirectory()
})

let converted = 0
let compressed = 0
let mobile = 0

for (const file of files) {
  const ext = extname(file).toLowerCase()
  const name = basename(file, ext)
  const srcPath = join(BLOG_DIR, file)
  const webpPath = join(BLOG_DIR, `${name}.webp`)
  const smPath = join(SM_DIR, `${name}.webp`)

  // Convert non-webp to webp
  if (ext !== '.webp') {
    console.log(`Converting ${file} → ${name}.webp`)
    await sharp(srcPath)
      .webp({ quality: QUALITY })
      .toFile(webpPath)
    converted++
    // Don't delete original here — let the user do that manually
  }

  const inputPath = ext === '.webp' ? srcPath : webpPath
  const { size } = statSync(inputPath)
  const { width } = await sharp(inputPath).metadata()

  // Recompress if over 100KB
  if (ext === '.webp' && size > 102400) {
    console.log(`Compressing ${name}.webp (${Math.round(size / 1024)}KB)`)
    const buf = await sharp(inputPath).webp({ quality: QUALITY }).toBuffer()
    // Only overwrite if actually smaller
    if (buf.length < size) {
      await sharp(buf).toFile(inputPath)
      compressed++
    }
  }

  // Generate mobile variant if wider than MOBILE_WIDTH
  // Skip if sm version exists and is newer
  const smExists = existsSync(smPath)
  const smNewer = smExists && statSync(smPath).mtimeMs > statSync(inputPath).mtimeMs

  if (!smNewer) {
    if (width && width > MOBILE_WIDTH) {
      console.log(`Mobile: sm/${name}.webp (${width}px → ${MOBILE_WIDTH}px)`)
      await sharp(inputPath)
        .resize(MOBILE_WIDTH)
        .webp({ quality: QUALITY })
        .toFile(smPath)
      mobile++
    } else if (!smExists) {
      // Image is already small, just copy as webp
      await sharp(inputPath).webp({ quality: QUALITY }).toFile(smPath)
      mobile++
    }
  }
}

console.log(`\nImage optimization complete: ${converted} converted, ${compressed} compressed, ${mobile} mobile variants generated.`)
