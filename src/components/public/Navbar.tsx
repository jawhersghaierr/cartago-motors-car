'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Car, Sun, Moon, Heart } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'
import { useFavorites } from '@/context/FavoritesContext'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Changer le thème"
      className="p-2 rounded-lg transition-colors text-carbon-500 hover:text-carbon-900 hover:bg-carbon-100 dark:text-carbon-400 dark:hover:text-white dark:hover:bg-white/5"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  function getLocalePath(targetLocale: string) {
    let path = pathname
    for (const loc of ['en', 'ar']) {
      if (path.startsWith(`/${loc}/`)) { path = path.slice(loc.length + 1); break }
      if (path === `/${loc}`) { path = '/'; break }
    }
    if (targetLocale === 'fr') return path || '/'
    return `/${targetLocale}${path === '/' ? '' : path}`
  }

  const locales = [
    { code: 'fr', country: 'fr', label: 'Français' },
    { code: 'en', country: 'gb', label: 'English' },
    { code: 'ar', country: 'sa', label: 'العربية' },
  ]

  return (
    <div className="flex items-center border border-carbon-200 dark:border-carbon-800 rounded-lg overflow-hidden">
      {locales.map(({ code, country, label }) => (
        <Link
          key={code}
          href={getLocalePath(code)}
          title={label}
          className={`flex items-center px-2 py-1.5 transition-colors ${
            locale === code
              ? 'bg-gold-500'
              : 'hover:bg-carbon-100 dark:hover:bg-white/5'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://flagcdn.com/20x15/${country}.png`}
            width={20}
            height={15}
            alt={label}
            className="rounded-sm"
          />
        </Link>
      ))}
    </div>
  )
}

interface NavbarProps {
  logoUrl?: string | null
  companyName?: string
}

export default function Navbar({ logoUrl, companyName = 'Cartago Motors' }: NavbarProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { favorites } = useFavorites()

  const prefix = locale === 'fr' ? '' : `/${locale}`

  const links = [
    { href: `${prefix}/home`,      label: t('home') },
    { href: `${prefix}/catalogue`, label: t('catalogue') },
    { href: `${prefix}/a-propos`,  label: t('about') },
    { href: `${prefix}/contact`,   label: t('contact') },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-carbon-950/90 backdrop-blur-md border-b border-carbon-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={prefix || '/'} className="flex items-center gap-2.5">
            {logoUrl ? (
              <Image src={logoUrl} alt={companyName} width={120} height={40} className="h-28 w-auto object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
                  <Car size={16} className="text-gold-600 dark:text-gold-400" />
                </div>
                <span className="text-carbon-950 dark:text-white font-bold text-base tracking-tight">{companyName}</span>
              </>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'text-gold-700 bg-gold-700/10 dark:text-gold-500 dark:bg-gold-500/10'
                    : 'text-carbon-600 hover:text-carbon-950 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link href={`${prefix}/favoris`} className="relative p-2 rounded-lg text-carbon-500 hover:text-red-500 hover:bg-red-500/10 dark:text-carbon-400 dark:hover:text-red-400 transition-colors">
              <Heart size={18} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="text-carbon-500 hover:text-carbon-900 dark:text-carbon-300 dark:hover:text-white p-2"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'text-gold-700 bg-gold-700/10 dark:text-gold-500 dark:bg-gold-500/10'
                    : 'text-carbon-600 hover:text-carbon-950 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link href={`${prefix}/favoris`} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-carbon-600 hover:text-carbon-950 hover:bg-carbon-100 dark:text-carbon-300 dark:hover:text-white dark:hover:bg-white/5 transition-colors">
              <Heart size={16} />
              {t('favourites')}
              {favorites.length > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
