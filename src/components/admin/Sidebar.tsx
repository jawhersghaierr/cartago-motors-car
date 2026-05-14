'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Car, LogOut, Settings, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

function SidebarContent({ onClose }: { onClose?: () => void }) {
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

  const navLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = pathname.startsWith(href)
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={17} />
        {label}
      </Link>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Cartago Motors</p>
            <p className="text-slate-500 text-xs">Administration</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navLink('/admin/cars', 'Voitures', Car)}
        {navLink('/admin/settings', 'Paramètres', Settings)}
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
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Topbar mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
            <Car size={13} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">Cartago Motors</span>
        </div>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar desktop (fixe) + tiroir mobile */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-60 bg-slate-900 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>
    </>
  )
}
