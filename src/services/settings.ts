import { supabase } from '@/lib/supabase'
import type { SiteSettings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()
  return (data as SiteSettings) ?? DEFAULT_SETTINGS
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })
  if (error) throw error
}
