'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import { Client } from '@/types/database'

export default function ModifierClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [clientId, setClientId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    last_interaction: '',
    status: 'active' as 'active' | 'inactive' | 'prospect',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    params.then(({ id }) => {
      setClientId(id)
      const supabase = createClient()
      supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          const clientData = data as unknown as Client | null
          if (clientData) {
            setFormData({
              name: clientData.name,
              email: clientData.email ?? '',
              phone: clientData.phone ?? '',
              last_interaction: clientData.last_interaction ?? '',
              status: clientData.status,
              notes: clientData.notes ?? '',
            })
          }
          setFetching(false)
        })
    })
  }, [params])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.from('clients').update({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      last_interaction: formData.last_interaction || null,
      status: formData.status,
      notes: formData.notes || null,
    } as never).eq('id', clientId)

    if (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
      return
    }

    router.push(`/app/clients/${clientId}`)
    router.refresh()
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/app/clients/${clientId}`}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le client</h1>
          <p className="text-gray-500 text-sm mt-0.5">{formData.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="last_interaction" className="block text-sm font-medium text-gray-700 mb-1">
              Dernière interaction
            </label>
            <input
              id="last_interaction"
              name="last_interaction"
              type="date"
              value={formData.last_interaction}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="active">Actif</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href={`/app/clients/${clientId}`}
              className="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
