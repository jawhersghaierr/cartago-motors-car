import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) return NextResponse.json({ error: 'Identifiants requis' }, { status: 400 })

    const db = getDb()
    const res = await db.execute({ sql: 'SELECT * FROM admins WHERE username = ?', args: [username] })
    const admin = res.rows[0] as any

    if (!admin) return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })

    const ok = await bcrypt.compare(password, admin.password as string)
    if (!ok) return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })

    const token = await signToken({ id: Number(admin.id), username: admin.username as string, name: admin.name as string, email: admin.email as string })
    const response = NextResponse.json({ success: true, admin: { id: admin.id, username: admin.username, name: admin.name, email: admin.email } })
    response.cookies.set('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' })
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}
