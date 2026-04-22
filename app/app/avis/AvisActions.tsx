'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Star } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
}

export default function AvisActions({
  clients,
  userId,
}: {
  clients: Client[]
  userId: string
}) {
  const router = useRouter()
  const [selectedClientId, setSelectedClientId] = useState('')
  const [channel, setChannel] = useState<'email' | 'sms'>('email')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const selectedClient = clients.find((c) => c.id === selectedClientId)
  const hasEmail = !!selectedClient?.email
  const hasPhone = !!selectedClient?.phone

  async function handleSend() {
    if (!selectedClientId) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/relances/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'avis',
          clientId: selectedClientId,
          channel,
          userId,
        }),
      })

      if (res.ok) {
        setSent(true)
        router.refresh()
      } else {
        setError('Impossible d\'envoyer la demande. Vérifiez les coordonnées du client.')
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="text-green-600 fill-green-600" size={20} />
        </div>
        <p className="font-medium text-gray-900">Demande envoyée !</p>
        <p className="text-sm text-gray-500 mt-1">
          {selectedClient?.name} a reçu votre demande d&apos;avis.
        </p>
        <button
          onClick={() => { setSent(false); setSelectedClientId('') }}
          className="mt-4 text-blue-600 text-sm hover:underline"
        >
          Envoyer une autre demande
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
          Choisir un client
        </label>
        <select
          id="client"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="">Sélectionner un client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedClientId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Envoyer via
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChannel('email')}
              disabled={!hasEmail}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                channel === 'email' && hasEmail
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Mail size={14} />
              Email
              {!hasEmail && <span className="text-xs">(non renseigné)</span>}
            </button>
            <button
              type="button"
              onClick={() => setChannel('sms')}
              disabled={!hasPhone}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                channel === 'sms' && hasPhone
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <Phone size={14} />
              SMS
              {!hasPhone && <span className="text-xs">(non renseigné)</span>}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={!selectedClientId || loading || (!hasEmail && !hasPhone)}
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Star size={16} />
        )}
        {loading ? 'Envoi…' : 'Envoyer la demande d\'avis'}
      </button>
    </div>
  )
}
