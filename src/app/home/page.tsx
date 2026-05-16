import Link from "next/link";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import Navbar from "@/components/public/Navbar";
import BrandMarquee from "@/components/public/BrandMarquee";
import FlagText from "@/components/FlagText";
import Footer from "@/components/public/Footer";
import VoitureCard from "@/components/public/VoitureCard";
import GoogleReviews from "@/components/public/GoogleReviews";
import { supabase } from "@/lib/supabase";
import { getSettings } from "@/services/settings";
import type { Car as CarType } from "@/types/car";

export const revalidate = 60;

async function getHomeData() {
  const [{ count: nbDispo }, { count: nbVendus }, { data: vedettes }] =
    await Promise.all([
      supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("status", "available"),
      supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("status", "sold"),
      supabase
        .from("cars")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
  return {
    nbDispo: nbDispo ?? 0,
    nbVendus: nbVendus ?? 0,
    vedettes: (vedettes ?? []) as CarType[],
  };
}

export default async function HomePage() {
  const [{ nbDispo, nbVendus, vedettes }, settings] = await Promise.all([
    getHomeData(),
    getSettings(),
  ]);

  const features = [
    {
      icon: Shield,
      title: "Véhicules certifiés",
      desc: "Chaque véhicule est inspecté avant mise en vente. Carnet d'entretien vérifié, historique transparent.",
    },
    {
      icon: Truck,
      title: "Export facilité",
      desc: "Accompagnement complet pour l'export vers la Tunisie, l'Algérie et le Maroc. Démarches incluses.",
    },
    {
      icon: Award,
      title: "Service premium",
      desc: "Dédouanement, homologation, transfert de carte grise. On gère tout de A à Z.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <Navbar logoUrl={settings.logo_url} companyName={settings.company_name} />
      <div className="pt-16">
        <BrandMarquee />
      </div>

      {/* Hero */}
      <section className="relative flex items-center pt-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 70% 50%, rgba(212,146,26,0.07) 0%, transparent 60%)",
            }}
          />
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
              <Link
                href="/catalogue"
                className="btn-gold inline-flex items-center justify-center gap-2"
              >
                Voir le catalogue
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="btn-outline-gold inline-flex items-center justify-center gap-2"
              >
                Demander un devis
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
                <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">
                  Sélection du moment
                </p>
                <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">
                  Véhicules disponibles
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="hidden sm:flex items-center gap-2 text-gold-700 dark:text-gold-500 hover:text-gold-800 dark:hover:text-gold-400 text-sm font-medium transition-colors"
              >
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vedettes.map((car) => (
                <VoitureCard key={car.id} car={car} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/catalogue"
                className="btn-outline-gold inline-flex items-center gap-2"
              >
                Voir tout le catalogue <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Pourquoi nous choisir
            </p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white">
              L'excellence à chaque étape
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-8 transition-all bg-gradient-to-r from-gold-700 to-gold-500"
              >
                <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      {settings.google_review_url && (
        <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40">
          <div className="max-w-2xl mx-auto px-4 text-center mb-10">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Avis clients
            </p>
            <h2 className="text-3xl font-bold text-carbon-950 dark:text-white mb-8">
              Ce que disent nos clients
            </h2>
            <div className="inline-flex flex-col items-center gap-4 bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/10 px-10 py-8 shadow-sm">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#FBBC05">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              {settings.google_rating && (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-carbon-950 dark:text-white">{settings.google_rating}</span>
                  <span className="text-carbon-400 text-lg">/&nbsp;5</span>
                </div>
              )}
              {settings.google_review_count && (
                <p className="text-carbon-500 dark:text-carbon-400 text-sm">
                  Basé sur <span className="font-semibold text-carbon-700 dark:text-carbon-300">{settings.google_review_count} avis</span> Google
                </p>
              )}
            </div>
          </div>
          <GoogleReviews reviewUrl={settings.google_review_url} />
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-carbon-950 dark:text-white mb-4">
            Prêt à trouver votre{" "}
            <span className="text-gold-gradient">prochaine voiture</span> ?
          </h2>
          <p className="text-carbon-500 dark:text-carbon-400 mb-8">
            Contactez-nous pour un devis personnalisé. Réponse sous 24h.
          </p>
          <Link
            href="/contact"
            className="btn-gold inline-flex items-center gap-2 text-base px-8 py-4"
          >
            Nous contacter <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-carbon-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: nbDispo.toString(), label: 'Véhicules disponibles' },
              { value: nbVendus > 0 ? `${nbVendus}+` : '0', label: 'Véhicules exportés' },
              { value: settings.stat_pays ?? '3', label: 'Pays desservis' },
              { value: settings.stat_clients ?? '200+', label: 'Clients satisfaits' },
            ].map((s) => (
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
  );
}
