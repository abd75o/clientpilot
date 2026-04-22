import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { differenceInDays, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ClientsTable from './ClientsTable'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
          <p className="text-gray-500 mt-1">
            {clients?.length ?? 0} client{(clients?.length ?? 0) > 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/app/clients/nouveau"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Ajouter un client
        </Link>
      </div>

      <ClientsTable clients={clients ?? []} />
    </div>
  )
}
