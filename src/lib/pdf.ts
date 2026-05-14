import puppeteer from 'puppeteer-core'

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Chromium/Application/chromium.exe',
]

export async function generatePdf(html: string): Promise<Buffer> {
  let executablePath = ''
  const fs = await import('fs')
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) { executablePath = p; break }
  }
  if (!executablePath) throw new Error('Chrome introuvable. Installez Google Chrome.')

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
