const { createClient } = require('@libsql/client')
const bcrypt = require('bcryptjs')
const path = require('path')

const dbPath = path.join(process.cwd(), 'data', 'AutoExport.db')
const db = createClient({ url: `file:${dbPath}` })

async function seed() {
  // Admin
  const hashedPassword = bcrypt.hashSync('Admin@2024!', 12)
  await db.execute({ sql: `INSERT OR IGNORE INTO admins (username, password, name, email) VALUES (?, ?, ?, ?)`, args: ['admin', hashedPassword, 'Administrateur', 'admin@AutoExport.com'] })
  console.log('✅ Admin créé: admin / Admin@2024!')

  // Fournisseurs
  const fournisseurs = [
    ['AutoPremium France', '+33 6 12 34 56 78', 'contact@autopremium.fr', 'France', 'Paris', 'Partenaire principal, stock 50+ véhicules', 'actif'],
    ['Carmax Europe GmbH', '+49 30 123 456 78', 'export@carmax-eu.de', 'Allemagne', 'Munich', 'Spécialiste BMW, Mercedes, Audi', 'actif'],
    ['Italia Auto Export', '+39 02 123 456 78', 'info@italiauto.it', 'Italie', 'Milan', 'Ferrari, Maserati, Alfa Romeo', 'actif'],
    ['Benelux Motors', '+32 2 123 45 67', 'sales@beneluxmotors.be', 'Belgique', 'Bruxelles', 'Voitures japonaises et coréennes', 'actif'],
  ]
  for (const f of fournisseurs) {
    await db.execute({ sql: `INSERT OR IGNORE INTO fournisseurs (nom, telephone, email, pays, ville, notes, statut) VALUES (?, ?, ?, ?, ?, ?, ?)`, args: f })
  }
  console.log('✅ Fournisseurs créés')

  // Voitures
  const voitures = [
    ['BMW', 'X5 xDrive40i', 2022, 52000, 28000, 'Essence', 'Automatique', 'Blanc Alpin', 340, 5, 7, 'Tunisie,Algérie,Maroc', 'BMW X5 xDrive40i full options : toit panoramique, sièges chauffants, caméra 360°, Harman Kardon. Carnet entretien complet BMW.', 'disponible', '[]', 2],
    ['Mercedes-Benz', 'GLE 350d AMG Line', 2021, 58000, 45000, 'Diesel', 'Automatique', 'Noir Obsidien', 272, 5, 5, 'Maroc,Tunisie', 'Mercedes GLE AMG Line. MBUX, Airmatic, toit ouvrant, phares LED multibeam. Parfait état, jamais accidenté.', 'disponible', '[]', 1],
    ['Audi', 'Q7 S-line 45 TDI', 2022, 61000, 32000, 'Diesel', 'Automatique', 'Gris Nardo', 231, 5, 7, 'Algérie,Maroc', 'Audi Q7 S-line quattro 7 places. Bang & Olufsen, Virtual Cockpit Pro, Night Vision, suspension pneumatique.', 'disponible', '[]', 2],
    ['Volkswagen', 'Touareg R-Line', 2021, 42000, 51000, 'Diesel', 'Automatique', 'Argent Tungstène', 231, 5, 5, 'Tunisie,Algérie,Maroc', 'VW Touareg R-Line 3.0 TDI. Innovision Cockpit, Matrix LED, 4Motion, toit panoramique.', 'disponible', '[]', 4],
    ['Toyota', 'Land Cruiser 300 VXR', 2023, 89000, 15000, 'Essence', 'Automatique', 'Blanc Perlé', 415, 5, 7, 'Algérie,Tunisie', 'Toyota Land Cruiser 300 VXR finition ultime. GR Sport, suspension adaptative, Multi-Terrain Monitor.', 'disponible', '[]', 4],
    ['Porsche', 'Cayenne S E-Hybrid', 2022, 78000, 22000, 'Hybride', 'Automatique', 'Bleu Saphir', 462, 5, 5, 'Maroc', 'Porsche Cayenne S E-Hybrid. PASM, PDCC, Sport Chrono, Burmester 3D. Hybride rechargeable hautes performances.', 'disponible', '[]', 2],
    ['Range Rover', 'Sport HSE Dynamic', 2021, 71000, 38000, 'Diesel', 'Automatique', 'Vert British Racing', 300, 5, 5, 'Maroc,Tunisie', 'Range Rover Sport HSE Dynamic. Terrain Response 2, Meridian, toit panoramique double, sièges massants.', 'disponible', '[]', 1],
    ['Lexus', 'LX 600 F-Sport', 2023, 95000, 8000, 'Essence', 'Automatique', 'Noir Obsidien', 415, 5, 7, 'Algérie', 'Lexus LX 600 F-Sport quasi neuf. Écran 12.3", Mark Levinson 25HP, Multi-Terrain Select, Crawl Control.', 'disponible', '[]', 4],
    ['Volvo', 'XC90 Recharge T8', 2022, 55000, 29000, 'Hybride', 'Automatique', 'Blanc Crystal', 455, 5, 7, 'Tunisie,Maroc', 'Volvo XC90 Recharge T8 Inscription. Bowers & Wilkins, Air Quality System, Pilot Assist, 7 places.', 'disponible', '[]', 4],
    ['BMW', 'Série 7 740d xDrive', 2022, 68000, 18000, 'Diesel', 'Automatique', 'Bleu Tanzanite', 333, 4, 5, 'Maroc', 'BMW Série 7 prestige. Executive Lounge, Rear Entertainment, massage, Bowers & Wilkins Diamond.', 'réservé', '[]', 2],
    ['Mercedes-Benz', 'CLA 200 AMG', 2023, 34000, 12000, 'Essence', 'Automatique', 'Rouge Jupiter', 163, 4, 5, 'Tunisie,Algérie,Maroc', 'Mercedes CLA 200 AMG Line quasi neuf. MBUX AR Navigation, Ambient Light 64 couleurs, phares LED.', 'disponible', '[]', 1],
    ['Volkswagen', 'Golf 8 GTI', 2023, 28000, 5000, 'Essence', 'Manuelle', 'Gris Nardo', 245, 5, 5, 'Tunisie,Algérie', 'VW Golf 8 GTI, 5000 km. IQ.LIGHT, Digital Cockpit Pro, DCC. La référence sportive accessible.', 'disponible', '[]', 4],
  ]
  for (const v of voitures) {
    await db.execute({ sql: `INSERT INTO voitures (marque, modele, annee, prix, kilometrage, carburant, boite, couleur, puissance, nb_portes, nb_places, pays_destination, description, statut, photos, fournisseur_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, args: v })
  }
  console.log(`✅ ${voitures.length} voitures créées`)

  // Clients
  const clients = [
    ['Ahmed Benali', '+216 55 123 456', 'ahmed.benali@gmail.com', 'Tunisie', null, 'BMW X5 ou équivalent', 'Cherche SUV premium familial. Budget 50-60k€.', 'nouveau'],
    ['Karim Meziane', '+213 77 234 567', 'k.meziane@email.dz', 'Algérie', null, 'Land Cruiser 300', 'Intéressé par Land Cruiser, disponibilité et délai livraison ?', 'contacté'],
    ['Youssef El Fassi', '+212 66 345 678', 'youssef.fassi@outlook.ma', 'Maroc', null, 'Range Rover Sport', 'Client régulier, 3ème achat. Range Rover Sport ou Defender ?', 'en_négociation'],
    ['Fatima Zahra Idrissi', '+212 61 456 789', 'fz.idrissi@gmail.com', 'Maroc', null, 'Mercedes GLE', 'Pour mon entreprise, SUV représentatif. Facture professionnelle possible ?', 'finalisé'],
  ]
  for (const c of clients) {
    await db.execute({ sql: `INSERT INTO clients (nom, telephone, email, pays, voiture_id, voiture_souhaitee, message, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, args: c })
  }
  console.log(`✅ ${clients.length} clients créés`)
  console.log('\n🚀 Seed terminé! Admin: admin / Admin@2024!')
}

seed().catch(console.error).finally(() => process.exit(0))
