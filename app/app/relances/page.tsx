import { createClient } from '@/lib/supabase/server'
import { differenceInDays, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import RelanceActions from './RelanceActions'
import { Client, Devis, Relance } from '@/types/database'

interface DevisWithClient extends Devis {
  clients: { name: string } | null
}

export default async function RelancesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [clientsRes, devisRes, relancesRes] = await Promise.all([
    supabase
      .from('clients')
      .select('*')
      .eq('user_id', user!.id)
      .not('last_interaction', 'is', null),
    supabase
      .from('devis')
      .select('*, clients(name)')
      .eq('user_id', user!.id)
      .eq('status', 'pending'),
    supabase
      .from('relances')
      .select('*')
      .eq('user_id', user!.id)
      .order('sent_at', { ascending: false })
      .limit(20),
  ])

  const clients = (clientsRes.data ?? []) as unknown as Client[]
  const devis = (devisRes.data ?? []) as unknown as DevisWithClient[]
  const relancesHistory = (relancesRes.data ?? []) as unknown as Relance[]

  const clientsInactifs = clients.filter((c) => {
    if (!c.last_interaction) return false
    return differenceInDays(new Date(), parseISO(c.last_interaction)) > 60
  })

  const devisARelancer = devis.filter((d) => {
    return differenceInDays(new Date(), parseISO(d.sent_at)) >= 3
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relances</h1>
        <p className="text-gray-500 mt-1">
          Relancez vos clients au bon moment, sans effort.
        </p>
      </div>

      <div className="space-y-6">
        {/* Devis à relancer */}
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Devis en attente</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Devis non signés depuis plus de 3 jours
              </p>
            </div>
            <span className="bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1 rounded-full">
              {devisARelancer.length}
            </span>
          </div>

          {devisARelancer.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">Aucun devis en attente. Bravo ! 🎉</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {devisARelancer.map((devis) => {
                const daysWaiting = differenceInDays(new Date(), parseISO(devis.sent_at))
                return (
                  <li key={devis.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{(devis.clients as { name: string } | null)?.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {devis.title}
                          {devis.amount && (
                            <span className="ml-2 text-gray-700 font-medium">
                              — {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(devis.amount)}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-amber-600 mt-1 font-medium">
                          Envoyé il y a {daysWaiting} jour{daysWaiting > 1 ? 's' : ''}
                        </p>
                      </div>
                      <RelanceActions
                        type="devis"
                        clientId={devis.client_id}
                        devisId={devis.id}
                        userId={user!.id}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Clients inactifs */}
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Clients inactifs</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Clients sans interaction depuis plus de 60 jours
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
              {clientsInactifs.length}
            </span>
          </div>

          {clientsInactifs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">Tous vos clients sont actifs. 👍</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {clientsInactifs.map((client) => {
                const daysInactive = differenceInDays(new Date(), parseISO(client.last_interaction!))
                return (
                  <li key={client.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          Inactif depuis {daysInactive} jours
                        </p>
                        {client.email && (
                          <p className="text-xs text-gray-400 mt-0.5">{client.email}</p>
                        )}
                      </div>
                      <RelanceActions
                        type="inactif"
                        clientId={client.id}
                        userId={user!.id}
                        hasEmail={!!client.email}
                        hasPhone={!!client.phone}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Historique */}
        {relancesHistory.length > 0 && (
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Historique des relances</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {relancesHistory.map((r) => (
                <li key={r.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      r.status === 'responded' ? 'bg-green-100' : r.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {r.type === 'devis' ? '📄' : r.type === 'inactif' ? '💤' : '⭐'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {r.type === 'devis' ? 'Relance devis' : r.type === 'inactif' ? 'Client inactif' : 'Demande d\'avis'}
                        {' '}via {r.channel === 'email' ? 'email' : 'SMS'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(r.sent_at), 'd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    r.status === 'responded' ? 'bg-green-100 text-green-700' :
                    r.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {r.status === 'responded' ? 'Répondu' : r.status === 'failed' ? 'Échec' : 'Envoyé'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
