'use client'

import { useEffect, useState } from 'react'

interface Props {
  logoUrl?: string | null
  companyName?: string
}

const MESSAGE = 'Bienvenue chez Cartago Motors'

export default function SplashScreen({ logoUrl, companyName = 'Cartago Motors' }: Props) {
  const [show, setShow] = useState(false)
  const [fade, setFade] = useState(false)
  const [bg, setBg] = useState('#111111')
  const [textColor, setTextColor] = useState('#ffffff')
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme')
    const isDark = theme === 'dark'
    setBg(isDark ? '#111111' : '#ffffff')
    setTextColor(isDark ? '#ffffff' : '#111111')

    setShow(true)

    // Effet machine à écrire : une lettre toutes les 60ms, démarre après 400ms
    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTyped(i)
      if (i >= MESSAGE.length) clearInterval(typeInterval)
    }, 60)
    const startDelay = setTimeout(() => {}, 400)

    const t1 = setTimeout(() => setFade(true), 400 + MESSAGE.length * 60 + 800)
    const t2 = setTimeout(() => setShow(false), 400 + MESSAGE.length * 60 + 1500)

    return () => {
      clearInterval(typeInterval)
      clearTimeout(startDelay)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999,
      background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.7s ease',
    }}>
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt={companyName}
        style={{ maxWidth: '60vw', maxHeight: '28vh', objectFit: 'contain', display: 'block' }}
      />

      {/* Message progressif */}
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(16px, 4vw, 22px)',
        fontWeight: 500,
        color: textColor,
        letterSpacing: '0.04em',
        minHeight: '1.5em',
        margin: 0,
      }}>
        {MESSAGE.slice(0, typed)}
        <span style={{
          display: 'inline-block', width: 2, height: '1em',
          background: '#d4921a', marginLeft: 2, verticalAlign: 'text-bottom',
          animation: typed < MESSAGE.length ? 'none' : 'sp-blink 0.8s infinite',
        }} />
      </p>

      <style>{`
        @keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
