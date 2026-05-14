export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp'
import SplashScreen from '@/components/SplashScreen'
import { getSettings } from '@/services/settings'
import { CompareProvider } from '@/context/CompareContext'
import CompareBar from '@/components/public/CompareBar'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.company_name} — Voitures Premium Export`,
    description: "Spécialiste export de véhicules premium vers la Tunisie, l'Algérie et le Maroc.",
    icons: {
      icon: settings.logo_url || '/logo.png',
      apple: settings.logo_url || '/logo.png',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <CompareProvider>
            <SplashScreen logoUrl={settings.logo_url} companyName={settings.company_name} />
            {children}
            <Toaster position="top-right" richColors closeButton />
            <FloatingWhatsApp number={settings.whatsapp} />
            <CompareBar />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
