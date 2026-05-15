'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'

// ── Config ────────────────────────────────────────────────────────────────────

const SOURCE_LANG = 'fr'
const BATCH_SIZE  = 20      // strings per API call
const DEBOUNCE_MS = 250     // wait before flushing new mutations

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'CODE', 'PRE', 'KBD', 'SAMP',
  'NOSCRIPT', 'TEXTAREA', 'OPTION',
])

// Mark elements whose text-children are already translated
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

  // Response: single string | array of strings | array of [string, …]
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
      if (!el)                              return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName))        return NodeFilter.FILTER_REJECT
      if (el.closest(`[${DONE_ATTR}]`))     return NodeFilter.FILTER_REJECT
      if (el.isContentEditable)             return NodeFilter.FILTER_REJECT
      const text = (node.textContent ?? '').trim()
      if (text.length < 2)                  return NodeFilter.FILTER_REJECT
      if (!/[a-zA-ZÀ-ÿ]/.test(text))       return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let n: Node | null
  while ((n = walker.nextNode())) out.push(n as Text)
  return out
}

function applyTranslation(node: Text, original: string, translated: string) {
  if (!node.isConnected || translated === original) return
  const raw = node.textContent ?? ''
  const leading  = raw.slice(0, raw.indexOf(original))
  const trailing = raw.slice(raw.indexOf(original) + original.length)
  node.textContent = leading + translated + trailing
  node.parentElement?.setAttribute(DONE_ATTR, '1')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DomTranslator() {
  const locale = useLocale()

  // Stable refs so the effect closure never goes stale
  const pendingRef = useRef<Set<Text>>(new Set())
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cacheRef   = useRef<Map<string, string>>(new Map())
  const inflight   = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (locale === SOURCE_LANG) return   // nothing to do for the default locale

    // ── Hydrate cache from sessionStorage ─────────────────────────────────
    const STORE_KEY = `dtl_${locale}`
    try {
      const raw = sessionStorage.getItem(STORE_KEY)
      if (raw) cacheRef.current = new Map(JSON.parse(raw) as [string, string][])
    } catch { /* ignore */ }

    function persistCache() {
      try {
        sessionStorage.setItem(
          STORE_KEY,
          JSON.stringify(Array.from(cacheRef.current.entries()))
        )
      } catch { /* quota exceeded – ignore */ }
    }

    // ── Flush: translate everything in pendingRef ──────────────────────────
    async function flush() {
      const nodes = [...pendingRef.current]
      pendingRef.current.clear()

      // Deduplicate by trimmed text, skip cached / in-flight
      const todo   = new Map<string, Text[]>()   // original → nodes
      const cached = new Map<string, string>()   // original → translation

      for (const node of nodes) {
        const text = (node.textContent ?? '').trim()
        if (!text || text.length < 2) continue

        if (cacheRef.current.has(text)) {
          cached.set(text, cacheRef.current.get(text)!)
        } else if (!inflight.current.has(text)) {
          if (!todo.has(text)) todo.set(text, [])
          todo.get(text)!.push(node)
        }
      }

      // Apply cached translations immediately (no flicker for known strings)
      for (const node of nodes) {
        const text = (node.textContent ?? '').trim()
        const tr = cached.get(text)
        if (tr) applyTranslation(node, text, tr)
      }

      if (todo.size === 0) return

      // Mark all as in-flight
      for (const text of todo.keys()) inflight.current.add(text)

      // Translate in batches
      const originals = [...todo.keys()]
      for (let i = 0; i < originals.length; i += BATCH_SIZE) {
        const batch = originals.slice(i, i + BATCH_SIZE)
        try {
          const translations = await gtBatch(batch, locale)
          batch.forEach((orig, idx) => {
            const tr = translations[idx] ?? orig
            cacheRef.current.set(orig, tr)
            inflight.current.delete(orig)
            for (const node of todo.get(orig) ?? []) {
              applyTranslation(node, orig, tr)
            }
          })
          persistCache()
        } catch {
          batch.forEach(t => inflight.current.delete(t))
        }
      }
    }

    // ── Schedule: debounce rapid DOM bursts ────────────────────────────────
    function schedule(nodes: Text[]) {
      for (const n of nodes) pendingRef.current.add(n)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flush, DEBOUNCE_MS)
    }

    // ── Initial pass on the already-rendered DOM ───────────────────────────
    schedule(collectTextNodes(document.body))

    // ── Watch future mutations (dynamic content, client navigation) ─────────
    const observer = new MutationObserver((mutations) => {
      const fresh: Text[] = []
      for (const m of mutations) {
        for (const added of m.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            fresh.push(added as Text)
          } else if (added.nodeType === Node.ELEMENT_NODE) {
            fresh.push(...collectTextNodes(added))
          }
        }
      }
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
