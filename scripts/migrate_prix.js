const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'autoexport.db')}` })

async function migrate() {
  // Add prix_ht and prix_ttc columns if they don't exist
  try { await db.execute('ALTER TABLE voitures ADD COLUMN prix_ht REAL') } catch {}
  try { await db.execute('ALTER TABLE voitures ADD COLUMN prix_ttc REAL') } catch {}

  // Copy existing prix → prix_ttc for rows that don't have it yet
  await db.execute('UPDATE voitures SET prix_ttc = prix WHERE prix_ttc IS NULL AND prix IS NOT NULL')

  const result = await db.execute('SELECT COUNT(*) as c FROM voitures WHERE prix_ttc IS NOT NULL')
  console.log(`✅ Migration terminée — ${result.rows[0].c} véhicule(s) mis à jour`)
}

migrate().catch(console.error).finally(() => process.exit(0))
