import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp'
import { getSettings } from '@/services/settings'

export const metadata: Metadata = {
  title: 'Cartago Motors — Voitures Premium Export',
  description: 'Spécialiste export de véhicules premium vers la Tunisie, l\'Algérie et le Maroc.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
          <FloatingWhatsApp number={settings.whatsapp} />
        </ThemeProvider>
      </body>
    </html>
  )
}
