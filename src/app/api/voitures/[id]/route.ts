import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const res = await db.execute({ sql: 'SELECT * FROM voitures WHERE id = ?', args: [params.id] })
    const voiture = res.rows[0] as any
    if (!voiture) return NextResponse.json({ error: 'Voiture non trouvée' }, { status: 404 })
    return NextResponse.json({ ...voiture, photos: JSON.parse(voiture.photos || '[]') })
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const body = await request.json()
    const { marque, modele, annee, prix_achat, prix_souhaite, prix_ht, prix_ttc, kilometrage, carburant, boite, couleur, puissance, nb_portes, nb_places, type_vente, pays_destination, description, statut, photos } = body
    await db.execute({
      sql: `UPDATE voitures SET marque=?, modele=?, annee=?, prix=?, prix_achat=?, prix_souhaite=?, prix_ht=?, prix_ttc=?, kilometrage=?, carburant=?, boite=?, couleur=?, puissance=?, nb_portes=?, nb_places=?, type_vente=?, pays_destination=?, description=?, statut=?, photos=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      args: [marque, modele, annee, prix_ttc, prix_achat || null, prix_souhaite || null, prix_ht || null, prix_ttc, kilometrage, carburant, boite, couleur || null, puissance || null, nb_portes, nb_places, type_vente || 'export', pays_destination, description || null, statut, JSON.stringify(photos || []), params.id]
    })
    const v = (await db.execute({ sql: 'SELECT * FROM voitures WHERE id = ?', args: [params.id] })).rows[0] as any
    return NextResponse.json({ ...v, photos: JSON.parse(v.photos || '[]') })
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    await db.execute({ sql: 'DELETE FROM voitures WHERE id = ?', args: [params.id] })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
