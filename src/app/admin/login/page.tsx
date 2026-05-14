'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const data = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
        }),
      })

      if (!res.ok) {
        toast.error('Identifiants incorrects')
        return
      }

      router.push('/admin/cars')
      router.refresh()
    } catch {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 mb-4 shadow-sm">
            <Car size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Cartago Motors</h1>
          <p className="text-slate-500 text-sm mt-1">Connexion à l'administration</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Identifiant</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                required
                autoFocus
                placeholder="admin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 size={15} className="animate-spin mr-2" />}
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
