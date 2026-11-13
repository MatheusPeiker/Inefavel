import { useId } from 'react';
import type { BodyType } from '../lib/types';

/* Ilustração lateral do carro, pintada na cor cadastrada. Aparece enquanto
   o carro não tem fotos reais. viewBox 400 x 200, chão em y = 172. */

interface Shape {
  body: string;
  glass: string;
  pillars: [number, number][]; // faixas x das colunas
  wheels: [number, number];
  cy: number;
  r: number;
  arch: number; // raio da caixa de roda
  sill: number; // y da borda inferior da carroceria
  head: string;
  tail: string;
  belt: string;
  doors: string;
  handles: [number, number][];
  extra?: (dark: string) => React.ReactNode;
}

const SHAPES: Record<BodyType, Shape> = {
  Hatch: {
    body: 'M38 148 L36 118 C36 104 40 96 50 90 L92 66 C100 62 106 60 116 60 L208 59 C220 59 228 62 236 68 L268 92 L336 102 C352 105 362 112 364 124 L366 146 C366 150 363 152 359 152 L331 152 A32 32 0 1 0 269 152 L131 152 A32 32 0 1 0 69 152 L44 152 C40 152 38 151 38 148 Z',
    glass: 'M94 74 C98 69 106 66 118 66 L204 65 C213 65 219 68 225 72 L252 93 L98 95 C91 95 89 82 94 74 Z',
    pillars: [[166, 172]],
    wheels: [100, 300], cy: 144, r: 27, arch: 32, sill: 152,
    head: 'M339 107 L358 112 C362 115 362 118 358 119 L341 117 Z',
    tail: 'M37 101 L47 97 L47 116 L36 118 Z',
    belt: 'M50 99 L338 107',
    doors: 'M170 97 L172 146 M248 97 L256 132',
    handles: [[146, 108], [224, 110]],
  },
  'Sedã': {
    body: 'M30 148 L30 122 C30 112 34 106 44 104 L86 98 C96 96 102 92 110 84 L132 66 C138 61 146 59 156 59 L222 59 C234 59 242 63 250 69 L282 94 L344 103 C358 106 366 113 368 124 L369 146 C369 150 366 152 362 152 L333 152 A32 32 0 1 0 271 152 L133 152 A32 32 0 1 0 71 152 L36 152 C32 152 30 151 30 148 Z',
    glass: 'M120 84 L141 69 C146 65 151 64 158 64 L220 64 C229 64 236 67 242 72 L266 94 L114 95 C110 95 112 89 120 84 Z',
    pillars: [[190, 196]],
    wheels: [102, 302], cy: 144, r: 27, arch: 32, sill: 152,
    head: 'M345 107 L364 113 C367 116 367 119 363 120 L347 118 Z',
    tail: 'M31 108 L44 105 L44 116 L30 118 Z',
    belt: 'M44 106 L344 108',
    doors: 'M194 97 L196 146 M268 97 L276 132',
    handles: [[170, 110], [246, 111]],
  },
  SUV: {
    body: 'M36 146 L34 92 C34 82 38 74 46 68 L64 56 C70 52 76 50 86 50 L236 50 C248 50 256 54 264 61 L294 90 L346 99 C360 102 368 110 369 122 L370 144 C370 148 367 150 363 150 L334 150 A35 35 0 1 0 266 150 L138 150 A35 35 0 1 0 70 150 L42 150 C38 150 36 149 36 146 Z',
    glass: 'M50 76 L66 62 C72 58 78 57 86 57 L232 57 C242 57 248 60 254 66 L281 91 L54 93 C48 93 46 84 50 76 Z',
    pillars: [[104, 112], [190, 196]],
    wheels: [104, 300], cy: 142, r: 30, arch: 35, sill: 150,
    head: 'M347 103 L366 109 C369 112 369 116 365 117 L349 114 Z',
    tail: 'M35 84 L45 82 L45 106 L35 108 Z',
    belt: 'M40 96 L346 103',
    doors: 'M194 95 L196 140 M276 96 L282 128',
    handles: [[168, 104], [250, 106]],
    extra: (dark) => (
      <>
        <rect x="78" y="44" width="150" height="5" rx="2.5" fill={dark} />
        <path d="M30 134 L370 134 L370 144 C370 148 367 150 363 150 L42 150 C38 150 36 149 36 146 Z" fill="#1d1d1d" opacity="0.55" />
      </>
    ),
  },
  Picape: {
    body: 'M26 146 L26 98 C26 94 28 92 32 92 L172 92 L176 60 C177 54 182 50 190 50 L246 50 C256 50 262 53 268 59 L298 88 L352 97 C364 100 370 108 371 120 L372 144 C372 148 369 150 365 150 L340 150 A35 35 0 1 0 272 150 L132 150 A35 35 0 1 0 64 150 L32 150 C28 150 26 149 26 146 Z',
    glass: 'M183 63 C184 58 188 56 194 56 L244 56 C252 56 257 59 262 64 L288 89 L181 91 Z',
    pillars: [[228, 234]],
    wheels: [98, 306], cy: 142, r: 30, arch: 35, sill: 150,
    head: 'M351 100 L368 106 C371 109 371 113 367 114 L353 111 Z',
    tail: 'M26 100 L34 100 L34 120 L26 120 Z',
    belt: 'M176 97 L350 102',
    doors: 'M232 94 L234 140',
    handles: [[208, 104], [270, 106]],
    extra: (dark) => (
      <>
        <rect x="28" y="88" width="146" height="5" rx="2" fill={dark} />
        <path d="M172 94 L172 146" stroke={dark} strokeWidth="2" opacity="0.7" />
      </>
    ),
  },
};

function mix(hex: string, target: string, amount: number) {
  const p = (h: string) => {
    const s = h.replace('#', '');
    const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s.padEnd(6, '0').slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0);
  };
  const a = p(hex);
  const b = p(target);
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0')).join('');
}

export function CarArt({ body, color, className = '', title }: { body: BodyType; color: string; className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  const s = SHAPES[body] ?? SHAPES.Hatch;
  const light = mix(color, '#ffffff', 0.38);
  const dark = mix(color, '#000000', 0.42);
  const deep = mix(color, '#000000', 0.62);
  const [x1, x2] = s.wheels;
  return (
    <svg viewBox="0 0 400 200" className={className} role="img" aria-label={title ?? `Ilustração de ${body}`}>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.42" stopColor={color} />
          <stop offset="0.78" stopColor={dark} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d6a77" />
          <stop offset="0.55" stopColor="#1f262d" />
          <stop offset="1" stopColor="#0f1418" />
        </linearGradient>
        <radialGradient id={`r${id}`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f1f1f1" />
          <stop offset="0.6" stopColor="#a9adb2" />
          <stop offset="1" stopColor="#6b7076" />
        </radialGradient>
        <clipPath id={`c${id}`}>
          <path d={s.glass} />
        </clipPath>
        <filter id={`s${id}`} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <ellipse cx="200" cy={s.cy + s.r + 1} rx="172" ry="7" fill="#000" opacity="0.28" filter={`url(#s${id})`} />
      {[x1, x2].map((x) => {
        const dx = Math.sqrt(s.arch ** 2 - (s.sill - s.cy) ** 2);
        return <path key={`w${x}`} d={`M${x - dx} ${s.sill} A${s.arch} ${s.arch} 0 1 1 ${x + dx} ${s.sill} Z`} fill="#141414" />;
      })}
      <path d={s.body} fill={`url(#b${id})`} stroke={deep} strokeWidth="1" />
      {s.extra?.(deep)}
      <path d={s.glass} fill={`url(#g${id})`} />
      <path d={s.glass} fill="none" stroke={deep} strokeWidth="2" />
      {s.pillars.map(([a, b]) => (
        <rect key={a} x={a} y="40" width={b - a} height="60" fill={dark} clipPath={`url(#c${id})`} />
      ))}
      <path d={s.belt} stroke={light} strokeWidth="1.6" opacity="0.7" fill="none" />
      <path d={s.doors} stroke={deep} strokeWidth="1.2" opacity="0.65" fill="none" />
      {s.handles.map(([x, y]) => (
        <rect key={x} x={x} y={y} width="14" height="3.2" rx="1.6" fill={deep} opacity="0.75" />
      ))}
      <path d={s.head} fill="#fff6e0" stroke={deep} strokeWidth="0.8" />
      <path d={s.tail} fill="#c3201f" />
      {[x1, x2].map((x) => (
        <g key={x}>
          <circle cx={x} cy={s.cy} r={s.r} fill="#161616" />
          <circle cx={x} cy={s.cy} r={s.r - 3} fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
          <circle cx={x} cy={s.cy} r={s.r * 0.62} fill={`url(#r${id})`} />
          {[0, 72, 144, 216, 288].map((a) => (
            <line
              key={a}
              x1={x}
              y1={s.cy}
              x2={x + Math.cos((a * Math.PI) / 180) * s.r * 0.58}
              y2={s.cy + Math.sin((a * Math.PI) / 180) * s.r * 0.58}
              stroke="#5b6066"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          ))}
          <circle cx={x} cy={s.cy} r={s.r * 0.18} fill="#2b2b2b" />
        </g>
      ))}
    </svg>
  );
}
