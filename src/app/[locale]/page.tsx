import { redirect } from 'next/navigation'

export default function LocaleRootPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale === 'fr' ? '' : locale + '/'}home`.replace('//', '/'))
}
