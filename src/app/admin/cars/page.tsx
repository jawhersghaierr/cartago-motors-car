export const dynamic = 'force-dynamic'

import CarTable from '@/components/admin/CarTable'

export default function CarsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Voitures</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gestion du parc automobile</p>
      </div>
      <CarTable />
    </div>
  )
}
