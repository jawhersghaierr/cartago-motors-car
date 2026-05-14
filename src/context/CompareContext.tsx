'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const MAX_COMPARE = 2
const STORAGE_KEY = 'compare_selection'

interface CompareContextValue {
  selected: string[]
  toggle: (id: string) => void
  isSelected: (id: string) => boolean
  clear: () => void
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setSelected(parsed.slice(0, MAX_COMPARE))
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = (ids: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      let next: string[]
      if (prev.includes(id)) {
        next = prev.filter(v => v !== id)
      } else if (prev.length < MAX_COMPARE) {
        next = [...prev, id]
      } else {
        // already 2 selected — replace the oldest
        next = [prev[1], id]
      }
      persist(next)
      return next
    })
  }, [])

  const isSelected = useCallback((id: string) => selected.includes(id), [selected])

  const clear = useCallback(() => {
    setSelected([])
    persist([])
  }, [])

  return (
    <CompareContext.Provider value={{ selected, toggle, isSelected, clear }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider')
  return ctx
}
