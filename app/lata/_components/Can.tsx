'use client'

import { useId } from 'react'
import { Artwork, TILE_W } from './Artwork'

const BODY_TOP = 78
const BODY_BOTTOM = 392

export function Can({
  color,
  spin = true,
  speed = 16,
  engraving,
  className,
  title = 'ESPAÑA',
}: {
  color: string
  spin?: boolean
  speed?: number
  engraving?: string
  className?: string
  title?: string
}) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, '')
  const steel = `steel-${id}`
  const shade = `shade-${id}`
  const clip = `clip-${id}`
  const top = `top-${id}`

  const bodyPath = `M10 ${BODY_TOP + 14} Q10 ${BODY_TOP + 2} 24 ${BODY_TOP} H176 Q190 ${BODY_TOP + 2} 190 ${BODY_TOP + 14} V${BODY_BOTTOM} H10 Z`

  return (
    <svg
      viewBox="0 0 200 420"
      className={className}
      role="img"
      aria-label="Canette isotherme LATA illustrée"
    >
      <defs>
        <linearGradient id={steel} x1="0" x2="1">
          <stop offset="0" stopColor="#8d9298" />
          <stop offset=".18" stopColor="#d9dde1" />
          <stop offset=".32" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#c5cace" />
          <stop offset=".78" stopColor="#e9ecee" />
          <stop offset="1" stopColor="#7d8288" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f7f8" />
          <stop offset="1" stopColor="#b8bdc2" />
        </linearGradient>
        <linearGradient id={shade} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".32" />
          <stop offset=".14" stopColor="#000" stopOpacity=".06" />
          <stop offset=".28" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".38" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".7" stopColor="#000" stopOpacity=".04" />
          <stop offset=".9" stopColor="#000" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity=".38" />
        </linearGradient>
        <clipPath id={clip}>
          <path d={bodyPath} />
        </clipPath>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="410" rx="86" ry="7" fill="#000" opacity=".14" />

      {/* bottom steel band */}
      <path d={`M10 ${BODY_BOTTOM - 2} H190 V398 Q190 408 170 409 H30 Q10 408 10 398 Z`} fill={`url(#${steel})`} />

      {/* painted body */}
      <path d={bodyPath} fill={color} />
      <g clipPath={`url(#${clip})`}>
        <g
          className={spin ? 'lata-spin' : undefined}
          style={{ ['--lata-speed' as string]: `${speed}s`, ['--lata-tile' as string]: `-${TILE_W}px` }}
        >
          <g transform={`translate(-40 ${BODY_TOP + 6})`}>
            <Artwork paper={color} labels title={title} />
            <g transform={`translate(${TILE_W} 0)`}>
              <Artwork paper={color} labels title={title} />
            </g>
          </g>
        </g>
        {engraving ? (
          <g>
            <rect x="46" y="356" width="108" height="20" rx="10" fill="#fff" opacity=".55" />
            <text
              x="100"
              y="370.5"
              textAnchor="middle"
              fill="#141414"
              style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 10, fontWeight: 600, letterSpacing: 2 }}
            >
              {engraving.toUpperCase()}
            </text>
          </g>
        ) : null}
        <rect x="0" y={BODY_TOP} width="200" height={BODY_BOTTOM - BODY_TOP} fill={`url(#${shade})`} />
      </g>

      {/* lid */}
      <path d="M24 34 H176 V76 Q176 82 168 82 H32 Q24 82 24 76 Z" fill={`url(#${steel})`} />
      <path d="M24 64 H176" stroke="#7d8288" strokeOpacity=".35" />
      <path d="M24 70 H176" stroke="#fff" strokeOpacity=".6" />
      <ellipse cx="100" cy="34" rx="76" ry="15" fill={`url(#${top})`} stroke="#9aa0a6" strokeWidth=".8" />
      <ellipse cx="100" cy="33" rx="62" ry="10.5" fill="none" stroke="#a5abb1" strokeWidth="1" />
      {/* drinking slot + slider */}
      <rect x="62" y="25" width="34" height="7" rx="3.5" fill="#3b3f44" />
      <rect x="98" y="24" width="30" height="9" rx="3" fill="#e4e7ea" stroke="#9aa0a6" strokeWidth=".8" />
      <path d="M104 28.5 h18" stroke="#9aa0a6" strokeWidth=".8" />
      <path d="M120 18 V28" stroke="#c9cdd1" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
