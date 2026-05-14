import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const res = await db.execute('SELECT key, value FROM settings')
    const settings: Record<string, string> = {}
    res.rows.forEach(r => { settings[r.key as string] = r.value as string })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const body = await request.json()
    for (const [key, value] of Object.entries(body)) {
      await db.execute({
        sql: 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
        args: [key, String(value)]
      })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
