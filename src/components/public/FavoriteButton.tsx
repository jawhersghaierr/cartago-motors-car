'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/FavoritesContext'

export default function FavoriteButton({ carId }: { carId: string }) {
  const { toggle, isFavorite } = useFavorites()
  const fav = isFavorite(carId)

  return (
    <button
      onClick={() => toggle(carId)}
      aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors ${
        fav
          ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
          : 'text-carbon-500 dark:text-carbon-400 hover:text-red-500 hover:bg-red-500/10'
      }`}
    >
      <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
      {fav ? 'Favori' : 'Ajouter aux favoris'}
    </button>
  )
}
