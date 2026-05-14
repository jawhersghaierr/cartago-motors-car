import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSettings } from '@/services/settings'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nom, telephone, message, vehicule } = body

    const settings = await getSettings()
    const to = settings.email
    if (!to) return NextResponse.json({ error: 'Aucun email configuré dans les paramètres.' }, { status: 400 })

    await resend.emails.send({
      from: 'Cartago Motors <onboarding@resend.dev>',
      to,
      subject: vehicule ? `Demande d'info — ${vehicule}` : 'Nouveau message de contact',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a;margin-bottom:4px">${vehicule ? `Intérêt pour : ${vehicule}` : 'Nouveau message de contact'}</h2>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Téléphone :</strong> ${telephone}</p>
          ${message ? `<p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi.' }, { status: 500 })
  }
}
