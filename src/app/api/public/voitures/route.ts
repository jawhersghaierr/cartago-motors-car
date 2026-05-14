import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    if (!idsParam) return NextResponse.json([])

    const ids = idsParam.split(',').map(Number).filter(n => !isNaN(n) && n > 0)
    if (!ids.length) return NextResponse.json([])

    const db = getDb()
    const placeholders = ids.map(() => '?').join(',')
    const res = await db.execute({
      sql: `SELECT id, marque, modele, annee, couleur, carburant, boite, kilometrage,
        puissance, prix_ht, prix_ttc, statut, type_vente, pays_destination, photos
        FROM voitures WHERE id IN (${placeholders})`,
      args: ids,
    })

    const rows = res.rows.map(r => ({
      ...r,
      photos: r.photos ? JSON.parse(r.photos as string) : [],
    }))

    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
