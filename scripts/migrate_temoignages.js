const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'autoexport.db')}` })

async function migrate() {
  await db.execute(`CREATE TABLE IF NOT EXISTS temoignages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    pays TEXT NOT NULL,
    texte TEXT NOT NULL,
    note INTEGER NOT NULL DEFAULT 5,
    statut TEXT NOT NULL DEFAULT 'visible',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
  console.log('✅ Table temoignages créée')
}

migrate().catch(console.error).finally(() => process.exit(0))
