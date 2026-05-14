import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const { searchParams } = new URL(request.url)
    const marque = searchParams.get('marque')
    const carburant = searchParams.get('carburant')
    const boite = searchParams.get('boite')
    const pays = searchParams.get('pays')
    const statut = searchParams.get('statut')
    const type_vente = searchParams.get('type_vente')
    const minPrix = searchParams.get('minPrix')
    const maxPrix = searchParams.get('maxPrix')
    const maxKm = searchParams.get('maxKm')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let where = 'WHERE 1=1'
    const args: any[] = []
    if (marque) { where += ' AND marque = ?'; args.push(marque) }
    if (carburant) { where += ' AND carburant = ?'; args.push(carburant) }
    if (boite) { where += ' AND boite = ?'; args.push(boite) }
    if (pays) { where += ' AND pays_destination LIKE ?'; args.push(`%${pays}%`) }
    if (statut) { where += ' AND statut = ?'; args.push(statut) }
    if (type_vente) { where += ' AND type_vente = ?'; args.push(type_vente) }
    if (minPrix) { where += ' AND prix_ttc >= ?'; args.push(parseFloat(minPrix)) }
    if (maxPrix) { where += ' AND prix_ttc <= ?'; args.push(parseFloat(maxPrix)) }
    if (maxKm) { where += ' AND kilometrage <= ?'; args.push(parseInt(maxKm)) }

    const countRes = await db.execute({ sql: `SELECT COUNT(*) as total FROM voitures ${where}`, args })
    const total = Number(countRes.rows[0].total)

    const voituresRes = await db.execute({
      sql: `SELECT * FROM voitures ${where} ORDER BY CASE statut WHEN 'disponible' THEN 1 WHEN 'réservé' THEN 2 WHEN 'vendu' THEN 3 ELSE 4 END, created_at DESC LIMIT ? OFFSET ?`,
      args: [...args, limit, offset]
    })

    const voitures = voituresRes.rows.map((v: any) => ({ ...v, photos: JSON.parse(v.photos || '[]') }))
    return NextResponse.json({ voitures, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('GET voitures error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const db = getDb()
    const body = await request.json()
    const { marque, modele, annee, prix_achat, prix_souhaite, prix_ht, prix_ttc, kilometrage, carburant, boite, couleur, puissance, nb_portes, nb_places, type_vente, pays_destination, description, statut, photos } = body
    if (!marque || !modele || !annee || !prix_ttc || !carburant || !boite || !pays_destination) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const result = await db.execute({
      sql: `INSERT INTO voitures (marque, modele, annee, prix, prix_achat, prix_souhaite, prix_ht, prix_ttc, kilometrage, carburant, boite, couleur, puissance, nb_portes, nb_places, type_vente, pays_destination, description, statut, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [marque, modele, annee, prix_ttc, prix_achat || null, prix_souhaite || null, prix_ht || null, prix_ttc, kilometrage || 0, carburant, boite, couleur || null, puissance || null, nb_portes || 4, nb_places || 5, type_vente || 'export', pays_destination, description || null, statut || 'disponible', JSON.stringify(photos || [])]
    })
    const voiture = (await db.execute({ sql: 'SELECT * FROM voitures WHERE id = ?', args: [Number(result.lastInsertRowid)] })).rows[0] as any
    return NextResponse.json({ ...voiture, photos: JSON.parse(voiture.photos || '[]') }, { status: 201 })
  } catch (error) {
    console.error('POST voiture error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
