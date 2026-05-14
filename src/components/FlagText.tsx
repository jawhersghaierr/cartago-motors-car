'use client'

interface Part {
  type: 'text' | 'flag'
  content: string
}

function parse(text: string): Part[] {
  const parts: Part[] = []
  // Regional Indicator Symbols: U+1F1E6–U+1F1FF (pairs = country flags)
  const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/gu
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = flagRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    const codePoints = [...match[0]].map(c => (c.codePointAt(0) ?? 0) - 0x1F1E6 + 65)
    const code = codePoints.map(cp => String.fromCharCode(cp)).join('').toLowerCase()
    parts.push({ type: 'flag', content: code })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

interface Props {
  text: string
  className?: string
}

export default function FlagText({ text, className }: Props) {
  const parts = parse(text)

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === 'flag' ? (
          <img
            key={i}
            src={`https://flagcdn.com/20x15/${part.content}.png`}
            srcSet={`https://flagcdn.com/40x30/${part.content}.png 2x`}
            alt={part.content.toUpperCase()}
            width={20}
            height={15}
            className="inline-block mx-0.5 align-middle"
          />
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </span>
  )
}
