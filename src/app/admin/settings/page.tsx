export const dynamic = 'force-dynamic'

import { Settings } from 'lucide-react'
import { getSettings } from '@/services/settings'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
          <Settings size={18} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Paramètres du site</h1>
          <p className="text-sm text-slate-500">Modifiez les textes et informations affichés sur la vitrine publique</p>
        </div>
      </div>
      <SettingsForm initial={settings} />
    </div>
  )
}
