'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import VoitureForm from '@/components/admin/VoitureForm'

export default function EditVoiturePage() {
  const params = useParams()
  const [voiture, setVoiture] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/voitures/${params.id}`)
      .then(r => r.json())
      .then(d => { setVoiture(d); setLoading(false) })
  }, [params.id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!voiture) return <div className="text-carbon-400 p-8">Voiture introuvable</div>

  return <VoitureForm voiture={voiture} isEdit />
}
