const { createClient } = require('@libsql/client')
const path = require('path')
const fs = require('fs')

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, 'AutoExport.db')
const db = createClient({ url: `file:${dbPath}` })

async function init() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS fournisseurs (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, telephone TEXT, email TEXT, pays TEXT NOT NULL, ville TEXT, notes TEXT, statut TEXT DEFAULT 'actif', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS voitures (id INTEGER PRIMARY KEY AUTOINCREMENT, marque TEXT NOT NULL, modele TEXT NOT NULL, annee INTEGER NOT NULL, prix_ht REAL, prix_ttc REAL NOT NULL, kilometrage INTEGER NOT NULL, carburant TEXT NOT NULL, boite TEXT NOT NULL, couleur TEXT, puissance INTEGER, nb_portes INTEGER DEFAULT 4, nb_places INTEGER DEFAULT 5, type_vente TEXT NOT NULL DEFAULT 'export', pays_destination TEXT NOT NULL, description TEXT, statut TEXT NOT NULL DEFAULT 'disponible', prix_vente REAL, client_vendu_id INTEGER, photos TEXT DEFAULT '[]', fournisseur_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, telephone TEXT NOT NULL, email TEXT, pays TEXT NOT NULL, type_vente TEXT, voiture_id INTEGER, voiture_souhaitee TEXT, message TEXT, statut TEXT DEFAULT 'nouveau', notes_internes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE TABLE IF NOT EXISTS temoignages (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, pays TEXT NOT NULL, texte TEXT NOT NULL, note INTEGER NOT NULL DEFAULT 5, statut TEXT NOT NULL DEFAULT 'visible', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE INDEX IF NOT EXISTS idx_voitures_marque ON voitures(marque)`,
    `CREATE INDEX IF NOT EXISTS idx_voitures_statut ON voitures(statut)`,
    `CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut)`,
  ]
  for (const sql of statements) await db.execute(sql)
  console.log('✅ Base de données initialisée:', dbPath)
}
init().catch(console.error).finally(() => process.exit(0))
