import { supabase } from '@/lib/supabase'
import type { Car, CreateCarInput, UpdateCarInput } from '@/types/car'

export interface GetCarsParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export async function getCars({
  search,
  status,
  page = 1,
  limit = 15,
}: GetCarsParams = {}): Promise<{ cars: Car[]; total: number }> {
  let query = supabase.from('cars').select('*', { count: 'exact' })

  if (search) {
    query = query.or(
      `brand.ilike.%${search}%,model.ilike.%${search}%,vin.ilike.%${search}%,plate_number.ilike.%${search}%`
    )
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { cars: (data ?? []) as Car[], total: count ?? 0 }
}

export async function getCarById(id: string): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Car
}

export async function createCar(input: CreateCarInput): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Car
}

export async function updateCar(id: string, input: UpdateCarInput): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Car
}

export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
}
