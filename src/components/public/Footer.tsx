import Link from 'next/link'
import { Car, Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import { getSettings } from '@/services/settings'

export default async function Footer() {
  const settings = await getSettings()

  return (
    <footer className="bg-gray-50 dark:bg-carbon-950 border-t border-carbon-200 dark:border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Car size={16} className="text-gold-600 dark:text-gold-400" />
            </div>
            <span className="text-carbon-950 dark:text-white font-bold">{settings.company_name}</span>
          </Link>

          {/* Infos de contact inline */}
          {(settings.phone || settings.whatsapp || settings.email || settings.address) && (
            <div className="flex flex-wrap items-center justify-center gap-5">
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 text-carbon-500 hover:text-carbon-900 dark:hover:text-white text-sm transition-colors">
                  <Phone size={13} className="text-gold-700/70 dark:text-gold-500/70" />
                  {settings.phone}
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-carbon-500 hover:text-carbon-900 dark:hover:text-white text-sm transition-colors">
                  <MessageCircle size={13} className="text-gold-700/70 dark:text-gold-500/70" />
                  WhatsApp
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 text-carbon-500 hover:text-carbon-900 dark:hover:text-white text-sm transition-colors">
                  <Mail size={13} className="text-gold-700/70 dark:text-gold-500/70" />
                  {settings.email}
                </a>
              )}
              {settings.address && (
                <span className="flex items-center gap-1.5 text-carbon-500 dark:text-carbon-500 text-sm">
                  <MapPin size={13} className="text-gold-700/70 dark:text-gold-500/70" />
                  {settings.address}
                </span>
              )}
            </div>
          )}

          {/* Réseaux sociaux */}
          {(settings.facebook_url || settings.instagram_url) && (
            <div className="flex items-center gap-2.5 shrink-0">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-carbon-100 dark:bg-white/5 border border-carbon-200 dark:border-white/10 flex items-center justify-center text-carbon-500 hover:text-carbon-950 dark:hover:text-white hover:bg-gold-500/10 hover:border-gold-500/30 transition-all"
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
                  className="w-9 h-9 rounded-lg bg-carbon-100 dark:bg-white/5 border border-carbon-200 dark:border-white/10 flex items-center justify-center text-carbon-500 hover:text-carbon-950 dark:hover:text-white hover:bg-gold-500/10 hover:border-gold-500/30 transition-all"
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

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-carbon-200 dark:border-white/5">
          <p className="text-carbon-400 dark:text-carbon-600 text-sm text-center">
            © {new Date().getFullYear()} {settings.company_name}. Tous droits réservés.
          </p>
        </div>
      </div>

    </footer>
  )
}
