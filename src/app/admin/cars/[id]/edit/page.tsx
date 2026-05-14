import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getCarById } from '@/services/cars'
import CarForm from '@/components/admin/CarForm'

export default async function EditCarPage({ params }: { params: { id: string } }) {
  let car
  try {
    car = await getCarById(params.id)
  } catch {
    notFound()
  }

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
        <h1 className="text-2xl font-bold text-slate-900">
          {car.brand} {car.model}
          <span className="text-slate-400 font-normal ml-2">· {car.year}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Modifier les informations du véhicule</p>
      </div>
      <CarForm car={car} />
    </div>
  )
}
