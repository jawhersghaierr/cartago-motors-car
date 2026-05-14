"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Flag from "@/components/Flag";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    pays: "",
    type_vente: "" as "" | "local" | "export",
    voiture_souhaitee: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/public/settings').then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  const phone = settings.company_phone || ''
  const email = settings.company_email || ''
  const address = settings.company_address || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Erreur de connexion. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-carbon-950">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
              Contact
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Demande de devis
            </h1>
            <p className="text-carbon-400 max-w-xl mx-auto text-lg">
              Remplissez le formulaire ci-dessous et nous vous répondons sous
              24h avec une offre personnalisée.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div className="glass rounded-2xl p-8 border border-white/5">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-emerald-400" />
                  </div>
                  <h2 className="text-white font-display text-2xl font-bold mb-3">
                    Demande reçue !
                  </h2>
                  <p className="text-carbon-400">
                    Merci <strong className="text-white">{form.nom}</strong>,
                    nous avons bien reçu votre demande. Notre équipe vous
                    contactera dans les{" "}
                    <strong className="text-gold-400">24 heures</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({
                        nom: "",
                        telephone: "",
                        email: "",
                        pays: "",
                        type_vente: "",
                        voiture_souhaitee: "",
                        message: "",
                      });
                    }}
                    className="btn-outline-gold mt-6"
                  >
                    Nouvelle demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-display text-xl font-bold text-white mb-2">
                    Vos informations
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-carbon-400 text-xs mb-1.5 block">
                        Nom complet *
                      </label>
                      <input
                        className="input-gold"
                        placeholder="Ahmed Benali"
                        required
                        value={form.nom}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, nom: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-carbon-400 text-xs mb-1.5 block">
                        Téléphone *
                      </label>
                      <input
                        className="input-gold"
                        type="tel"
                        placeholder="+216 XX XXX XXX"
                        required
                        value={form.telephone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, telephone: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-carbon-400 text-xs mb-1.5 block">
                      Adresse email
                    </label>
                    <input
                      className="input-gold"
                      type="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-carbon-400 text-xs mb-2 block">
                      Type de demande *
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {([
                        ["local", "🇫🇷", "Vente locale", "France"],
                        ["export", "🌍", "Export Maghreb", "TN · DZ · MA"],
                      ] as const).map(([val, flag, label, sub]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setForm(f => ({
                            ...f,
                            type_vente: val,
                            pays: val === "local" ? "France" : "",
                          }))}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                            form.type_vente === val
                              ? "bg-gold-500/10 border-gold-500/40 text-white"
                              : "border-carbon-700 text-carbon-400 hover:border-carbon-600"
                          }`}
                        >
                          <span className="text-2xl">{flag}</span>
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs opacity-60">{sub}</span>
                        </button>
                      ))}
                    </div>

                    {form.type_vente === "export" && (
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          ["Tunisie", "🇹🇳"],
                          ["Algérie", "🇩🇿"],
                          ["Maroc", "🇲🇦"],
                        ] as const).map(([pays, flag]) => (
                          <button
                            key={pays}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, pays }))}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                              form.pays === pays
                                ? "bg-gold-500/10 border-gold-500/40 text-white"
                                : "border-carbon-700 text-carbon-400 hover:border-carbon-600"
                            }`}
                          >
                            <span className="text-xl">{flag}</span>
                            <span className="text-xs font-medium">{pays}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* hidden required input pour validation HTML */}
                    <input
                      type="text"
                      required
                      value={form.pays}
                      onChange={() => {}}
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                    />
                  </div>

                  <div>
                    <label className="text-carbon-400 text-xs mb-1.5 block">
                      Véhicule souhaité
                    </label>
                    <input
                      className="input-gold"
                      placeholder="Ex: BMW X5, Mercedes GLE, ou selon budget..."
                      value={form.voiture_souhaitee}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          voiture_souhaitee: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-carbon-400 text-xs mb-1.5 block">
                      Message / Précisions
                    </label>
                    <textarea
                      className="input-gold resize-none"
                      rows={4}
                      placeholder="Budget, type de carburant préféré, usage, délai souhaité..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    Envoyer ma demande
                  </button>

                  <p className="text-carbon-500 text-xs text-center">
                    Réponse garantie sous 24h • Aucun engagement
                  </p>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-white font-semibold text-lg mb-5">
                  Nos coordonnées
                </h3>
                <div className="space-y-4">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-4 group">
                      <div className="w-11 h-11 bg-gold-500/10 rounded-xl border border-gold-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <Phone size={18} className="text-gold-400" />
                      </div>
                      <div>
                        <div className="text-carbon-400 text-xs mb-0.5">Téléphone</div>
                        <div className="text-white font-medium">{phone}</div>
                      </div>
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                      <div className="w-11 h-11 bg-gold-500/10 rounded-xl border border-gold-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                        <Mail size={18} className="text-gold-400" />
                      </div>
                      <div>
                        <div className="text-carbon-400 text-xs mb-0.5">Email</div>
                        <div className="text-white font-medium">{email}</div>
                      </div>
                    </a>
                  )}
                  {address && (
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gold-500/10 rounded-xl border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-gold-400" />
                      </div>
                      <div>
                        <div className="text-carbon-400 text-xs mb-0.5">Adresse</div>
                        <div className="text-white font-medium">{address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">
                      WhatsApp
                    </div>
                    <div className="text-carbon-400 text-sm">
                      Réponse rapide, 7j/7
                    </div>
                  </div>
                </div>
              </a>

              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-white font-semibold mb-4">
                  Destinations export
                </h3>
                <div className="space-y-3">
                  {[
                    { pays: "Tunisie",  info: "Import direct, dédouanement inclus" },
                    { pays: "Algérie",  info: "Expertise réglementations algériennes" },
                    { pays: "Maroc",    info: "Réseau de partenaires locaux" },
                  ].map(({ pays, info }) => (
                    <div key={pays} className="flex items-center gap-3">
                      <Flag pays={pays} size={28} className="rounded flex-shrink-0" />
                      <div>
                        <div className="text-white text-sm font-medium">{pays}</div>
                        <div className="text-carbon-500 text-xs">{info}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
