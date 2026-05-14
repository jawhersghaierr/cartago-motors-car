import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(prix)
}

export function formatKilometrage(km: number): string {
  return new Intl.NumberFormat('fr-FR').format(km) + ' km'
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function getStatutColor(statut: string): string {
  const colors: Record<string, string> = {
    disponible: 'text-white bg-emerald-500 border-emerald-600',
    réservé: 'text-white bg-black border-black',
    vendu: 'text-white bg-red-500 border-red-600',
    nouveau: 'text-white bg-blue-500 border-blue-600',
    contacté: 'text-white bg-purple-500 border-purple-600',
    en_négociation: 'text-white bg-gray-500 border-gray-600',
    finalisé: 'text-white bg-emerald-500 border-emerald-600',
    annulé: 'text-white bg-red-500 border-red-600',
  }
  return colors[statut] || 'text-white bg-gray-500 border-gray-600'
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    disponible: 'Disponible',
    réservé: 'Réservé',
    vendu: 'Vendu',
    nouveau: 'Nouveau',
    contacté: 'Contacté',
    en_négociation: 'En négociation',
    finalisé: 'Finalisé',
    annulé: 'Annulé',
    actif: 'Actif',
    inactif: 'Inactif',
  }
  return labels[statut] || statut
}

export function getFlagEmoji(pays: string): string {
  const flags: Record<string, string> = {
    'Tunisie': '🇹🇳', 'Algérie': '🇩🇿', 'Maroc': '🇲🇦', 'France': '🇫🇷',
    'Allemagne': '🇩🇪', 'Italie': '🇮🇹', 'Belgique': '🇧🇪', 'Espagne': '🇪🇸',
  }
  return flags[pays] || '🌍'
}

export function getCountryCode(pays: string): string {
  const codes: Record<string, string> = {
    'France': 'fr', 'Tunisie': 'tn', 'Algérie': 'dz', 'Maroc': 'ma',
    'Belgique': 'be', 'Suisse': 'ch', 'Allemagne': 'de', 'Italie': 'it',
    'Espagne': 'es', 'Pays-Bas': 'nl', 'Royaume-Uni': 'gb',
  }
  return codes[pays] || ''
}
