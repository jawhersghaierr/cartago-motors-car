import NavbarWrapper from '@/components/public/NavbarWrapper'
import Footer from '@/components/public/Footer'
import FavorisClient from './FavorisClient'

export default function FavorisPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-carbon-950 text-carbon-950 dark:text-white">
      <NavbarWrapper />
      <FavorisClient />
      <Footer />
    </div>
  )
}
