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

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="bg-white dark:bg-carbon-900 rounded-2xl border border-carbon-200 dark:border-white/10 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <img
          src={r.profile_photo_url}
          alt={r.author_name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          referrerPolicy="no-referrer"
        />
        <div>
          <p className="font-semibold text-carbon-950 dark:text-white text-sm">{r.author_name}</p>
          <p className="text-carbon-400 text-xs">{r.relative_time_description}</p>
        </div>
      </div>
      <Stars n={r.rating} />
      <p className="text-carbon-600 dark:text-carbon-400 text-sm leading-relaxed">
        {r.text || 'Très bon service.'}
      </p>
    </div>
  )
}

const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2634.312!2d2.3673886!3d48.7555344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e675000724595f%3A0x2a45f1d26d4a4ef1!2sCARTAGO%20MOTORS!5e0!3m2!1sfr!2sfr!4v1716800000000!8m2!3d48.7555309!4d2.3699635'

function Modal({ data, reviewUrl, onClose }: { data: Data; reviewUrl: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-carbon-950 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <p className="font-semibold text-carbon-950 dark:text-white text-sm">CARTAGO MOTORS — Tous les avis</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Stars n={Math.round(data.rating)} size={12} />
                <span className="text-xs text-carbon-500">{data.rating.toFixed(1)} · {data.total} avis Google</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-carbon-400 hover:bg-carbon-100 dark:hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Google Maps embed */}
        <div className="flex-1 min-h-0">
          <iframe
            src={MAPS_EMBED}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '500px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-carbon-100 dark:border-white/10 flex flex-col sm:flex-row gap-3">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-2 px-6 py-3 text-sm flex-1"
          >
            Laisser un avis Google
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function GoogleReviews({ reviewUrl }: { reviewUrl: string }) {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(r => r.json())
      .then(d => { if (d.rating) setData(d) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
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

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
                >
                  Laisser un avis
                </a>
                {data && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-outline-gold inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
                  >
                    Voir les avis
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 3 derniers avis */}
          {data?.reviews?.length ? (
            <div className="grid md:grid-cols-3 gap-6">
              {data.reviews.slice(0, 3).map((r, i) => <ReviewCard key={i} r={r} />)}
            </div>
          ) : null}

        </div>
      </section>

      {modalOpen && data && (
        <Modal data={data} reviewUrl={reviewUrl} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
