import Link from 'next/link'
import { ArrowRight, Shield, Truck, Award, CheckCircle2, Users, Car, Globe, HeartHandshake, ClipboardList, PackageCheck, FileCheck, Plane } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import { getSettings } from '@/services/settings'

export const revalidate = 3600

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const [t, settings] = await Promise.all([getTranslations('about'), getSettings()])
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const values = [
    { icon: Shield,        title: t('val1Title'), desc: t('val1Desc') },
    { icon: HeartHandshake, title: t('val2Title'), desc: t('val2Desc') },
    { icon: Award,         title: t('val3Title'), desc: t('val3Desc') },
  ]

  const steps = [
    { num: '01', icon: ClipboardList, title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', icon: FileCheck,     title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', icon: PackageCheck,  title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', icon: Plane,         title: t('step4Title'), desc: t('step4Desc') },
  ]

  const countries = [
    { flag: '🇹🇳', name: t('tn'), desc: t('tnDesc') },
    { flag: '🇩🇿', name: t('dz'), desc: t('dzDesc') },
    { flag: '🇲🇦', name: t('ma'), desc: t('maDesc') },
  ]

  const stats = [
    { value: settings.stat_clients ?? '200+', label: t('statClients'),   icon: Users },
    { value: '500+',                          label: t('statVehicles'),  icon: Car },
    { value: settings.stat_pays ?? '3',       label: t('statCountries'), icon: Globe },
    { value: '5★',                            label: t('statRating'),    icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(212,146,26,0.10) 0%, transparent 65%)' }} />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-gold-500/10 opacity-60" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-gold-500/10 opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-4">{t('label')}</p>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gold-gradient">{t('title1')}</span><br />
              <span className="text-carbon-950 dark:text-white">{t('title2')}</span>
            </h1>
            <p className="text-carbon-600 dark:text-carbon-300 text-lg leading-relaxed mb-8 max-w-2xl">{t('intro')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`${prefix}/catalogue`} className="btn-gold inline-flex items-center justify-center gap-2">
                {t('viewCatalogue')} <ArrowRight size={18} />
              </Link>
              <Link href={`${prefix}/contact`} className="btn-outline-gold inline-flex items-center justify-center gap-2">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">{t('storyLabel')}</p>
              <h2 className="text-3xl font-bold text-carbon-950 dark:text-white mb-6">{t('storyTitle')}</h2>
              <div className="space-y-4 text-carbon-600 dark:text-carbon-300 leading-relaxed">
                <p>{t('storyP1')}</p>
                <p>{t('storyP2')}</p>
                <p>{t('storyP3')}</p>
              </div>
              <ul className="mt-8 space-y-3">
                {[t('check1'), t('check2'), t('check3'), t('check4')].map(item => (
                  <li key={item} className="flex items-start gap-3 text-carbon-700 dark:text-carbon-300 text-sm">
                    <CheckCircle2 size={17} className="text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-700/20 to-gold-500/5 rounded-3xl blur-2xl" />
              <div className="relative bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-white/5 rounded-3xl p-8 shadow-xl dark:shadow-none overflow-hidden">
                <div className="h-1.5 w-16 bg-gradient-to-r from-gold-700 to-gold-500 rounded-full mb-8" />
                <blockquote className="text-carbon-700 dark:text-carbon-200 text-xl font-medium leading-relaxed mb-8 italic">
                  "{t('quote')}"
                </blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-carbon-100 dark:border-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-700 to-gold-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">CM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-carbon-950 dark:text-white">{t('team')}</p>
                    <p className="text-carbon-500 dark:text-carbon-400 text-sm">{t('teamSub')}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #d4921a 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-carbon-100/60 dark:bg-carbon-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">{t('valuesLabel')}</p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('valuesTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-8 bg-gradient-to-br from-gold-700 to-gold-500 transition-transform hover:-translate-y-1 duration-300">
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

      {/* Comment ça marche */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">{t('howLabel')}</p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('howTitle')}</h2>
            <p className="text-carbon-500 dark:text-carbon-400 mt-3 max-w-lg mx-auto">{t('howDesc')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, icon: Icon, title, desc }, i) => (
              <div key={num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold-500/40 to-transparent z-0 -translate-y-0.5" />
                )}
                <div className="relative bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-white/5 rounded-2xl p-6 hover:border-gold-500/40 dark:hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-black text-gold-500/20 dark:text-gold-500/15 leading-none select-none">{num}</span>
                    <div className="w-10 h-10 rounded-xl bg-gold-700/10 dark:bg-gold-500/10 border border-gold-700/20 dark:border-gold-500/20 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gold-700 dark:text-gold-500" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-carbon-950 dark:text-white mb-2">{title}</h3>
                  <p className="text-carbon-500 dark:text-carbon-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pays desservis */}
      <section className="py-16 bg-carbon-100/60 dark:bg-carbon-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">{t('countriesLabel')}</p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">{t('countriesTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {countries.map(({ flag, name, desc }) => (
              <div key={name} className="bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-white/5 rounded-2xl p-6 text-center hover:border-gold-500/40 dark:hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none">
                <span className="text-5xl mb-4 block">{flag}</span>
                <h3 className="font-bold text-carbon-950 dark:text-white text-lg mb-2">{name}</h3>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40 border-y border-carbon-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-700/10 dark:bg-gold-500/10 border border-gold-700/20 dark:border-gold-500/20 flex items-center justify-center">
                  <Icon size={20} className="text-gold-700 dark:text-gold-500" />
                </div>
                <p className="text-4xl font-bold text-gold-gradient">{value}</p>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-700/20 to-gold-500/10 rounded-full blur-xl" />
            <div className="relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold-700 to-gold-500 flex items-center justify-center shadow-lg">
              <Truck size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-carbon-950 dark:text-white mb-4">
            {t('ctaTitle')} <span className="text-gold-gradient">{t('ctaHighlight')}</span> ?
          </h2>
          <p className="text-carbon-500 dark:text-carbon-400 mb-8 text-lg">{t('ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${prefix}/catalogue`} className="btn-gold inline-flex items-center justify-center gap-2">
              {t('ctaBrowse')} <ArrowRight size={18} />
            </Link>
            <Link href={`${prefix}/contact`} className="btn-outline-gold inline-flex items-center justify-center gap-2">
              {t('ctaQuote')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
