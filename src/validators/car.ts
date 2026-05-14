import { z } from 'zod'

const nullableString = z.string().trim().nullable().optional().transform(v => v || null)
const nullablePositiveInt = z.preprocess(
  v => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().int().positive().nullable()
)
const nullablePositiveNumber = z.preprocess(
  v => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().nonnegative().nullable()
)

export const createCarSchema = z.object({
  brand: z.string().min(1, 'La marque est requise'),
  model: z.string().min(1, 'Le modèle est requis'),
  year: z.preprocess(
    v => (v === '' || v === null || v === undefined ? NaN : Number(v)),
    z.number({ invalid_type_error: 'Année invalide' })
      .int()
      .min(1900, 'Année trop ancienne')
      .max(new Date().getFullYear() + 1, 'Année invalide')
  ),
  vin: nullableString,
  plate_number: nullableString,
  fuel: z.enum(['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL']),
  engine: nullableString,
  transmission: z.enum(['Manuelle', 'Automatique', 'Semi-automatique']),
  horsepower: nullablePositiveInt,
  color: nullableString,
  price: nullablePositiveNumber,
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  images: z.array(z.string()).default([]),
  description: nullableString,
  vincario_data: z.record(z.string(), z.string()).nullable().optional().transform(v => v ?? null),
})

export const updateCarSchema = createCarSchema.partial()

export type CreateCarSchema = z.infer<typeof createCarSchema>
export type UpdateCarSchema = z.infer<typeof updateCarSchema>
