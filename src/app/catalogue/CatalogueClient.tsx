'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'
import type { Car } from '@/types/car'
import { FUEL_TYPES, TRANSMISSION_TYPES } from '@/types/car'
import VoitureCard from '@/components/public/VoitureCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function CatalogueClient() {
  const [cars, setCars] = useState<Car[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fuel, setFuel] = useState('')
  const [transmission, setTransmission] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)
  const limit = 12

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabaseClient
        .from('cars')
        .select('*', { count: 'exact' })
        .eq('status', 'available')

      if (search) query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%`)
      if (fuel) query = query.eq('fuel', fuel)
      if (transmission) query = query.eq('transmission', transmission)
      if (maxPrice) query = query.lte('price', Number(maxPrice))

      const from = (page - 1) * limit
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1)

      if (error) throw error
      setCars((data ?? []) as Car[])
      setTotal(count ?? 0)
    } finally {
      setLoading(false)
    }
  }, [search, fuel, transmission, maxPrice, page])

  useEffect(() => { fetchCars() }, [fetchCars])
  useEffect(() => { setPage(1) }, [search, fuel, transmission, maxPrice])

  const hasFilters = search || fuel || transmission || maxPrice
  function clearFilters() {
    setSearch(''); setFuel(''); setTransmission(''); setMaxPrice('')
  }

  const totalPages = Math.ceil(total / limit)
  const inputClass = 'bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-carbon-800 rounded-lg px-3 py-2 text-carbon-950 dark:text-white text-sm placeholder-carbon-400 dark:placeholder-carbon-600 focus:outline-none focus:border-gold-500 transition-colors'

  return (
    <div>
      {/* Filtres */}
      <div className="bg-white dark:bg-carbon-900/60 border border-carbon-200 dark:border-white/5 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={15} className="text-gold-500" />
          <span className="text-carbon-950 dark:text-white text-sm font-medium">Filtres</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white text-xs transition-colors">
              <X size={12} /> Effacer
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400 dark:text-carbon-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Marque, modèle…"
              className={`${inputClass} pl-8 w-full`}
            />
          </div>
          <select value={fuel} onChange={e => setFuel(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">Tous carburants</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={transmission} onChange={e => setTransmission(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">Toutes transmissions</option>
            {TRANSMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Prix max (€)"
            className={`${inputClass} w-full`}
            min={0}
          />
        </div>
      </div>

      {/* Résultats */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-carbon-500 dark:text-carbon-400 text-sm">
          {loading ? '…' : `${total} véhicule${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl bg-carbon-200 dark:bg-carbon-800" />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-carbon-500 dark:text-carbon-400 text-lg">Aucun véhicule ne correspond à votre recherche</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-gold-500 hover:text-gold-400 text-sm transition-colors">
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => <VoitureCard key={car.id} car={car} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-gold-500 text-black'
                  : 'bg-gray-100 dark:bg-carbon-900 text-carbon-600 dark:text-carbon-400 hover:text-carbon-950 dark:hover:text-white border border-carbon-200 dark:border-carbon-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
