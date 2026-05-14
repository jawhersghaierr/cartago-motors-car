const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'autoexport.db')}` })

async function migrate() {
  try { await db.execute('ALTER TABLE voitures ADD COLUMN prix_vente REAL') } catch {}
  try { await db.execute('ALTER TABLE voitures ADD COLUMN client_vendu_id INTEGER') } catch {}
  console.log('✅ Migration vente terminée')
}

migrate().catch(console.error).finally(() => process.exit(0))
