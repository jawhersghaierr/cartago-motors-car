import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Fuel, Settings, Zap, Gauge, Palette, Car } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { Car as CarType } from '@/types/car'

export const revalidate = 60

interface Props {
  params: { locale: string }
  searchParams: { a?: string; b?: string }
}

function cmpLower(a: number | null | undefined, b: number | null | undefined): ['better' | 'worse' | 'equal', 'worse' | 'better' | 'equal'] {
  if (a == null || b == null) return ['equal', 'equal']
  if (a < b) return ['better', 'worse']
  if (a > b) return ['worse', 'better']
  return ['equal', 'equal']
}

function cmpHigher(a: number | null | undefined, b: number | null | undefined): ['better' | 'worse' | 'equal', 'worse' | 'better' | 'equal'] {
  if (a == null || b == null) return ['equal', 'equal']
  if (a > b) return ['better', 'worse']
  if (a < b) return ['worse', 'better']
  return ['equal', 'equal']
}

function highlightClass(result: 'better' | 'worse' | 'equal') {
  if (result === 'better') return 'text-emerald-500 font-semibold'
  if (result === 'worse') return 'text-carbon-400 dark:text-carbon-500'
  return ''
}

function statusBadge(status: CarType['status']) {
  const base = 'text-xs font-semibold px-2.5 py-1 rounded-full border'
  if (status === 'available') return `${base} bg-emerald-500/20 text-emerald-500 border-emerald-500/30`
  if (status === 'reserved') return `${base} bg-amber-500/20 text-amber-500 border-amber-500/30`
  return `${base} bg-red-500/20 text-red-500 border-red-500/30`
}

export default async function ComparerPage({ params: { locale }, searchParams }: Props) {
  const t = await getTranslations('compare')
  const ts = await getTranslations('status')
  const tc = await getTranslations('car')
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const idA = searchParams.a?.trim()
  const idB = searchParams.b?.trim()

  if (!idA || !idB) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
        <NavbarWrapper />
        <div className="pt-32 pb-20 flex flex-col items-center gap-6 px-4">
          <p className="text-carbon-500 dark:text-carbon-400 text-lg">{t('selectTwo')}</p>
          <Link href={`${prefix}/catalogue`} className="btn-gold flex items-center gap-2">
            <ChevronLeft size={16} /> {t('backToCatalogue')}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const [{ data: carAData }, { data: carBData }] = await Promise.all([
    supabase.from('cars').select('*').eq('id', idA).single(),
    supabase.from('cars').select('*').eq('id', idB).single(),
  ])

  const carA = carAData as CarType | null
  const carB = carBData as CarType | null

  if (!carA || !carB) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
        <NavbarWrapper />
        <div className="pt-32 pb-20 flex flex-col items-center gap-6 px-4">
          <p className="text-carbon-500 dark:text-carbon-400 text-lg">{t('notFound')}</p>
          <Link href={`${prefix}/catalogue`} className="btn-gold flex items-center gap-2">
            <ChevronLeft size={16} /> {t('backToCatalogue')}
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const priceFieldA = carA.price_ht ?? carA.price_ttc ?? carA.price
  const priceFieldB = carB.price_ht ?? carB.price_ttc ?? carB.price
  const [pA, pB] = cmpLower(priceFieldA, priceFieldB)
  const [mA, mB] = cmpLower(carA.mileage, carB.mileage)
  const [hA, hB] = cmpHigher(carA.horsepower, carB.horsepower)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`${prefix}/catalogue`} className="inline-flex items-center gap-1.5 text-carbon-500 hover:text-carbon-950 dark:text-carbon-400 dark:hover:text-white text-sm transition-colors mb-8">
            <ChevronLeft size={15} /> {t('backToCatalogue')}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-carbon-950 dark:text-white mb-8">{t('title')}</h1>

          {/* Photos + header */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[carA, carB].map(car => (
              <div key={car.id} className="bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/5 overflow-hidden">
                <div className="relative aspect-video bg-carbon-100 dark:bg-carbon-800">
                  {car.images[0] ? (
                    <Image src={car.images[0]} alt={`${car.brand} ${car.model}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Car size={40} className="text-carbon-300 dark:text-carbon-700" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h2 className="text-carbon-950 dark:text-white font-bold text-lg leading-tight">{car.brand} {car.model}</h2>
                      <p className="text-carbon-500 dark:text-carbon-400 text-sm">{car.year}</p>
                    </div>
                    <span className={statusBadge(car.status)}>{ts(car.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          <div className="bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/5 overflow-hidden divide-y divide-carbon-100 dark:divide-white/5">
            <div className="px-4 py-2 bg-carbon-50 dark:bg-carbon-800/50">
              <p className="text-xs font-semibold uppercase tracking-widest text-carbon-400 dark:text-carbon-500">{t('price')}</p>
            </div>

            {(carA.price_ht || carB.price_ht) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('priceHT')}</p>
                  <p className={`text-base ${carA.price_ht ? highlightClass(cmpLower(carA.price_ht, carB.price_ht)[0]) : 'text-carbon-400'}`}>
                    {carA.price_ht ? formatPrice(carA.price_ht) : '—'}
                  </p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('priceHT')}</p>
                  <p className={`text-base ${carB.price_ht ? highlightClass(cmpLower(carA.price_ht, carB.price_ht)[1]) : 'text-carbon-400'}`}>
                    {carB.price_ht ? formatPrice(carB.price_ht) : '—'}
                  </p>
                </div>
              </div>
            )}

            {(carA.price_ttc || carB.price_ttc) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('priceTTC')}</p>
                  <p className={`text-base ${carA.price_ttc ? highlightClass(cmpLower(carA.price_ttc, carB.price_ttc)[0]) : 'text-carbon-400'}`}>
                    {carA.price_ttc ? formatPrice(carA.price_ttc) : '—'}
                  </p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('priceTTC')}</p>
                  <p className={`text-base ${carB.price_ttc ? highlightClass(cmpLower(carA.price_ttc, carB.price_ttc)[1]) : 'text-carbon-400'}`}>
                    {carB.price_ttc ? formatPrice(carB.price_ttc) : '—'}
                  </p>
                </div>
              </div>
            )}

            {!carA.price_ht && !carA.price_ttc && !carB.price_ht && !carB.price_ttc && (carA.price || carB.price) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('price')}</p>
                  <p className={`text-base ${carA.price ? highlightClass(pA) : 'text-carbon-400'}`}>
                    {carA.price ? formatPrice(carA.price) : t('onRequest')}
                  </p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('price')}</p>
                  <p className={`text-base ${carB.price ? highlightClass(pB) : 'text-carbon-400'}`}>
                    {carB.price ? formatPrice(carB.price) : t('onRequest')}
                  </p>
                </div>
              </div>
            )}

            <div className="px-4 py-2 bg-carbon-50 dark:bg-carbon-800/50">
              <p className="text-xs font-semibold uppercase tracking-widest text-carbon-400 dark:text-carbon-500">{t('motorization')}</p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
              <div className="px-5 py-3.5">
                <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Fuel size={11} />{tc('fuel')}</p>
                <p className="text-base text-carbon-950 dark:text-white">{carA.fuel}</p>
              </div>
              <div className="px-5 py-3.5">
                <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Fuel size={11} />{tc('fuel')}</p>
                <p className="text-base text-carbon-950 dark:text-white">{carB.fuel}</p>
              </div>
            </div>

            {(carA.engine || carB.engine) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('engine')}</p>
                  <p className="text-base text-carbon-950 dark:text-white">{carA.engine ?? '—'}</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5">{tc('engine')}</p>
                  <p className="text-base text-carbon-950 dark:text-white">{carB.engine ?? '—'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
              <div className="px-5 py-3.5">
                <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Settings size={11} />{tc('transmission')}</p>
                <p className="text-base text-carbon-950 dark:text-white">{carA.transmission}</p>
              </div>
              <div className="px-5 py-3.5">
                <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Settings size={11} />{tc('transmission')}</p>
                <p className="text-base text-carbon-950 dark:text-white">{carB.transmission}</p>
              </div>
            </div>

            {(carA.horsepower || carB.horsepower) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Zap size={11} />{tc('power')}</p>
                  <p className={`text-base ${carA.horsepower ? highlightClass(hA) : 'text-carbon-400'}`}>
                    {carA.horsepower ? `${carA.horsepower} ch` : '—'}
                  </p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Zap size={11} />{tc('power')}</p>
                  <p className={`text-base ${carB.horsepower ? highlightClass(hB) : 'text-carbon-400'}`}>
                    {carB.horsepower ? `${carB.horsepower} ch` : '—'}
                  </p>
                </div>
              </div>
            )}

            <div className="px-4 py-2 bg-carbon-50 dark:bg-carbon-800/50">
              <p className="text-xs font-semibold uppercase tracking-widest text-carbon-400 dark:text-carbon-500">{t('details')}</p>
            </div>

            {(carA.mileage || carB.mileage) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Gauge size={11} />{tc('mileage')}</p>
                  <p className={`text-base ${carA.mileage ? highlightClass(mA) : 'text-carbon-400'}`}>
                    {carA.mileage ? `${carA.mileage.toLocaleString('fr-FR')} km` : '—'}
                  </p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Gauge size={11} />{tc('mileage')}</p>
                  <p className={`text-base ${carB.mileage ? highlightClass(mB) : 'text-carbon-400'}`}>
                    {carB.mileage ? `${carB.mileage.toLocaleString('fr-FR')} km` : '—'}
                  </p>
                </div>
              </div>
            )}

            {(carA.color || carB.color) && (
              <div className="grid grid-cols-2 divide-x divide-carbon-100 dark:divide-white/5">
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Palette size={11} />{tc('color')}</p>
                  <p className="text-base text-carbon-950 dark:text-white">{carA.color ?? '—'}</p>
                </div>
                <div className="px-5 py-3.5">
                  <p className="text-xs text-carbon-400 dark:text-carbon-500 mb-0.5 flex items-center gap-1"><Palette size={11} />{tc('color')}</p>
                  <p className="text-base text-carbon-950 dark:text-white">{carB.color ?? '—'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-carbon-400 dark:text-carbon-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {t('betterValue')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {[carA, carB].map(car => (
              <Link key={car.id} href={`${prefix}/voiture/${car.id}`} className="btn-outline-gold flex items-center justify-center gap-2 text-sm py-3">
                {t('view')} {car.brand} {car.model}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
