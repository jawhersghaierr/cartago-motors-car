import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { STORAGE_BUCKET } from '@/services/storage'

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Format non supporté (jpg, png, webp)' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const buffer = new Uint8Array(await file.arrayBuffer())
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) throw error

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl, path })
  } catch (error) {
    console.error('[POST /api/upload]', error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getAuthFromRequest(request)
    if (!auth) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'Chemin manquant' }, { status: 400 })
    }

    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/upload]', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
