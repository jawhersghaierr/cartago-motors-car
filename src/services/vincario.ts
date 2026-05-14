import { createHash } from 'crypto'

const API_BASE = 'https://api.vincario.com/3.2'
const OPERATION = 'decode'

// ---------- Types ----------

export interface VincarioDecodeItem {
  label: string
  value: string | null
  id?: number
}

export interface VincarioApiResponse {
  vin: string
  decode: VincarioDecodeItem[]
  make_logo?: string
  balance?: {
    API_calls_made?: number
    API_calls_remaining?: number
  }
}

export interface VincarioResult {
  vin: string
  make: string | null
  model: string | null
  modelYear: number | null
  fuelType: string | null
  engine: string | null
  transmission: string | null
  body: string | null
  plantCountry: string | null
  makeLogo: string | null
  raw: VincarioDecodeItem[]
}

// ---------- Utilities ----------

export function getDecodeValue(items: VincarioDecodeItem[], label: string): string | null {
  const item = items.find(i => i.label.toLowerCase() === label.toLowerCase())
  const val = item?.value
  return val && val.trim() !== '' ? val.trim() : null
}

export function buildControlSum(vin: string, apiKey: string, secretKey: string): string {
  const input = `${vin}|${OPERATION}|${apiKey}|${secretKey}`
  return createHash('sha1').update(input).digest('hex').substring(0, 10)
}

// ---------- Mappings ----------

const FUEL_MAP: Record<string, string> = {
  Gasoline: 'Essence',
  Petrol: 'Essence',
  Diesel: 'Diesel',
  Electric: 'Électrique',
  Hybrid: 'Hybride',
  'Plug-In Hybrid': 'Hybride',
  LPG: 'GPL',
  CNG: 'GPL',
  Hydrogen: 'Hydrogène',
}

function mapFuel(raw: string | null): string | null {
  if (!raw) return null
  return FUEL_MAP[raw] ?? raw
}

function mapTransmission(raw: string | null): string | null {
  if (!raw) return null
  const t = raw.toLowerCase()
  if (t.includes('automatic')) return 'Automatique'
  if (t.includes('manual')) return 'Manuelle'
  return raw
}

// ---------- Main ----------

export async function decodeVin(vin: string): Promise<VincarioResult> {
  if (!vin || vin.trim() === '') {
    throw new Error('VIN manquant')
  }

  const apiKey = process.env.VINCARIO_API_KEY
  const secretKey = process.env.VINCARIO_SECRET_KEY

  if (!apiKey || !secretKey) {
    throw new Error('VINCARIO_API_KEY ou VINCARIO_SECRET_KEY non configurés')
  }

  const cleanVin = vin.trim().toUpperCase()
  const controlSum = buildControlSum(cleanVin, apiKey, secretKey)
  const url = `${API_BASE}/${apiKey}/${controlSum}/${OPERATION}/${cleanVin}.json`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    if (res.status === 402) throw new Error('Quota Vincario épuisé')
    if (res.status === 404) throw new Error('VIN non reconnu par Vincario')
    throw new Error(`Vincario API erreur HTTP ${res.status}`)
  }

  const data: VincarioApiResponse = await res.json()

  if (!data.decode || !Array.isArray(data.decode)) {
    throw new Error('Réponse Vincario invalide — champ decode manquant')
  }

  const get = (label: string) => getDecodeValue(data.decode, label)

  const yearRaw = get('Model Year')
  const parsedYear = yearRaw ? parseInt(yearRaw, 10) : null

  return {
    vin: data.vin ?? cleanVin,
    make: get('Make'),
    model: get('Model'),
    modelYear: parsedYear && !isNaN(parsedYear) ? parsedYear : null,
    fuelType: mapFuel(get('Fuel Type - Primary') ?? get('Fuel Type')),
    engine: get('Engine Model') ?? get('Displacement (L)') ?? get('Engine'),
    transmission: mapTransmission(get('Transmission Style') ?? get('Transmission')),
    body: get('Body Class') ?? get('Body Style'),
    plantCountry: get('Plant Country'),
    makeLogo: data.make_logo ?? null,
    raw: data.decode,
  }
}
