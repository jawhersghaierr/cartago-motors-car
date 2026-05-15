'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { MessageCircle, X, Send, RotateCcw, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

type Role    = 'user' | 'assistant'
type Message = { role: Role; content: string }

const WELCOME = "Bonjour 👋 Je suis l'assistant Cartago Motors. Posez-moi vos questions sur nos véhicules, l'export, les délais ou les prix !"

const SUGGESTIONS = [
  'Comment passer commande ?',
  'Quels pays livrez-vous ?',
  'Quel est le délai de livraison ?',
  'Comment se passe le dédouanement ?',
]

// ── Button / window base offsets (px) ────────────────────────────────────────
const BTN_BOTTOM  = 96   // bottom-24
const WIN_BOTTOM  = 160  // above button (btn_bottom + btn_height + gap)
const RIGHT       = 24   // right-6

export default function ChatBot() {
  const pathname                = usePathname()
  const [open, setOpen]         = useState(false)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [history, setHistory]   = useState<Message[]>([])
  const [kbOffset, setKbOffset] = useState(0)   // keyboard height in px
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  // ── Track virtual keyboard via visualViewport ─────────────────────────────
  useEffect(() => {
    function update() {
      const vv = window.visualViewport
      if (!vv) return
      // keyboard height = difference between layout viewport and visual viewport
      const kh = Math.max(0, window.innerHeight - vv.height)
      setKbOffset(kh)
    }
    window.visualViewport?.addEventListener('resize', update)
    // Also fire on focus/blur as fallback for some Android browsers
    window.addEventListener('resize', update)
    return () => {
      window.visualViewport?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // ── Auto-scroll to last message ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  // ── Focus input when chat opens ───────────────────────────────────────────
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  // All hooks above — safe to early-return now
  if (pathname.startsWith('/admin')) return null

  // ── Dynamic positioning — translateY lifts both elements above the keyboard ─
  const lift      = kbOffset > 0 ? kbOffset : 0
  const btnStyle  = { bottom: BTN_BOTTOM, right: RIGHT, transform: `translateY(-${lift}px)` }
  const winStyle  = {
    bottom:    WIN_BOTTOM,
    right:     RIGHT,
    maxHeight: `calc(100dvh - ${WIN_BOTTOM + lift + 16}px)`,
    transform: `translateY(-${lift}px)`,
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const next = [...history, userMsg]
    setHistory(next)
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setHistory(prev => [...prev, {
        role:    'assistant',
        content: data.content ?? "Désolé, une erreur est survenue. Contactez-nous sur WhatsApp.",
      }])
    } catch {
      setHistory(prev => [...prev, {
        role:    'assistant',
        content: 'Erreur de connexion. Veuillez réessayer ou nous contacter sur WhatsApp.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent) { e.preventDefault(); send(input) }
  function reset() { setHistory([]); setInput('') }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-carbon-200 dark:border-white/10 bg-white dark:bg-carbon-950 transition-transform duration-200 ease-out w-[calc(100vw-3rem)] sm:w-80"
          style={winStyle}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gold-500 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                <MessageCircle size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-black leading-tight">Assistant Cartago</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                  <p className="text-[11px] text-black/70">En ligne · IA Llama 3</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={reset} title="Nouvelle conversation"
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
                <RotateCcw size={13} className="text-black/70" />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
                <X size={16} className="text-black" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            <BotBubble text={WELCOME} />
            {history.length === 0 && (
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-carbon-200 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/5 text-carbon-700 dark:text-carbon-300 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {history.map((msg, i) =>
              msg.role === 'user'
                ? <UserBubble key={i} text={msg.content} />
                : <BotBubble   key={i} text={msg.content} />
            )}
            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex-shrink-0 flex items-center justify-center">
                  <MessageCircle size={11} className="text-gold-600 dark:text-gold-400" />
                </div>
                <div className="bg-carbon-100 dark:bg-white/5 rounded-2xl rounded-tl-none px-3 py-2.5">
                  <Loader2 size={14} className="text-carbon-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input — stays visible above keyboard */}
          <form onSubmit={onSubmit}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-carbon-100 dark:border-white/5 bg-carbon-50 dark:bg-white/5 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Votre question…"
              disabled={loading}
              enterKeyHint="send"
              className="flex-1 text-sm bg-transparent outline-none text-carbon-900 dark:text-white placeholder:text-carbon-400 disabled:opacity-50"
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 hover:bg-gold-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={13} className="text-black" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Ouvrir le chatbot"
        style={btnStyle}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-black/30 transition-transform duration-200 ease-out hover:scale-110 active:scale-95 bg-carbon-900 dark:bg-white"
      >
        {open
          ? <X size={22} className="text-white dark:text-carbon-900" />
          : <MessageCircle size={22} className="text-white dark:text-carbon-900" />
        }
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-white dark:border-carbon-950" />
        )}
      </button>
    </>
  )
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex-shrink-0 flex items-center justify-center mt-0.5">
        <MessageCircle size={11} className="text-gold-600 dark:text-gold-400" />
      </div>
      <div className="bg-carbon-100 dark:bg-white/5 rounded-2xl rounded-tl-none px-3 py-2 text-sm text-carbon-800 dark:text-carbon-100 max-w-[85%] leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-gold-500 rounded-2xl rounded-tr-none px-3 py-2 text-sm text-black font-medium max-w-[85%] leading-relaxed">
        {text}
      </div>
    </div>
  )
}
