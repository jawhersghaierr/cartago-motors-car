import { NextResponse } from 'next/server'

const BUSINESS_NAME = 'CARTAGO MOTORS'
const LAT = 48.7555309
const LNG = 2.3699635

interface NewReview {
  relativePublishTimeDescription: string
  rating: number
  text?: { text: string }
  authorAttribution: { displayName: string; photoUri: string }
  publishTime: string
}

async function searchPlaceId(apiKey: string): Promise<string | null> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id',
    },
    body: JSON.stringify({
      textQuery: BUSINESS_NAME,
      languageCode: 'fr',
      locationBias: {
        circle: {
          center: { latitude: LAT, longitude: LNG },
          radius: 500.0,
        },
      },
    }),
    next: { revalidate: 86400 },
  })
  const data = await res.json()
  return data.places?.[0]?.id ?? null
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }

  const placeId = process.env.GOOGLE_PLACE_ID ?? await searchPlaceId(apiKey)
  if (!placeId) {
    return NextResponse.json({ error: 'Business not found' }, { status: 500 })
  }

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`,
    {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
      next: { revalidate: 3600 },
    }
  )
  const data = await res.json()

  const reviews = [...((data.reviews ?? []) as NewReview[])]
    .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
    .slice(0, 3)
    .map(r => ({
      author_name: r.authorAttribution.displayName,
      rating: r.rating,
      text: r.text?.text ?? '',
      profile_photo_url: r.authorAttribution.photoUri,
      relative_time_description: r.relativePublishTimeDescription,
    }))

  return NextResponse.json({
    reviews,
    rating: data.rating,
    total: data.userRatingCount,
  })
}
