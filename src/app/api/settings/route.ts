import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { getSettings, updateSettings } from '@/services/settings'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  await updateSettings(body)
  return NextResponse.json({ success: true })
}
