import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Fetch real inventory from Supabase ────────────────────────────────────────

async function getInventoryContext(): Promise<string> {
  const { data: cars, error } = await supabase
    .from('cars')
    .select('brand, model, year, fuel, transmission, mileage, price, price_ttc, status, color, engine, horsepower')
    .order('created_at', { ascending: false })

  if (error || !cars || cars.length === 0) {
    return 'Aucun véhicule trouvé dans le stock actuellement.'
  }

  const available  = cars.filter(c => c.status === 'available')
  const reserved   = cars.filter(c => c.status === 'reserved')
  const sold       = cars.filter(c => c.status === 'sold')

  type Car = (typeof cars)[number]
  function formatCar(c: Car) {
    const price = c.price_ttc ?? c.price
    const parts = [
      `${c.brand} ${c.model} ${c.year}`,
      c.fuel        ? `• Carburant: ${c.fuel}`           : null,
      c.transmission? `• Transmission: ${c.transmission}` : null,
      c.mileage     ? `• Kilométrage: ${c.mileage.toLocaleString('fr-FR')} km` : null,
      c.horsepower  ? `• Puissance: ${c.horsepower} ch`  : null,
      c.color       ? `• Couleur: ${c.color}`             : null,
      price         ? `• Prix: ${price.toLocaleString('fr-FR')} €` : '• Prix: sur demande',
    ]
    return parts.filter(Boolean).join('\n')
  }

  const lines: string[] = []

  if (available.length > 0) {
    lines.push(`=== VÉHICULES DISPONIBLES (${available.length}) ===`)
    available.forEach((c, i) => lines.push(`\n[${i + 1}]\n${formatCar(c)}`))
  } else {
    lines.push('=== AUCUN VÉHICULE DISPONIBLE ACTUELLEMENT ===')
  }

  if (reserved.length > 0) {
    lines.push(`\n=== VÉHICULES RÉSERVÉS (${reserved.length}) ===`)
    reserved.forEach((c, i) => lines.push(`\n[${i + 1}] ${c.brand} ${c.model} ${c.year} — RÉSERVÉ`))
  }

  if (sold.length > 0) {
    lines.push(`\n=== VÉHICULES VENDUS (${sold.length}) ===`)
    sold.forEach((c, i) => lines.push(`[${i + 1}] ${c.brand} ${c.model} ${c.year} — VENDU`))
  }

  return lines.join('\n')
}

// ── System prompt ─────────────────────────────────────────────────────────────

function buildSystemPrompt(inventory: string) {
  return `Tu es l'assistant virtuel de Cartago Motors, spécialisée dans l'export de véhicules premium depuis l'Europe vers le Maghreb (Tunisie, Algérie, Maroc).

STOCK ACTUEL EN TEMPS RÉEL :
${inventory}

INFORMATIONS SUR CARTAGO MOTORS :
- Pays desservis : Tunisie, Algérie, Maroc
- Délai de livraison : 4 à 8 semaines selon la destination
- Dédouanement : entièrement géré par Cartago (certificat de conformité, homologation, démarches douanières)
- Paiement : virement SWIFT, remise documentaire, crédit documentaire (LC) — acompte requis
- Inspection : chaque véhicule inspecté avant expédition, rapport complet fourni
- Contact : WhatsApp disponible 7j/7, réponse en moins d'1h

RÈGLES STRICTES :
- Réponds UNIQUEMENT avec les véhicules listés ci-dessus. Ne mentionne JAMAIS une voiture qui n'est pas dans ce stock.
- Si le client demande un modèle non disponible, dis-le honnêtement et propose les alternatives disponibles.
- Réponds dans la langue du client (français, arabe ou anglais).
- Sois concis : 2-4 phrases max sauf si le client veut plus de détails.
- Pour les prix, utilise exactement ceux du stock. Si pas de prix, dis "prix sur demande".
- Pour toute demande complexe (devis, commande), redirige vers WhatsApp.`
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: string; content: string }[]
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  // Fetch live inventory for every request
  const inventory    = await getInventoryContext()
  const systemPrompt = buildSystemPrompt(inventory)

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.4,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const data    = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  return NextResponse.json({ content })
}
