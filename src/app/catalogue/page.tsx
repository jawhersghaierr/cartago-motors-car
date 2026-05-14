import { Suspense } from 'react'
import CatalogueClient from './CatalogueClient'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function CataloguePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CatalogueClient />
      </Suspense>
      <Footer />
    </>
  )
}
