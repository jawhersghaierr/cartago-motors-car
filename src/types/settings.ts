export interface SiteSettings {
  company_name: string
  hero_tagline: string
  hero_title: string
  hero_description: string
  about_text: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  facebook_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  stat_pays: string | null
  stat_clients: string | null
  logo_url: string | null
  google_review_url: string | null
  google_rating: string | null
  google_review_count: string | null
  google_review_1_author: string | null
  google_review_1_text: string | null
  google_review_1_rating: string | null
  google_review_2_author: string | null
  google_review_2_text: string | null
  google_review_2_rating: string | null
  google_review_3_author: string | null
  google_review_3_text: string | null
  google_review_3_rating: string | null
}

export const DEFAULT_SETTINGS: SiteSettings = {
  company_name: 'Cartago Motors',
  hero_tagline: 'Spécialiste export automobile',
  hero_title: "Voitures Premium pour l'export",
  hero_description: "Sélection rigoureuse de véhicules haut de gamme. Accompagnement complet jusqu'à la livraison au Maghreb.",
  about_text: null,
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  facebook_url: null,
  instagram_url: null,
  tiktok_url: null,
  stat_pays: '3',
  stat_clients: '200+',
  logo_url: null,
  google_review_url: null,
  google_rating: null,
  google_review_count: null,
  google_review_1_author: null,
  google_review_1_text: null,
  google_review_1_rating: null,
  google_review_2_author: null,
  google_review_2_text: null,
  google_review_2_rating: null,
  google_review_3_author: null,
  google_review_3_text: null,
  google_review_3_rating: null,
}
