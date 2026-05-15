import { getTranslations } from 'next-intl/server'
import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import CatalogueClient from './CatalogueClient'

export default async function CataloguePage() {
  const t = await getTranslations('catalogue')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">Notre sélection</p>
            <h1 className="text-4xl font-bold text-carbon-950 dark:text-white">{t('title')}</h1>
          </div>
          <CatalogueClient />
        </div>
      </div>
      <Footer />
    </div>
  )
}
