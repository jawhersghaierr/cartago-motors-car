'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface LogoUploadProps {
  value: string | null
  onChange: (url: string | null) => void
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? 'Erreur upload')
        return
      }
      const { url } = await res.json()
      onChange(url)
      toast.success('Logo uploadé')
    } catch {
      toast.error("Échec de l'upload")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    if (!value) return
    try {
      const urlObj = new URL(value)
      const marker = '/object/public/car-images/'
      const parts = urlObj.pathname.split(marker)
      if (parts.length >= 2) {
        const path = decodeURIComponent(parts[1])
        await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
      }
    } catch { /* non-blocking */ }
    onChange(null)
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="relative h-12 w-32">
            <Image src={value} alt="Logo" fill className="object-contain" sizes="128px" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !uploading && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="text-slate-400 animate-spin" />
            <p className="text-sm text-slate-500">Upload en cours…</p>
          </>
        ) : (
          <>
            <Upload size={20} className="text-slate-400" />
            <p className="text-sm font-medium text-slate-600">{value ? 'Remplacer le logo' : 'Uploader un logo'}</p>
            <p className="text-xs text-slate-400">PNG, SVG, WEBP — fond transparent recommandé</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
