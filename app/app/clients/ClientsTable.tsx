'use client'

import { useState } from 'react'
import Link from 'next/link'
import { differenceInDays, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Search, Phone, Mail, ChevronRight } from 'lucide-react'
import { Client } from '@/types/database'

const STATUS_LABELS = {
  active: { label: 'Actif', class: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-600' },
  prospect: { label: 'Prospect', class: 'bg-blue-100 text-blue-700' },
}

export default function ClientsTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('')

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? '').includes(search)
  )

  function getInactivityBadge(lastInteraction: string | null) {
    if (!lastInteraction) return null
    const days = differenceInDays(new Date(), parseISO(lastInteraction))
    if (days > 60) {
      return (
        <span className="text-xs text-red-600 font-medium">
          Inactif depuis {days} j
        </span>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">
            {search ? 'Aucun client trouvé pour cette recherche.' : 'Vous n\'avez pas encore de clients.'}
          </p>
          {!search && (
            <Link
              href="/app/clients/nouveau"
              className="inline-block mt-3 text-blue-600 text-sm font-medium hover:underline"
            >
              Ajouter votre premier client →
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filtered.map((client) => {
            const status = STATUS_LABELS[client.status] ?? STATUS_LABELS.active
            return (
              <li key={client.id}>
                <Link
                  href={`/app/clients/${client.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-semibold text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {client.email && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={11} />
                            {client.email}
                          </span>
                        )}
                        {client.phone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone size={11} />
                            {client.phone}
                          </span>
                        )}
                      </div>
                      {client.last_interaction && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            Dernière interaction : {format(parseISO(client.last_interaction), 'd MMM yyyy', { locale: fr })}
                          </span>
                          {getInactivityBadge(client.last_interaction)}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
