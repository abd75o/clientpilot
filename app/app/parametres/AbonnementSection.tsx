'use client'

import { useState } from 'react'
import { Profile } from '@/types/database'
import { Check, CreditCard } from 'lucide-react'

const PLANS = [
  {
    id: 'monthly',
    name: 'Mensuel',
    price: '39€',
    period: '/mois',
    description: 'Idéal pour commencer',
    features: ['Clients illimités', 'Relances automatiques', 'Avis Google', 'Support email'],
  },
  {
    id: 'yearly',
    name: 'Annuel',
    price: '390€',
    period: '/an',
    badge: '2 mois offerts',
    description: 'La meilleure valeur',
    features: ['Tout du plan mensuel', '2 mois gratuits', 'Support prioritaire', 'Export CSV'],
  },
]

export default function AbonnementSection({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState<string | null>(null)

  const isActive = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  const currentPlan = profile?.subscription_plan

  async function handleSubscribe(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  async function handleManage() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  if (isActive) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="text-green-600" size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              Plan {currentPlan === 'yearly' ? 'Annuel' : 'Mensuel'} actif
            </p>
            <p className="text-sm text-gray-500">
              {profile?.subscription_status === 'trialing' ? 'Période d\'essai en cours' : 'Abonnement actif'}
            </p>
          </div>
        </div>
        <button
          onClick={handleManage}
          disabled={loading === 'portal'}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          <CreditCard size={15} />
          {loading === 'portal' ? 'Redirection…' : 'Gérer mon abonnement'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        Choisissez votre formule pour accéder à toutes les fonctionnalités.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border-2 p-5 ${
              plan.id === 'yearly'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <h3 className="font-semibold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{plan.description}</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                plan.id === 'yearly'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {loading === plan.id ? 'Redirection…' : 'Choisir ce plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
