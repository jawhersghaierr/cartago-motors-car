#!/usr/bin/env node
/**
 * auto-extract.mjs
 *
 * Scans all TSX/JSX files, detects hardcoded French strings,
 * injects them into fr.json, replaces with t('key') calls,
 * wires up useTranslations/getTranslations if missing,
 * then runs translate.mjs to generate en.json + ar.json.
 *
 * Usage:
 *   node scripts/auto-extract.mjs            ← apply changes
 *   node scripts/auto-extract.mjs --dry-run  ← preview only
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const MSG_DIR   = join(ROOT, 'src/messages')
const SRC_DIR   = join(ROOT, 'src')
const DRY_RUN   = process.argv.includes('--dry-run')

// Directories to skip
const SKIP = ['/admin/', '/api/', '/ui/']

// ── File walking ──────────────────────────────────────────────────────────────

function walkTsx(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue
    const full = join(dir, e.name)
    if (e.isDirectory()) walkTsx(full, out)
    else if (/\.(tsx|jsx)$/.test(e.name)) out.push(full)
  }
  return out
}

// ── Namespace inference ───────────────────────────────────────────────────────

function inferNs(filePath) {
  const rel = relative(SRC_DIR, filePath).replace(/\\/g, '/')
  if (/navbar/i.test(rel))              return 'nav'
  if (/footer/i.test(rel))             return 'footer'
  if (/contact/i.test(rel))            return 'contact'
  if (/catalogue/i.test(rel))          return 'catalogue'
  if (/a-propos|about/i.test(rel))     return 'about'
  if (/favoris|favourites/i.test(rel)) return 'favourites'
  if (/compar/i.test(rel))             return 'compare'
  if (/voiture|car/i.test(rel))        return 'car'
  if (/splash/i.test(rel))             return 'common'
  if (/home/i.test(rel))               return 'home'
  const m = rel.match(/\[locale\]\/([a-z-]+)\//i)
  if (m) return m[1]
  return 'common'
}

// ── Detect the namespace already bound to `t` in a file ──────────────────────

function existingNs(source) {
  const m = source.match(/(?:useTranslations|getTranslations)\(['"]([^'"]+)['"]\)/)
  return m ? m[1] : null
}

// ── Key generation ────────────────────────────────────────────────────────────

function toKey(text) {
  const words = text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim().toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 1)
    .slice(0, 5)
  if (!words.length) return 'text'
  return words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('')
}

function uniqueKey(ns, text, fr) {
  if (!fr[ns]) fr[ns] = {}
  const base = toKey(text)
  if (fr[ns][base] === text) return base   // exact match → reuse
  let key = base, i = 2
  while (fr[ns][key] !== undefined && fr[ns][key] !== text) key = `${base}${i++}`
  return key
}

// ── French-ness heuristic ─────────────────────────────────────────────────────

const FR_RE = /[àâéèêëîïôùûüÿçæœÀÂÉÈÊËÎÏÔÙÛÜŸÇÆŒ]|(?:^|\s)(le|la|les|un|une|des|du|de|au|aux|et|ou|en|votre|notre|sur|par|pour|avec|dans|est|sont|tout|tous|toute|pas|plus|très|bien|qui|que|dont|où|ici|ce|cet|cette|mes|tes|ses|nos|vos|leurs|mon|ton|son|ma|ta|sa)(?:\s|$)/i

function looksFrench(text) {
  const t = text.trim()
  if (t.length < 2)           return false
  if (!/[a-zA-ZÀ-ÿ]/.test(t)) return false
  return FR_RE.test(t)
}

function isMeaningful(text) {
  const t = text.trim()
  if (t.length < 2)                                            return false
  if (!/[a-zA-ZÀ-ÿ]/.test(t))                                 return false
  if (/^[A-Z][a-zA-Z0-9]+$/.test(t) && t.length < 20)        return false // PascalCase
  if (/^[a-z][a-zA-Z0-9]+$/.test(t) && !/ /.test(t) && t.length < 15) return false // camelCase
  return true
}

// ── Source transformation ─────────────────────────────────────────────────────

function transform(source, filePath, fr) {
  // Prefer the namespace already in use (keeps existing t() valid)
  const ns = existingNs(source) ?? inferNs(filePath)
  if (!fr[ns]) fr[ns] = {}

  const extracted = []

  function reg(text) {
    if (!isMeaningful(text) || !looksFrench(text)) return null
    const key = uniqueKey(ns, text, fr)
    fr[ns][key] = text
    extracted.push({ ns, key, text })
    return key
  }

  let src = source

  // Skip lines / blocks that already call t(
  // Strategy: replace char-by-char would be safest but too slow.
  // We use regexes that avoid matching inside {t('...')} by checking context.

  // 1. Static placeholder="text"
  src = src.replace(/\bplaceholder="([^"{}]+)"/g, (m, txt) => {
    const k = reg(txt); return k ? `placeholder={t('${k}')}` : m
  })

  // 2. Static aria-label="text"
  src = src.replace(/\baria-label="([^"{}]+)"/g, (m, txt) => {
    const k = reg(txt); return k ? `aria-label={t('${k}')}` : m
  })

  // 3. Ternary aria-label={cond ? 'a' : 'b'}
  src = src.replace(/\baria-label=\{([^}?]+?)\s*\?\s*'([^']+)'\s*:\s*'([^']+)'\}/g,
    (m, cond, t1, t2) => {
      const k1 = reg(t1), k2 = reg(t2)
      if (!k1 && !k2) return m
      const r1 = k1 ? `t('${k1}')` : `'${t1}'`
      const r2 = k2 ? `t('${k2}')` : `'${t2}'`
      return `aria-label={${cond.trim()} ? ${r1} : ${r2}}`
    }
  )

  // 4. Static title="text"
  src = src.replace(/\btitle="([^"{}]+)"/g, (m, txt) => {
    const k = reg(txt); return k ? `title={t('${k}')}` : m
  })

  // 5. Inline string literals in JSX expressions: {'text'} or {"text"}
  //    But NOT when already inside t('…') – the outer { } would be t(…)
  src = src.replace(/\{(['"])([^'"{}]+)\1\}/g, (m, q, txt) => {
    if (!looksFrench(txt)) return m
    const k = reg(txt); return k ? `{t('${k}')}` : m
  })

  // 6. JSX text nodes: >text< (no tags, braces, or newlines inside)
  src = src.replace(/(?<=>)([^<>{}\n\r]+)(?=<)/g, (m, txt) => {
    const trimmed = txt.trim()
    if (!isMeaningful(trimmed) || !looksFrench(trimmed)) return m
    const k = reg(trimmed)
    if (!k) return m
    return m.replace(trimmed, `{t('${k}')}`)
  })

  // 7. Ternary string pairs in JSX: cond ? 'fr1' : 'fr2'
  //    Only inside JSX-ish context (after = or { or return)
  src = src.replace(/([={(\[,]\s*[^=!<>]*?)\s*\?\s*'([^'\\]+)'\s*:\s*'([^'\\]+)'/g,
    (m, prefix, t1, t2) => {
      if (!looksFrench(t1) && !looksFrench(t2)) return m
      const k1 = looksFrench(t1) ? reg(t1) : null
      const k2 = looksFrench(t2) ? reg(t2) : null
      if (!k1 && !k2) return m
      const r1 = k1 ? `t('${k1}')` : `'${t1}'`
      const r2 = k2 ? `t('${k2}')` : `'${t2}'`
      return `${prefix} ? ${r1} : ${r2}`
    }
  )

  // 8. Standalone string constants: const X = 'French text'
  src = src.replace(/\bconst\s+(\w+)\s*=\s*'([^'\\]+)'/g, (m, varName, txt) => {
    if (!looksFrench(txt)) return m
    const k = reg(txt); return k ? `const ${varName} = t('${k}')` : m
  })

  return { src, ns, extracted }
}

// ── Wire up translations hook ─────────────────────────────────────────────────

function wireHook(source, ns) {
  const isClient = /^\s*['"]use client['"]/.test(source)

  // ── Case A: hook already present ─────────────────────────────────────────
  if (source.includes('useTranslations') || source.includes('getTranslations')) {
    // Check if this exact namespace is already covered
    const alreadyCovered =
      source.includes(`useTranslations('${ns}')`) ||
      source.includes(`getTranslations('${ns}')`)

    if (alreadyCovered) return source

    // Different namespace in the same file → add a second binding
    // (e.g. const tCar = useTranslations('car'))
    const alias = `t${ns[0].toUpperCase()}${ns.slice(1)}`
    if (isClient) {
      source = source.replace(
        /(const \w+ = useTranslations\('[^']+'\))/,
        `$1\n  const ${alias} = useTranslations('${ns}')`
      )
    } else {
      source = source.replace(
        /(const \w+ = await getTranslations\('[^']+'\))/,
        `$1\n  const ${alias} = await getTranslations('${ns}')`
      )
    }
    return source
  }

  // ── Case B: no hook at all ────────────────────────────────────────────────
  if (isClient) {
    // Add import
    if (source.includes("from 'next-intl'")) {
      source = source.replace(
        /import \{([^}]+)\} from 'next-intl'/,
        (m, imp) => imp.includes('useTranslations')
          ? m
          : `import {${imp.trimEnd()}, useTranslations } from 'next-intl'`
      )
    } else {
      source = source.replace(
        /^(\s*['"]use client['"]\s*\n)/,
        `$1import { useTranslations } from 'next-intl'\n`
      )
    }

    // Insert const t = ... as first statement of the component function
    // Try: export default function Foo(...) {
    if (/export default function\s+\w+/.test(source)) {
      source = source.replace(
        /(export default function\s+\w+[^{]*\{)(\s*)/,
        `$1$2const t = useTranslations('${ns}')\n`
      )
    } else {
      // Try arrow function: const Foo = (...) => {
      source = source.replace(
        /(=\s*(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>\s*\{)(\s*)/,
        `$1$2const t = useTranslations('${ns}')\n`
      )
    }
  } else {
    // Server component
    if (source.includes("from 'next-intl/server'")) {
      source = source.replace(
        /import \{([^}]+)\} from 'next-intl\/server'/,
        (m, imp) => imp.includes('getTranslations')
          ? m
          : `import {${imp.trimEnd()}, getTranslations } from 'next-intl/server'`
      )
    } else {
      source = `import { getTranslations } from 'next-intl/server'\n` + source
    }

    source = source.replace(
      /(export default async function\s+\w+[^{]*\{)(\s*)/,
      `$1$2const t = await getTranslations('${ns}')\n`
    )
  }

  return source
}

// ── Main ──────────────────────────────────────────────────────────────────────

const frPath = join(MSG_DIR, 'fr.json')
const fr = JSON.parse(readFileSync(frPath, 'utf-8'))

const files = walkTsx(SRC_DIR).filter(
  f => !SKIP.some(d => f.replace(/\\/g, '/').includes(d))
)

let totalExtracted = 0
const report = []

for (const filePath of files) {
  const original = readFileSync(filePath, 'utf-8')
  const { src: transformed, ns, extracted } = transform(original, filePath, fr)

  if (extracted.length === 0) continue

  const final = wireHook(transformed, ns)

  if (!DRY_RUN) writeFileSync(filePath, final, 'utf-8')

  totalExtracted += extracted.length
  report.push({ file: relative(ROOT, filePath), ns, extracted })
}

if (!DRY_RUN) writeFileSync(frPath, JSON.stringify(fr, null, 2) + '\n', 'utf-8')

// ── Report ────────────────────────────────────────────────────────────────────

console.log(DRY_RUN ? '\n🔍  DRY RUN – aucun fichier écrit\n' : '')
for (const { file, ns, extracted } of report) {
  console.log(`\n  📄  ${file}  [${ns}]`)
  for (const { key, text } of extracted) {
    console.log(`       ✓  ${key}  →  "${text.slice(0, 70)}"`)
  }
}
console.log(`\n${DRY_RUN ? '' : '✅  '}${totalExtracted} chaînes extraites dans ${report.length} fichier(s)`)

if (!DRY_RUN && totalExtracted > 0) {
  console.log('\n🌐  Lancement de translate.mjs …\n')
  execSync('node scripts/translate.mjs', { cwd: ROOT, stdio: 'inherit' })
}
