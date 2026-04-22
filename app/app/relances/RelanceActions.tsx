'use client'

import { useState } from 'react'
import { Send, Mail, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RelanceActionsProps {
  type: 'devis' | 'inactif' | 'avis'
  clientId: string
  userId: string
  devisId?: string
  hasEmail?: boolean
  hasPhone?: boolean
}

export default function RelanceActions({
  type,
  clientId,
  userId,
  devisId,
  hasEmail = true,
  hasPhone = false,
}: RelanceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'email' | 'sms' | null>(null)
  const [sent, setSent] = useState<'email' | 'sms' | null>(null)

  async function sendRelance(channel: 'email' | 'sms') {
    setLoading(channel)
    try {
      const res = await fetch('/api/relances/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, clientId, devisId, channel, userId }),
      })

      if (res.ok) {
        setSent(channel)
        router.refresh()
      }
    } finally {
      setLoading(null)
    }
  }

  if (sent) {
    return (
      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
        <span>✓</span> Envoyé
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {hasEmail && (
        <button
          onClick={() => sendRelance('email')}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading === 'email' ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Mail size={14} />
          )}
          Email
        </button>
      )}
      {hasPhone && (
        <button
          onClick={() => sendRelance('sms')}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60 transition-colors"
        >
          {loading === 'sms' ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Phone size={14} />
          )}
          SMS
        </button>
      )}
    </div>
  )
}
