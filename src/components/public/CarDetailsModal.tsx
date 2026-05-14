'use client'

import { useState, useEffect } from 'react'
import { X, Fuel, Settings, Zap, Palette, Hash, Car, FileText, Calendar, Info } from 'lucide-react'
import type { Car as CarType } from '@/types/car'
import { STATUS_LABELS } from '@/types/car'
import { formatPrice, formatDate } from '@/lib/utils'

interface Props {
  car: CarType
}

export default function CarDetailsModal({ car }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const specs = [
    { icon: Calendar, label: 'Année', value: String(car.year) },
    { icon: Fuel, label: 'Carburant', value: car.fuel },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    car.mileage ? { icon: FileText, label: 'Kilométrage', value: `${car.mileage.toLocaleString('fr-FR')} km` } : null,
    car.horsepower ? { icon: Zap, label: 'Puissance', value: `${car.horsepower} ch` } : null,
    car.engine ? { icon: Car, label: 'Moteur', value: car.engine } : null,
    car.color ? { icon: Palette, label: 'Couleur', value: car.color } : null,
    car.vin ? { icon: Hash, label: 'VIN', value: car.vin } : null,
    car.plate_number ? { icon: FileText, label: 'Immatriculation', value: car.plate_number } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-carbon-200 dark:border-white/10 text-carbon-600 dark:text-carbon-300 hover:text-carbon-950 dark:hover:text-white hover:border-carbon-400 dark:hover:border-white/30 rounded-xl py-3 text-sm font-medium transition-all"
      >
        <Info size={15} />
        Voir tous les détails
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-carbon-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-carbon-100 dark:border-white/5 sticky top-0 bg-white dark:bg-carbon-900 z-10">
              <div>
                <h2 className="text-xl font-bold text-carbon-950 dark:text-white">
                  {car.brand} {car.model}
                </h2>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm mt-0.5">{car.year}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  car.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : car.status === 'reserved'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {STATUS_LABELS[car.status]}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-carbon-100 dark:bg-white/10 flex items-center justify-center text-carbon-500 hover:text-carbon-950 dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Prix */}
              {car.price && (
                <div>
                  <p className="text-3xl font-bold text-gold-gradient">
                    {formatPrice(car.price)}
                  </p>
                </div>
              )}

              {/* Specs */}
              <div>
                <h3 className="text-xs font-semibold text-carbon-400 dark:text-carbon-500 uppercase tracking-wider mb-3">
                  Caractéristiques
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-carbon-50 dark:bg-carbon-800 rounded-xl p-3.5 border border-carbon-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-carbon-400 text-xs mb-1">
                        <Icon size={12} />
                        {label}
                      </div>
                      <p className="text-carbon-950 dark:text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="text-xs font-semibold text-carbon-400 dark:text-carbon-500 uppercase tracking-wider mb-3">
                    Description
                  </h3>
                  <p className="text-carbon-600 dark:text-carbon-300 text-sm leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Données Vincario supplémentaires */}
              {car.vincario_data && Object.keys(car.vincario_data).length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-carbon-400 dark:text-carbon-500 uppercase tracking-wider mb-3">
                    Données techniques complètes
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(car.vincario_data).map(([label, value]) => (
                      <div key={label} className="bg-carbon-50 dark:bg-carbon-800 rounded-lg px-3 py-2 border border-carbon-100 dark:border-white/5">
                        <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{label}</p>
                        <p className="text-xs font-medium text-carbon-800 dark:text-carbon-200 break-words">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="pt-2 border-t border-carbon-100 dark:border-white/5">
                <p className="text-carbon-400 dark:text-carbon-600 text-xs">
                  Ajouté le {formatDate(car.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
