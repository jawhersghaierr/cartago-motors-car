import Link from "next/link";
import Flag from "@/components/Flag";
import { Phone, Mail, MapPin } from "lucide-react";
import { getDb } from "@/lib/db";

const SOCIALS = [
  {
    href: 'https://www.facebook.com/p/CARTAGO-MOTORS-61577844482184/',
    label: 'Facebook',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    href: '#',
    label: 'Instagram',
    svg: <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>,
  },
  {
    href: 'https://www.tiktok.com/@cartagomotors',
    label: 'TikTok',
    svg: <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />,
  },
]

export default async function Footer() {
  const db = getDb()
  const res = await db.execute('SELECT key, value FROM settings').catch(() => ({ rows: [] }))
  const s: Record<string, string> = {}
  res.rows.forEach((r: any) => { s[r.key] = r.value })

  const phone = s.company_phone || ''
  const email = s.company_email || ''
  const address = s.company_address || ''
  const name = s.company_name || 'Cartago Motors'
  return (
    <footer className="bg-carbon-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
                <span className="text-black font-bold font-display text-lg">
                  A
                </span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-none">
                  {name}
                </div>
                <div className="text-gold-400 text-xs tracking-widest uppercase">
                  Vente Locale & Export
                </div>
              </div>
            </div>
            <p className="text-carbon-400 text-sm leading-relaxed mb-5">
              Des véhicules premium sélectionnés pour l’export international et
              la vente locale, avec un service fiable et sur mesure.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ href, label, svg }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-lg bg-carbon-900 border border-carbon-800 flex items-center justify-center text-carbon-400 hover:text-gold-400 hover:border-gold-500/30 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{svg}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              {[
                ["/", "Accueil"],
                ["/catalogue", "Catalogue voitures"],
                ["/contact", "Demande de devis"],
                ["/contact", "Nous contacter"],
              ].map(([href, label]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-carbon-400 hover:text-gold-400 text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Destinations
            </h4>
            <div className="flex flex-col gap-2">
              {["Tunisie", "Algérie", "Maroc"].map((pays) => (
                <Link
                  key={pays}
                  href={`/catalogue?pays=${pays}`}
                  className="flex items-center gap-2 text-carbon-400 hover:text-gold-400 text-sm transition-colors"
                >
                  <Flag pays={pays} size={14} /> Export vers le {pays}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-carbon-400 hover:text-white text-sm transition-colors">
                  <Phone size={15} className="text-gold-500 flex-shrink-0" />
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`}
                  className="flex items-center gap-3 text-carbon-400 hover:text-white text-sm transition-colors">
                  <Mail size={15} className="text-gold-500 flex-shrink-0" />
                  {email}
                </a>
              )}
              {address && (
                <div className="flex items-start gap-3 text-carbon-400 text-sm">
                  <MapPin size={15} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-carbon-500 text-sm">
            © {new Date().getFullYear()} {name}. Tous droits réservés.
          </p>
          <p className="text-carbon-600 text-xs">
            Spécialiste de la vente locale et de l'export de véhicules premium
            vers la Tunisie, l'Algérie et le Maroc.
          </p>
        </div>
      </div>
    </footer>
  );
}
