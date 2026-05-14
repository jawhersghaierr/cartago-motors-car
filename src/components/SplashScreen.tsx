'use client'

const MESSAGE = 'Bienvenue chez Cartago Motors'

export default function SplashScreen({ logoUrl, companyName = 'Cartago Motors' }: Props) {
  const [show, setShow] = useState(false)
  const [fade, setFade] = useState(false)
  const [bg, setBg] = useState('#111111')
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme')
    setBg(theme === 'dark' ? '#111111' : '#ffffff')
    setShow(true)

    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTyped(i)
      if (i >= MESSAGE.length) clearInterval(typeInterval)
    }, 60)

    const t1 = setTimeout(() => setFade(true), MESSAGE.length * 60 + 1200)
    const t2 = setTimeout(() => setShow(false), MESSAGE.length * 60 + 1900)
    return () => { clearInterval(typeInterval); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999, background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.7s ease',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt={companyName}
        style={{ maxWidth: '60vw', maxHeight: '32vh', objectFit: 'contain', display: 'block' }} />
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(15px, 3.5vw, 20px)',
        fontWeight: 600,
        background: 'linear-gradient(135deg, #d4921a, #ecc44b, #d4921a)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '0.05em',
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
