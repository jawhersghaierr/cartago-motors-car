import { NextResponse } from 'next/server'

// Identifiant extrait directement depuis l'URL Google Maps de la fiche
const PLACE_FTID = '0x47e675000724595f:0x2a45f1d26d4a4ef1'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  const placeId = process.env.GOOGLE_PLACE_ID || PLACE_FTID

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=fr&key=${apiKey}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (data.status !== 'OK') {
    return NextResponse.json({ error: data.status }, { status: 500 })
  }

  const reviews = (data.result.reviews ?? [])
    .sort((a: { time: number }, b: { time: number }) => b.time - a.time)
    .slice(0, 3)

  return NextResponse.json({
    reviews,
    rating: data.result.rating,
    total: data.result.user_ratings_total,
  })
}
