'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import { Voiture } from '@/types'
import { formatPrix, formatKilometrage, getStatutColor, getStatutLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminVoituresPage() {
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchVoitures = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: page.toString(), limit: '15' })
    if (statut) params.set('statut', statut)
    if (search) params.set('marque', search)
    const res = await fetch(`/api/voitures?${params}`)
    const data = await res.json()
    setVoitures(data.voitures || [])
    setTotal(data.total || 0)
    setPages(data.pages || 1)
    setLoading(false)
  }, [page, statut, search])

  useEffect(() => { fetchVoitures() }, [fetchVoitures])

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`Supprimer "${label}" ?`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/voitures/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Véhicule supprimé')
        fetchVoitures()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-white font-display text-2xl font-bold">Gestion des voitures</h1>
          <p className="text-carbon-400 text-sm mt-0.5">{total} véhicule{total > 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/admin/voitures/nouveau" className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={16} /> Ajouter une voiture
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-500" />
          <input className="input-gold pl-9 text-sm py-2.5" placeholder="Rechercher par marque..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className="select-gold text-sm py-2.5 w-auto min-w-36" value={statut}
          onChange={e => { setStatut(e.target.value); setPage(1) }}>
          <option value="">Tous les statuts</option>
          <option value="disponible">Disponible</option>
          <option value="réservé">Réservé</option>
          <option value="vendu">Vendu</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-carbon-900 rounded-2xl border border-carbon-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-carbon-800">
                <th className="text-left px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider">Véhicule</th>
                <th className="text-left px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Infos</th>
                <th className="text-left px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider">Prix</th>
                <th className="text-left px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Destinations</th>
                <th className="text-left px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider">Statut</th>
                <th className="text-right px-4 py-3 text-carbon-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-10 bg-carbon-800 rounded-lg w-48" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 bg-carbon-800 rounded w-32" /></td>
                    <td className="px-4 py-4"><div className="h-4 bg-carbon-800 rounded w-20" /></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 bg-carbon-800 rounded w-24" /></td>
                    <td className="px-4 py-4"><div className="h-6 bg-carbon-800 rounded-full w-20" /></td>
                    <td className="px-4 py-4"><div className="h-8 bg-carbon-800 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : voitures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-carbon-500">
                    <Car size={32} className="mx-auto mb-3 opacity-30" />
                    Aucun véhicule trouvé
                  </td>
                </tr>
              ) : voitures.map(v => (
                <tr key={v.id} className="hover:bg-carbon-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 bg-carbon-800 rounded-lg overflow-hidden flex-shrink-0">
                        {v.photos?.[0] ? (
                          <img src={v.photos[0]} alt="" className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        ) : <div className="w-full h-full flex items-center justify-center text-carbon-600"><Car size={14} /></div>}
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">{v.marque} {v.modele}</div>
                        <div className="text-carbon-500 text-xs">{v.annee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="text-carbon-300 text-xs">{v.carburant} • {v.boite}</div>
                    <div className="text-carbon-500 text-xs">{formatKilometrage(v.kilometrage)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white text-sm font-semibold">{formatPrix(v.prix_ttc)}</div>
                    {v.prix_ht && <div className="text-carbon-500 text-xs">HT {formatPrix(v.prix_ht)}</div>}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap items-center">
                      {v.pays_destination?.split(',').map(p => p.trim()).filter(p => p && p !== 'France').map(p => (
                        <span key={p} className="text-xs text-carbon-400">{p === 'Tunisie' ? '🇹🇳' : p === 'Algérie' ? '🇩🇿' : p === 'Maroc' ? '🇲🇦' : ''}</span>
                      ))}
                      {v.type_vente?.split(',').includes('local') && (
                        <span className="text-xs text-blue-300">🇫🇷</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatutColor(v.statut)}`}>
                      {getStatutLabel(v.statut)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/voiture/${v.id}`} target="_blank"
                        className="w-8 h-8 bg-carbon-800 border border-carbon-700 rounded-lg flex items-center justify-center text-carbon-400 hover:text-white transition-colors">
                        <Eye size={14} />
                      </Link>
                      <Link href={`/admin/voitures/${v.id}`}
                        className="w-8 h-8 bg-carbon-800 border border-carbon-700 rounded-lg flex items-center justify-center text-carbon-400 hover:text-gold-400 transition-colors">
                        <Edit2 size={14} />
                      </Link>
                      <button onClick={() => handleDelete(v.id, `${v.marque} ${v.modele}`)}
                        disabled={deleting === v.id}
                        className="w-8 h-8 bg-carbon-800 border border-carbon-700 rounded-lg flex items-center justify-center text-carbon-400 hover:text-red-400 transition-colors disabled:opacity-50">
                        {deleting === v.id
                          ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-carbon-800">
            <span className="text-carbon-400 text-sm">Page {page} / {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="w-9 h-9 bg-carbon-800 rounded-lg flex items-center justify-center text-carbon-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
                className="w-9 h-9 bg-carbon-800 rounded-lg flex items-center justify-center text-carbon-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
