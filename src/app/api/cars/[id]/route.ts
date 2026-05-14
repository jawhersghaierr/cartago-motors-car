import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { getCarById, updateCar, deleteCar } from '@/services/cars'
import { updateCarSchema } from '@/validators/car'

type Params = { params: { id: string } }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const car = await getCarById(params.id)
    return NextResponse.json(car)
  } catch {
    return NextResponse.json({ error: 'Voiture introuvable' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await request.json()
    const parsed = updateCarSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const car = await updateCar(params.id, parsed.data)
    return NextResponse.json(car)
  } catch (error) {
    console.error('[PUT /api/cars/:id]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    await deleteCar(params.id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/cars/:id]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
