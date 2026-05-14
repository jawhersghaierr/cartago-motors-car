import { NextRequest, NextResponse } from 'next/server'

const NHTSA_API = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin'

const FUEL_MAP: Record<string, string> = {
  Gasoline: 'Essence',
  Diesel: 'Diesel',
  Electric: 'Électrique',
  Hybrid: 'Hybride',
  'Plug-In Hybrid': 'Hybride',
  'Flexible Fuel Vehicle (FFV)': 'Essence',
  'Natural Gas': 'GPL',
  'Liquefied Petroleum Gas (LPG)': 'GPL',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get('vin')?.trim().toUpperCase()

  if (!vin || vin.length !== 17) {
    return NextResponse.json({ error: 'VIN invalide (17 caractères requis)' }, { status: 400 })
  }

  try {
    const res = await fetch(`${NHTSA_API}/${vin}?format=json`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'API NHTSA indisponible' }, { status: 502 })
    }

    const data = await res.json()
    const results: Array<{ Variable: string; Value: string | null }> = data.Results ?? []

    const get = (variable: string): string | null => {
      const val = results.find(r => r.Variable === variable)?.Value
      return val && val !== 'Not Applicable' && val !== '0' && val.trim() !== ''
        ? val.trim()
        : null
    }

    const yearRaw = get('Model Year')
    const year = yearRaw ? parseInt(yearRaw, 10) : null
    const fuelRaw = get('Fuel Type - Primary')
    const transmissionRaw = get('Transmission Style')

    let transmission: string | null = null
    if (transmissionRaw) {
      const t = transmissionRaw.toLowerCase()
      if (t.includes('automatic')) transmission = 'Automatique'
      else if (t.includes('manual')) transmission = 'Manuelle'
    }

    return NextResponse.json({
      brand: get('Make'),
      model: get('Model'),
      year: year && !isNaN(year) ? year : null,
      fuel: fuelRaw ? (FUEL_MAP[fuelRaw] ?? null) : null,
      engine: get('Engine Model') ?? get('Displacement (L)'),
      transmission,
    })
  } catch (error) {
    console.error('[GET /api/vin]', error)
    return NextResponse.json({ error: 'Erreur lors du décodage VIN' }, { status: 500 })
  }
}
