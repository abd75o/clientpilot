'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InscriptionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          business_name: formData.businessName,
        },
      },
    })

    if (error) {
      setError(error.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email.'
        : 'Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
        <p className="text-gray-500 text-sm">
          Nous avons envoyé un lien de confirmation à <strong>{formData.email}</strong>.
          Cliquez dessus pour activer votre compte.
        </p>
        <Link href="/auth/connexion" className="inline-block mt-4 text-blue-600 text-sm hover:underline">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer votre compte</h1>
      <p className="text-gray-500 text-sm mb-6">14 jours gratuits, sans carte bancaire</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Votre prénom et nom
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Marie Dupont"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de votre entreprise
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            required
            placeholder="Plomberie Dupont"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="marie@plomberie-dupont.fr"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="8 caractères minimum"
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
          {loading ? 'Création du compte…' : 'Créer mon compte gratuit'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          En créant un compte, vous acceptez nos{' '}
          <Link href="/conditions" className="underline hover:text-gray-600">conditions d&apos;utilisation</Link>
          {' '}et notre{' '}
          <Link href="/confidentialite" className="underline hover:text-gray-600">politique de confidentialité</Link>.
        </p>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?{' '}
        <Link href="/auth/connexion" className="text-blue-600 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  )
}
