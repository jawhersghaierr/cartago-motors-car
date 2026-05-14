import { getCountryCode } from '@/lib/utils'

interface FlagProps {
  pays: string
  size?: number
  className?: string
}

export default function Flag({ pays, size = 18, className = '' }: FlagProps) {
  const code = getCountryCode(pays)
  if (!code) return <span className={`text-base ${className}`}>🌍</span>
  const w = Math.round(size * 4 / 3)
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      width={w}
      height={size}
      alt={pays}
      className={`inline-block object-cover rounded-sm flex-shrink-0 ${className}`}
    />
  )
}
