'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'

// ── Config ────────────────────────────────────────────────────────────────────

const SOURCE_LANG = 'fr'
const BATCH_SIZE  = 20
const DEBOUNCE_MS = 250

const SKIP_TAGS: Record<string, boolean> = {
  SCRIPT: true, STYLE: true, CODE: true, PRE: true,
  KBD: true, SAMP: true, NOSCRIPT: true, TEXTAREA: true, OPTION: true,
}

const DONE_ATTR = 'data-dtl'

// ── Google Translate (free, no key) ──────────────────────────────────────────

async function gtBatch(texts: string[], lang: string): Promise<string[]> {
  const qs = texts.map(t => `q=${encodeURIComponent(t)}`).join('&')
  const url =
    `https://translate.googleapis.com/translate_a/t` +
    `?client=gtx&sl=${SOURCE_LANG}&tl=${lang}&${qs}`

  const res = await fetch(url)
  if (!res.ok) return texts

  const data = await res.json()
  if (typeof data === 'string') return [data]
  return (data as unknown[]).map((d) =>
    Array.isArray(d) ? (d[0] as string) : (d as string)
  )
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

function collectTextNodes(root: Node): Text[] {
  const out: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el)                         return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS[el.tagName])       return NodeFilter.FILTER_REJECT
      if (el.closest(`[${DONE_ATTR}]`)) return NodeFilter.FILTER_REJECT
      if (el.isContentEditable)        return NodeFilter.FILTER_REJECT
      const text = (node.textContent ?? '').trim()
      if (text.length < 2)             return NodeFilter.FILTER_REJECT
      if (!/[a-zA-ZÀ-ÿ]/.test(text))  return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let n: Node | null
  while ((n = walker.nextNode())) out.push(n as Text)
  return out
}

function applyTranslation(node: Text, original: string, translated: string) {
  if (!node.isConnected || translated === original) return
  const raw      = node.textContent ?? ''
  const idx      = raw.indexOf(original)
  if (idx === -1) return
  node.textContent =
    raw.slice(0, idx) + translated + raw.slice(idx + original.length)
  node.parentElement?.setAttribute(DONE_ATTR, '1')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DomTranslator() {
  const locale = useLocale()

  const pendingRef = useRef<Text[]>([])
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  // cache: plain object for compat (no Map iterator needed)
  const cacheRef   = useRef<Record<string, string>>({})
  const inflightRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (locale === SOURCE_LANG) return

    const STORE_KEY = `dtl_${locale}`

    // ── Hydrate cache ──────────────────────────────────────────────────────
    try {
      const raw = sessionStorage.getItem(STORE_KEY)
      if (raw) cacheRef.current = JSON.parse(raw) as Record<string, string>
    } catch { /* ignore */ }

    function persistCache() {
      try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(cacheRef.current))
      } catch { /* quota */ }
    }

    // ── Flush ──────────────────────────────────────────────────────────────
    async function flush() {
      const nodes = pendingRef.current.slice()
      pendingRef.current = []

      // Collect unique uncached texts
      const todoMap: Record<string, Text[]> = {}  // text → nodes
      const toTranslate: string[] = []

      nodes.forEach(node => {
        const text = (node.textContent ?? '').trim()
        if (!text || text.length < 2) return

        if (cacheRef.current[text] !== undefined) {
          // apply immediately from cache
          applyTranslation(node, text, cacheRef.current[text])
        } else if (!inflightRef.current[text]) {
          if (!todoMap[text]) {
            todoMap[text] = []
            toTranslate.push(text)
          }
          todoMap[text].push(node)
        }
      })

      if (!toTranslate.length) return

      toTranslate.forEach(t => { inflightRef.current[t] = true })

      for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
        const batch = toTranslate.slice(i, i + BATCH_SIZE)
        try {
          const translations = await gtBatch(batch, locale)
          batch.forEach((orig, idx) => {
            const tr = translations[idx] ?? orig
            cacheRef.current[orig] = tr
            delete inflightRef.current[orig]
            const affected = todoMap[orig] ?? []
            affected.forEach(node => applyTranslation(node, orig, tr))
          })
          persistCache()
        } catch {
          batch.forEach(t => { delete inflightRef.current[t] })
        }
      }
    }

    // ── Schedule (debounce) ────────────────────────────────────────────────
    function schedule(nodes: Text[]) {
      nodes.forEach(n => pendingRef.current.push(n))
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flush, DEBOUNCE_MS)
    }

    // ── Initial pass ───────────────────────────────────────────────────────
    schedule(collectTextNodes(document.body))

    // ── MutationObserver ───────────────────────────────────────────────────
    const observer = new MutationObserver((mutations) => {
      const fresh: Text[] = []
      mutations.forEach(m => {
        Array.from(m.addedNodes).forEach(added => {
          if (added.nodeType === Node.TEXT_NODE) {
            fresh.push(added as Text)
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            fresh.push(...collectTextNodes(added))
          }
        })
      })
      if (fresh.length) schedule(fresh)
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [locale])

  return null
}
