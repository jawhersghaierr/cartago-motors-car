'use client'

import { useEffect, useState } from 'react'

interface Review {
  author_name: string
  rating: number
  text: string
  profile_photo_url: string
  relative_time_description: string
}

interface Data {
  reviews: Review[]
  rating: number
  total: number
}

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= n ? '#FBBC05' : '#e2e8f0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function GoogleReviews({ reviewUrl }: { reviewUrl: string }) {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(r => r.json())
      .then(d => { if (d.rating) setData(d) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-12 bg-carbon-100/60 dark:bg-carbon-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <p className="text-gold-700 dark:text-gold-500 text-sm uppercase tracking-widest font-medium mb-3">
            Avis clients
          </p>
          <h2 className="text-3xl font-bold text-carbon-950 dark:text-white mb-8">
            Ce que disent nos clients
          </h2>

          <div className="inline-flex flex-col items-center gap-4 bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/10 px-10 py-8 shadow-sm">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <Stars n={5} size={22} />
            </div>

            {loading ? (
              <div className="h-12 w-24 bg-carbon-100 dark:bg-carbon-800 rounded-lg animate-pulse" />
            ) : data ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-carbon-950 dark:text-white">{data.rating.toFixed(1)}</span>
                  <span className="text-carbon-400 text-lg">/&nbsp;5</span>
                </div>
                <p className="text-carbon-500 dark:text-carbon-400 text-sm">
                  Basé sur <span className="font-semibold text-carbon-700 dark:text-carbon-300">{data.total} avis</span> Google
                </p>
              </>
            ) : null}

            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm mt-2"
            >
              Laisser un avis Google
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>

        {data?.reviews?.length ? (
          <div className="grid md:grid-cols-3 gap-6">
            {data.reviews.map((r, i) => (
              <div key={i} className="bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/10 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={r.profile_photo_url}
                    alt={r.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-semibold text-carbon-950 dark:text-white text-sm">{r.author_name}</p>
                    <p className="text-carbon-400 text-xs">{r.relative_time_description}</p>
                  </div>
                </div>
                <Stars n={r.rating} />
                <p className="text-carbon-600 dark:text-carbon-400 text-sm leading-relaxed line-clamp-4">
                  {r.text || 'Très bon service.'}
                </p>
              </div>
            ))}
          </div>
        ) : null}

      </div>
    </section>
  )
}
