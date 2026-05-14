const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'autoexport.db')}` })

async function migrate() {
  try { await db.execute("ALTER TABLE voitures ADD COLUMN type_vente TEXT NOT NULL DEFAULT 'export'") } catch {}
  await db.execute("UPDATE voitures SET type_vente = 'export' WHERE type_vente IS NULL OR type_vente = ''")
  const result = await db.execute('SELECT COUNT(*) as c FROM voitures WHERE type_vente IS NOT NULL')
  console.log(`✅ Migration type_vente terminée — ${result.rows[0].c} véhicule(s) mis à jour`)
}

migrate().catch(console.error).finally(() => process.exit(0))
