import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import Flag from "@/components/Flag";
import { getDb } from "@/lib/db";
import { formatPrix } from "@/lib/utils";
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  Star,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export const revalidate = 60;

async function getHomeData() {
  const db = getDb();

  const [
    stockRes,
    exportesRes,
    clientsRes,
    vedettesRes,
    tunsRes,
    algRes,
    marRes,
  ] = await Promise.all([
    db.execute(
      "SELECT COUNT(*) as nb FROM voitures WHERE statut = 'disponible'",
    ),
    db.execute("SELECT COUNT(*) as nb FROM voitures WHERE statut = 'vendu'"),
    db.execute("SELECT COUNT(*) as nb FROM clients WHERE statut = 'finalisé'"),
    db.execute(
      "SELECT id, marque, modele, annee, prix_ttc, prix_ht, kilometrage, photos FROM voitures WHERE statut = 'disponible' ORDER BY created_at DESC LIMIT 3",
    ),
    db.execute(
      "SELECT COUNT(*) as nb FROM voitures WHERE statut = 'disponible' AND pays_destination LIKE '%Tunisie%'",
    ),
    db.execute(
      "SELECT COUNT(*) as nb FROM voitures WHERE statut = 'disponible' AND pays_destination LIKE '%Algérie%'",
    ),
    db.execute(
      "SELECT COUNT(*) as nb FROM voitures WHERE statut = 'disponible' AND pays_destination LIKE '%Maroc%'",
    ),
  ]);

  return {
    nbDisponibles: Number(stockRes.rows[0].nb),
    nbExportes: Number(exportesRes.rows[0].nb),
    nbClients: Number(clientsRes.rows[0].nb),
    vedettes: vedettesRes.rows as any[],
    nbTunisie: Number(tunsRes.rows[0].nb),
    nbAlgerie: Number(algRes.rows[0].nb),
    nbMaroc: Number(marRes.rows[0].nb),
  };
}

export default async function Home() {
  const {
    nbDisponibles,
    nbExportes,
    nbClients,
    vedettes,
    nbTunisie,
    nbAlgerie,
    nbMaroc,
  } = await getHomeData();

  const stats = [
    { value: nbDisponibles.toString(), label: "Véhicules en stock" },
    {
      value: nbExportes > 0 ? `${nbExportes}+` : "0",
      label: "Véhicules vendus",
    },
    {
      value: nbClients > 0 ? `${nbClients}+` : "0",
      label: "Clients finalisés",
    },
    { value: "4", label: "Pays desservis" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Garantie & Fiabilité",
      desc: "Chaque véhicule est inspecté et certifié avant export. Carnet d'entretien vérifié, pas de sinistre caché.",
    },
    {
      icon: Truck,
      title: "Transport Sécurisé",
      desc: "Livraison porte-à-porte ou au port de votre choix. Assurance transport incluse sur tous les véhicules.",
    },
    {
      icon: Award,
      title: "Service Premium",
      desc: "Accompagnement complet : dédouanement, homologation, transfert de carte grise. On gère tout.",
    },
  ];

  const temoignages = [
    {
      nom: "Ahmed B.",
      pays: "🇹🇳 Tunisie",
      texte:
        "Service impeccable, BMW X5 reçue en parfait état. Toutes les démarches d'importation gérées. Je recommande vivement !",
      note: 5,
    },
    {
      nom: "Karim M.",
      pays: "🇩🇿 Algérie",
      texte:
        "Mon 3ème achat avec Cartago Motors. Toujours aussi pro, prix transparents et véhicules exactement comme décrit.",
      note: 5,
    },
    {
      nom: "Youssef E.",
      pays: "🇲🇦 Maroc",
      texte:
        "Range Rover Sport livrée en 3 semaines. Qualité irréprochable et suivi personnalisé du début à la fin.",
      note: 5,
    },
  ];

  const destinations = [
    {
      pays: "Tunisie",
      desc: "Import direct depuis l'Europe, homologation et dédouanement pris en charge.",
      nb: nbTunisie,
    },
    {
      pays: "Algérie",
      desc: "Expertise des réglementations douanières algériennes, livraison rapide.",
      nb: nbAlgerie,
    },
    {
      pays: "Maroc",
      desc: "Réseau de partenaires au Maroc, procédures simplifiées.",
      nb: nbMaroc,
    },
  ];

  return (
    <div className="min-h-screen bg-carbon-950">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-carbon-950 via-carbon-950/95 to-carbon-900" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-900/10 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 70% 50%, rgba(212,146,26,0.08) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fadeUp-2">
                <span className="text-white">Voitures</span>
                <br />
                <span className="text-gold-gradient">Premium</span>
                <br />
                <span className="text-white">Pour l'export</span>
              </h1>

              <p className="text-carbon-300 text-lg leading-relaxed mb-8 max-w-lg animate-fadeUp-3">
                Spécialistes de la vente locale et de l'export automobile.
                Sélection rigoureuse de véhicules haut de gamme, avec
                accompagnement complet et démarches incluses jusqu'à la
                livraison.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fadeUp-4">
                <Link
                  href="/catalogue"
                  className="btn-gold flex items-center justify-center gap-2 text-base px-8 py-4"
                >
                  Voir les véhicules
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="btn-outline-gold flex items-center justify-center gap-2 text-base px-8 py-4"
                >
                  Demander un devis
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 animate-fadeUp-4">
                {["France", "Tunisie", "Algérie", "Maroc"].map((pays) => (
                  <Link
                    key={pays}
                    href={`/catalogue?pays=${pays}`}
                    className="flex items-center gap-2 text-carbon-400 hover:text-white transition-colors group"
                  >
                    <Flag pays={pays} size={24} className="rounded" />
                    <span className="text-sm font-medium group-hover:text-gold-400 transition-colors">
                      {pays}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Stock card */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="border-gold-shimmer rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-900/5 to-transparent rounded-3xl" />
                  <div className="relative">
                    <div className="text-carbon-400 text-sm mb-2 uppercase tracking-widest font-medium">
                      Stock actuel
                    </div>
                    <div className="text-6xl font-display font-bold text-gold-gradient mb-1">
                      {nbDisponibles}
                    </div>
                    <div className="text-carbon-300 text-lg">
                      véhicule{nbDisponibles !== 1 ? "s" : ""} disponible
                      {nbDisponibles !== 1 ? "s" : ""}
                    </div>

                    <div className="mt-6 space-y-3">
                      {vedettes.length > 0 ? (
                        vedettes.map((v, i) => (
                          <Link
                            key={i}
                            href={`/voiture/${v.id}`}
                            className="flex items-center justify-between p-3 bg-carbon-900/50 rounded-xl border border-carbon-800 hover:border-gold-500/40 hover:bg-carbon-800/60 transition-all"
                          >
                            <div>
                              <div className="text-white text-sm font-semibold">
                                {v.marque} {v.modele}
                              </div>
                              <div className="text-carbon-500 text-xs">
                                {v.annee} •{" "}
                                {new Intl.NumberFormat("fr-FR").format(
                                  v.kilometrage,
                                )}{" "}
                                km
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-gold-400 font-bold text-sm">
                                {formatPrix(v.prix_ttc)}{" "}
                                <span className="text-gold-400/60 text-xs">
                                  TTC
                                </span>
                              </div>
                              {v.prix_ht && v.prix_ht !== v.prix_ttc && (
                                <div className="text-gold-400 font-bold text-sm">
                                  {formatPrix(v.prix_ht)}{" "}
                                  <span className="text-gold-400/60 text-xs">
                                    HT
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 bg-carbon-900/50 rounded-xl border border-carbon-800 text-center text-carbon-500 text-sm">
                          Catalogue en cours de mise à jour
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-dark rounded-2xl px-4 py-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">
                      En stock aujourd'hui
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-0.5 h-12 bg-gradient-to-b from-gold-500 to-transparent" />
          <span className="text-carbon-500 text-xs uppercase tracking-widest">
            Découvrir
          </span>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-display font-bold text-gold-gradient mb-2">
                  {value}
                </div>
                <div className="text-carbon-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Pourquoi nous choisir
            </div>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              L'excellence à chaque étape
            </h2>
            <p className="text-carbon-400 max-w-xl mx-auto">
              De la sélection du véhicule jusqu'à la livraison, nous vous
              accompagnons avec rigueur et transparence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="glass rounded-2xl p-8 border border-white/5 hover:border-gold-500/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
                  <Icon size={22} className="text-gold-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {title}
                </h3>
                <p className="text-carbon-400 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24 bg-carbon-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Nos destinations
            </div>
            <h2 className="font-display text-4xl font-bold text-white">
              Export vers le Maghreb
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map(({ pays, desc, nb }) => (
              <Link
                key={pays}
                href={`/catalogue?pays=${pays}`}
                className="relative overflow-hidden rounded-2xl border border-carbon-800 hover:border-gold-500/30 transition-all duration-300 group hover:-translate-y-1 p-8 bg-carbon-900"
              >
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-25 transition-opacity">
                  <Flag pays={pays} size={64} className="rounded" />
                </div>
                <div className="mb-4">
                  <Flag pays={pays} size={48} className="rounded" />
                </div>
                <h3 className="text-white font-display font-bold text-2xl mb-2">
                  {pays}
                </h3>
                <p className="text-carbon-400 text-sm mb-4">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold-400 font-semibold">
                    {nb > 0
                      ? `${nb} véhicule${nb > 1 ? "s" : ""} disponible${nb > 1 ? "s" : ""}`
                      : "Catalogue mis à jour régulièrement"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-carbon-500 group-hover:text-gold-400 transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Témoignages
            </div>
            <h2 className="font-display text-4xl font-bold text-white">
              Ils nous font confiance
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {temoignages.map(({ nom, pays, texte, note }) => (
              <div
                key={nom}
                className="glass rounded-2xl p-7 border border-white/5"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: note }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p className="text-carbon-300 text-sm leading-relaxed mb-5 italic">
                  "{texte}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-black font-bold text-sm">
                    {nom[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {nom}
                    </div>
                    <div className="text-carbon-500 text-xs">{pays}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-carbon-900/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            Prêt à trouver votre
            <span className="text-gold-gradient"> prochaine voiture</span> ?
          </h2>
          <p className="text-carbon-400 text-lg mb-10 max-w-xl mx-auto">
            Contactez-nous dès aujourd'hui pour un devis personnalisé. Réponse
            garantie sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogue"
              className="btn-gold flex items-center justify-center gap-2 px-8 py-4 text-base"
            >
              Explorer le catalogue
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/33123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
