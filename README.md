# 🚗 AutoExport Maghreb

Plateforme premium de vente et d'export de véhicules vers la **Tunisie**, l'**Algérie** et le **Maroc**.

---

## ✨ Fonctionnalités

### Site public

- **Accueil** premium avec hero section, statistiques, destinations, témoignages
- **Catalogue** avec filtres avancés (marque, carburant, boîte, prix, kilométrage, pays)
- **Détail véhicule** avec galerie photos, specs, formulaire de devis intégré, WhatsApp CTA
- **Page contact** formulaire de devis complet

### Administration

- **Dashboard** — statistiques temps réel, demandes récentes, valeur du stock
- **Voitures** — CRUD complet, upload multi-photos, statuts (disponible/réservé/vendu)
- **Clients** — gestion des demandes, modification de statut, notes internes
- **Fournisseurs** — gestion des partenaires Europe

---

## 🛠 Stack Technique

| Couche          | Technologie             |
| --------------- | ----------------------- |
| Frontend        | Next.js 14 (App Router) |
| Styling         | Tailwind CSS            |
| Base de données | SQLite (better-sqlite3) |
| Auth            | JWT (jose) + cookies    |
| Upload          | API Route multipart     |
| Icons           | Lucide React            |
| Notifications   | React Hot Toast         |

---

## 🚀 Installation & Lancement

### Prérequis

- Node.js ≥ 18.17
- npm ≥ 9

### 1. Cloner et installer

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npm run db:init

# Peupler avec des données d'exemple
npm run seed
```

### 2. Configuration

Copiez `.env.local` et adaptez si nécessaire :

```bash
cp .env.local .env.local
# Modifiez JWT_SECRET en production !
```

### 3. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### 4. Build production

```bash
npm run build
npm start
```

---

## 🔐 Accès Administration

| URL                   | Description       |
| --------------------- | ----------------- |
| `/admin/login`        | Connexion admin   |
| `/admin/dashboard`    | Tableau de bord   |
| `/admin/voitures`     | Gestion véhicules |
| `/admin/clients`      | Demandes clients  |
| `/admin/fournisseurs` | Fournisseurs      |

**Identifiants par défaut** (après seed) :

```
Utilisateur : admin
Mot de passe : Admin@2024!
```

⚠️ **Changez ces identifiants en production** via la base de données.

---

## 📁 Structure du Projet

```
AutoExport/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes (Next.js)
│   │   │   ├── auth/               # Login / Logout
│   │   │   ├── voitures/           # CRUD véhicules
│   │   │   ├── fournisseurs/       # CRUD fournisseurs
│   │   │   ├── clients/            # CRUD demandes
│   │   │   ├── dashboard/          # Stats dashboard
│   │   │   └── upload/             # Upload photos
│   │   ├── admin/                  # Pages admin (protégées)
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── voitures/
│   │   │   ├── clients/
│   │   │   └── fournisseurs/
│   │   ├── catalogue/              # Page catalogue public
│   │   ├── voiture/[id]/           # Détail véhicule
│   │   ├── contact/                # Formulaire contact
│   │   ├── layout.tsx              # Layout racine
│   │   └── page.tsx                # Page d'accueil
│   ├── components/
│   │   ├── admin/
│   │   │   ├── VoitureForm.tsx     # Formulaire voiture
│   │   │   └── FournisseurForm.tsx # Formulaire fournisseur
│   │   └── public/
│   │       ├── Navbar.tsx          # Navigation publique
│   │       ├── Footer.tsx          # Pied de page
│   │       └── VoitureCard.tsx     # Carte véhicule
│   ├── lib/
│   │   ├── db.ts                   # Singleton SQLite
│   │   ├── auth.ts                 # JWT helpers
│   │   └── utils.ts                # Fonctions utilitaires
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   └── middleware.ts               # Protection routes admin
├── scripts/
│   ├── initDb.js                   # Création des tables
│   └── seed.js                     # Données d'exemple
├── data/                           # SQLite DB (auto-créé)
├── public/
│   └── uploads/voitures/           # Photos uploadées
└── .env.local                      # Variables d'environnement
```

---

## 🗄 Schéma Base de Données

### `voitures`

| Champ            | Type    | Description                   |
| ---------------- | ------- | ----------------------------- |
| marque, modele   | TEXT    | Identification                |
| annee, prix      | INTEGER | Année et prix en euros        |
| kilometrage      | INTEGER | Kilométrage en km             |
| carburant        | TEXT    | Essence/Diesel/Hybride/GPL/EV |
| boite            | TEXT    | Manuelle/Automatique/Semi     |
| pays_destination | TEXT    | Tunisie,Algérie,Maroc (CSV)   |
| statut           | TEXT    | disponible/réservé/vendu      |
| photos           | JSON    | Array de chemins de photos    |

### `clients`

| Champ          | Type | Description                              |
| -------------- | ---- | ---------------------------------------- |
| statut         | TEXT | nouveau/contacté/en_négociation/finalisé |
| notes_internes | TEXT | Notes admin privées                      |

---

## 🎨 Design System

- **Fond** : `#111111` (carbon-950)
- **Accent** : `#d4921a` (gold-500) → doré premium
- **Police titre** : Playfair Display (serif élégant)
- **Police corps** : DM Sans (sans-serif moderne)

---

## 🌍 Déploiement

### Vercel (recommandé)

```bash
npm i -g vercel
vercel --prod
```

> Note : SQLite n'est pas persistant sur Vercel. En production, migrez vers PostgreSQL (Neon, Supabase) et remplacez `better-sqlite3` par `pg` ou Prisma.

### VPS / Serveur dédié

```bash
npm run build
pm2 start npm --name "AutoExport" -- start
```

---

## 📞 Support

Pour toute question : contact@AutoExport.com

---

_AutoExport Maghreb — Votre spécialiste export automobile vers le Maghreb_ 🇹🇳🇩🇿🇲🇦
