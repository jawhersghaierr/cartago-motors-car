'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const MESSAGE = 'Bienvenue chez Cartago Motors'

export default function SplashPage() {
  const router = useRouter()
  const [typed, setTyped] = useState(0)
  const [fade, setFade] = useState(false)
  const [bg, setBg] = useState('#111111')

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme')
    setBg(theme === 'dark' ? '#111111' : '#ffffff')

    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTyped(i)
      if (i >= MESSAGE.length) clearInterval(typeInterval)
    }, 60)

    const t1 = setTimeout(() => setFade(true), MESSAGE.length * 60 + 1200)
    const t2 = setTimeout(() => router.replace('/home'), MESSAGE.length * 60 + 1900)

    return () => { clearInterval(typeInterval); clearTimeout(t1); clearTimeout(t2) }
  }, [router])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: bg, zIndex: 99999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 28,
      opacity: fade ? 0 : 1, transition: 'opacity 0.7s ease',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Cartago Motors"
        style={{ maxWidth: '60vw', maxHeight: '32vh', objectFit: 'contain' }} />
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(15px, 3.5vw, 20px)', fontWeight: 600,
        background: 'linear-gradient(135deg, #d4921a, #ecc44b, #d4921a)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', letterSpacing: '0.05em',
        margin: 0, minHeight: '1.5em',
      }}>
        {MESSAGE.slice(0, typed)}
        <span style={{
          display: 'inline-block', width: 2, height: '1em',
          background: '#d4921a', marginLeft: 2, verticalAlign: 'text-bottom',
          animation: typed < MESSAGE.length ? 'none' : 'sp-blink 0.8s infinite',
          WebkitTextFillColor: 'initial',
        }} />
      </p>
      <style>{`@keyframes sp-blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}
