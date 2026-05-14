import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CarForm from '@/components/admin/CarForm'

export default function NewCarPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/cars"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ChevronLeft size={14} />
          Retour aux voitures
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Ajouter une voiture</h1>
        <p className="text-slate-500 text-sm mt-0.5">Remplissez les informations ci-dessous</p>
      </div>
      <CarForm />
    </div>
  )
}
