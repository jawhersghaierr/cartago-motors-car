'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'favoris_voitures'
const EVENT = 'favoris_updated'

function readFromStorage(): number[] {
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

export function useFavoris() {
  const [ids, setIds] = useState<number[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIds(readFromStorage())
    setReady(true)

    const onUpdate = () => setIds(readFromStorage())
    // même onglet
    window.addEventListener(EVENT, onUpdate)
    // autres onglets
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) onUpdate() }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, onUpdate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback((id: number) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
        window.dispatchEvent(new Event(EVENT))
      } catch {}
      return next
    })
  }, [])

  const isFavori = useCallback((id: number) => ids.includes(id), [ids])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
      window.dispatchEvent(new Event(EVENT))
    } catch {}
    setIds([])
  }, [])

  return { ids, count: ids.length, toggle, isFavori, clear, ready }
}
