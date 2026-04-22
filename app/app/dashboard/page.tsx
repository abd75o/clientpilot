import { createClient } from '@/lib/supabase/server'
import { Users, Send, Star, AlertCircle } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'

async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  const [clientsRes, relancesRes, avisRes, devisRes] = await Promise.all([
    supabase.from('clients').select('id, last_interaction, status').eq('user_id', userId),
    supabase.from('relances').select('id, status').eq('user_id', userId),
    supabase.from('avis').select('id, responded').eq('user_id', userId),
    supabase.from('devis').select('id, status, sent_at').eq('user_id', userId).eq('status', 'pending'),
  ])

  type ClientRow = { id: string; last_interaction: string | null; status: string }
  type RelanceRow = { id: string; status: string }
  type AvisRow = { id: string; responded: boolean }
  type DevisRow = { id: string; status: string; sent_at: string }

  const clients = (clientsRes.data ?? []) as unknown as ClientRow[]
  const relances = (relancesRes.data ?? []) as unknown as RelanceRow[]
  const avis = (avisRes.data ?? []) as unknown as AvisRow[]
  const devisPending = (devisRes.data ?? []) as unknown as DevisRow[]

  const inactiveClients = clients.filter((c) => {
    if (!c.last_interaction) return false
    return differenceInDays(new Date(), parseISO(c.last_interaction)) > 60
  })

  const relancesEnvoyees = relances.length
  const relancesRepondues = relances.filter((r) => r.status === 'responded').length
  const tauxReponse = relancesEnvoyees > 0
    ? Math.round((relancesRepondues / relancesEnvoyees) * 100)
    : 0

  const devisARelancer = devisPending.filter((d) => {
    return differenceInDays(new Date(), parseISO(d.sent_at)) >= 3
  })

  return {
    totalClients: clients.length,
    clientsInactifs: inactiveClients.length,
    relancesEnvoyees,
    tauxReponse,
    avisEnvoyes: avis.length,
    devisARelancer: devisARelancer.length,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', user!.id)
    .single()

  const profile = rawProfile as unknown as { full_name: string | null; business_name: string | null } | null

  const stats = await getDashboardStats(user!.id)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'là'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Voici ce qui se passe avec vos clients aujourd&apos;hui.
        </p>
      </div>

      {/* Alertes */}
      {(stats.devisARelancer > 0 || stats.clientsInactifs > 0) && (
        <div className="mb-6 space-y-3">
          {stats.devisARelancer > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {stats.devisARelancer} devis{stats.devisARelancer > 1 ? ' sont' : ' est'} en attente depuis plus de 3 jours
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Allez dans <strong>Relances</strong> pour les envoyer automatiquement.
                </p>
              </div>
            </div>
          )}
          {stats.clientsInactifs > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-blue-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {stats.clientsInactifs} client{stats.clientsInactifs > 1 ? 's' : ''} inactif{stats.clientsInactifs > 1 ? 's' : ''} depuis plus de 60 jours
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Reprenez contact avant de les perdre définitivement.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Clients"
          value={stats.totalClients}
          subtitle="au total"
          icon={<Users className="text-blue-600" size={22} />}
          color="blue"
        />
        <StatCard
          title="Relances envoyées"
          value={stats.relancesEnvoyees}
          subtitle="depuis le début"
          icon={<Send className="text-green-600" size={22} />}
          color="green"
        />
        <StatCard
          title="Taux de réponse"
          value={`${stats.tauxReponse}%`}
          subtitle="sur vos relances"
          icon={<Send className="text-purple-600" size={22} />}
          color="purple"
        />
        <StatCard
          title="Avis demandés"
          value={stats.avisEnvoyes}
          subtitle="demandes d'avis"
          icon={<Star className="text-yellow-500" size={22} />}
          color="yellow"
        />
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            href="/app/clients/nouveau"
            title="Ajouter un client"
            description="Enregistrez les coordonnées d'un nouveau client"
            emoji="➕"
          />
          <QuickAction
            href="/app/relances"
            title="Envoyer des relances"
            description="Relancez vos devis et clients inactifs"
            emoji="📨"
          />
          <QuickAction
            href="/app/avis"
            title="Demander un avis"
            description="Invitez un client à laisser un avis Google"
            emoji="⭐"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'yellow'
}) {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    yellow: 'bg-yellow-50',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`w-9 h-9 ${bgColors[color]} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  )
}

function QuickAction({
  href,
  title,
  description,
  emoji,
}: {
  href: string
  title: string
  description: string
  emoji: string
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <span className="text-2xl mb-3 block">{emoji}</span>
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </a>
  )
}
