/**
 * Original line-art label for the LATA can: six Spanish landmarks drawn in a
 * single ink stroke, laid out on a 300 × 320 tile that repeats horizontally.
 */

export const TILE_W = 300
export const TILE_H = 320

type P = { x: number; y: number; paper: string }

function Tower({ x, y, paper }: P) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M20 -8 V0 M17 -4 h6" />
      <rect x="15" y="0" width="10" height="14" fill={paper} />
      <rect x="11" y="14" width="18" height="18" fill={paper} />
      <path d="M16 28 v-6 a4 4 0 0 1 8 0 v6" />
      <rect x="7" y="32" width="26" height="70" fill={paper} />
      <path d="M7 37 h26" />
      {[46, 64, 82].map((yy) => (
        <path key={yy} d={`M16 ${yy + 9} v-6 a4 4 0 0 1 8 0 v6`} />
      ))}
      <path d="M10 50 l4 -3 M26 50 l4 -3 M10 70 l4 -3 M26 70 l4 -3" opacity=".7" />
      <path d="M0 102 h40" />
    </g>
  )
}

function Spires({ x, y, paper }: P) {
  const spires = [
    { cx: 14, tip: 14 },
    { cx: 35, tip: 0 },
    { cx: 56, tip: 10 },
  ]
  return (
    <g transform={`translate(${x} ${y})`}>
      {spires.map(({ cx, tip }) => (
        <g key={cx}>
          <path d={`M${cx - 7} 62 V34 L${cx} ${tip} L${cx + 7} 34 V62 Z`} fill={paper} />
          <path d={`M${cx - 4} 42 h8 M${cx - 4} 50 h8 M${cx - 3} ${tip + 12} h6`} />
          <circle cx={cx} cy={tip - 3} r="2" fill={paper} />
        </g>
      ))}
      <rect x="2" y="62" width="66" height="40" fill={paper} />
      <circle cx="35" cy="76" r="8" />
      <path d="M35 68 v16 M27 76 h16" opacity=".6" />
      <path d="M29 102 v-9 a6 6 0 0 1 12 0 v9" />
      <path d="M8 70 v14 M14 70 v14 M56 70 v14 M62 70 v14" />
    </g>
  )
}

function Arches({ x, y, paper }: P) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="10" width="104" height="44" fill={paper} />
      <path d="M0 16 h104" />
      {[6, 30, 54, 78].map((ax) => (
        <g key={ax}>
          <path d={`M${ax} 54 V32 A10 10 0 0 1 ${ax + 20} 32 V54`} />
          <path d={`M${ax + 3} 32 A7 7 0 0 1 ${ax + 17} 32`} strokeDasharray="3 2.5" />
        </g>
      ))}
      <path d="M-4 54 h112" />
    </g>
  )
}

function Bridge({ x, y, paper }: P) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 h110 v40 H0 Z" fill={paper} />
      <path d="M0 6 h110" />
      {[8, 41, 74].map((ax) => (
        <path key={ax} d={`M${ax} 40 V26 A14 14 0 0 1 ${ax + 28} 26 V40`} />
      ))}
      <path d="M20 -10 v10 M90 -10 v10 M16 -10 h8 M86 -10 h8" />
      <path d="M-6 48 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0" />
      <path d="M8 56 q7 -5 14 0 t14 0 t14 0 t14 0 t14 0" opacity=".6" />
    </g>
  )
}

function Windmill({ x, y, paper }: P) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M14 92 L19 32 H33 L38 92 Z" fill={paper} />
      <path d="M17 32 Q26 18 35 32 Z" fill={paper} />
      <path d="M23 92 v-9 a3 3 0 0 1 6 0 v9 M24 56 h4 v6 h-4 Z" />
      <g transform="translate(26 27) rotate(22)">
        {[0, 90, 180, 270].map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d="M0 0 V-30" />
            <rect x="1" y="-30" width="7" height="22" fill={paper} />
            <path d="M1 -23 h7 M1 -16 h7 M4.5 -30 v22" opacity=".7" />
          </g>
        ))}
        <circle r="2.5" fill={paper} />
      </g>
      <path d="M0 92 h52" />
    </g>
  )
}

function Sun({ x, y, paper }: P) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="11" fill={paper} />
      <circle r="6" opacity=".5" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d="M0 -15 V-21" transform={`rotate(${i * 30})`} />
      ))}
    </g>
  )
}

const LABELS: { x: number; y: number; t: string }[] = [
  { x: 62, y: 52, t: 'Sevilla' },
  { x: 236, y: 8, t: 'Barcelona' },
  { x: 14, y: 220, t: 'Córdoba' },
  { x: 152, y: 226, t: 'Ronda' },
  { x: 246, y: 314, t: 'La Mancha' },
  { x: 116, y: 72, t: 'Valencia' },
]

export const CITIES = ['Sevilla', 'Barcelona', 'Córdoba', 'Ronda', 'La Mancha', 'Valencia']

export function Artwork({
  ink = '#141414',
  paper = '#ffffff',
  labels = true,
  title = 'ESPAÑA',
}: {
  ink?: string
  paper?: string
  labels?: boolean
  title?: string
}) {
  return (
    <g>
      <g
        fill="none"
        stroke={ink}
        strokeWidth={1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Tower x={18} y={14} paper={paper} />
        <Sun x={132} y={40} paper={paper} />
        <Spires x={204} y={18} paper={paper} />
        <Arches x={8} y={226} paper={paper} />
        <Bridge x={118} y={244} paper={paper} />
        <Windmill x={240} y={204} paper={paper} />
        <path
          d="M0 310 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"
          opacity=".5"
        />
      </g>
      <text
        x={TILE_W / 2}
        y={196}
        textAnchor="middle"
        fill={ink}
        style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontSize: 86, letterSpacing: 1 }}
      >
        {title}
      </text>
      {labels &&
        LABELS.map((l) => (
          <text
            key={l.t}
            x={l.x}
            y={l.y}
            fill={ink}
            style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontStyle: 'italic', fontSize: 10 }}
          >
            {l.t}
          </text>
        ))}
    </g>
  )
}
