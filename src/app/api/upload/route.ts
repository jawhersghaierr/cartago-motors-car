import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const formData = await request.formData()
    const files = formData.getAll('photos') as File[]

    if (!files.length) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'voitures')
    await mkdir(uploadDir, { recursive: true })

    const uploadedPaths: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${uuidv4()}.${ext}`
      const filepath = path.join(uploadDir, filename)

      const bytes = await file.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))

      uploadedPaths.push(`/uploads/voitures/${filename}`)
    }

    return NextResponse.json({ paths: uploadedPaths })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }
}
