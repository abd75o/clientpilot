'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Droplets,
  Flame,
  Leaf,
  Minus,
  PenLine,
  Plus,
  Shield,
  ShoppingBag,
  Snowflake,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { Can } from './Can'
import { Artwork, CITIES, TILE_H, TILE_W } from './Artwork'

const COLORS = [
  { id: 'salvia', name: 'Salvia', hex: '#A9D6BC', deep: '#2f6b4f', tint: '#e3f1e8' },
  { id: 'cielo', name: 'Cielo', hex: '#8FB2E3', deep: '#23457a', tint: '#e2eaf7' },
  { id: 'rosa', name: 'Rosa', hex: '#EBA9AA', deep: '#8a3438', tint: '#f8e5e4' },
] as const

type ColorId = (typeof COLORS)[number]['id']
type CartItem = { key: string; color: ColorId; engraving: string; qty: number }

const PRICE = 24.9
const ENGRAVING_PRICE = 5
const FREE_SHIPPING = 45

const eur = (n: number) =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.lata-reveal')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export function LataSite() {
  const [active, setActive] = useState<ColorId>('cielo')
  const [engraving, setEngraving] = useState('')
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useReveal()

  const color = COLORS.find((c) => c.id === active)!
  const unit = PRICE + (engraving.trim() ? ENGRAVING_PRICE : 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.qty * (PRICE + (i.engraving ? ENGRAVING_PRICE : 0)), 0)
  const shippingLeft = Math.max(0, FREE_SHIPPING - subtotal)

  function addToCart() {
    const e = engraving.trim()
    const key = `${active}|${e}`
    setCart((c) => {
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...c, { key, color: active, engraving: e, qty }]
    })
    setToast(`${qty} × LATA ${color.name} ajoutée${qty > 1 ? 's' : ''} au panier`)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }

  function updateQty(key: string, delta: number) {
    setCart((c) =>
      c.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0),
    )
  }

  return (
    <div className="lata-root min-h-screen overflow-x-clip">
      {/* Announcement */}
      <div className="bg-[var(--ink)] text-[var(--cream)] text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-2 text-center">
          <Truck size={15} aria-hidden />
          Livraison offerte dès {FREE_SHIPPING} € · Expédition sous 48 h · Retours 30 jours
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--cream)_80%,transparent)] border-b border-black/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-baseline gap-1">
            <span className="lata-display text-3xl leading-none">LATA</span>
            <span className="h-2 w-2 rounded-full bg-[var(--terracotta)]" />
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#produit" className="hover:text-[var(--terracotta)] transition-colors">Produit</a>
            <a href="#illustration" className="hover:text-[var(--terracotta)] transition-colors">L’illustration</a>
            <a href="#boutique" className="hover:text-[var(--terracotta)] transition-colors">Boutique</a>
            <a href="#faq" className="hover:text-[var(--terracotta)] transition-colors">FAQ</a>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-[var(--ink)] text-[var(--cream)] pl-4 pr-5 h-10 text-sm font-medium hover:bg-black transition-colors"
            aria-label={`Ouvrir le panier (${cartCount} article${cartCount > 1 ? 's' : ''})`}
          >
            <ShoppingBag size={16} aria-hidden />
            Panier
            <span className="ml-1 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-[var(--terracotta)] text-[11px] font-bold">
              {cartCount}
            </span>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative lata-grain">
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{ background: `radial-gradient(60% 70% at 72% 45%, ${color.tint} 0%, transparent 70%)` }}
          aria-hidden
        />
        <div
          className="lata-display lata-outline absolute inset-x-0 top-6 text-center leading-none select-none pointer-events-none text-[34vw] md:text-[26vw]"
          aria-hidden
        >
          ESPAÑA
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="lata-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--terracotta)]" />
              Nouvelle collection · Edición España
            </p>
            <h1 className="mt-6 lata-display text-[64px] leading-[.9] sm:text-[88px] lg:text-[112px]">
              L’Espagne,
              <br />
              <span className="lata-serif normal-case text-[0.78em] tracking-normal" style={{ color: color.deep }}>
                à emporter.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-black/70 leading-relaxed">
              La canette isotherme en acier inoxydable, illustrée à la main de six villes
              espagnoles. Votre boisson reste fraîche 12 heures — le voyage, lui, dure toute la journée.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#boutique"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--terracotta)] text-white h-12 px-6 font-semibold shadow-[0_10px_30px_-10px_rgba(212,80,44,.7)] hover:brightness-110 transition"
              >
                Choisir ma couleur
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </a>
              <a
                href="#produit"
                className="inline-flex items-center h-12 px-6 rounded-full border border-black/15 font-semibold hover:bg-black/5 transition"
              >
                Découvrir
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex gap-2" role="radiogroup" aria-label="Couleur">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={active === c.id}
                    aria-label={c.name}
                    onClick={() => setActive(c.id)}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      active === c.id ? 'border-[var(--ink)] scale-110' : 'border-white'
                    }`}
                    style={{ background: c.hex, boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}
                  />
                ))}
              </div>
              <span className="text-sm text-black/60">
                Coloris <strong className="text-[var(--ink)]">{color.name}</strong> · {eur(PRICE)}
              </span>
            </div>
          </div>

          {/* three cans */}
          <div className="relative h-[440px] sm:h-[520px] lata-rise" style={{ animationDelay: '.15s' }}>
            {COLORS.map((c, i) => {
              const isActive = c.id === active
              const pos = [
                { left: '0%', top: '6%', r: '-6deg', delay: '0s' },
                { left: '32%', top: '14%', r: '0deg', delay: '-2s' },
                { left: '64%', top: '4%', r: '6deg', delay: '-4s' },
              ][i]
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  aria-label={`Voir le coloris ${c.name}`}
                  className="absolute w-[36%] transition-[filter,transform] duration-500"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    zIndex: isActive ? 3 : i === 1 ? 2 : 1,
                    filter: isActive ? 'none' : 'saturate(.8) brightness(.98)',
                    transform: isActive ? 'scale(1.06)' : 'scale(.96)',
                  }}
                >
                  <div className="lata-float" style={{ ['--r' as string]: pos.r, animationDelay: pos.delay }}>
                    <Can color={c.hex} speed={14 + i * 3} className="w-full h-auto drop-shadow-[0_30px_30px_rgba(0,0,0,.18)]" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* stats */}
        <div className="relative border-y border-black/10 bg-white/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-black/10">
            {[
              { k: '12 h', v: 'au frais' },
              { k: '6 h', v: 'au chaud' },
              { k: '500 ml', v: 'de contenance' },
              { k: '0 g', v: 'de plastique jetable' },
            ].map((s) => (
              <div key={s.v} className="py-6 px-4 text-center">
                <div className="lata-display text-4xl sm:text-5xl leading-none">{s.k}</div>
                <div className="mt-1 text-sm text-black/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[var(--terracotta)] text-white py-4 overflow-hidden" aria-hidden>
        <div className="lata-marquee flex w-max gap-10 whitespace-nowrap">
          {[...Array(2)].flatMap((_, k) =>
            ['Granada', 'Sevilla', 'Madrid', 'Toledo', 'Valencia', 'Bilbao', 'Salamanca', 'Córdoba', 'Barcelona', 'Ronda', 'Zaragoza', 'Málaga'].map((city) => (
              <span key={`${k}-${city}`} className="flex items-center gap-10 lata-display text-3xl tracking-wide">
                {city}
                <Star size={16} className="fill-current" />
              </span>
            )),
          )}
        </div>
      </div>

      {/* Product features */}
      <section id="produit" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl lata-reveal">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--terracotta)]">Le produit</p>
          <h2 className="mt-3 lata-display text-5xl sm:text-6xl leading-[.95]">
            La forme d’une canette. <span className="lata-serif normal-case">L’âme d’une gourde.</span>
          </h2>
          <p className="mt-4 text-lg text-black/65">
            On a gardé ce que tout le monde aime dans une canette — la prise en main, le geste —
            et on l’a rendue éternelle.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
          {/* big card */}
          <div
            className="lata-reveal md:col-span-3 md:row-span-2 relative overflow-hidden rounded-[28px] p-8 sm:p-10 text-white min-h-[420px] flex flex-col justify-between transition-colors duration-700"
            style={{ background: color.deep }}
          >
            <div>
              <Snowflake size={28} aria-hidden />
              <h3 className="mt-6 lata-display text-5xl leading-none">Double paroi sous vide</h3>
              <p className="mt-3 max-w-xs text-white/80">
                Une couche de vide entre deux parois d’acier bloque les échanges thermiques.
                Pas de condensation, pas de mains mouillées.
              </p>
            </div>
            <div className="mt-8 space-y-4 max-w-sm">
              {[
                { label: 'Eau glacée', icon: Snowflake, h: 12, pct: 100 },
                { label: 'Café chaud', icon: Flame, h: 6, pct: 50 },
                { label: 'Canette alu classique', icon: Droplets, h: 0.5, pct: 5 },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <b.icon size={14} aria-hidden /> {b.label}
                    </span>
                    <span className="font-semibold">{b.h < 1 ? '30 min' : `${b.h} h`}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -right-10 -bottom-16 w-56 opacity-90 rotate-12 hidden sm:block">
              <Can color={color.hex} speed={22} />
            </div>
          </div>

          {[
            { icon: Shield, title: 'Acier inox 18/8', text: 'Qualité alimentaire, sans goût métallique, sans BPA. Inusable.' },
            { icon: PenLine, title: 'Dessiné à la main', text: 'Une illustration au trait, imprimée tout autour de la canette.' },
            { icon: Check, title: 'Couvercle coulissant', text: 'Ouvert d’un pouce, fermé d’un geste. Paille incluse.' },
            { icon: Leaf, title: '1 LATA = 300 canettes', text: 'Économisées chaque année pour un usage quotidien.' },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`lata-reveal rounded-[28px] bg-white p-7 border border-black/5 ${i === 0 ? 'md:col-span-3' : 'md:col-span-1'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--cream)]">
                <f.icon size={20} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-black/60 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Illustration */}
      <section id="illustration" className="bg-[var(--ink)] text-[var(--cream)] py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 items-end lata-reveal">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--terracotta)]">L’illustration</p>
              <h2 className="mt-3 lata-display text-5xl sm:text-7xl leading-[.9]">
                Six villes.
                <br />
                <span className="lata-serif normal-case">Un seul trait.</span>
              </h2>
            </div>
            <p className="text-lg text-white/65 max-w-lg">
              Une tour andalouse, des flèches catalanes, des arches cordouanes, un pont suspendu
              au-dessus du vide, un moulin de La Mancha et le soleil de Valencia. Tournez la canette :
              le voyage continue.
            </p>
          </div>

          <div className="mt-14 lata-reveal">
            <div
              className="rounded-[28px] p-4 sm:p-8 transition-colors duration-700"
              style={{ background: color.hex }}
            >
              <svg
                viewBox={`0 0 ${TILE_W * 2} ${TILE_H}`}
                className="w-full h-auto"
                role="img"
                aria-label="Illustration déroulée de l’étiquette"
              >
                <Artwork paper={color.hex} />
                <g transform={`translate(${TILE_W} 0)`}>
                  <Artwork paper={color.hex} />
                </g>
              </svg>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <ul className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <li key={c} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">
                    {c}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    className={`rounded-full px-4 h-9 text-sm font-medium transition ${
                      active === c.id ? 'bg-[var(--cream)] text-[var(--ink)]' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="boutique" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            className="lata-reveal relative rounded-[32px] aspect-[4/5] flex items-center justify-center overflow-hidden transition-colors duration-700"
            style={{ background: color.tint }}
          >
            <div
              className="lata-display absolute inset-0 flex items-center justify-center text-[38vw] lg:text-[18vw] leading-none select-none transition-colors duration-700"
              style={{ color: color.hex, opacity: 0.35 }}
              aria-hidden
            >
              {color.name.toUpperCase()}
            </div>
            <div className="relative w-[46%] lata-float">
              <Can color={color.hex} engraving={engraving.trim()} className="w-full h-auto drop-shadow-[0_40px_40px_rgba(0,0,0,.2)]" />
            </div>
            <span className="absolute top-5 left-5 rounded-full bg-white px-3 py-1 text-xs font-semibold">
              Best-seller
            </span>
          </div>

          <div className="lata-reveal">
            <div className="flex items-center gap-1 text-[var(--terracotta)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-current" aria-hidden />
              ))}
              <span className="ml-2 text-sm text-black/60">4,9/5 · 1 284 avis</span>
            </div>
            <h2 className="mt-3 lata-display text-6xl leading-none">LATA España</h2>
            <p className="mt-2 text-black/60">Canette isotherme 500 ml · Acier inoxydable</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{eur(unit)}</span>
              {engraving.trim() && <span className="text-sm text-black/50">dont gravure {eur(ENGRAVING_PRICE)}</span>}
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold">
                Coloris — <span className="font-normal text-black/60">{color.name}</span>
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id)}
                    aria-pressed={active === c.id}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                      active === c.id ? 'border-[var(--ink)] bg-white' : 'border-transparent bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span className="h-8 w-8 rounded-full shrink-0" style={{ background: c.hex }} />
                    <span className="text-sm font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="engraving" className="text-sm font-semibold flex items-center justify-between">
                <span>
                  Gravure personnalisée <span className="font-normal text-black/50">(+{eur(ENGRAVING_PRICE)})</span>
                </span>
                <span className="font-normal text-black/40 tabular-nums">{engraving.length}/14</span>
              </label>
              <input
                id="engraving"
                value={engraving}
                maxLength={14}
                onChange={(e) => setEngraving(e.target.value)}
                placeholder="Ex. : LUCÍA, OLÉ, PAPA…"
                className="mt-2 w-full h-12 rounded-2xl border border-black/10 bg-white px-4 outline-none focus:border-[var(--ink)] transition"
              />
              <p className="mt-1.5 text-xs text-black/50">Aperçu en direct sur la canette.</p>
            </div>

            <div className="mt-8 flex gap-3">
              <div className="inline-flex items-center rounded-full border border-black/15 bg-white h-14">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-14 w-12 flex items-center justify-center"
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="h-14 w-12 flex items-center justify-center"
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={addToCart}
                className="flex-1 h-14 rounded-full bg-[var(--ink)] text-[var(--cream)] font-semibold inline-flex items-center justify-center gap-2 hover:bg-black active:scale-[.99] transition"
              >
                Ajouter au panier · {eur(unit * qty)}
              </button>
            </div>

            <ul className="mt-8 grid sm:grid-cols-3 gap-3 text-sm text-black/70">
              <li className="flex items-center gap-2"><Truck size={16} aria-hidden /> Expédié sous 48 h</li>
              <li className="flex items-center gap-2"><Shield size={16} aria-hidden /> Garantie 2 ans</li>
              <li className="flex items-center gap-2"><Leaf size={16} aria-hidden /> Emballage recyclé</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Specs + Reviews */}
      <section className="bg-white border-y border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 grid lg:grid-cols-[1fr_1.4fr] gap-14">
          <div className="lata-reveal">
            <h2 className="lata-display text-5xl leading-none">Fiche technique</h2>
            <dl className="mt-8 divide-y divide-black/10 border-y border-black/10">
              {[
                ['Contenance', '500 ml'],
                ['Dimensions', 'Ø 7,4 × 19,5 cm'],
                ['Poids', '290 g'],
                ['Matière', 'Acier inoxydable 18/8'],
                ['Isolation', 'Double paroi sous vide'],
                ['Couvercle', 'Coulissant, paille intégrée'],
                ['Entretien', 'Lavage à la main recommandé'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3.5 text-sm">
                  <dt className="text-black/55">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Camille R.', city: 'Lyon', text: 'Je l’ai emmenée à Séville cet été : glaçons encore là à 18 h. Et tout le monde me demande où je l’ai trouvée.', c: 0 },
              { name: 'Hugo M.', city: 'Bordeaux', text: 'Le couvercle ne fuit pas dans le sac, c’était mon seul critère. Le dessin est un vrai bonus.', c: 1 },
              { name: 'Inès B.', city: 'Paris', text: 'Offerte avec gravure pour un anniversaire. Rendu très soigné, emballage superbe.', c: 2 },
              { name: 'Lucas D.', city: 'Toulouse', text: 'La forme canette tient parfaitement dans le porte-gobelet de la voiture.', c: 1 },
            ].map((r, i) => (
              <figure
                key={r.name}
                className="lata-reveal rounded-[24px] p-6 flex flex-col justify-between"
                style={{ background: COLORS[r.c].tint, transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex gap-0.5 text-[var(--ink)]">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={14} className="fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 lata-serif text-xl leading-snug">« {r.text} »</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{r.name}</span> <span className="text-black/50">· {r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
        <h2 className="lata-display text-5xl sm:text-6xl text-center lata-reveal">Questions fréquentes</h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {[
            ['Puis-je y mettre des boissons gazeuses ?', 'Oui, avec modération : remplissez aux trois quarts et ouvrez doucement le couvercle coulissant.'],
            ['Passe-t-elle au lave-vaisselle ?', 'Nous recommandons un lavage à la main pour préserver l’illustration et le vide d’isolation sur la durée.'],
            ['Le couvercle est-il étanche ?', 'Fermé, il ne fuit pas en position verticale. Pour le sac, gardez-la debout ou utilisez le bouchon de voyage fourni.'],
            ['Combien de temps pour la livraison ?', 'Expédition sous 48 h ouvrées, livraison en 2 à 4 jours en France métropolitaine. Offerte dès 45 €.'],
            ['La gravure est-elle définitive ?', 'Oui, elle est réalisée au laser sur l’acier : elle ne s’efface pas. Elle n’est donc ni reprise ni échangée.'],
          ].map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex items-center justify-between gap-6 text-lg font-medium">
                {q}
                <Plus size={20} className="lata-plus shrink-0 transition-transform" aria-hidden />
              </summary>
              <p className="mt-3 text-black/65 leading-relaxed pr-10">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[32px] bg-[var(--terracotta)] text-white px-6 py-14 sm:p-16 lata-reveal">
          <div className="lata-display absolute -right-6 -bottom-10 text-[180px] sm:text-[260px] leading-none opacity-15 select-none" aria-hidden>
            ¡OLÉ!
          </div>
          <div className="relative max-w-xl">
            <h2 className="lata-display text-5xl sm:text-6xl leading-[.95]">
              Prochaine édition : <span className="lata-serif normal-case">Italia ?</span>
            </h2>
            <p className="mt-3 text-white/85">
              Recevez les nouvelles illustrations en avant-première et −10 % sur votre première LATA.
            </p>
            {subscribed ? (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 h-12 font-medium">
                <Check size={18} aria-hidden /> Merci ! Votre code arrive par e-mail.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.includes('@')) setSubscribed(true)
                }}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="nl-email" className="sr-only">Adresse e-mail</label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 h-12 rounded-full px-5 bg-white text-[var(--ink)] outline-none placeholder:text-black/40"
                />
                <button className="h-12 px-6 rounded-full bg-[var(--ink)] font-semibold hover:bg-black transition">
                  Je m’inscris
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] text-sm">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="lata-display text-4xl leading-none">LATA</span>
              <span className="h-2 w-2 rounded-full bg-[var(--terracotta)]" />
            </div>
            <p className="mt-3 max-w-xs text-black/60">
              Des canettes qui ne finissent jamais à la poubelle. Dessinées pour voyager.
            </p>
          </div>
          {[
            ['Boutique', ['Salvia', 'Cielo', 'Rosa', 'Carte cadeau']],
            ['Aide', ['Livraison', 'Retours', 'Entretien', 'Contact']],
            ['Maison', ['Notre histoire', 'Illustrateurs', 'Engagements', 'Presse']],
          ].map(([title, links]) => (
            <div key={title as string}>
              <p className="font-semibold">{title as string}</p>
              <ul className="mt-3 space-y-2 text-black/60">
                {(links as string[]).map((l) => (
                  <li key={l}>
                    <a href="#top" className="hover:text-[var(--ink)]">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 border-t border-black/10 text-xs text-black/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} LATA. Concept de démonstration.</span>
          <span>Fait avec soin · Hecho con cariño</span>
        </div>
      </footer>

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        subtotal={subtotal}
        shippingLeft={shippingLeft}
        updateQty={updateQty}
      />

      {/* Toast */}
      <div
        className={`fixed left-1/2 bottom-6 z-50 -translate-x-1/2 transition-all duration-300 ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-full bg-[var(--ink)] text-[var(--cream)] pl-4 pr-2 py-2 shadow-2xl text-sm">
          <Check size={16} aria-hidden />
          {toast}
          <button onClick={() => setCartOpen(true)} className="ml-2 rounded-full bg-[var(--cream)] text-[var(--ink)] px-3 py-1 font-semibold">
            Voir
          </button>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({
  open,
  onClose,
  cart,
  subtotal,
  shippingLeft,
  updateQty,
}: {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  subtotal: number
  shippingLeft: number
  updateQty: (key: string, d: number) => void
}) {
  const progress = useMemo(() => Math.min(100, (subtotal / FREE_SHIPPING) * 100), [subtotal])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-label="Panier"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[var(--cream)] shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-black/10">
          <h2 className="lata-display text-3xl">Votre panier</h2>
          <button onClick={onClose} aria-label="Fermer le panier" className="h-10 w-10 rounded-full hover:bg-black/5 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-black/10">
          <p className="text-sm">
            {shippingLeft > 0 ? (
              <>Plus que <strong>{eur(shippingLeft)}</strong> pour la livraison offerte</>
            ) : (
              <>🎉 Livraison offerte !</>
            )}
          </p>
          <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
            <div className="h-full bg-[var(--terracotta)] transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-black/50 text-center mt-16">Votre panier est vide.</p>
          ) : (
            cart.map((item) => {
              const c = COLORS.find((x) => x.id === item.color)!
              const p = PRICE + (item.engraving ? ENGRAVING_PRICE : 0)
              return (
                <div key={item.key} className="flex gap-4 rounded-2xl bg-white p-3">
                  <div className="w-16 shrink-0 rounded-xl flex items-center justify-center py-1" style={{ background: c.tint }}>
                    <Can color={c.hex} spin={false} className="w-10 h-auto" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">LATA {c.name}</p>
                    <p className="text-xs text-black/50 truncate">
                      {item.engraving ? `Gravure : ${item.engraving}` : 'Sans gravure'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-black/10">
                        <button onClick={() => updateQty(item.key, -1)} className="h-8 w-8 flex items-center justify-center" aria-label="Retirer un">
                          <Minus size={14} />
                        </button>
                        <span className="w-5 text-center text-sm tabular-nums">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} className="h-8 w-8 flex items-center justify-center" aria-label="Ajouter un">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">{eur(p * item.qty)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="border-t border-black/10 px-6 py-5">
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span className="font-semibold">{eur(subtotal)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            className="mt-4 w-full h-14 rounded-full bg-[var(--ink)] text-[var(--cream)] font-semibold disabled:opacity-40 hover:bg-black transition"
          >
            Passer commande
          </button>
        </div>
      </aside>
    </div>
  )
}
