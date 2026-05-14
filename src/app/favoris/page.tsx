'use client'
import { useState, useEffect } from 'react'
import { Heart, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import VoitureCard from '@/components/public/VoitureCard'
import { useFavoris } from '@/hooks/useFavoris'
import { Voiture } from '@/types'

export default function FavorisPage() {
  const { ids, count, clear, ready } = useFavoris()
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (ids.length === 0) { setVoitures([]); return }
    setLoading(true)
    fetch(`/api/public/voitures?ids=${ids.join(',')}`)
      .then(r => r.json())
      .then(data => setVoitures(Array.isArray(data) ? data : []))
      .catch(() => setVoitures([]))
      .finally(() => setLoading(false))
  }, [ids, ready])

  return (
    <div className="min-h-screen bg-carbon-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/catalogue"
              className="w-10 h-10 bg-carbon-900 border border-carbon-800 rounded-xl flex items-center justify-center text-carbon-400 hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-white font-display text-3xl font-bold">Mes favoris</h1>
              <p className="text-carbon-400 text-sm mt-0.5">
                {count === 0 ? 'Aucun véhicule sauvegardé' : `${count} véhicule${count > 1 ? 's' : ''} sauvegardé${count > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          {count > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 px-4 py-2 border border-carbon-700 text-carbon-400 hover:text-red-400 hover:border-red-500/40 rounded-xl text-sm transition-colors">
              <Trash2 size={14} />
              Tout effacer
            </button>
          )}
        </div>

        {/* Content */}
        {!ready || loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-carbon-900 rounded-2xl h-80 animate-pulse border border-carbon-800" />
            ))}
          </div>
        ) : count === 0 ? (
          <div className="text-center py-24 bg-carbon-900 rounded-2xl border border-carbon-800">
            <div className="w-16 h-16 bg-carbon-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Heart size={28} className="text-carbon-600" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Aucun favori pour l'instant</h2>
            <p className="text-carbon-400 text-sm mb-6 max-w-sm mx-auto">
              Cliquez sur le cœur sur une fiche véhicule pour l'ajouter ici.
            </p>
            <Link href="/catalogue" className="btn-gold inline-flex items-center gap-2 text-sm px-6 py-2.5">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {voitures.map(v => (
              <VoitureCard key={v.id} voiture={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
