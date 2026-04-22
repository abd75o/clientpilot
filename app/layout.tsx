import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClientPilot — Relancez vos clients automatiquement',
  description: "Automatisez vos relances clients : devis non signés, clients inactifs, demandes d'avis Google. Simple, rapide, efficace.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>{children}</body>
    </html>
  )
}
