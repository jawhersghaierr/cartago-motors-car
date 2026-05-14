import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    const db = getDb()
    const res = await db.execute("SELECT * FROM temoignages ORDER BY created_at DESC")
    return NextResponse.json({ temoignages: res.rows })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const { nom, pays, texte, note, statut } = await request.json()
    if (!nom || !pays || !texte) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const result = await db.execute({
      sql: 'INSERT INTO temoignages (nom, pays, texte, note, statut) VALUES (?, ?, ?, ?, ?)',
      args: [nom, pays, texte, note || 5, statut || 'visible']
    })
    return NextResponse.json({ id: Number(result.lastInsertRowid) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
