'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { supabaseClient } from '@/lib/supabase-client'
import type { Car } from '@/types/car'
import { FUEL_TYPES, TRANSMISSION_TYPES, CAR_BRANDS } from '@/types/car'
import VoitureCard from '@/components/public/VoitureCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function CatalogueClient() {
  const t = useTranslations('catalogue')
  const [cars, setCars] = useState<Car[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [fuel, setFuel] = useState('')
  const [transmission, setTransmission] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState('recent')
  const limit = 12

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabaseClient.from('cars').select('*', { count: 'exact' })
      if (search) query = query.or(`brand.ilike.%${search}%,model.ilike.%${search}%`)
      if (brand) query = query.eq('brand', brand)
      if (fuel) query = query.eq('fuel', fuel)
      if (transmission) query = query.eq('transmission', transmission)
      if (status) query = query.eq('status', status)
      if (minPrice) query = query.gte('price_ttc', Number(minPrice))
      if (maxPrice) query = query.lte('price_ttc', Number(maxPrice))

      const from = (page - 1) * limit
      let ordered = query.order('status', { ascending: true })
      if (sort === 'recent')       ordered = ordered.order('created_at', { ascending: false })
      else if (sort === 'price_asc')  ordered = ordered.order('price_ttc', { ascending: true, nullsFirst: false })
      else if (sort === 'price_desc') ordered = ordered.order('price_ttc', { ascending: false, nullsFirst: false })
      else if (sort === 'mileage')    ordered = ordered.order('mileage', { ascending: true, nullsFirst: false })

      const { data, count, error } = await ordered.range(from, from + limit - 1)
      if (error) throw error
      setCars((data ?? []) as Car[])
      setTotal(count ?? 0)
    } finally {
      setLoading(false)
    }
  }, [search, brand, fuel, transmission, minPrice, maxPrice, status, page, sort])

  useEffect(() => { fetchCars() }, [fetchCars])
  useEffect(() => { setPage(1) }, [search, brand, fuel, transmission, minPrice, maxPrice, status, sort])

  const hasFilters = search || brand || fuel || transmission || minPrice || maxPrice || status
  function clearFilters() {
    setSearch(''); setBrand(''); setFuel(''); setTransmission(''); setMinPrice(''); setMaxPrice(''); setStatus('')
  }

  const totalPages = Math.ceil(total / limit)
  const inputClass = 'bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-carbon-800 rounded-lg px-3 py-2 text-carbon-950 dark:text-white text-sm placeholder-carbon-400 dark:placeholder-carbon-600 focus:outline-none focus:border-gold-500 transition-colors'

  return (
    <div>
      {/* Filtres */}
      <div className="bg-white dark:bg-carbon-900/60 border border-carbon-200 dark:border-white/5 rounded-2xl p-5 mb-8">
        <button className="flex items-center gap-2 w-full sm:cursor-default" onClick={() => setFiltersOpen(o => !o)}>
          <SlidersHorizontal size={15} className="text-gold-700 dark:text-gold-500" />
          <span className="text-carbon-950 dark:text-white text-sm font-medium">{t('filters')}</span>
          {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-gold-500 inline-block" />}
          <ChevronDown size={15} className={`ml-auto text-carbon-400 transition-transform sm:hidden ${filtersOpen ? 'rotate-180' : ''}`} />
          {hasFilters && (
            <span onClick={e => { e.stopPropagation(); clearFilters() }} className="hidden sm:flex ml-auto items-center gap-1 text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white text-xs transition-colors cursor-pointer">
              <X size={12} /> {t('clear')}
            </span>
          )}
        </button>
        {hasFilters && filtersOpen && (
          <button onClick={clearFilters} className="sm:hidden mt-3 flex items-center gap-1 text-carbon-500 text-xs">
            <X size={12} /> {t('clearFilters')}
          </button>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-hidden transition-all sm:!max-h-none sm:!mt-4 ${filtersOpen ? 'max-h-[500px] mt-4' : 'max-h-0 sm:max-h-none'}`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400 dark:text-carbon-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')} className={`${inputClass} pl-8 w-full`} />
          </div>
          <select value={brand} onChange={e => setBrand(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">{t('allBrands')}</option>
            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={fuel} onChange={e => setFuel(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">{t('allFuels')}</option>
            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={transmission} onChange={e => setTransmission(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">{t('allTransmissions')}</option>
            {TRANSMISSION_TYPES.map(tr => <option key={tr} value={tr}>{tr}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className={`${inputClass} w-full`}>
            <option value="">{t('allStatuses')}</option>
            <option value="available">{t('available')}</option>
            <option value="reserved">{t('reserved')}</option>
            <option value="sold">{t('sold')}</option>
          </select>
          <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder={t('minPrice')} className={`${inputClass} w-full`} min={0} />
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder={t('maxPrice')} className={`${inputClass} w-full`} min={0} />
        </div>
      </div>

      {/* Résultats + Tri */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-carbon-500 dark:text-carbon-400 text-sm">
          {loading ? '…' : total <= 1 ? t('vehiclesFound', { count: total }) : t('vehiclesFoundPlural', { count: total })}
        </p>
        <select value={sort} onChange={e => setSort(e.target.value)} className={`${inputClass} text-xs`}>
          <option value="recent">{t('sortRecent')}</option>
          <option value="price_asc">{t('sortPriceAsc')}</option>
          <option value="price_desc">{t('sortPriceDesc')}</option>
          <option value="mileage">{t('sortMileage')}</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl bg-carbon-200 dark:bg-carbon-800" />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-carbon-500 dark:text-carbon-400 text-lg">{t('noResults')}</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-gold-700 dark:text-gold-500 hover:text-gold-800 dark:hover:text-gold-400 text-sm transition-colors">
              {t('clearFilters')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cars.map(car => <VoitureCard key={car.id} car={car} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-gold-500 text-black' : 'bg-gray-100 dark:bg-carbon-900 text-carbon-600 dark:text-carbon-400 hover:text-carbon-950 dark:hover:text-white border border-carbon-200 dark:border-carbon-800'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
