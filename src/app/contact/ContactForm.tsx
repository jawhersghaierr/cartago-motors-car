'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.')
      form.reset()
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white dark:bg-carbon-900 border border-carbon-200 dark:border-carbon-800 rounded-xl px-4 py-3 text-carbon-950 dark:text-white placeholder-carbon-400 dark:placeholder-carbon-600 focus:outline-none focus:border-gold-500 transition-colors text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Nom *</label>
          <input name="nom" required placeholder="Votre nom" className={inputClass} />
        </div>
        <div>
          <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Pays *</label>
          <input name="pays" required placeholder="Tunisie, Algérie…" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Téléphone *</label>
        <input name="telephone" required type="tel" placeholder="+216 XX XXX XXX" className={inputClass} />
      </div>
      <div>
        <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
        <input name="email" type="email" placeholder="votre@email.com" className={inputClass} />
      </div>
      <div>
        <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Votre message *</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Décrivez le véhicule recherché ou posez vos questions…"
          className={`${inputClass} resize-none`}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 h-auto">
        <Send size={16} className="mr-2" />
        {loading ? 'Envoi…' : 'Envoyer le message'}
      </Button>
    </form>
  )
}
