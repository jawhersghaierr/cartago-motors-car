'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Car, Fuel, Settings, Zap, Gauge, BarChart2, Check, Heart, Share2 } from 'lucide-react'
import type { Car as CarType } from '@/types/car'
import { formatPrice } from '@/lib/utils'
import { useCompare } from '@/context/CompareContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useState } from 'react'

interface Props {
  car: CarType
}

export default function VoitureListItem({ car }: Props) {
  const { toggle, isSelected } = useCompare()
  const selected = isSelected(car.id)
  const { toggle: toggleFav, isFavorite } = useFavorites()
  const favorited = isFavorite(car.id)
  const [copied, setCopied] = useState(false)

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/voiture/${car.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/5 overflow-hidden hover:border-gold-600/50 dark:hover:border-gold-500/30 transition-all duration-300 hover:shadow-lg dark:hover:shadow-none flex">

      {/* Image */}
      <Link href={`/voiture/${car.id}`} className="relative shrink-0 w-52 sm:w-64 bg-carbon-100 dark:bg-carbon-800 overflow-hidden">
        {car.images[0] ? (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="256px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car size={36} className="text-carbon-300 dark:text-carbon-700" />
          </div>
        )}
        {/* Status badge on image */}
        <span className={`absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${
          car.status === 'available'
            ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
            : car.status === 'reserved'
            ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
            : 'bg-red-500/20 text-red-500 border-red-500/30'
        }`}>
          {car.status === 'available' ? 'Disponible' : car.status === 'reserved' ? 'Réservé' : 'Vendu'}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4 min-w-0">

        {/* Title + specs */}
        <Link href={`/voiture/${car.id}`} className="flex-1 min-w-0">
          <h3 className="text-carbon-950 dark:text-white font-semibold text-lg leading-tight mb-0.5 truncate">
            {car.brand} {car.model}
          </h3>
          <p className="text-carbon-400 dark:text-carbon-500 text-sm mb-3">{car.year}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-carbon-500 dark:text-carbon-400 text-xs">
            <span className="flex items-center gap-1.5">
              <Fuel size={13} />
              {car.fuel}
            </span>
            <span className="flex items-center gap-1.5">
              <Settings size={13} />
              {car.transmission}
            </span>
            {car.horsepower && (
              <span className="flex items-center gap-1.5">
                <Zap size={13} />
                {car.horsepower} ch
              </span>
            )}
            {car.mileage && (
              <span className="flex items-center gap-1.5">
                <Gauge size={13} />
                {car.mileage.toLocaleString('fr-FR')} km
              </span>
            )}
            {car.color && (
              <span className="flex items-center gap-1.5 capitalize">
                <span className="w-3 h-3 rounded-full border border-carbon-300 dark:border-carbon-600 inline-block" style={{ background: car.color }} />
                {car.color}
              </span>
            )}
          </div>
        </Link>

        {/* Price + actions */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
          <div className="text-right">
            {(car.price_ttc || car.price_ht || car.price) ? (
              (car.price_ht || car.price_ttc) ? (
                <div className="flex flex-col items-end gap-0.5">
                  {car.price_ht && (
                    <p className="text-base font-bold text-gold-700 dark:text-gold-400">
                      {formatPrice(car.price_ht)}<span className="text-xs font-semibold text-carbon-400 ml-1">HT</span>
                    </p>
                  )}
                  {car.price_ttc && (
                    <p className="text-base font-bold text-gold-700 dark:text-gold-400">
                      {formatPrice(car.price_ttc)}<span className="text-xs font-semibold text-carbon-400 ml-1">TTC</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gold-700 dark:text-gold-400 font-bold text-xl">{formatPrice(car.price!)}</p>
              )
            ) : (
              <p className="text-carbon-400 text-sm italic">Prix sur demande</p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggle(car.id)}
              aria-label={selected ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
                selected
                  ? 'bg-gold-600 border-gold-500 text-white'
                  : 'bg-white dark:bg-carbon-900 border-carbon-200 dark:border-carbon-700 text-carbon-500 dark:text-carbon-400 hover:border-gold-400 hover:text-gold-700 dark:hover:text-gold-400'
              }`}
            >
              {selected ? <Check size={11} /> : <BarChart2 size={11} />}
              Comparer
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Copier le lien"
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                copied
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : 'bg-white dark:bg-carbon-900 border-carbon-200 dark:border-carbon-700 text-carbon-400 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
            </button>
            <button
              type="button"
              onClick={() => toggleFav(car.id)}
              aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                favorited
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-white dark:bg-carbon-900 border-carbon-200 dark:border-carbon-700 text-carbon-400 hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart size={14} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
