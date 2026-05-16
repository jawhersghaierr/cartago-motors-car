import { NextResponse } from 'next/server'

const BUSINESS_NAME = 'CARTAGO MOTORS'
const BUSINESS_LAT = '48.7555309'
const BUSINESS_LNG = '2.3699635'

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  // Trouve le Place ID automatiquement si non configuré
  let placeId = process.env.GOOGLE_PLACE_ID
  if (!placeId) {
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(BUSINESS_NAME)}&inputtype=textquery&fields=place_id&locationbias=point:${BUSINESS_LAT},${BUSINESS_LNG}&key=${apiKey}`
    const findRes = await fetch(findUrl, { next: { revalidate: 86400 } })
    const findData = await findRes.json()
    placeId = findData.candidates?.[0]?.place_id
  }

  if (!placeId) {
    return NextResponse.json({ error: 'Business not found' }, { status: 500 })
  }

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
