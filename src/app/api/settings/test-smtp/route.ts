import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'
import { getSmtpSettings, createTransporter } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const { to } = await request.json()
    const s = await getSmtpSettings()

    if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) {
      return NextResponse.json({ error: 'Configuration SMTP incomplète' }, { status: 400 })
    }

    const transporter = createTransporter(s)
    await transporter.sendMail({
      from: s.smtp_from || s.smtp_user,
      to: to || s.smtp_user,
      subject: 'Test SMTP — Cartago Motors',
      html: `<p>La configuration SMTP de <strong>${s.company_name || 'Cartago Motors'}</strong> fonctionne correctement.</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur SMTP' }, { status: 500 })
  }
}
