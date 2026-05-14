'use client'

import { useCompare } from '@/context/CompareContext'
import { useRouter } from 'next/navigation'
import { X, BarChart2 } from 'lucide-react'

export default function CompareBar() {
  const { selected, clear } = useCompare()
  const router = useRouter()

  if (selected.length === 0) return null

  const canCompare = selected.length === 2

  const handleCompare = () => {
    router.push(`/comparer?a=${selected[0]}&b=${selected[1]}`)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div className="bg-white dark:bg-carbon-900 border-t border-carbon-200 dark:border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BarChart2 size={18} className="text-gold-600 dark:text-gold-400 shrink-0" />
            <span className="text-sm font-medium text-carbon-700 dark:text-carbon-200">
              {canCompare
                ? '2 véhicules sélectionnés'
                : '1 véhicule sélectionné — sélectionnez-en un 2ème'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canCompare && (
              <button
                onClick={handleCompare}
                className="btn-gold flex items-center gap-2 text-sm py-2 px-5"
              >
                <BarChart2 size={15} />
                Comparer
              </button>
            )}
            <button
              onClick={clear}
              aria-label="Effacer la sélection"
              className="p-2 rounded-lg text-carbon-400 hover:text-carbon-700 dark:hover:text-white hover:bg-carbon-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
