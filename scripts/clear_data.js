const { createClient } = require('@libsql/client')
const path = require('path')

const db = createClient({ url: `file:${path.join(process.cwd(), 'data', 'autoexport.db')}` })

async function clear() {
  await db.execute('DELETE FROM voitures')
  await db.execute('DELETE FROM clients')
  await db.execute('DELETE FROM fournisseurs')
  await db.execute({ sql: "DELETE FROM sqlite_sequence WHERE name = 'voitures'" })
  await db.execute({ sql: "DELETE FROM sqlite_sequence WHERE name = 'clients'" })
  await db.execute({ sql: "DELETE FROM sqlite_sequence WHERE name = 'fournisseurs'" })
  console.log('✅ Toutes les données supprimées, compteurs remis à zéro')
}

clear().catch(console.error).finally(() => process.exit(0))
