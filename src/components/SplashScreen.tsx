'use client'

import { useEffect, useState } from 'react'
import { Car } from 'lucide-react'

interface Props {
  logoUrl?: string | null
  companyName?: string
}

export default function SplashScreen({ logoUrl, companyName = 'Cartago Motors' }: Props) {
  const src = logoUrl || '/logo.png'
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const delay = imgLoaded ? 1200 : 1600
    const fadeTimer = setTimeout(() => setFadeOut(true), delay)
    const hideTimer = setTimeout(() => setVisible(false), delay + 600)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [imgLoaded])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={companyName}
            onLoad={() => setImgLoaded(true)}
            style={{
              maxWidth: 260,
              maxHeight: 160,
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              background: 'rgba(212,146,26,0.15)', border: '1px solid rgba(212,146,26,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Car size={32} color="#b97015" />
            </div>
            <p style={{ fontWeight: 700, fontSize: 22, color: '#111111', margin: 0 }}>{companyName}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#d4921a',
                display: 'inline-block',
                animation: 'bounce 0.8s infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
