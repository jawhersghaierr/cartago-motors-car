'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CarContactModalProps {
  brand: string
  model: string
  year: number
}

export default function CarContactModal({ brand, model, year }: CarContactModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputClass = 'w-full bg-gray-50 dark:bg-carbon-900 border border-carbon-200 dark:border-carbon-800 rounded-xl px-4 py-3 text-carbon-950 dark:text-white placeholder-carbon-400 dark:placeholder-carbon-600 focus:outline-none focus:border-gold-500 transition-colors text-sm'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, vehicule: `${brand} ${model} (${year})` }),
      })
      if (!res.ok) throw new Error()
      toast.success('Message envoyé ! Nous vous répondrons sous 24h.')
      setOpen(false)
      form.reset()
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-center gap-2 text-base py-4 rounded-lg font-semibold bg-gold-500 hover:bg-gold-400 text-black transition-colors">
          <MessageSquare size={18} />
          Je suis intéressé
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-carbon-950 border border-carbon-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-carbon-950 dark:text-white text-lg font-bold">
            Demande d&apos;information
          </DialogTitle>
          <p className="text-carbon-500 dark:text-carbon-400 text-sm mt-1">
            {brand} {model} — {year}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Nom *</label>
            <input name="nom" required placeholder="Votre nom" className={inputClass} />
          </div>
          <div>
            <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Téléphone *</label>
            <input name="telephone" required type="tel" placeholder="+216 XX XXX XXX" className={inputClass} />
          </div>
          <div>
            <label className="text-carbon-500 dark:text-carbon-400 text-xs uppercase tracking-wider mb-1.5 block">Message</label>
            <textarea
              name="message"
              rows={3}
              defaultValue={`Bonjour, je suis intéressé par le ${brand} ${model} (${year}). Pouvez-vous me contacter ?`}
              className={`${inputClass} resize-none`}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 h-auto"
          >
            <Send size={15} className="mr-2" />
            {loading ? 'Envoi…' : 'Envoyer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
