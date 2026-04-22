import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Calendar, FileText } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import ClientActions from './ClientActions'
import { Client, Relance, Devis } from '@/types/database'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rawClient } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!rawClient) notFound()

  const client = rawClient as unknown as Client

  const { data: rawRelances } = await supabase
    .from('relances')
    .select('*')
    .eq('client_id', id)
    .order('sent_at', { ascending: false })
    .limit(5)

  const { data: rawDevis } = await supabase
    .from('devis')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  const relances = (rawRelances ?? []) as unknown as Relance[]
  const devis = (rawDevis ?? []) as unknown as Devis[]

  const STATUS_LABELS: Record<string, { label: string; class: string }> = {
    active: { label: 'Actif', class: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-600' },
    prospect: { label: 'Prospect', class: 'bg-blue-100 text-blue-700' },
  }

  const status = STATUS_LABELS[client.status] ?? STATUS_LABELS.active

  const daysSinceInteraction = client.last_interaction
    ? differenceInDays(new Date(), parseISO(client.last_interaction))
    : null

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/app/clients"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.class}`}>
          {status.label}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Informations</h2>
        <dl className="space-y-3">
          {client.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="text-sm text-gray-900">{client.email}</dd>
              </div>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-400">Téléphone</dt>
                <dd className="text-sm text-gray-900">{client.phone}</dd>
              </div>
            </div>
          )}
          {client.last_interaction && (
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-400">Dernière interaction</dt>
                <dd className="text-sm text-gray-900 flex items-center gap-2">
                  {format(parseISO(client.last_interaction), 'd MMMM yyyy', { locale: fr })}
                  {daysSinceInteraction !== null && daysSinceInteraction > 60 && (
                    <span className="text-xs text-red-600 font-medium">
                      ({daysSinceInteraction} jours sans contact)
                    </span>
                  )}
                </dd>
              </div>
            </div>
          )}
          {client.notes && (
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-gray-400">Notes</dt>
                <dd className="text-sm text-gray-900 whitespace-pre-line">{client.notes}</dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      <ClientActions clientId={client.id} clientName={client.name} />

      {relances.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
          <h2 className="font-semibold text-gray-900 mb-4">Historique des relances</h2>
          <ul className="space-y-2">
            {relances.map((r) => (
              <li key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {r.type === 'devis' ? '📄 Relance devis' : r.type === 'inactif' ? '💤 Client inactif' : '⭐ Demande d\'avis'}
                  {' '}via {r.channel === 'email' ? 'email' : 'SMS'}
                </span>
                <span className="text-gray-400 text-xs">
                  {format(new Date(r.sent_at), 'd MMM', { locale: fr })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {devis.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
          <h2 className="font-semibold text-gray-900 mb-4">Devis</h2>
          <ul className="space-y-2">
            {devis.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-900">{d.title}</span>
                <div className="flex items-center gap-3">
                  {d.amount && (
                    <span className="text-gray-600">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(d.amount)}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    d.status === 'signed' ? 'bg-green-100 text-green-700' :
                    d.status === 'refused' ? 'bg-red-100 text-red-700' :
                    d.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status === 'signed' ? 'Signé' : d.status === 'refused' ? 'Refusé' : d.status === 'expired' ? 'Expiré' : 'En attente'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
