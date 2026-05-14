'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, ArrowLeft, Save, ScanLine, CheckCircle2 } from 'lucide-react'
import { Voiture, MARQUES, CARBURANTS, BOITES } from '@/types'
import toast from 'react-hot-toast'

function parsePrix(val: string): number | null {
  if (!val.trim()) return null
  const cleaned = val.replace(/\s/g, '').replace(/,/g, '')
  const n = parseFloat(cleaned)
  return isNaN(n) ? null : n
}

function PrixInput({ label, value, onChange, required, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void
  required?: boolean; placeholder?: string; hint?: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-carbon-400 text-xs">{label}</label>
        {hint}
      </div>
      <input
        type="text"
        inputMode="decimal"
        className="input-gold"
        required={required}
        placeholder={placeholder || 'Ex: 14,500'}
        value={value}
        onChange={e => {
          const raw = e.target.value.replace(/[^0-9,. ]/g, '')
          onChange(raw)
        }}
        onBlur={e => {
          const n = parsePrix(e.target.value)
          if (n !== null) onChange(n.toString())
        }}
      />
    </div>
  )
}

interface VoitureFormProps {
  voiture?: Voiture
  isEdit?: boolean
}

export default function VoitureForm({ voiture, isEdit }: VoitureFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [decodeQuery, setDecodeQuery] = useState('')
  const [decoding, setDecoding] = useState(false)
  const [decodedFields, setDecodedFields] = useState<string[]>([])

  const [form, setForm] = useState({
    marque: voiture?.marque || '',
    modele: voiture?.modele || '',
    annee: voiture?.annee?.toString() || new Date().getFullYear().toString(),
    prix_souhaite: (voiture as any)?.prix_souhaite?.toString() || '',
    prix_ht: voiture?.prix_ht?.toString() || '',
    prix_ttc: voiture?.prix_ttc?.toString() || '',
    kilometrage: voiture?.kilometrage?.toString() || '0',
    carburant: voiture?.carburant || 'Diesel',
    boite: voiture?.boite || 'Automatique',
    couleur: voiture?.couleur || '',
    puissance: voiture?.puissance?.toString() || '',
    nb_portes: voiture?.nb_portes?.toString() || '5',
    nb_places: voiture?.nb_places?.toString() || '5',
    type_vente: (voiture?.type_vente || 'export') as string,
    pays_destination: voiture?.pays_destination?.split(',').map(p => p.trim()).filter(p => p !== 'France') || [],
    description: voiture?.description || '',
    statut: voiture?.statut || 'disponible',
    photos: voiture?.photos || [],
  })

  const toggleTypeVente = (type: string) => {
    setForm(f => {
      const types = f.type_vente.split(',').filter(Boolean)
      const next = types.includes(type) ? types.filter(t => t !== type) : [...types, type]
      return { ...f, type_vente: next.join(',') }
    })
  }

  const togglePays = (pays: string) => {
    setForm(f => ({
      ...f,
      pays_destination: f.pays_destination.includes(pays)
        ? f.pays_destination.filter(p => p !== pays)
        : [...f.pays_destination, pays]
    }))
  }

  const handleDecode = async () => {
    const vin = decodeQuery.trim()
    if (!vin) return
    setDecoding(true)
    setDecodedFields([])
    try {
      const res = await fetch(`/api/decode-vehicle?vin=${encodeURIComponent(vin)}`)
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Erreur de décodage'); return }
      const filled: string[] = []
      setForm(f => {
        const next = { ...f }
        if (data.marque && MARQUES.includes(data.marque)) { next.marque = data.marque; filled.push('Marque') }
        if (data.modele) { next.modele = data.modele; filled.push('Modèle') }
        if (data.annee) { next.annee = data.annee.toString(); filled.push('Année') }
        if (data.carburant && CARBURANTS.includes(data.carburant)) { next.carburant = data.carburant; filled.push('Carburant') }
        if (data.boite && BOITES.includes(data.boite)) { next.boite = data.boite; filled.push('Boîte') }
        if (data.nb_portes) { next.nb_portes = data.nb_portes.toString(); filled.push('Portes') }
        if (data.nb_places) { next.nb_places = data.nb_places.toString(); filled.push('Places') }
        if (data.puissance) { next.puissance = data.puissance.toString(); filled.push('Puissance') }
        return next
      })
      setDecodedFields(filled)
      if (filled.length > 0) toast.success(`${filled.length} champ(s) rempli(s) automatiquement`)
      else toast('VIN reconnu mais données insuffisantes — remplissez manuellement', { icon: '⚠️' })
    } catch { toast.error('Erreur lors du décodage') }
    finally { setDecoding(false) }
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('photos', f))
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.paths) {
        setForm(f => ({ ...f, photos: [...f.photos, ...data.paths] }))
        toast.success(`${data.paths.length} photo(s) uploadée(s)`)
      }
    } catch {
      toast.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (idx: number) => {
    setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type_vente) {
      toast.error('Sélectionnez au moins un type de vente')
      return
    }
    if (form.type_vente.split(',').includes('export') && !form.pays_destination.length) {
      toast.error('Sélectionnez au moins un pays de destination export')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        annee: parseInt(form.annee),
        prix_souhaite: parsePrix(form.prix_souhaite),
        prix_ht: parsePrix(form.prix_ht),
        prix_ttc: parsePrix(form.prix_ttc) ?? 0,
        kilometrage: parseInt(form.kilometrage),
        puissance: form.puissance ? parseInt(form.puissance) : null,
        nb_portes: parseInt(form.nb_portes),
        nb_places: parseInt(form.nb_places),
        pays_destination: [
          ...(form.type_vente.split(',').includes('export') ? form.pays_destination : []),
          ...(form.type_vente.split(',').includes('local') ? ['France'] : []),
        ].join(','),
      }

      const url = isEdit ? `/api/voitures/${voiture?.id}` : '/api/voitures'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(isEdit ? 'Voiture modifiée !' : 'Voiture ajoutée !')
        router.push('/admin/voitures')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Erreur lors de la sauvegarde')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => router.back()}
          className="w-10 h-10 bg-carbon-900 border border-carbon-800 rounded-xl flex items-center justify-center text-carbon-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-white font-display text-2xl font-bold">
            {isEdit ? `Modifier ${voiture?.marque} ${voiture?.modele}` : 'Ajouter une voiture'}
          </h1>
        </div>
        <button type="submit" disabled={saving}
          className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5 ml-auto">
          {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={15} />}
          {isEdit ? 'Enregistrer' : 'Publier'}
        </button>
      </div>

      {/* VIN */}
      <div className="bg-carbon-900 rounded-2xl p-5 border border-carbon-800">
        <div className="flex items-center gap-2 mb-3">
          <ScanLine size={16} className="text-gold-400" />
          <span className="text-white text-sm font-semibold">Remplir depuis le VIN</span>
          <span className="text-carbon-500 text-xs ml-1">17 caractères</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={17}
            className="input-gold flex-1 text-sm font-mono uppercase tracking-widest"
            placeholder="Ex : WBA3A5C50DF356711"
            value={decodeQuery}
            onChange={e => setDecodeQuery(e.target.value.replace(/[^A-HJ-NPR-Za-hj-npr-z0-9]/g, '').toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleDecode())}
          />
          <button
            type="button"
            onClick={handleDecode}
            disabled={decoding || decodeQuery.length !== 17}
            className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-50"
          >
            {decoding
              ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              : <ScanLine size={15} />}
            {decoding ? 'Recherche…' : 'Compléter'}
          </button>
        </div>
        {decodedFields.length > 0 && (
          <div className="flex items-center gap-2 mt-3 text-emerald-400 text-xs">
            <CheckCircle2 size={13} />
            <span>Rempli automatiquement : {decodedFields.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identité */}
          <div className="bg-carbon-900 rounded-2xl p-6 border border-carbon-800">
            <h2 className="text-white font-semibold mb-5">Identification</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Marque *</label>
                <select className="select-gold" required value={form.marque} onChange={e => setForm(f => ({ ...f, marque: e.target.value }))}>
                  <option value="">Sélectionner</option>
                  {MARQUES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Modèle *</label>
                <input className="input-gold" required placeholder="Ex: X5 xDrive40i" value={form.modele}
                  onChange={e => setForm(f => ({ ...f, modele: e.target.value }))} />
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Année *</label>
                <input type="number" className="input-gold" required min="1990" max="2030" value={form.annee}
                  onChange={e => setForm(f => ({ ...f, annee: e.target.value }))} />
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Couleur</label>
                <input className="input-gold" placeholder="Ex: Noir Obsidien" value={form.couleur}
                  onChange={e => setForm(f => ({ ...f, couleur: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Mécanique */}
          <div className="bg-carbon-900 rounded-2xl p-6 border border-carbon-800">
            <h2 className="text-white font-semibold mb-5">Caractéristiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Carburant *</label>
                <select className="select-gold" value={form.carburant} onChange={e => setForm(f => ({ ...f, carburant: e.target.value as any }))}>
                  {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Boîte *</label>
                <select className="select-gold" value={form.boite} onChange={e => setForm(f => ({ ...f, boite: e.target.value as any }))}>
                  {BOITES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Kilométrage (km) *</label>
                <input type="number" className="input-gold" min="0" value={form.kilometrage}
                  onChange={e => setForm(f => ({ ...f, kilometrage: e.target.value }))} />
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Puissance (ch)</label>
                <input type="number" className="input-gold" min="50" max="2000" placeholder="Ex: 340" value={form.puissance}
                  onChange={e => setForm(f => ({ ...f, puissance: e.target.value }))} />
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Nombre de portes</label>
                <select className="select-gold" value={form.nb_portes} onChange={e => setForm(f => ({ ...f, nb_portes: e.target.value }))}>
                  {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-carbon-400 text-xs mb-1.5 block">Nombre de places</label>
                <select className="select-gold" value={form.nb_places} onChange={e => setForm(f => ({ ...f, nb_places: e.target.value }))}>
                  {[2,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-carbon-900 rounded-2xl p-6 border border-carbon-800">
            <h2 className="text-white font-semibold mb-5">Description</h2>
            <textarea className="input-gold resize-none" rows={5}
              placeholder="Décrivez le véhicule : équipements, état, historique, options..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Photos */}
          <div className="bg-carbon-900 rounded-2xl p-6 border border-carbon-800">
            <h2 className="text-white font-semibold mb-5">Photos</h2>

            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                uploading ? 'border-gold-500/50 bg-gold-500/5' : 'border-carbon-700 hover:border-carbon-600 hover:bg-carbon-800/50'
              }`}>
                {uploading
                  ? <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  : <Upload size={24} className="mx-auto mb-2 text-carbon-500" />}
                <p className="text-carbon-400 text-sm">
                  {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}
                </p>
                <p className="text-carbon-600 text-xs mt-1">JPG, PNG, WEBP • Plusieurs fichiers acceptés</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={e => e.target.files && handleUpload(e.target.files)} />
            </label>

            {form.photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {form.photos.map((photo, i) => (
                  <div key={i} className="relative group aspect-video">
                    <img src={photo} alt="" className="w-full h-full object-cover rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%231a1a1a' width='100%25' height='100%25'/%3E%3Ctext fill='%23444' font-size='11' font-family='sans-serif' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EErreur%3C/text%3E%3C/svg%3E" }}
                    />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-gold-500 text-black text-xs px-1.5 py-0.5 rounded font-semibold">
                        Principale
                      </div>
                    )}
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Statut */}
          <div className="bg-carbon-900 rounded-2xl p-5 border border-carbon-800">
            <h2 className="text-white font-semibold mb-4">Statut</h2>
            <select className="select-gold" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value as any }))}>
              <option value="disponible">Disponible</option>
              <option value="réservé">Réservé</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>

          {/* Prix souhaité */}
          <div className="bg-carbon-900 rounded-2xl p-5 border border-carbon-800">
            <h2 className="text-white font-semibold mb-4">Prix souhaité</h2>
            <div className="space-y-4">
              <PrixInput
                label="Prix HT (€)"
                placeholder="Ex: 37,500"
                value={form.prix_ht}
                onChange={v => setForm(f => ({ ...f, prix_ht: v }))}
              />
              <PrixInput
                label="Prix TTC (€) *"
                placeholder="Ex: 45,000"
                required
                value={form.prix_ttc}
                onChange={v => setForm(f => ({ ...f, prix_ttc: v }))}
                hint={form.prix_ht ? (
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, prix_ttc: ((parsePrix(f.prix_ht) ?? 0) * 1.2).toFixed(0) }))}
                    className="text-gold-500 text-xs hover:text-gold-400 transition-colors">
                    Calculer TTC (×1.20)
                  </button>
                ) : undefined}
              />
            </div>
          </div>

          {/* Type de vente */}
          <div className="bg-carbon-900 rounded-2xl p-5 border border-carbon-800">
            <h2 className="text-white font-semibold mb-4">Type de vente *</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {([['export', '🌍', 'Export Maghreb'], ['local', '🇫🇷', 'Vente locale France']] as [string, string, string][]).map(([val, flag, label]) => {
                const active = form.type_vente.split(',').includes(val)
                return (
                  <label key={val} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer border transition-all text-center ${
                    active ? 'bg-gold-500/10 border-gold-500/30 text-white' : 'border-carbon-800 text-carbon-400 hover:border-carbon-700'
                  }`}>
                    <input type="checkbox" className="sr-only" checked={active} onChange={() => toggleTypeVente(val)} />
                    <span className="text-2xl">{flag}</span>
                    <span className="text-xs font-medium">{label}</span>
                    {active && <span className="text-gold-400 text-xs">✓</span>}
                  </label>
                )
              })}
            </div>

            {form.type_vente.split(',').includes('export') && (
              <div className="space-y-2">
                {[['🇹🇳', 'Tunisie'], ['🇩🇿', 'Algérie'], ['🇲🇦', 'Maroc']].map(([flag, pays]) => (
                  <label key={pays} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    form.pays_destination.includes(pays)
                      ? 'bg-gold-500/10 border-gold-500/30 text-white'
                      : 'border-carbon-800 text-carbon-400 hover:border-carbon-700'
                  }`}>
                    <input type="checkbox" className="sr-only" checked={form.pays_destination.includes(pays)}
                      onChange={() => togglePays(pays)} />
                    <span className="text-xl">{flag}</span>
                    <span className="text-sm font-medium">{pays}</span>
                    {form.pays_destination.includes(pays) && <span className="ml-auto text-gold-400">✓</span>}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
