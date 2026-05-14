'use client'

import { useEffect, useState } from 'react'

interface Props {
  logoUrl?: string | null
  companyName?: string
}

export default function SplashScreen({ logoUrl, companyName = 'Cartago Motors' }: Props) {
  const [show, setShow] = useState(false)
  const [fade, setFade] = useState(false)
  const [bg, setBg] = useState('#111111')

  useEffect(() => {
    // Utilise le même fond que le thème actif
    const theme = document.documentElement.getAttribute('data-theme')
    setBg(theme === 'dark' ? '#111111' : '#ffffff')

    setShow(true)
    const t1 = setTimeout(() => setFade(true), 2000)
    const t2 = setTimeout(() => setShow(false), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999,
      background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.7s ease',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt={companyName}
        style={{ maxWidth: '60vw', maxHeight: '30vh', objectFit: 'contain', display: 'block' }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 150, 300].map(delay => (
          <span key={delay} style={{
            width: 8, height: 8, borderRadius: '50%', background: '#d4921a', display: 'block',
            animation: 'sp-bounce 0.9s infinite ease-in-out',
            animationDelay: `${delay}ms`,
          }} />
        ))}
      </div>
      <style>{`@keyframes sp-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  )
}
