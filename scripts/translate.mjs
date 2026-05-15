#!/usr/bin/env node
/**
 * Auto-translate src/messages/fr.json → en.json + ar.json
 * Uses Google Translate free endpoint – no API key needed.
 * Preserves existing translations and {interpolation} variables.
 *
 * Usage: node scripts/translate.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = join(__dirname, '../src/messages')

const TARGETS = [
  { code: 'en', file: 'en.json' },
  { code: 'ar', file: 'ar.json' },
]

// ── Google Translate (free, no key) ─────────────────────────────────────────

async function gtranslate(text, targetLang) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=fr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data[0].map((c) => c[0]).join('')
}

// Preserve {variable} placeholders (next-intl interpolation)
async function translateString(text, targetLang) {
  const vars = []
  const masked = text.replace(/\{[^}]+\}/g, (m) => {
    vars.push(m)
    return `XVARX${vars.length - 1}X`
  })

  let result = await gtranslate(masked, targetLang)

  // Restore – Google sometimes adds spaces around our tokens
  result = result.replace(/X\s*VAR\s*X\s*(\d+)\s*X/gi, (_, i) => vars[parseInt(i, 10)])
  return result
}

// ── Recursive translation ────────────────────────────────────────────────────

async function translateObj(source, existing, targetLang, path = '') {
  const out = {}
  for (const [key, val] of Object.entries(source)) {
    const fullPath = path ? `${path}.${key}` : key

    if (val && typeof val === 'object') {
      out[key] = await translateObj(val, existing?.[key] ?? {}, targetLang, fullPath)
    } else if (typeof val === 'string') {
      const current = existing?.[key]
      // Keep existing translation if present and not identical to source
      if (current && current !== val) {
        out[key] = current
        process.stdout.write(`  ↩  ${fullPath}\n`)
      } else {
        await sleep(120) // stay under rate limit
        out[key] = await translateString(val, targetLang)
        process.stdout.write(`  ✓  ${fullPath}\n`)
      }
    } else {
      out[key] = val
    }
  }
  return out
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Main ─────────────────────────────────────────────────────────────────────

const source = JSON.parse(readFileSync(join(MESSAGES_DIR, 'fr.json'), 'utf-8'))

for (const { code, file } of TARGETS) {
  console.log(`\n🌐  Translating → ${code} …`)
  const targetPath = join(MESSAGES_DIR, file)
  const existing = existsSync(targetPath)
    ? JSON.parse(readFileSync(targetPath, 'utf-8'))
    : {}

  const translated = await translateObj(source, existing, code)
  writeFileSync(targetPath, JSON.stringify(translated, null, 2) + '\n', 'utf-8')
  console.log(`✅  ${file} updated`)
}

console.log('\nDone.')
