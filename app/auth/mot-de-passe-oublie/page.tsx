'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/nouveau-mot-de-passe`,
    })

    if (error) {
      setError('Une erreur est survenue. Vérifiez votre adresse email.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
        <p className="text-gray-500 text-sm mb-4">
          Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe.
        </p>
        <Link href="/auth/connexion" className="text-blue-600 text-sm hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mot de passe oublié ?</h1>
      <p className="text-gray-500 text-sm mb-6">
        Entrez votre email et nous vous enverrons un lien pour le réinitialiser.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="vous@exemple.fr"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Envoi…' : 'Envoyer le lien'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/auth/connexion" className="text-blue-600 hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </>
  )
}
