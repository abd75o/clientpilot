import { createClient } from '@/lib/supabase/server'
import ProfilForm from './ProfilForm'
import AbonnementSection from './AbonnementSection'

export default async function ParametresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = rawProfile as any

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez votre compte et votre abonnement.</p>
      </div>

      <div className="space-y-6">
        {/* Profil */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Mon profil</h2>
          <ProfilForm profile={profile} />
        </section>

        {/* Abonnement */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Mon abonnement</h2>
          <AbonnementSection profile={profile} />
        </section>

        {/* Email de connexion */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Compte</h2>
          <p className="text-sm text-gray-500 mb-4">
            Email de connexion : <strong className="text-gray-700">{user?.email}</strong>
          </p>
          <a
            href="/auth/mot-de-passe-oublie"
            className="text-sm text-blue-600 hover:underline"
          >
            Changer mon mot de passe
          </a>
        </section>
      </div>
    </div>
  )
}
