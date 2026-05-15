/**
 * Server-side translation utility using the free Google Translate endpoint.
 * Results are cached by Next.js fetch for 1 hour.
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = 'fr',
): Promise<string> {
  if (!text?.trim() || targetLang === sourceLang) return text
  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return text
    const data = await res.json()
    return (data[0] as [string][]).map((c) => c[0]).join('')
  } catch {
    return text
  }
}

// Locale → Google Translate language code
export const LOCALE_TO_LANG: Record<string, string> = {
  fr: 'fr',
  en: 'en',
  ar: 'ar',
}

// Fixed-value translations for fuel & transmission stored as French in DB
export const FUEL_LABELS: Record<string, Record<string, string>> = {
  fr: { Essence: 'Essence', Diesel: 'Diesel', Hybride: 'Hybride', 'Électrique': 'Électrique', GPL: 'GPL' },
  en: { Essence: 'Petrol', Diesel: 'Diesel', Hybride: 'Hybrid', 'Électrique': 'Electric', GPL: 'LPG' },
  ar: { Essence: 'بنزين', Diesel: 'ديزل', Hybride: 'هجين', 'Électrique': 'كهربائي', GPL: 'غاز' },
}

export const TRANSMISSION_LABELS: Record<string, Record<string, string>> = {
  fr: { Manuelle: 'Manuelle', Automatique: 'Automatique', 'Semi-automatique': 'Semi-automatique' },
  en: { Manuelle: 'Manual', Automatique: 'Automatic', 'Semi-automatique': 'Semi-automatic' },
  ar: { Manuelle: 'يدوي', Automatique: 'أوتوماتيك', 'Semi-automatique': 'نصف أوتوماتيك' },
}
