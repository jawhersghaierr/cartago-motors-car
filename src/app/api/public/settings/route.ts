import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const PUBLIC_KEYS = ['company_name', 'company_phone', 'company_whatsapp', 'company_email', 'company_address', 'company_siret', 'company_logo']

export async function GET() {
  try {
    const db = getDb()
    const res = await db.execute('SELECT key, value FROM settings')
    const settings: Record<string, string> = {}
    res.rows.forEach(r => {
      if (PUBLIC_KEYS.includes(r.key as string)) {
        settings[r.key as string] = r.value as string
      }
    })
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({})
  }
}
