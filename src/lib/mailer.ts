import nodemailer from 'nodemailer'
import { getDb } from '@/lib/db'

export async function getSmtpSettings() {
  const db = getDb()
  const res = await db.execute('SELECT key, value FROM settings')
  const s: Record<string, string> = {}
  res.rows.forEach(r => { s[r.key as string] = r.value as string })
  return s
}

export function createTransporter(s: Record<string, string>) {
  const port = parseInt(s.smtp_port || '587')
  const secure = port === 465

  return nodemailer.createTransport({
    host: s.smtp_host,
    port,
    secure,
    auth: { user: s.smtp_user, pass: s.smtp_pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
    },
  })
}
