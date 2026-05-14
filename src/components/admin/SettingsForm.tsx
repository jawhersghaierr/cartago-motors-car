'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/types/settings'
import LogoUpload from '@/components/admin/LogoUpload'

interface Props {
  initial: SiteSettings
}

export default function SettingsForm({ initial }: Props) {
  const [values, setValues] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)

  function set(key: keyof SiteSettings, value: string) {
    setValues(v => ({ ...v, [key]: value || null }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      toast.success('Paramètres sauvegardés')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const textareaCls = `${inputCls} resize-none`
  const labelCls = 'block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

      {/* Section Logo */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
          Logo
        </h2>
        <LogoUpload
          value={values.logo_url ?? null}
          onChange={url => setValues(v => ({ ...v, logo_url: url }))}
        />
      </section>

      {/* Section Vitrine */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
          Vitrine publique
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nom de la société</label>
            <input
              className={inputCls}
              value={values.company_name}
              onChange={e => set('company_name', e.target.value)}
              placeholder="Cartago Motors"
            />
          </div>
          <div>
            <label className={labelCls}>Accroche (petite ligne au-dessus du titre)</label>
            <input
              className={inputCls}
              value={values.hero_tagline}
              onChange={e => set('hero_tagline', e.target.value)}
              placeholder="Spécialiste export automobile"
            />
          </div>
          <div>
            <label className={labelCls}>Titre principal du hero</label>
            <input
              className={inputCls}
              value={values.hero_title}
              onChange={e => set('hero_title', e.target.value)}
              placeholder="Voitures Premium pour l'export"
            />
          </div>
          <div>
            <label className={labelCls}>Description hero</label>
            <textarea
              className={textareaCls}
              rows={3}
              value={values.hero_description}
              onChange={e => set('hero_description', e.target.value)}
              placeholder="Sélection rigoureuse de véhicules haut de gamme…"
            />
          </div>
          <div>
            <label className={labelCls}>Texte « À propos » (footer / présentation)</label>
            <textarea
              className={textareaCls}
              rows={3}
              value={values.about_text ?? ''}
              onChange={e => set('about_text', e.target.value)}
              placeholder="Spécialiste de l'export automobile vers le Maghreb depuis…"
            />
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
          Informations de contact
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Téléphone</label>
              <input
                className={inputCls}
                value={values.phone ?? ''}
                onChange={e => set('phone', e.target.value)}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input
                className={inputCls}
                value={values.whatsapp ?? ''}
                onChange={e => set('whatsapp', e.target.value)}
                placeholder="+33 6 00 00 00 00"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              className={inputCls}
              value={values.email ?? ''}
              onChange={e => set('email', e.target.value)}
              placeholder="contact@cartagomotors.com"
            />
          </div>
          <div>
            <label className={labelCls}>Adresse</label>
            <input
              className={inputCls}
              value={values.address ?? ''}
              onChange={e => set('address', e.target.value)}
              placeholder="12 rue des Voitures, 75001 Paris"
            />
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
          Statistiques (page d'accueil)
        </h2>
        <p className="text-xs text-slate-400 mb-4">Les véhicules disponibles et exportés sont calculés automatiquement. Renseignez les deux autres ici.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Pays desservis</label>
            <input
              className={inputCls}
              value={values.stat_pays ?? ''}
              onChange={e => set('stat_pays', e.target.value)}
              placeholder="ex : 3"
            />
          </div>
          <div>
            <label className={labelCls}>Clients satisfaits</label>
            <input
              className={inputCls}
              value={values.stat_clients ?? ''}
              onChange={e => set('stat_clients', e.target.value)}
              placeholder="ex : 200+"
            />
          </div>
        </div>
      </section>

      {/* Section Réseaux sociaux */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-5 pb-3 border-b border-slate-100">
          Réseaux sociaux
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Facebook</label>
            <input
              className={inputCls}
              value={values.facebook_url ?? ''}
              onChange={e => set('facebook_url', e.target.value)}
              placeholder="https://facebook.com/cartagomotors"
            />
          </div>
          <div>
            <label className={labelCls}>Instagram</label>
            <input
              className={inputCls}
              value={values.instagram_url ?? ''}
              onChange={e => set('instagram_url', e.target.value)}
              placeholder="https://instagram.com/cartagomotors"
            />
          </div>
          <div>
            <label className={labelCls}>TikTok</label>
            <input
              className={inputCls}
              value={values.tiktok_url ?? ''}
              onChange={e => set('tiktok_url', e.target.value)}
              placeholder="https://tiktok.com/@cartagomotors"
            />
          </div>
        </div>
      </section>

      <Button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white"
      >
        <Save size={16} />
        {saving ? 'Sauvegarde…' : 'Sauvegarder les paramètres'}
      </Button>
    </form>
  )
}
