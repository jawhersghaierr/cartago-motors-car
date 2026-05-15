export const dynamic = 'force-dynamic'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'
import FloatingWhatsApp from '@/components/public/FloatingWhatsApp'
import { getSettings } from '@/services/settings'
import { CompareProvider } from '@/context/CompareContext'
import CompareBar from '@/components/public/CompareBar'
import { FavoritesProvider } from '@/context/FavoritesContext'
import HtmlAttributes from '@/components/HtmlAttributes'
import DomTranslator from '@/components/DomTranslator'

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  const settings = await getSettings()

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlAttributes locale={locale} />
      <DomTranslator />
      <ThemeProvider>
        <FavoritesProvider>
          <CompareProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
            <FloatingWhatsApp number={settings.whatsapp} />
            <CompareBar />
          </CompareProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
