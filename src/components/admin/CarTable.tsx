'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus, Search, Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import type { Car } from '@/types/car'
import { STATUS_LABELS, STATUS_COLORS } from '@/types/car'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { formatPrice, formatDate } from '@/lib/utils'

const FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'available', label: 'Disponibles' },
  { value: 'reserved', label: 'Réservées' },
  { value: 'sold', label: 'Vendues' },
]

const LIMIT = 15

export default function CarTable() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
      if (search) params.set('search', search)
      if (status !== 'all') params.set('status', status)

      const res = await fetch(`/api/cars?${params}`)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setCars(data.cars)
      setTotal(data.total)
    } catch {
      toast.error('Erreur lors du chargement des voitures')
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, status])

  async function handleDelete() {
    if (!deleteId) return
    const res = await fetch(`/api/cars/${deleteId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    toast.success('Voiture supprimée')
    setDeleteId(null)
    fetchCars()
    router.refresh()
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                status === f.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Marque, modèle, VIN…"
              className="pl-8"
            />
          </div>
          <Link href="/admin/cars/new">
            <Button>
              <Plus size={15} className="mr-1.5" />
              Ajouter
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="py-20 text-center">
            <CarIcon size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">Aucune voiture trouvée</p>
            <p className="text-slate-400 text-sm mt-1">
              {search || status !== 'all'
                ? 'Modifiez vos filtres pour voir plus de résultats'
                : 'Commencez par ajouter une voiture'}
            </p>
            {!search && status === 'all' && (
              <Link href="/admin/cars/new" className="mt-4 inline-block">
                <Button size="sm" className="mt-4">
                  <Plus size={14} className="mr-1.5" />
                  Ajouter une voiture
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Technique
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Prix
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                  Ajouté le
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cars.map(car => (
                <tr key={car.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center border border-slate-100">
                        {car.images[0] ? (
                          <Image
                            src={car.images[0]}
                            alt={`${car.brand} ${car.model}`}
                            width={64}
                            height={44}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <CarIcon size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{car.brand} {car.model}</p>
                        <p className="text-slate-400 text-xs">{car.year}{car.vin ? ` · ${car.vin}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-slate-700">{car.fuel} · {car.transmission}</p>
                    {car.horsepower && <p className="text-slate-400 text-xs">{car.horsepower} ch</p>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {car.price != null ? (
                      <p className="font-semibold text-slate-900">{formatPrice(car.price)}</p>
                    ) : (
                      <p className="text-slate-300">—</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-slate-400 text-xs">
                    {formatDate(car.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[car.status]}`}>
                      {STATUS_LABELS[car.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/cars/${car.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(car.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            {total} voiture{total > 1 ? 's' : ''} au total
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="px-2 font-medium text-slate-700">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
