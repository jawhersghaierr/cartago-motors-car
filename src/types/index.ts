export interface Voiture {
  id: number
  marque: string
  modele: string
  annee: number
  prix_achat?: number
  prix_souhaite?: number
  prix_ht?: number
  prix_ttc: number
  kilometrage: number
  carburant: 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL'
  boite: 'Manuelle' | 'Automatique' | 'Semi-automatique'
  couleur?: string
  puissance?: number
  nb_portes: number
  nb_places: number
  pays_destination: string
  description?: string
  type_vente: 'export' | 'local'
  statut: 'disponible' | 'réservé' | 'vendu'
  photos: string[]
  created_at: string
  updated_at: string
}

export type CarburantType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL'
export type BoiteType = 'Manuelle' | 'Automatique' | 'Semi-automatique'
export type StatutVoiture = 'disponible' | 'réservé' | 'vendu'
export type TypeVente = 'export' | 'local'
export type PaysDestination = 'Tunisie' | 'Algérie' | 'Maroc'

export const MARQUES = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Peugeot', 'Porsche', 'Range Rover', 'Renault', 'Seat', 'Skoda', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo']
export const CARBURANTS: CarburantType[] = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']
export const BOITES: BoiteType[] = ['Manuelle', 'Automatique', 'Semi-automatique']
export const PAYS_DESTINATION: PaysDestination[] = ['Tunisie', 'Algérie', 'Maroc']
