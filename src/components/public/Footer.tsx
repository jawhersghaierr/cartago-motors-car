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

      {/* Boutons flottants */}
      {(settings.phone || settings.whatsapp) && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {settings.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nous contacter sur WhatsApp"
              className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-black/20 transition-transform hover:scale-110 active:scale-95"
              style={{ background: '#25D366' }}
            >
              {/* Pulse */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.853L.057 23.428a.5.5 0 0 0 .609.61l5.66-1.453A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.384l-.36-.214-3.733.958.993-3.645-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
              </svg>
            </a>
          )}
          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              aria-label="Nous appeler"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-carbon-900 dark:bg-white/10 border border-white/10 shadow-lg shadow-black/20 text-white hover:bg-gold-500 hover:border-gold-400 transition-all hover:scale-110 active:scale-95"
            >
              <Phone size={22} strokeWidth={2} />
            </a>
          )}
        </div>
      )}
    </footer>
  )
}
