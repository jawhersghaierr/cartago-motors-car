import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Cartago Motors, une société spécialisée dans l'export de véhicules premium depuis l'Europe vers le Maghreb (Tunisie, Algérie, Maroc).

Ton rôle : répondre de façon concise, professionnelle et chaleureuse aux questions des clients sur :
- Les véhicules disponibles (catalogue, marques, modèles, prix)
- Le processus d'export et de livraison (délais : 4 à 8 semaines)
- Les démarches douanières (dédouanement, homologation, certificat de conformité — tout est géré par Cartago)
- Les modes de paiement (virement SWIFT, remise documentaire, crédit documentaire — acompte requis)
- Les pays desservis (Tunisie, Algérie, Maroc)
- Les garanties et inspections (chaque véhicule inspecté avant expédition, rapport complet fourni)
- Les contacts (WhatsApp disponible 7j/7, réponse en moins d'1h)

Règles :
- Réponds toujours dans la langue du client (français, arabe, ou anglais)
- Sois concis : 2-3 phrases max par réponse
- Si tu ne sais pas, redirige vers WhatsApp ou le formulaire de contact
- Ne mentionne jamais de prix précis si tu ne les connais pas — propose un devis personnalisé
- Sois positif et rassurant`

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as {
    messages: { role: string; content: string }[]
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const data = await res.json()
  const content: string = data.choices?.[0]?.message?.content ?? ''

  return NextResponse.json({ content })
}
