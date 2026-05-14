import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Missing config' }, { status: 500 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=fr&key=${apiKey}`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (data.status !== 'OK') {
    return NextResponse.json({ error: data.status }, { status: 500 })
  }

  const reviews = (data.result.reviews ?? [])
    .sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating)
    .slice(0, 3)

  return NextResponse.json({
    reviews,
    rating: data.result.rating,
    total: data.result.user_ratings_total,
  })
}
