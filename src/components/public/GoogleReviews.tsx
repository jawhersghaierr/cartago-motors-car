'use client'

import { useEffect, useState } from 'react'

interface Review {
  author_name: string
  rating: number
  text: string
  profile_photo_url: string
  relative_time_description: string
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= n ? '#FBBC05' : '#e2e8f0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function GoogleReviews({ reviewUrl }: { reviewUrl: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(r => r.json())
      .then(d => { if (d.reviews?.length) setReviews(d.reviews) })
      .catch(() => null)
  }, [])

  if (reviews.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
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

      <div className="text-center mt-8">
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold inline-flex items-center gap-2 px-7 py-3"
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
  )
}
