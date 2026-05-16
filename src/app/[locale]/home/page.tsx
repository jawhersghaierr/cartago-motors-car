import Link from 'next/link'
import { ArrowRight, Shield, Truck, Award } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import BrandMarquee from '@/components/public/BrandMarquee'
import GoogleReviews from '@/components/public/GoogleReviews'
import FlagText from '@/components/FlagText'
import Footer from '@/components/public/Footer'
import VoitureCard from '@/components/public/VoitureCard'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/services/settings'
import type { Car as CarType } from '@/types/car'

export const revalidate = 60

async function getHomeData() {
  const [{ count: nbDispo }, { count: nbVendus }, { data: vedettes }] = await Promise.all([
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
    supabase.from('cars').select('*').eq('status', 'available').order('created_at', { ascending: false }).limit(3),
  ])
  return { nbDispo: nbDispo ?? 0, nbVendus: nbVendus ?? 0, vedettes: (vedettes ?? []) as CarType[] }
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const [{ nbDispo, nbVendus, vedettes }, settings, t] = await Promise.all([
    getHomeData(),
    getSettings(),
    getTranslations('home'),
  ])

  const prefix = locale === 'fr' ? '' : `/${locale}`

  const features = [
    { icon: Shield, title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: Truck, title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: Award, title: t('feat3Title'), desc: t('feat3Desc') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <div className="pt-16"><BrandMarquee /></div>

      {/* Hero */}
      <section className="relative flex items-center pt-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(212,146,26,0.07) 0%, transparent 60%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="max-w-3xl">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-4 animate-fadeUp-1">
              {settings.hero_tagline}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-6 animate-fadeUp-2">
              <span className="text-gold-gradient">{settings.hero_title}</span>
            </h1>
            <p className="text-carbon-600 dark:text-carbon-300 text-lg leading-relaxed mb-8 max-w-xl animate-fadeUp-3">
              <FlagText text={settings.hero_description} />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeUp-4">
              <Link href={`${prefix}/catalogue`} className="btn-gold inline-flex items-center justify-center gap-2">
                {t('viewCatalogue')} <ArrowRight size={18} />
              </Link>
              <Link href={`${prefix}/contact`} className="btn-outline-gold inline-flex items-center justify-center gap-2">
                {t('requestQuote')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Véhicules en vedette */}
      {vedettes.length > 0 && (
        <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">{t('featuredLabel')}</p>
                <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('featuredTitle')}</h2>
              </div>
              <Link href={`${prefix}/catalogue`} className="hidden sm:flex items-center gap-2 text-gold-700 dark:text-gold-500 hover:text-gold-800 dark:hover:text-gold-400 text-sm font-medium transition-colors">
                {t('viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vedettes.map(car => <VoitureCard key={car.id} car={car} />)}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href={`${prefix}/catalogue`} className="btn-outline-gold inline-flex items-center gap-2">
                {t('viewAllCatalogue')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">{t('whyLabel')}</p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('whyTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-8 transition-all bg-gradient-to-r from-gold-700 to-gold-500">
                <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      {settings.google_review_url && (
        <GoogleReviews reviewUrl={settings.google_review_url} />
      )}

      {/* CTA */}
      <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-carbon-950 dark:text-white mb-4">
            {t('ctaTitle')} <span className="text-gold-gradient">{t('ctaTitleHighlight')}</span> ?
          </h2>
          <p className="text-carbon-500 dark:text-carbon-400 mb-8">{t('ctaDesc')}</p>
          <Link href={`${prefix}/contact`} className="btn-gold inline-flex items-center gap-2 text-base px-8 py-4">
            {t('ctaButton')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-carbon-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: nbDispo.toString(), label: t('statAvailable') },
              { value: nbVendus > 0 ? `${nbVendus}+` : '0', label: t('statExported') },
              { value: settings.stat_pays ?? '3', label: t('statCountries') },
              { value: settings.stat_clients ?? '200+', label: t('statClients') },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-gold-gradient">{s.value}</p>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
