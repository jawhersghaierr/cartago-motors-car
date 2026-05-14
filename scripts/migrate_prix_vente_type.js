const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'AutoExport.db')}` })

async function migrate() {
  await db.execute(`ALTER TABLE voitures ADD COLUMN vente_type_local INTEGER NOT NULL DEFAULT 0`)
  await db.execute(`ALTER TABLE voitures ADD COLUMN prix_vente_type TEXT NOT NULL DEFAULT 'ht'`)
  console.log('✅ Colonnes vente_type_local + prix_vente_type ajoutées')
}

migrate().catch(console.error).finally(() => process.exit(0))
