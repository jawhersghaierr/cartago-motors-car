'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  images: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) {
          const err = await res.json()
          toast.error(err.error ?? `Erreur upload: ${file.name}`)
          continue
        }
        const { url } = await res.json()
        newUrls.push(url)
      } catch {
        toast.error(`Échec de l'upload: ${file.name}`)
      }
    }

    if (newUrls.length) {
      onChange([...images, ...newUrls])
      toast.success(`${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} ajoutée${newUrls.length > 1 ? 's' : ''}`)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleRemove(url: string) {
    try {
      const urlObj = new URL(url)
      const marker = '/object/public/car-images/'
      const parts = urlObj.pathname.split(marker)
      if (parts.length >= 2) {
        const path = decodeURIComponent(parts[1])
        await fetch(`/api/upload?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
      }
    } catch {
      // Non-blocking
    }
    onChange(images.filter(img => img !== url))
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
            >
              <Image
                src={url}
                alt={`Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={11} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !uploading && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 size={22} className="text-slate-400 animate-spin" />
            <p className="text-sm text-slate-500">Upload en cours…</p>
          </>
        ) : (
          <>
            <Upload size={22} className="text-slate-400" />
            <p className="text-sm font-medium text-slate-600">Cliquer ou glisser-déposer</p>
            <p className="text-xs text-slate-400">JPG, PNG, WEBP — max 10 Mo par fichier</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
