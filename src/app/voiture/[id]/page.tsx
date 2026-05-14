"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Link from "next/link";
import {
  Fuel,
  Gauge,
  Calendar,
  Settings,
  MapPin,
  Users,
  DoorOpen,
  Zap,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Send,
} from "lucide-react";
import { Voiture } from "@/types";
import BoutonFavori from "@/components/public/BoutonFavori";
import {
  formatPrix,
  formatKilometrage,
  getStatutColor,
  getStatutLabel,
} from "@/lib/utils";
import Flag from "@/components/Flag";

export default function VoitureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [voiture, setVoiture] = useState<Voiture | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    pays: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const closeLightbox = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setPhotoIdx(i => (i + 1) % (voiture?.photos?.length || 1));
      if (e.key === 'ArrowLeft') setPhotoIdx(i => (i - 1 + (voiture?.photos?.length || 1)) % (voiture?.photos?.length || 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, closeLightbox, voiture]);

  useEffect(() => {
    fetch(`/api/voitures/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setVoiture(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          voiture_id: voiture?.id,
          voiture_souhaitee: `${voiture?.marque} ${voiture?.modele} ${voiture?.annee}`,
        }),
      });
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-carbon-400">Chargement...</p>
        </div>
      </div>
    );

  if (!voiture)
    return (
      <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Véhicule introuvable
          </h2>
          <Link
            href="/catalogue"
            className="btn-gold mt-4 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Retour au catalogue
          </Link>
        </div>
      </div>
    );

  const photos = voiture.photos?.length
    ? voiture.photos
    : ["/images/car-placeholder.svg"];
  const pays = voiture.pays_destination?.split(",").map((p) => p.trim()) || [];

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par le véhicule ${voiture.marque} ${voiture.modele} ${voiture.annee} (${formatPrix(voiture.prix_ttc)}). Pouvez-vous m'envoyer plus d'informations ?`,
  );

  return (
    <div className="min-h-screen bg-carbon-950">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors text-xl font-bold z-10"
          >
            ✕
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-carbon-400 text-sm">
            {photoIdx + 1} / {photos.length}
          </div>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx(i => (i - 1 + photos.length) % photos.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx(i => (i + 1) % photos.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <img
            src={photos[photoIdx]}
            alt={`${voiture.marque} ${voiture.modele}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}

      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-carbon-500 mb-8">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link
              href="/catalogue"
              className="hover:text-gold-400 transition-colors"
            >
              Catalogue
            </Link>
            <span>/</span>
            <span className="text-white">
              {voiture.marque} {voiture.modele}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Photos + Description */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-carbon-900 mb-3 aspect-video">
                <img
                  src={photos[photoIdx]}
                  alt={`${voiture.marque} ${voiture.modele}`}
                  onClick={() => setLightbox(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%231a1a1a' width='800' height='450'/%3E%3Ctext fill='%23444' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EPhoto indisponible%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatutColor(voiture.statut)}`}
                >
                  {getStatutLabel(voiture.statut)}
                </div>
                <BoutonFavori id={voiture.id} className="absolute top-4 right-4" />

                {/* Signature */}
                <div className="absolute bottom-3 right-4 text-white/30 text-xs font-semibold tracking-[0.2em] uppercase select-none pointer-events-none drop-shadow-sm">
                  Cartago Motors
                </div>
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setPhotoIdx(
                          (i) => (i - 1 + photos.length) % photos.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 glass-dark rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setPhotoIdx((i) => (i + 1) % photos.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 glass-dark rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIdx(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === photoIdx ? "bg-gold-400 w-4" : "bg-white/30"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === photoIdx ? "border-gold-400" : "border-carbon-800 hover:border-carbon-600"}`}
                    >
                      <img
                        src={p}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='70'%3E%3Crect fill='%231a1a1a' width='100%25' height='100%25'/%3E%3C/svg%3E";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              {voiture.description && (
                <div className="glass rounded-2xl p-8 border border-white/5 mt-4">
                  <h2 className="font-display text-xl font-bold text-white mb-4">
                    Description
                  </h2>
                  <p className="text-carbon-300 leading-relaxed">
                    {voiture.description}
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">
                {voiture.marque} {voiture.modele}
              </h1>
              <p className="text-carbon-400 mb-4">
                {voiture.annee} {voiture.couleur && `• ${voiture.couleur}`}
              </p>

              <div className="mb-6 flex items-baseline gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-display font-bold text-gold-gradient">{formatPrix(voiture.prix_ttc)}</span>
                  <span className="text-sm font-medium text-gold-400/60">TTC</span>
                </div>
                {voiture.prix_ht && voiture.prix_ht !== voiture.prix_ttc && (
                  <>
                    <span className="text-carbon-700 text-xl">|</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-display font-bold text-gold-gradient">{formatPrix(voiture.prix_ht)}</span>
                      <span className="text-sm font-medium text-gold-400/60">HT</span>
                    </div>
                  </>
                )}
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    icon: Gauge,
                    label: "Kilométrage",
                    value: formatKilometrage(voiture.kilometrage),
                  },
                  { icon: Fuel, label: "Carburant", value: voiture.carburant },
                  { icon: Settings, label: "Boîte", value: voiture.boite },
                  {
                    icon: Calendar,
                    label: "Année",
                    value: voiture.annee.toString(),
                  },
                  ...(voiture.puissance
                    ? [
                        {
                          icon: Zap,
                          label: "Puissance",
                          value: `${voiture.puissance} ch`,
                        },
                      ]
                    : []),
                  {
                    icon: Users,
                    label: "Places",
                    value: `${voiture.nb_places} places`,
                  },
                  {
                    icon: DoorOpen,
                    label: "Portes",
                    value: `${voiture.nb_portes} portes`,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-carbon-900 rounded-xl p-4 border border-carbon-800"
                  >
                    <div className="flex items-center gap-2 text-carbon-400 text-xs mb-1">
                      <Icon size={13} className="text-gold-600" /> {label}
                    </div>
                    <div className="text-white font-semibold text-sm">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination */}
              <div className="bg-carbon-900 rounded-xl p-4 border border-carbon-800 mb-6">
                <div className="flex items-center gap-2 text-carbon-400 text-sm mb-3">
                  <MapPin size={14} className="text-gold-600" /> Disponible
                </div>
                <div className="flex flex-wrap gap-2">
                  {pays
                    .filter((p) => p !== "France")
                    .map((p) => (
                      <span
                        key={p}
                        className="flex items-center gap-1.5 bg-carbon-800 border border-carbon-700 rounded-full px-3 py-1.5 text-sm text-white"
                      >
                        <Flag pays={p} size={16} /> {p}
                      </span>
                    ))}
                  {voiture.type_vente?.split(",").includes("local") && (
                    <span className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1.5 text-sm text-blue-300">
                      <Flag pays="France" size={16} /> Vente locale France
                    </span>
                  )}
                </div>
              </div>

              {/* Formulaire de contact inline */}
              <div className="bg-gold-500/5 border border-gold-500/20 rounded-2xl p-5 mb-4">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Send size={15} className="text-gold-400" />
                  Je suis intéressé par ce véhicule
                </h3>
                {success ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-white font-semibold">Demande envoyée !</p>
                    <p className="text-carbon-400 text-sm mt-1">Nous vous contacterons dans les 24h.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-carbon-400 text-xs mb-1 block">Nom *</label>
                        <input className="input-gold text-sm" required placeholder="Votre nom"
                          value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-carbon-400 text-xs mb-1 block">Téléphone *</label>
                        <input className="input-gold text-sm" type="tel" required placeholder="+216 ..."
                          value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-carbon-400 text-xs mb-1 block">Pays *</label>
                      <select className="select-gold text-sm" required value={form.pays}
                        onChange={e => setForm(f => ({ ...f, pays: e.target.value }))}>
                        <option value="">Sélectionner</option>
                        <option value="France">🇫🇷 France</option>
                        <option value="Tunisie">🇹🇳 Tunisie</option>
                        <option value="Algérie">🇩🇿 Algérie</option>
                        <option value="Maroc">🇲🇦 Maroc</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-carbon-400 text-xs mb-1 block">Message</label>
                      <textarea className="input-gold resize-none text-sm" rows={2}
                        placeholder="Questions, délai souhaité..."
                        value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="btn-gold w-full py-3 flex items-center justify-center gap-2 text-sm">
                      {submitting
                        ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        : <Send size={15} />}
                      Envoyer la demande
                    </button>
                  </form>
                )}
              </div>

              {/* Contacts secondaires */}
              <div className="flex flex-col gap-2">
                <a href={`https://wa.me/33123456789?text=${whatsappMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  <MessageCircle size={16} /> Contacter via WhatsApp
                </a>
                <a href="tel:+33123456789"
                  className="flex items-center justify-center gap-2 btn-outline-gold py-3 text-sm">
                  <Phone size={16} /> Appeler maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
