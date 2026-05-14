export type CarStatus = 'available' | 'reserved' | 'sold'
export type FuelType = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL'
export type TransmissionType = 'Manuelle' | 'Automatique' | 'Semi-automatique'

export interface Car {
  id: string
  brand: string
  model: string
  year: number
  vin: string | null
  plate_number: string | null
  fuel: FuelType
  engine: string | null
  transmission: TransmissionType
  horsepower: number | null
  color: string | null
  price: number | null
  status: CarStatus
  images: string[]
  description: string | null
  vincario_data: Record<string, string> | null
  created_at: string
  updated_at: string
}

export type CreateCarInput = Omit<Car, 'id' | 'created_at' | 'updated_at'>
export type UpdateCarInput = Partial<CreateCarInput>

export const CAR_BRANDS = [
  'Alfa Romeo', 'Audi', 'BMW', 'Citroën', 'Dacia', 'Ferrari', 'Fiat',
  'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Kia', 'Land Rover', 'Lexus',
  'Maserati', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Opel',
  'Peugeot', 'Porsche', 'Renault', 'SEAT', 'Skoda', 'Tesla', 'Toyota',
  'Volkswagen', 'Volvo',
] as const

export const FUEL_TYPES: FuelType[] = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']
export const TRANSMISSION_TYPES: TransmissionType[] = ['Manuelle', 'Automatique', 'Semi-automatique']

export const STATUS_LABELS: Record<CarStatus, string> = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
}

export const STATUS_COLORS: Record<CarStatus, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  reserved: 'bg-amber-100 text-amber-700',
  sold: 'bg-red-100 text-red-700',
}
