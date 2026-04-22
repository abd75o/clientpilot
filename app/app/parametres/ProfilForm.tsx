'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile } from '@/types/database'

export default function ProfilForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: profile?.full_name ?? '',
    business_name: profile?.business_name ?? '',
    phone: profile?.phone ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name || null,
        business_name: formData.business_name || null,
        phone: formData.phone || null,
      })
      .eq('id', profile!.id)

    if (error) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } else {
      setSuccess(true)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Prénom et nom
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Marie Dupont"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de l&apos;entreprise
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          value={formData.business_name}
          onChange={handleChange}
          placeholder="Plomberie Dupont"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="06 12 34 56 78"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          Profil mis à jour avec succès.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
