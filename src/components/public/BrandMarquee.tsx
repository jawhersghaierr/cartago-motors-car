const BRANDS: { name: string; logo: React.ReactNode }[] = [
  {
    name: 'BMW',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="3"/>
        <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="2"/>
        <path d="M50 50 L50 19 A31 31 0 0 1 81 50 Z" fill="currentColor"/>
        <path d="M50 50 L50 81 A31 31 0 0 1 19 50 Z" fill="currentColor"/>
        <line x1="50" y1="19" x2="50" y2="81" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="19" y1="50" x2="81" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: 'Mercedes',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 12 L50 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M50 50 L83 70" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M50 50 L17 70" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Audi',
    logo: (
      <svg viewBox="0 0 176 56" fill="none" className="w-16 h-6">
        <circle cx="28" cy="28" r="25" stroke="currentColor" strokeWidth="3"/>
        <circle cx="68" cy="28" r="25" stroke="currentColor" strokeWidth="3"/>
        <circle cx="108" cy="28" r="25" stroke="currentColor" strokeWidth="3"/>
        <circle cx="148" cy="28" r="25" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    name: 'Volkswagen',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="3"/>
        <path d="M36 22 L50 52 L64 22" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 38 L36 68 L50 48 L64 68 L78 38" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Renault',
    logo: (
      <svg viewBox="0 0 80 100" fill="none" className="w-8 h-10">
        <path d="M40 4 L76 52 L40 96 L4 52 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M40 22 L62 52 L40 78 L18 52 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M40 36 L52 52 L40 64 L28 52 Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Citroën',
    logo: (
      <svg viewBox="0 0 100 70" fill="none" className="w-12 h-8">
        <path d="M5 38 L50 8 L95 38" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 58 L50 28 L95 58" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Peugeot',
    logo: (
      <svg viewBox="0 0 60 100" fill="none" className="w-8 h-12">
        <path d="M30 5 L52 28 C60 38 58 52 48 58 C42 62 36 62 30 60 L30 95" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M30 5 L8 28 C0 38 2 52 12 58 C18 62 24 62 30 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="10" y1="48" x2="50" y2="48" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Toyota',
    logo: (
      <svg viewBox="0 0 120 80" fill="none" className="w-14 h-9">
        <ellipse cx="60" cy="55" rx="55" ry="22" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="40" cy="28" rx="28" ry="16" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="80" cy="28" rx="28" ry="16" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="60" cy="45" rx="10" ry="28" stroke="currentColor" strokeWidth="3"/>
      </svg>
    ),
  },
  {
    name: 'Ford',
    logo: (
      <svg viewBox="0 0 140 70" fill="none" className="w-14 h-7">
        <ellipse cx="70" cy="35" rx="67" ry="32" stroke="currentColor" strokeWidth="4"/>
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="serif" fontSize="28" fontStyle="italic" fontWeight="bold"
          fill="currentColor">Ford</text>
      </svg>
    ),
  },
  {
    name: 'Hyundai',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <ellipse cx="50" cy="50" rx="47" ry="47" stroke="currentColor" strokeWidth="3"/>
        <path d="M28 30 L28 70 M28 50 C28 50 40 42 50 50 C60 58 72 50 72 50 M72 30 L72 70" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Nissan',
    logo: (
      <svg viewBox="0 0 160 60" fill="none" className="w-16 h-6">
        <rect x="3" y="3" width="154" height="54" rx="27" stroke="currentColor" strokeWidth="3"/>
        <line x1="55" y1="3" x2="55" y2="57" stroke="currentColor" strokeWidth="3"/>
        <line x1="105" y1="3" x2="105" y2="57" stroke="currentColor" strokeWidth="3"/>
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="sans-serif" fontSize="16" fontWeight="bold" letterSpacing="3"
          fill="currentColor">NISSAN</text>
      </svg>
    ),
  },
  {
    name: 'Kia',
    logo: (
      <svg viewBox="0 0 120 60" fill="none" className="w-14 h-7">
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="sans-serif" fontSize="38" fontWeight="800" letterSpacing="4"
          fill="currentColor">KIA</text>
      </svg>
    ),
  },
  {
    name: 'Volvo',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <circle cx="46" cy="54" r="38" stroke="currentColor" strokeWidth="4"/>
        <path d="M73 27 L90 10 M90 10 L90 28 M90 10 L72 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: 'Land Rover',
    logo: (
      <svg viewBox="0 0 180 60" fill="none" className="w-20 h-7">
        <rect x="3" y="3" width="174" height="54" rx="6" stroke="currentColor" strokeWidth="3"/>
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="sans-serif" fontSize="13" fontWeight="700" letterSpacing="2"
          fill="currentColor">LAND ROVER</text>
      </svg>
    ),
  },
  {
    name: 'Porsche',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="currentColor" strokeWidth="3"/>
        <path d="M50 25 L75 50 L50 75 L25 50 Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M50 5 L50 25 M95 50 L75 50 M50 95 L50 75 M5 50 L25 50" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="50" r="8" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Opel',
    logo: (
      <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10">
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="3"/>
        <ellipse cx="50" cy="50" rx="47" ry="18" stroke="currentColor" strokeWidth="3"/>
        <path d="M28 28 C36 20 64 20 72 28" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M28 72 C36 80 64 80 72 72" stroke="currentColor" strokeWidth="3" fill="none"/>
      </svg>
    ),
  },
]

import React from 'react'

function BrandItem({ name, logo }: { name: string; logo: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-10 shrink-0">
      <div className="text-carbon-400 dark:text-carbon-500 opacity-70 hover:opacity-100 transition-opacity">
        {logo}
      </div>
      <span className="text-carbon-400 dark:text-carbon-600 text-xs font-medium tracking-wider">
        {name}
      </span>
    </div>
  )
}

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS]

  return (
    <section className="py-8 border-y border-carbon-200 dark:border-white/5 overflow-hidden bg-white dark:bg-carbon-950">
      <div
        className="flex items-center"
        style={{ animation: 'marquee 40s linear infinite', width: 'max-content' }}
      >
        {items.map((b, i) => (
          <BrandItem key={i} name={b.name} logo={b.logo} />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
