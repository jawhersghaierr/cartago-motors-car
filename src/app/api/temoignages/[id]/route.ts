import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const { nom, pays, texte, note, statut } = await request.json()
    await db.execute({
      sql: 'UPDATE temoignages SET nom=?, pays=?, texte=?, note=?, statut=? WHERE id=?',
      args: [nom, pays, texte, note, statut, params.id]
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    await db.execute({ sql: 'DELETE FROM temoignages WHERE id=?', args: [params.id] })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
