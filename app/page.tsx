import Link from 'next/link'
import { Check, ArrowRight, Send, Star, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ClientPilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/connexion" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Connexion
            </Link>
            <Link
              href="/auth/inscription"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Star size={14} className="fill-current" />
            14 jours d&apos;essai gratuit — aucune carte requise
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Ne perdez plus jamais<br />un client par oubli
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            ClientPilot relance automatiquement vos devis non signés, repère vos clients inactifs,
            et vous aide à obtenir des avis Google — sans effort de votre part.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/inscription"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors text-lg"
            >
              Commencer gratuitement
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth/connexion"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users size={24} className="text-blue-600" />,
                title: 'Gestion clients',
                desc: 'Centralisez vos contacts avec toutes leurs infos en un seul endroit.',
              },
              {
                icon: <Send size={24} className="text-green-600" />,
                title: 'Relance automatique',
                desc: 'Vos devis non signés sont relancés automatiquement après 3 jours.',
              },
              {
                icon: <Star size={24} className="text-yellow-500" />,
                title: 'Avis Google',
                desc: 'Demandez des avis clients automatiquement après chaque vente.',
              },
              {
                icon: <TrendingUp size={24} className="text-purple-600" />,
                title: 'Tableau de bord',
                desc: 'Visualisez votre activité : relances envoyées, taux de réponse.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Un tarif simple et honnête
          </h2>
          <p className="text-gray-500 text-center mb-12">14 jours gratuits, sans engagement.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="font-bold text-xl text-gray-900 mb-1">Mensuel</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">39€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Clients illimités', 'Relances automatiques', 'Avis Google', 'Support email'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-600">
                    <Check size={16} className="text-green-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/inscription"
                className="block text-center w-full py-3 border border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Commencer l&apos;essai gratuit
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-blue-600 p-8 bg-blue-50 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full whitespace-nowrap">
                2 mois offerts
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Annuel</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">390€</span>
                <span className="text-gray-500">/an</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Tout du plan mensuel', '2 mois gratuits', 'Support prioritaire', 'Export CSV'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-600">
                    <Check size={16} className="text-blue-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/inscription"
                className="block text-center w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Commencer l&apos;essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">CP</span>
            </div>
            <span className="font-semibold text-gray-700">ClientPilot</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 ClientPilot. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
