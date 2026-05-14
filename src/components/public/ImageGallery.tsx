'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Download, ZoomIn, Car } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  // Bloquer le scroll quand lightbox ouvert
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  if (images.length === 0) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-carbon-100 dark:bg-carbon-900 flex items-center justify-center">
        <Car size={60} className="text-carbon-300 dark:text-carbon-700" />
      </div>
    )
  }

  return (
    <>
      {/* Galerie principale */}
      <div className="space-y-3">
        {/* Image principale */}
        <div
          className="relative aspect-video rounded-2xl overflow-hidden bg-carbon-100 dark:bg-carbon-900 group cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[current]}
            alt={`${alt} — photo ${current + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Watermark */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none select-none">
            <span className="text-gold-400 text-xs">✦</span>
            <span className="text-white text-xs font-semibold tracking-wide">Cartago Motors</span>
          </div>
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          {/* Flèches si plusieurs images */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
              {/* Compteur */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                {current + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Vignettes */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative aspect-video rounded-lg overflow-hidden bg-carbon-100 dark:bg-carbon-900 transition-all ${
                  i === current
                    ? 'ring-2 ring-gold-500 ring-offset-1 ring-offset-gray-50 dark:ring-offset-carbon-950'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="20vw" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <a
              href={images[current]}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Télécharger"
            >
              <Download size={18} />
            </a>
            <button
              onClick={() => setLightbox(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Compteur */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {current + 1} / {images.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[current]}
              alt={`${alt} — photo ${current + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none select-none">
              <span className="text-gold-400 text-xs">✦</span>
              <span className="text-white text-xs font-semibold tracking-wide">Cartago Motors</span>
            </div>
          </div>

          {/* Flèches lightbox */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Vignettes lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setCurrent(i) }}
                  className={`relative w-14 h-10 rounded overflow-hidden transition-all ${
                    i === current ? 'ring-2 ring-gold-400 opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
