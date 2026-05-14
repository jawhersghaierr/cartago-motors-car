import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import { getSettings } from '@/services/settings'
import ContactForm from './ContactForm'

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSettings()

  const contactItems = [
    settings.phone    && { icon: Phone,         label: 'Téléphone', value: settings.phone,    href: `tel:${settings.phone}` },
    settings.whatsapp && { icon: MessageCircle,  label: 'WhatsApp',  value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` },
    settings.email    && { icon: Mail,           label: 'Email',     value: settings.email,    href: `mailto:${settings.email}` },
    settings.address  && { icon: MapPin,         label: 'Adresse',   value: settings.address,  href: null },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string | null }[]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">Contactez-nous</p>
            <h1 className="text-4xl font-bold text-carbon-950 dark:text-white">Demande de devis</h1>
            <p className="text-carbon-500 dark:text-carbon-400 mt-3">Réponse garantie sous 24h.</p>
          </div>

          <div className={`gap-8 ${contactItems.length > 0 ? 'grid lg:grid-cols-5' : ''}`}>
            {/* Infos de contact (si renseignées dans les paramètres) */}
            {contactItems.length > 0 && (
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-sm font-semibold text-carbon-500 dark:text-carbon-400 uppercase tracking-wider mb-4">
                  Nos coordonnées
                </h2>
                {contactItems.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3 bg-white dark:bg-carbon-900/60 border border-carbon-200 dark:border-white/5 rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-gold-700/10 dark:bg-gold-500/10 border border-gold-700/20 dark:border-gold-500/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-gold-700 dark:text-gold-500" />
                    </div>
                    <div>
                      <p className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-carbon-950 dark:text-white text-sm font-medium hover:text-gold-700 dark:hover:text-gold-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-carbon-950 dark:text-white text-sm font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire */}
            <div className={contactItems.length > 0 ? 'lg:col-span-3' : ''}>
              <div className="bg-white dark:bg-carbon-900/60 border border-carbon-200 dark:border-white/5 rounded-2xl p-8 shadow-sm dark:shadow-none">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
