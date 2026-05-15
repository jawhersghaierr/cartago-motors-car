export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const { getSettings } = await import('@/services/settings')
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
