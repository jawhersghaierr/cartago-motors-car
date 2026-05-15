import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getSettings } from '@/services/settings'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nom, telephone, message, vehicule } = body

    let to = process.env.CONTACT_EMAIL ?? null
    if (!to) {
      const settings = await getSettings()
      to = settings.email
    }
    if (!to) return NextResponse.json({ error: 'Aucun email destinataire configuré.' }, { status: 400 })

    await transporter.sendMail({
      from: `"Cartago Motors" <${process.env.SMTP_USER}>`,
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
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi.' }, { status: 500 })
  }
}
