const BRANDS = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Peugeot',
  'Renault', 'Toyota', 'Ford', 'Citroën', 'Hyundai',
  'Kia', 'Nissan', 'Volvo', 'Land Rover', 'Porsche', 'Opel',
]

function BrandItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4 px-6 shrink-0">
      <span className="text-gold-600 dark:text-gold-500 text-xs">✦</span>
      <span className="text-gold-700 dark:text-gold-400 font-semibold text-base tracking-wide whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS]

  return (
    <section className="py-6 border-y border-carbon-200 dark:border-white/5 overflow-hidden bg-white dark:bg-carbon-950">
      <div
        className="flex items-center"
        style={{ animation: 'marquee 35s linear infinite', width: 'max-content' }}
      >
        {items.map((name, i) => (
          <BrandItem key={i} name={name} />
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
