'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Car, LogOut, Settings } from 'lucide-react'
import { toast } from 'sonner'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      toast.success('Déconnexion réussie')
      router.push('/admin/login')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Cartago Motors</p>
            <p className="text-slate-500 text-xs">Administration</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        <Link
          href="/admin/cars"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith('/admin/cars')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Car size={17} />
          Voitures
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith('/admin/settings')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={17} />
          Paramètres
        </Link>
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
