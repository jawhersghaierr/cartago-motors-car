const BRANDS = [
  { name: 'BMW', svg: <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3"/><circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="2"/><path d="M50 18 L50 50 L18 50" fill="currentColor" opacity="0.15"/><path d="M50 82 L50 50 L82 50" fill="currentColor" opacity="0.15"/><path d="M50 18 L50 50 L18 50 A32 32 0 0 1 50 18Z" fill="currentColor" opacity="0.7"/><path d="M50 82 L50 50 L82 50 A32 32 0 0 1 50 82Z" fill="currentColor" opacity="0.7"/></svg> },
  { name: 'Mercedes', svg: <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3"/><path d="M50 10 L50 50 M50 50 L84 72 M50 50 L16 72" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg> },
  { name: 'Audi', svg: <svg viewBox="0 0 160 50" fill="none"><circle cx="20" cy="25" r="18" stroke="currentColor" strokeWidth="3"/><circle cx="53" cy="25" r="18" stroke="currentColor" strokeWidth="3"/><circle cx="86" cy="25" r="18" stroke="currentColor" strokeWidth="3"/><circle cx="119" cy="25" r="18" stroke="currentColor" strokeWidth="3"/></svg> },
  { name: 'Volkswagen', svg: <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="3"/><path d="M30 30 L50 70 L70 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M22 45 L50 70 L78 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> },
  { name: 'Peugeot', svg: null },
  { name: 'Renault', svg: null },
  { name: 'Toyota', svg: <svg viewBox="0 0 120 50" fill="none"><ellipse cx="60" cy="25" rx="20" ry="12" stroke="currentColor" strokeWidth="3"/><ellipse cx="60" cy="25" rx="40" ry="22" stroke="currentColor" strokeWidth="3"/><path d="M20 10 Q60 50 100 10" stroke="currentColor" strokeWidth="3" fill="none"/></svg> },
  { name: 'Ford', svg: null },
  { name: 'Citroën', svg: null },
  { name: 'Hyundai', svg: null },
  { name: 'Kia', svg: null },
  { name: 'Nissan', svg: null },
  { name: 'Volvo', svg: null },
  { name: 'Land Rover', svg: null },
  { name: 'Porsche', svg: null },
  { name: 'Opel', svg: null },
]

function BrandItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 px-8 shrink-0">
      <span className="text-carbon-400 dark:text-carbon-500 select-none">✦</span>
      <span className="text-carbon-700 dark:text-carbon-300 font-semibold text-lg tracking-wide whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS]

  return (
    <section className="py-10 border-y border-carbon-200 dark:border-white/5 overflow-hidden bg-white dark:bg-carbon-950">
      <div
        className="flex"
        style={{
          animation: 'marquee 30s linear infinite',
          width: 'max-content',
        }}
      >
        {items.map((b, i) => (
          <BrandItem key={i} name={b.name} />
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
