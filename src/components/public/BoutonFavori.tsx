'use client'
import { Heart } from 'lucide-react'
import { useFavoris } from '@/hooks/useFavoris'

export default function BoutonFavori({ id, className }: { id: number; className?: string }) {
  const { isFavori, toggle, ready } = useFavoris()
  if (!ready) return null

  const favori = isFavori(id)

  return (
    <button
      type="button"
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
      title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        favori
          ? 'bg-red-500 border border-red-400 text-white shadow-lg shadow-red-500/30'
          : 'bg-black/50 border border-white/20 text-white/70 hover:bg-black/70 hover:text-white backdrop-blur-sm'
      } ${className || ''}`}
    >
      <Heart size={16} fill={favori ? 'currentColor' : 'none'} strokeWidth={2} />
    </button>
  )
}
