import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans, Instrument_Serif } from 'next/font/google'
import './lata.css'

const display = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' })
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic', 'normal'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'LATA — La canette isotherme illustrée',
  description:
    "Canette isotherme en acier inoxydable, illustrée à la main de six villes d'Espagne. 12 h au frais, 6 h au chaud, 500 ml.",
}

export default function LataLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} ${serif.variable}`}>{children}</div>
}
