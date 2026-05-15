'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowRight, ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFavorites } from '@/context/FavoritesContext'
import { supabaseClient } from '@/lib/supabase-client'
import type { Car } from '@/types/car'
import VoitureCard from '@/components/public/VoitureCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function FavorisClient() {
  const t = useTranslations('favourites')
  const tc = useTranslations('catalogue')
  const { favorites, clear } = useFavorites()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) { setLoading(false); setCars([]); return }
    setLoading(true)
    supabaseClient.from('cars').select('*').in('id', favorites).then(({ data }) => {
      setCars((data ?? []) as Car[])
      setLoading(false)
    })
  }, [favorites])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white text-sm transition-colors mb-8">
        <ChevronLeft size={15} />
        {tc('title')}
      </Link>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('title')}</h1>
        {favorites.length > 0 && (
          <button onClick={clear} className="text-sm text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white transition-colors">
            {tc('clear')}
          </button>
        )}
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-carbon-200 dark:bg-carbon-800" />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="py-32 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Heart size={28} className="text-red-400" />
          </div>
          <p className="text-carbon-500 dark:text-carbon-400 text-lg">{t('empty')}</p>
          <p className="text-carbon-400 dark:text-carbon-600 text-sm max-w-xs">{t('emptyDesc')}</p>
          <Link href="/catalogue" className="btn-gold inline-flex items-center gap-2 mt-4 px-6 py-3">
            {tc('title')} <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => <VoitureCard key={car.id} car={car} />)}
        </div>
      )}
    </div>
  )
}
