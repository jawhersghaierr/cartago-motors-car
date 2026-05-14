import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Fuel, Settings, Zap, Palette, Hash, Car, FileText } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { supabase } from '@/lib/supabase'
import type { Car as CarType } from '@/types/car'
import { STATUS_LABELS } from '@/types/car'
import { formatPrice, formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function VoiturePage({ params }: { params: { id: string } }) {
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !car) notFound()

  const c = car as CarType

  const specs = [
    { icon: Fuel, label: 'Carburant', value: c.fuel },
    { icon: Settings, label: 'Transmission', value: c.transmission },
    c.horsepower ? { icon: Zap, label: 'Puissance', value: `${c.horsepower} ch` } : null,
    c.engine ? { icon: Car, label: 'Moteur', value: c.engine } : null,
    c.color ? { icon: Palette, label: 'Couleur', value: c.color } : null,
    c.vin ? { icon: Hash, label: 'VIN', value: c.vin } : null,
    c.plate_number ? { icon: FileText, label: 'Immatriculation', value: c.plate_number } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <Navbar />
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
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-carbon-100 dark:bg-carbon-900 mb-3">
                {c.images[0] ? (
                  <Image
                    src={c.images[0]}
                    alt={`${c.brand} ${c.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car size={60} className="text-carbon-300 dark:text-carbon-700" />
                  </div>
                )}
              </div>
              {c.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {c.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-carbon-100 dark:bg-carbon-900">
                      <Image src={img} alt={`Photo ${i + 2}`} fill className="object-cover" sizes="25vw" />
                    </div>
                  ))}
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

              {c.price && (
                <p className="text-4xl font-bold text-gold-gradient mt-4 mb-6">
                  {formatPrice(c.price)}
                </p>
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

              {c.description && (
                <div className="mb-6">
                  <h2 className="text-carbon-950 dark:text-white font-semibold mb-2">Description</h2>
                  <p className="text-carbon-500 dark:text-carbon-400 text-sm leading-relaxed">{c.description}</p>
                </div>
              )}

              <Link
                href="/contact"
                className="btn-gold w-full flex items-center justify-center gap-2 text-base py-4"
              >
                Demander un devis pour ce véhicule
              </Link>
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
