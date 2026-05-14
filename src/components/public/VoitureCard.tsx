'use client'
import Link from 'next/link'
import { Fuel, Gauge, Calendar, Settings, ArrowRight } from 'lucide-react'
import { Voiture } from '@/types'
import { formatPrix, formatKilometrage, getStatutColor, getStatutLabel } from '@/lib/utils'
import Flag from '@/components/Flag'
import BoutonFavori from '@/components/public/BoutonFavori'

interface VoitureCardProps {
  voiture: Voiture
}

export default function VoitureCard({ voiture }: VoitureCardProps) {
  const photo = voiture.photos?.[0] || '/images/car-placeholder.svg'
  const pays = voiture.pays_destination?.split(',').map(p => p.trim()) || []

  return (
    <Link href={`/voiture/${voiture.id}`} className="group block">
      <div className="bg-carbon-900 rounded-2xl overflow-hidden border border-carbon-800 hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium">
        {/* Photo */}
        <div className="relative h-52 overflow-hidden bg-carbon-800">
          <img
            src={photo}
            alt={`${voiture.marque} ${voiture.modele}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231a1a1a' width='400' height='300'/%3E%3Ctext fill='%23444' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EPhoto indisponible%3C/text%3E%3C/svg%3E"
            }}
          />

          {/* Statut badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${
            voiture.statut === 'réservé'
              ? 'text-white border-black'
              : getStatutColor(voiture.statut)
          }`}
            style={voiture.statut === 'réservé' ? { backgroundColor: '#000000' } : undefined}
          >
            {getStatutLabel(voiture.statut)}
          </div>

          {/* Favori */}
          <BoutonFavori id={voiture.id} className="absolute top-3 left-3" />

          {/* Signature */}
          <div className="absolute bottom-2 right-3 text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase select-none pointer-events-none drop-shadow-sm">
            Cartago Motors
          </div>

        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-display font-semibold text-lg leading-tight">
                {voiture.marque} {voiture.modele}
              </h3>
              <p className="text-carbon-400 text-sm mt-0.5">{voiture.annee} • {voiture.couleur}</p>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-gold-400 font-bold font-display text-xl">{formatPrix(voiture.prix_ttc ?? (voiture as any).prix)}</span>
                  <span className="text-gold-400/60 text-xs font-medium">TTC</span>
                </div>
                {voiture.prix_ht && voiture.prix_ht !== voiture.prix_ttc && (
                  <>
                    <span className="text-carbon-700 text-sm">|</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gold-400 font-bold font-display text-xl">{formatPrix(voiture.prix_ht)}</span>
                      <span className="text-gold-400/60 text-xs font-medium">HT</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-carbon-800 flex items-center justify-center text-carbon-500 group-hover:bg-gold-500/10 group-hover:text-gold-400 transition-colors flex-shrink-0 ml-2">
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-carbon-400 text-sm">
              <Gauge size={14} className="text-gold-600 flex-shrink-0" />
              {formatKilometrage(voiture.kilometrage)}
            </div>
            <div className="flex items-center gap-2 text-carbon-400 text-sm">
              <Fuel size={14} className="text-gold-600 flex-shrink-0" />
              {voiture.carburant}
            </div>
            <div className="flex items-center gap-2 text-carbon-400 text-sm">
              <Settings size={14} className="text-gold-600 flex-shrink-0" />
              {voiture.boite}
            </div>
            {voiture.puissance && (
              <div className="flex items-center gap-2 text-carbon-400 text-sm">
                <Calendar size={14} className="text-gold-600 flex-shrink-0" />
                {voiture.puissance} ch
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {pays.filter(p => p !== 'France').map(p => (
              <span key={p} className="text-xs bg-carbon-800 text-carbon-300 px-2 py-0.5 rounded-full border border-carbon-700 flex items-center gap-1">
                <Flag pays={p} size={12} /> {p}
              </span>
            ))}
            {voiture.type_vente?.split(',').includes('local') && (
              <span className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                <Flag pays="France" size={12} /> France
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
