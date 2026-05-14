import { supabase } from '@/lib/supabase'

export const STORAGE_BUCKET = 'car-images'

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const urlObj = new URL(url)
    const marker = `/object/public/${STORAGE_BUCKET}/`
    const parts = urlObj.pathname.split(marker)
    if (parts.length < 2) return
    const path = decodeURIComponent(parts[1])
    await supabase.storage.from(STORAGE_BUCKET).remove([path])
  } catch {
    // Non-blocking deletion
  }
}

export async function deleteImagesByUrls(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.map(deleteImageByUrl))
}
