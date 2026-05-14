const BRANDS = [
  { name: 'BMW',         logo: 'https://logo.clearbit.com/bmw.com' },
  { name: 'Mercedes',    logo: 'https://logo.clearbit.com/mercedes-benz.com' },
  { name: 'Audi',        logo: 'https://logo.clearbit.com/audi.com' },
  { name: 'Volkswagen',  logo: 'https://logo.clearbit.com/vw.com' },
  { name: 'Peugeot',     logo: 'https://logo.clearbit.com/peugeot.com' },
  { name: 'Renault',     logo: 'https://logo.clearbit.com/renault.com' },
  { name: 'Toyota',      logo: 'https://logo.clearbit.com/toyota.com' },
  { name: 'Ford',        logo: 'https://logo.clearbit.com/ford.com' },
  { name: 'Citroën',     logo: 'https://logo.clearbit.com/citroen.com' },
  { name: 'Hyundai',     logo: 'https://logo.clearbit.com/hyundai.com' },
  { name: 'Kia',         logo: 'https://logo.clearbit.com/kia.com' },
  { name: 'Nissan',      logo: 'https://logo.clearbit.com/nissan.com' },
  { name: 'Volvo',       logo: 'https://logo.clearbit.com/volvocars.com' },
  { name: 'Land Rover',  logo: 'https://logo.clearbit.com/landrover.com' },
  { name: 'Porsche',     logo: 'https://logo.clearbit.com/porsche.com' },
  { name: 'Opel',        logo: 'https://logo.clearbit.com/opel.com' },
]

function BrandItem({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-8 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-12 h-12 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
      />
      <span className="text-carbon-400 dark:text-carbon-600 text-xs font-medium tracking-wide">
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
