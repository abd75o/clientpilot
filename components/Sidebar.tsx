'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Users,
  Send,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/app/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/app/clients', label: 'Mes clients', icon: Users },
  { href: '/app/relances', label: 'Relances', icon: Send },
  { href: '/app/avis', label: 'Avis clients', icon: Star },
  { href: '/app/parametres', label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/connexion')
    router.refresh()
  }

  const NavLinks = () => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">CP</span>
          </div>
          <span className="font-bold text-gray-900">ClientPilot</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 z-20 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavLinks />
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-gray-200">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">ClientPilot</span>
          </div>
        </div>

        <NavLinks />

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  )
}
