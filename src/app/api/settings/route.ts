import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { getSettings, updateSettings } from '@/services/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('[GET /api/settings]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthFromRequest(req)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body = await req.json()
    await updateSettings(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PUT /api/settings]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
