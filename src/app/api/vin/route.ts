import { NextRequest, NextResponse } from 'next/server'
import { decodeVin } from '@/services/vincario'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get('vin')?.trim().toUpperCase()

  if (!vin || vin.length !== 17) {
    return NextResponse.json({ error: 'VIN invalide (17 caractères requis)' }, { status: 400 })
  }

  try {
    const result = await decodeVin(vin)

    // Shape identique à l'ancienne route NHTSA pour la compatibilité avec CarForm
    return NextResponse.json({
      brand: result.make,
      model: result.model,
      year: result.modelYear,
      fuel: result.fuelType,
      engine: result.engine,
      transmission: result.transmission,
      makeLogo: result.makeLogo,
    })
  } catch (error) {
    console.error('[GET /api/vin]', error)
    const message = error instanceof Error ? error.message : 'Erreur lors du décodage VIN'
    const status = message.includes('manquant') ? 400
      : message.includes('non reconnu') ? 404
      : message.includes('Quota') ? 402
      : 502
    return NextResponse.json({ error: message }, { status })
  }
}
