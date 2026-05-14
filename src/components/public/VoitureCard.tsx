import Link from 'next/link'
import Image from 'next/image'
import { Car, Fuel, Settings, Zap, Gauge } from 'lucide-react'
import type { Car as CarType } from '@/types/car'
import { formatPrice } from '@/lib/utils'

interface VoitureCardProps {
  car: CarType
}

export default function VoitureCard({ car }: VoitureCardProps) {
  return (
    <Link
      href={`/voiture/${car.id}`}
      className="group block bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/5 overflow-hidden hover:border-gold-600/50 dark:hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none"
    >
      <div className="relative aspect-video bg-carbon-100 dark:bg-carbon-800 overflow-hidden">
        {car.images[0] ? (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Car size={40} className="text-carbon-300 dark:text-carbon-700" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-carbon-950 dark:text-white font-semibold text-lg leading-tight">
            {car.brand} {car.model}
          </h3>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            car.status === 'available'
              ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
              : car.status === 'reserved'
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              : 'bg-red-500/20 text-red-500 border-red-500/30'
          }`}>
            {car.status === 'available' ? 'Disponible' : car.status === 'reserved' ? 'Réservé' : 'Vendu'}
          </span>
        </div>
        <p className="text-carbon-500 text-sm mb-4">{car.year}</p>

        <div className="flex items-center gap-4 text-carbon-500 dark:text-carbon-400 text-xs mb-4">
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
        </div>

        <div>
          {(car.price_ttc || car.price_ht || car.price) ? (
            (car.price_ht || car.price_ttc) ? (
              <div className="flex items-baseline gap-4 flex-wrap">
                {car.price_ht && (
                  <p className="text-base font-bold text-carbon-700 dark:text-carbon-300">
                    {formatPrice(car.price_ht)}<span className="text-xs font-semibold text-carbon-400 dark:text-carbon-500 ml-1">HT</span>
                  </p>
                )}
                {car.price_ttc && (
                  <p className="text-lg font-bold text-gold-700 dark:text-gold-400">
                    {formatPrice(car.price_ttc)}<span className="text-xs font-semibold text-carbon-400 dark:text-carbon-500 ml-1">TTC</span>
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
      </div>
    </Link>
  )
}
