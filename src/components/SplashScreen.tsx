'use client'

import { useEffect, useState } from 'react'
import { Car } from 'lucide-react'

interface Props {
  logoUrl?: string | null
  companyName?: string
}

export default function SplashScreen({ logoUrl, companyName = 'Cartago Motors' }: Props) {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400)
    const hideTimer = setTimeout(() => setVisible(false), 2000)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-carbon-950 transition-opacity duration-500"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      <div
        className="flex flex-col items-center gap-4 transition-transform duration-500"
        style={{ transform: fadeOut ? 'scale(1.05)' : 'scale(1)' }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={companyName}
            style={{ width: 220, height: 'auto', objectFit: 'contain' }}
          />
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <Car size={36} className="text-gold-400" />
            </div>
            <p className="text-white font-bold text-2xl tracking-tight">{companyName}</p>
          </>
        )}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
