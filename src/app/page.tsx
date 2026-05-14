import Link from 'next/link'
import { ArrowRight, Shield, Truck, Award } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
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

export default async function HomePage() {
  const [{ nbDispo, nbVendus, vedettes }, settings] = await Promise.all([
    getHomeData(),
    getSettings(),
  ])

  const features = [
    { icon: Shield, title: 'Véhicules certifiés', desc: 'Chaque véhicule est inspecté avant mise en vente. Carnet d\'entretien vérifié, historique transparent.' },
    { icon: Truck, title: 'Export facilité', desc: 'Accompagnement complet pour l\'export vers la Tunisie, l\'Algérie et le Maroc. Démarches incluses.' },
    { icon: Award, title: 'Service premium', desc: 'Dédouanement, homologation, transfert de carte grise. On gère tout de A à Z.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900" />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(212,146,26,0.07) 0%, transparent 60%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-4 animate-fadeUp-1">
              {settings.hero_tagline}
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fadeUp-2">
              <span className="text-gold-gradient">{settings.hero_title}</span>
            </h1>
            <p className="text-carbon-600 dark:text-carbon-300 text-lg leading-relaxed mb-8 max-w-xl animate-fadeUp-3">
              {settings.hero_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeUp-4">
              <Link href="/catalogue" className="btn-gold inline-flex items-center justify-center gap-2">
                Voir le catalogue
                <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-outline-gold inline-flex items-center justify-center gap-2">
                Demander un devis
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-lg">
            {[
              { value: nbDispo.toString(), label: 'Véhicules disponibles' },
              { value: nbVendus > 0 ? `${nbVendus}+` : '0', label: 'Véhicules exportés' },
              { value: '3', label: 'Pays desservis' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-gold-gradient">{s.value}</p>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Véhicules en vedette */}
      {vedettes.length > 0 && (
        <section className="py-24 bg-carbon-100/60 dark:bg-carbon-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">Sélection du moment</p>
                <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">Véhicules disponibles</h2>
              </div>
              <Link href="/catalogue" className="hidden sm:flex items-center gap-2 text-gold-700 dark:text-gold-500 hover:text-gold-800 dark:hover:text-gold-400 text-sm font-medium transition-colors">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vedettes.map(car => <VoitureCard key={car.id} car={car} />)}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/catalogue" className="btn-outline-gold inline-flex items-center gap-2">
                Voir tout le catalogue <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">Pourquoi nous choisir</p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">L'excellence à chaque étape</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass rounded-2xl p-8 hover:border-gold-500/20 transition-all">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="text-carbon-950 dark:text-white font-semibold text-lg mb-3">{title}</h3>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-carbon-100/60 dark:bg-carbon-900/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-carbon-950 dark:text-white mb-4">
            Prêt à trouver votre{' '}
            <span className="text-gold-gradient">prochaine voiture</span> ?
          </h2>
          <p className="text-carbon-500 dark:text-carbon-400 mb-8">Contactez-nous pour un devis personnalisé. Réponse sous 24h.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 text-base px-8 py-4">
            Nous contacter <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
