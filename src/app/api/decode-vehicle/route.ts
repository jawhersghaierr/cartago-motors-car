import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

function mapCarburant(fuel: string): string | null {
  const t = (fuel || '').toLowerCase()
  if (t.includes('electric')) return 'Électrique'
  if (t.includes('diesel')) return 'Diesel'
  if (t.includes('hybrid')) return 'Hybride'
  if (t.includes('gasoline') || t.includes('petrol') || t.includes('gas')) return 'Essence'
  if (t.includes('lpg') || t.includes('gpl') || t.includes('liquefied')) return 'GPL'
  return null
}

function mapBoite(trans: string): string | null {
  const t = (trans || '').toLowerCase()
  if (t.includes('manual')) return 'Manuelle'
  if (t.includes('cvt') || t.includes('automatic') || t.includes('dct') || t.includes('dsg')) return 'Automatique'
  if (t.includes('semi')) return 'Semi-automatique'
  return null
}

const BRAND_MAP: Record<string, string> = {
  'VOLKSWAGEN': 'Volkswagen', 'MERCEDES-BENZ': 'Mercedes-Benz', 'MERCEDES BENZ': 'Mercedes-Benz',
  'BMW': 'BMW', 'AUDI': 'Audi', 'FORD': 'Ford', 'HONDA': 'Honda', 'HYUNDAI': 'Hyundai',
  'KIA': 'Kia', 'LEXUS': 'Lexus', 'MAZDA': 'Mazda', 'MITSUBISHI': 'Mitsubishi',
  'NISSAN': 'Nissan', 'PEUGEOT': 'Peugeot', 'PORSCHE': 'Porsche', 'RENAULT': 'Renault',
  'SEAT': 'Seat', 'SKODA': 'Skoda', 'SUBARU': 'Subaru', 'SUZUKI': 'Suzuki',
  'TESLA': 'Tesla', 'TOYOTA': 'Toyota', 'VOLVO': 'Volvo',
  'LAND ROVER': 'Range Rover', 'RANGE ROVER': 'Range Rover',
  'CITROEN': 'Peugeot', 'CITROËN': 'Peugeot', 'DACIA': 'Renault',
}

function normalizeBrand(make: string): string {
  const upper = (make || '').toUpperCase().trim()
  return BRAND_MAP[upper] || (make.charAt(0).toUpperCase() + make.slice(1).toLowerCase())
}

const VIN_YEAR: Record<string, number> = {
  'A':2010,'B':2011,'C':2012,'D':2013,'E':2014,'F':2015,'G':2016,'H':2017,
  'J':2018,'K':2019,'L':2020,'M':2021,'N':2022,'P':2023,'R':2024,'S':2025,'T':2026,
  '1':2001,'2':2002,'3':2003,'4':2004,'5':2005,'6':2006,'7':2007,'8':2008,'9':2009,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get('vin')?.trim().replace(/\s+/g, '').toUpperCase()

  if (!vin) return NextResponse.json({ error: 'VIN manquant' }, { status: 400 })
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return NextResponse.json({ error: 'VIN invalide — 17 caractères requis (sans I, O, Q)' }, { status: 400 })
  }

  const apiKey    = process.env.VIN_DECODER_API_KEY
  const secretKey = process.env.VIN_DECODER_SECRET_KEY
  if (!apiKey || !secretKey) {
    return NextResponse.json({ error: 'Clés API Vincario manquantes' }, { status: 500 })
  }

  try {
    // Vincario auth : control = SHA1("{vin}|{secret_key}") — 10 premiers caractères
    const control = createHash('sha1')
      .update(`${vin}|${secretKey}`)
      .digest('hex')
      .substring(0, 10)

    const res = await fetch(
      `https://api.vincario.com/v1/decode/${vin}?id=${apiKey}&control=${control}`,
      { cache: 'no-store', headers: { Accept: 'application/json' } }
    )

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Vincario ${res.status}${body ? ' — ' + body.slice(0, 150) : ''}`)
    }

    const data = await res.json()

    // Vincario retourne { decode: [{label, value}, ...] }
    const fields: { label: string; value: string }[] = data.decode ?? []
    if (!fields.length) throw new Error('VIN non trouvé dans la base Vincario')

    const get = (label: string) =>
      fields.find(f => f.label?.toLowerCase() === label.toLowerCase())?.value ?? null

    const make    = get('Make')
    const model   = get('Model')
    const yearStr = get('Model Year')
    const year    = yearStr ? parseInt(yearStr) : (VIN_YEAR[vin[9]] ?? null)
    const kwStr   = get('Engine Power (kW)') ?? get('Engine power (kW)')
    const kw      = kwStr ? parseFloat(kwStr) : 0

    return NextResponse.json({
      marque:    make  ? normalizeBrand(make)  : null,
      modele:    model || null,
      annee:     year,
      carburant: mapCarburant(get('Fuel Type - Primary') ?? get('Fuel Type') ?? ''),
      boite:     mapBoite(get('Transmission') ?? ''),
      nb_portes: (() => { const v = get('Number of Doors') ?? get('Doors'); return v ? parseInt(v) || null : null })(),
      nb_places: (() => { const v = get('Number of Seats') ?? get('Seats'); return v ? parseInt(v) || null : null })(),
      puissance: kw > 0 ? Math.round(kw * 1.341) : null,
    })
  } catch (error: any) {
    const cause = error?.cause?.message || error?.cause?.code || ''
    return NextResponse.json({ error: `${error.message}${cause ? ' — ' + cause : ''}` }, { status: 400 })
  }
}
