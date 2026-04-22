'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2 } from 'lucide-react'

export default function ClientActions({
  clientId,
  clientName,
}: {
  clientId: string
  clientName: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('clients').delete().eq('id', clientId)
    router.push('/app/clients')
    router.refresh()
  }

  return (
    <div className="flex gap-3">
      <Link
        href={`/app/clients/${clientId}/modifier`}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Pencil size={15} />
        Modifier
      </Link>

      {!confirmDelete ? (
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
          Supprimer
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm text-red-700">Confirmer ?</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-60"
          >
            {deleting ? 'Suppression…' : 'Oui, supprimer'}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
