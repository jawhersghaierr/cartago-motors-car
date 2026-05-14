import Link from 'next/link'
import { Car, Phone, MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react'
import { getSettings } from '@/services/settings'

export default async function Footer() {
  const settings = await getSettings()

  const hasSocials = settings.facebook_url || settings.instagram_url
  const hasContact = settings.phone || settings.whatsapp || settings.email || settings.address

  return (
    <footer className="relative bg-carbon-950 text-white overflow-hidden">
      {/* Ligne dorée en haut */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      {/* Glow décoratif */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Colonne 1 — Marque */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                <Car size={18} className="text-gold-400" />
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-none block">{settings.company_name}</span>
                <span className="text-gold-500/70 text-xs font-medium tracking-widest uppercase">Export Automobile</span>
              </div>
            </Link>
            <p className="text-carbon-400 text-sm leading-relaxed mb-6">
              {settings.about_text ?? 'Spécialiste de l\'export de véhicules premium vers la Tunisie, l\'Algérie et le Maroc. Accompagnement complet de A à Z.'}
            </p>
            {hasSocials && (
              <div className="flex items-center gap-3">
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="group w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:bg-gold-500/10 hover:border-gold-500/30 transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                )}
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-carbon-400 hover:text-white hover:bg-gold-500/10 hover:border-gold-500/30 transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Colonne 2 — Navigation */}
          <div className="md:col-span-3 md:col-start-6">
            <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/catalogue', label: 'Catalogue' },
                { href: '/contact', label: 'Contact & Devis' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 text-carbon-400 hover:text-white text-sm transition-colors"
                  >
                    <ArrowRight size={12} className="text-gold-500/0 group-hover:text-gold-500/80 transition-colors -translate-x-1 group-hover:translate-x-0 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Contact */}
          {hasContact && (
            <div className="md:col-span-3 md:col-start-10">
              <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5">Contact</h3>
              <ul className="space-y-3.5">
                {settings.phone && (
                  <li>
                    <a href={`tel:${settings.phone}`} className="flex items-start gap-2.5 text-carbon-400 hover:text-white text-sm transition-colors group">
                      <Phone size={14} className="mt-0.5 shrink-0 text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-carbon-400 hover:text-white text-sm transition-colors group"
                    >
                      <MessageCircle size={14} className="mt-0.5 shrink-0 text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                      WhatsApp
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li>
                    <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 text-carbon-400 hover:text-white text-sm transition-colors group">
                      <Mail size={14} className="mt-0.5 shrink-0 text-gold-500/60 group-hover:text-gold-400 transition-colors" />
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-2.5 text-carbon-400 text-sm">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-gold-500/60" />
                    {settings.address}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Barre de bas */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-carbon-600 text-xs">
            © {new Date().getFullYear()} {settings.company_name}. Tous droits réservés.
          </p>
          <p className="text-carbon-700 text-xs">
            Export premium vers le Maghreb
          </p>
        </div>
      </div>
    </footer>
  )
}
