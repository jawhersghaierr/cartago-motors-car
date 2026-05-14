'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'favorites'

interface FavoritesContextValue {
  favorites: string[]
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
  clear: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setFavorites(parsed)
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
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
      persist(next)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const clear = useCallback(() => {
    setFavorites([])
    persist([])
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, clear }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}
