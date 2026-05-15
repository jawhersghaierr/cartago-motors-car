import { Toaster } from 'sonner'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 lg:overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
