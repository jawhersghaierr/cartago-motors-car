import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { getCars, createCar } from '@/services/cars'
import { createCarSchema } from '@/validators/car'

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '15')))

    const result = await getCars({ search, status, page, limit })
    return NextResponse.json({ ...result, page, limit })
  } catch (error) {
    console.error('[GET /api/cars]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const parsed = createCarSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const car = await createCar(parsed.data)
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('[POST /api/cars]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
