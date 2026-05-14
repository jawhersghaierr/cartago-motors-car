'use client'

interface Part {
  type: 'text' | 'flag'
  content: string
}

// Regional Indicator Symbols in UTF-16 surrogate pairs: 🇦–🇿
const FLAG_REGEX = /(\uD83C[\uDDE6-\uDDFF]){2}/g

function surrogateToLetter(low: number): string {
  // low surrogate \uDDE6 = 'A', \uDDE7 = 'B', etc.
  return String.fromCharCode(low - 0xDDE6 + 65)
}

function parse(text: string): Part[] {
  const parts: Part[] = []
  FLAG_REGEX.lastIndex = 0
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = FLAG_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    // Each flag = 4 chars (2 surrogate pairs). Extract low surrogates at pos 1 and 3.
    const code = (
      surrogateToLetter(match[0].charCodeAt(1)) +
      surrogateToLetter(match[0].charCodeAt(3))
    ).toLowerCase()
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
