'use client'
import { useState, useEffect, useCallback } from 'react'
import VoitureCard from '@/components/public/VoitureCard'
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Voiture, CARBURANTS, BOITES, MARQUES } from '@/types'
import { useSearchParams } from 'next/navigation'
import Flag from '@/components/Flag'

export default function CatalogueClient() {
  const searchParams = useSearchParams()
  const [voitures, setVoitures] = useState<Voiture[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    marque: '',
    carburant: '',
    boite: '',
    pays: searchParams.get('pays') || '',
    minPrix: '',
    maxPrix: '',
    statut: '',
    maxKm: '',
    type_vente: '',
  })

  const fetchVoitures = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '12' })
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const res = await fetch(`/api/voitures?${params}`)
      const data = await res.json()
      setVoitures(data.voitures || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      console.error('Erreur fetch voitures')
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchVoitures() }, [fetchVoitures])

  const clearFilters = () => {
    setFilters({ marque: '', carburant: '', boite: '', pays: '', minPrix: '', maxPrix: '', statut: '', maxKm: '', type_vente: '' })
    setPage(1)
  }

  const activeFiltersCount = Object.entries(filters).filter(([k, v]) => v && k !== 'statut').length

  return (
    <div className="min-h-screen bg-carbon-950">
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="text-gold-500 text-sm uppercase tracking-widest font-medium mb-2">Catalogue</div>
              <h1 className="font-display text-4xl font-bold text-white">Nos Véhicules Premium</h1>
              <p className="text-carbon-400 mt-2">
                {loading ? 'Chargement...' : `${total} véhicule${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="hidden md:flex items-center gap-2">
                {[['', 'Tous'], ['Tunisie', 'Tunisie'], ['Algérie', 'Algérie'], ['Maroc', 'Maroc'], ['France', 'France']].map(([pays, label]) => (
                  <button key={label}
                    onClick={() => { setFilters(f => ({ ...f, pays: label === 'Tous' ? '' : pays })); setPage(1) }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      (filters.pays === pays || (label === 'Tous' && !filters.pays))
                        ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                        : 'bg-carbon-900 text-carbon-400 border-carbon-800 hover:border-carbon-700'
                    }`}>
                    {label !== 'Tous' && <Flag pays={pays} size={14} />}
                    {label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                    : 'bg-carbon-900 border-carbon-800 text-carbon-300 hover:border-carbon-700'
                }`}>
                <SlidersHorizontal size={16} />
                Filtres {activeFiltersCount > 0 && (
                  <span className="bg-gold-500 text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">{activeFiltersCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-6 glass rounded-2xl p-6 border border-white/5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">Marque</label>
                  <select className="select-gold text-sm" value={filters.marque}
                    onChange={e => { setFilters(f => ({ ...f, marque: e.target.value })); setPage(1) }}>
                    <option value="">Toutes</option>
                    {MARQUES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">Carburant</label>
                  <select className="select-gold text-sm" value={filters.carburant}
                    onChange={e => { setFilters(f => ({ ...f, carburant: e.target.value })); setPage(1) }}>
                    <option value="">Tous</option>
                    {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">Boîte</label>
                  <select className="select-gold text-sm" value={filters.boite}
                    onChange={e => { setFilters(f => ({ ...f, boite: e.target.value })); setPage(1) }}>
                    <option value="">Toutes</option>
                    {BOITES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">Prix max (€)</label>
                  <input type="number" className="input-gold text-sm" placeholder="Ex: 60000" value={filters.maxPrix}
                    onChange={e => { setFilters(f => ({ ...f, maxPrix: e.target.value })); setPage(1) }} />
                </div>
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">Type de vente</label>
                  <select className="select-gold text-sm"
                    value={filters.type_vente === 'local' && filters.pays ? `local_${filters.pays.toLowerCase().replace('é', 'e')}` : filters.type_vente}
                    onChange={e => {
                      const v = e.target.value
                      const localPays: Record<string, string> = {
                        local_tunisie: 'Tunisie',
                        local_algerie: 'Algérie',
                        local_maroc: 'Maroc',
                        local_france: 'France',
                      }
                      if (localPays[v]) {
                        setFilters(f => ({ ...f, type_vente: 'local', pays: localPays[v] }))
                      } else {
                        setFilters(f => ({ ...f, type_vente: v, pays: v === 'export' ? '' : f.pays }))
                      }
                      setPage(1)
                    }}>
                    <option value="">Tous</option>
                    <option value="export">🌍 Export Maghreb</option>
                    <option value="local_france">🇫🇷 Vente locale France</option>
                    <option value="local_tunisie">🇹🇳 Vente locale Tunisie</option>
                    <option value="local_algerie">🇩🇿 Vente locale Algérie</option>
                    <option value="local_maroc">🇲🇦 Vente locale Maroc</option>
                  </select>
                </div>
                <div>
                  <label className="text-carbon-400 text-xs mb-1.5 block">KM max</label>
                  <input type="number" className="input-gold text-sm" placeholder="Ex: 50000" value={filters.maxKm}
                    onChange={e => { setFilters(f => ({ ...f, maxKm: e.target.value })); setPage(1) }} />
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button onClick={clearFilters} className="flex items-center gap-2 text-carbon-400 hover:text-white text-sm transition-colors">
                  <X size={14} /> Réinitialiser les filtres
                </button>
                <div className="flex items-center gap-2">
                  <label className="text-carbon-400 text-xs">Statut :</label>
                  <select className="select-gold text-sm w-auto" value={filters.statut}
                    onChange={e => { setFilters(f => ({ ...f, statut: e.target.value })); setPage(1) }}>
                    <option value="">Tous</option>
                    <option value="disponible">Disponible</option>
                    <option value="réservé">Réservé</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-carbon-900 rounded-2xl overflow-hidden border border-carbon-800 animate-pulse">
                  <div className="h-52 bg-carbon-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-carbon-800 rounded w-3/4" />
                    <div className="h-4 bg-carbon-800 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(j => <div key={j} className="h-4 bg-carbon-800 rounded" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : voitures.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-white font-semibold text-xl mb-2">Aucun véhicule trouvé</h3>
              <p className="text-carbon-400 mb-6">Modifiez vos filtres ou revenez bientôt.</p>
              <button onClick={clearFilters} className="btn-gold">Réinitialiser les filtres</button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {voitures.map(v => <VoitureCard key={v.id} voiture={v} />)}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 rounded-xl bg-carbon-900 border border-carbon-800 flex items-center justify-center text-carbon-400 hover:text-white hover:border-carbon-700 disabled:opacity-30 transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl border text-sm font-medium transition-all ${
                        page === p
                          ? 'bg-gold-500/20 border-gold-500/40 text-gold-300'
                          : 'bg-carbon-900 border-carbon-800 text-carbon-400 hover:border-carbon-700 hover:text-white'
                      }`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                    className="w-10 h-10 rounded-xl bg-carbon-900 border border-carbon-800 flex items-center justify-center text-carbon-400 hover:text-white hover:border-carbon-700 disabled:opacity-30 transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
