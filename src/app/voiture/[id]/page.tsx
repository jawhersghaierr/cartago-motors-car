import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Fuel, Settings, Zap, Palette, Hash, Car, FileText } from 'lucide-react'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import ImageGallery from '@/components/public/ImageGallery'
import CarDetailsModal from '@/components/public/CarDetailsModal'
import CarContactModal from '@/components/public/CarContactModal'
import ShareButton from '@/components/public/ShareButton'
import FavoriteButton from '@/components/public/FavoriteButton'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/services/settings'
import type { Car as CarType } from '@/types/car'
import { STATUS_LABELS } from '@/types/car'
import { formatPrice, formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function VoiturePage({ params }: { params: { id: string } }) {
  const [{ data: car, error }, settings] = await Promise.all([
    supabase.from('cars').select('*').eq('id', params.id).single(),
    getSettings(),
  ])

  if (error || !car) notFound()

  const c = car as CarType

  type Spec = { icon: React.ElementType; label: string; value: string }
  const specsRaw: (Spec | null)[] = [
    { icon: Fuel, label: 'Carburant', value: c.fuel },
    { icon: Settings, label: 'Transmission', value: c.transmission },
    c.mileage ? { icon: FileText, label: 'Kilométrage', value: `${c.mileage.toLocaleString('fr-FR')} km` } : null,
    c.horsepower ? { icon: Zap, label: 'Puissance', value: `${c.horsepower} ch` } : null,
    c.engine ? { icon: Car, label: 'Moteur', value: c.engine } : null,
    c.color ? { icon: Palette, label: 'Couleur', value: c.color } : null,
    c.vin ? { icon: Hash, label: 'VIN', value: c.vin } : null,
    c.plate_number ? { icon: FileText, label: 'Immatriculation', value: c.plate_number } : null,
  ]
  const specs = specsRaw.filter((s): s is Spec => s !== null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white text-sm transition-colors mb-8"
          >
            <ChevronLeft size={15} />
            Retour au catalogue
          </Link>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Photos */}
            <div>
              <ImageGallery images={c.images} alt={`${c.brand} ${c.model}`} />
              {c.description && (
                <div className="mt-5 bg-white dark:bg-carbon-900 rounded-xl border border-carbon-200 dark:border-white/5 p-5">
                  <h2 className="text-carbon-950 dark:text-white font-semibold mb-2">Description</h2>
                  <p className="text-carbon-500 dark:text-carbon-400 text-sm leading-relaxed">{c.description}</p>
                </div>
              )}
            </div>

            {/* Infos */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-carbon-950 dark:text-white">{c.brand} {c.model}</h1>
                  <p className="text-carbon-500 dark:text-carbon-400 mt-1">{c.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FavoriteButton carId={c.id} />
                  <ShareButton brand={c.brand} model={c.model} year={c.year} />
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    c.status === 'available'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : c.status === 'reserved'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
              </div>

              {(c.price_ttc || c.price_ht || c.price) && (
                <div className="mt-4 mb-6">
                  {(c.price_ht || c.price_ttc) ? (
                    <div className="flex items-baseline gap-6 flex-wrap">
                      {c.price_ht && (
                        <p className="text-3xl font-bold text-gold-gradient">
                          {formatPrice(c.price_ht)}<span className="text-sm font-semibold text-carbon-400 dark:text-carbon-500 ml-1.5">HT</span>
                        </p>
                      )}
                      {c.price_ttc && (
                        <p className="text-3xl font-bold text-gold-gradient">
                          {formatPrice(c.price_ttc)}<span className="text-sm font-semibold text-carbon-400 dark:text-carbon-500 ml-1.5">TTC</span>
                        </p>
                      )}
                    </div>
                  ) : c.price ? (
                    <p className="text-4xl font-bold text-gold-gradient">{formatPrice(c.price)}</p>
                  ) : null}
                </div>
              )}

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white dark:bg-carbon-900 rounded-xl p-3.5 border border-carbon-200 dark:border-white/5">
                    <div className="flex items-center gap-2 text-carbon-500 text-xs mb-1.5">
                      <Icon size={12} />
                      {label}
                    </div>
                    <p className="text-carbon-950 dark:text-white text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>

<div className="flex flex-col gap-3 mt-6">
                <CarDetailsModal car={c} />
                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par le véhicule : ${c.brand} ${c.model} (${c.year}) — ${typeof window === 'undefined' ? '' : window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-base py-4 rounded-lg font-semibold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Contacter sur WhatsApp
                  </a>
                )}
                <CarContactModal brand={c.brand} model={c.model} year={c.year} />
              </div>

              <p className="text-carbon-400 dark:text-carbon-600 text-xs text-center mt-3">
                Ajouté le {formatDate(c.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
