# Cartago Motors

Plateforme web pour un concessionnaire automobile spécialisé dans l'export vers le Maghreb. Construite avec Next.js 14, Supabase et Tailwind CSS.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Base de données | Supabase (PostgreSQL) |
| Styles | Tailwind CSS |
| Auth | JWT (jose) + cookies |
| Email | Resend |
| Upload | Supabase Storage |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Pages publiques

| Route | Description |
|-------|-------------|
| `/home` | Page d'accueil |
| `/catalogue` | Liste des voitures avec filtres et tri |
| `/voiture/[id]` | Fiche détaillée d'un véhicule |
| `/comparer` | Comparateur de véhicules |
| `/favoris` | Voitures sauvegardées (localStorage) |
| `/contact` | Formulaire de contact |
| `/a-propos` | Page à propos |

## Interface admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard |
| `/admin/cars` | Gestion du parc automobile |
| `/admin/cars/new` | Ajouter un véhicule |
| `/admin/cars/[id]/edit` | Modifier un véhicule |
| `/admin/settings` | Paramètres (logo, coordonnées, réseaux sociaux) |

---

## Installation

```bash
git clone <repo>
cd cartago-motors-car
npm install
cp .env.local.example .env.local
# Remplir les variables dans .env.local
npm run dev
```

---

## Variables d'environnement

```env
# Authentification admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_change_in_production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# WhatsApp (bouton flottant)
NEXT_PUBLIC_WHATSAPP=+21698000000

# Resend (envoi d'emails de contact)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

---

## Fonctionnalités

- Catalogue avec filtres (marque, carburant, transmission, prix, statut) et tri
- Accordéon de filtres sur mobile
- Fiche voiture avec galerie photos, specs, bouton WhatsApp et formulaire "Je suis intéressé"
- Emails envoyés via Resend vers l'adresse configurée dans les paramètres admin
- Comparateur jusqu'à 3 véhicules
- Favoris persistants via localStorage
- Mode sombre / clair
- Interface admin complète avec upload d'images

---

## Configuration email (Resend)

1. Crée un compte sur [resend.com](https://resend.com)
2. Génère une clé API et ajoute-la dans `.env.local` : `RESEND_API_KEY=re_...`
3. Dans `/admin/settings`, renseigne l'adresse email destinataire des messages
4. (Optionnel) Vérifie ton domaine sur Resend pour envoyer depuis ta propre adresse

> En mode test, les emails partent depuis `onboarding@resend.dev`.

---

## Déploiement (Vercel)

```bash
vercel --prod
```

Ajoute toutes les variables d'environnement dans le dashboard Vercel avant le déploiement.
