import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import AvisActions from './AvisActions'
import { Star } from 'lucide-react'

interface AvisWithClient {
  id: string
  client_id: string
  requested_at: string
  responded: boolean
  rating: number | null
  clients: { name: string } | null
}

interface ClientOption {
  id: string
  name: string
  email: string | null
  phone: string | null
}

export default async function AvisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [clientsRes, avisRes] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name, email, phone')
      .eq('user_id', user!.id)
      .eq('status', 'active')
      .order('name'),
    supabase
      .from('avis')
      .select('*, clients(name)')
      .eq('user_id', user!.id)
      .order('requested_at', { ascending: false })
      .limit(20),
  ])

  const clients = (clientsRes.data ?? []) as unknown as ClientOption[]
  const avisHistory = (avisRes.data ?? []) as unknown as AvisWithClient[]

  const avisEnvoyes = avisHistory.length
  const avisRepondus = avisHistory.filter((a) => a.responded).length
  const tauxReponse = avisEnvoyes > 0
    ? Math.round((avisRepondus / avisEnvoyes) * 100)
    : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Avis clients</h1>
        <p className="text-gray-500 mt-1">
          Demandez un avis Google automatiquement après une vente.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{avisEnvoyes}</p>
          <p className="text-sm text-gray-500 mt-1">Demandes envoyées</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{avisRepondus}</p>
          <p className="text-sm text-gray-500 mt-1">Avis reçus</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-gray-900">{tauxReponse}%</p>
          <p className="text-sm text-gray-500 mt-1">Taux de réponse</p>
        </div>
      </div>

      {/* Demander un avis */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Demander un avis</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Sélectionnez un client et envoyez-lui une demande d&apos;avis Google.
          </p>
        </div>
        <div className="p-6">
          <AvisActions clients={clients} userId={user!.id} />
        </div>
      </section>

      {/* Historique */}
      {avisHistory.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Historique</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {avisHistory.map((avis) => (
              <li key={avis.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Star size={16} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {(avis.clients as { name: string } | null)?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Demande envoyée le {format(new Date(avis.requested_at), 'd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {avis.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: avis.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    avis.responded
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {avis.responded ? 'Avis reçu' : 'En attente'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
