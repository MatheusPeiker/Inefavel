import type { CSSProperties } from 'react';
import { BrandMark } from './BrandMark';
import { Logo } from './Logo';

interface Brand {
  name: string;
  count: number;
}

/** Faixa infinita com as marcas que têm carro no estoque. Pausa ao passar o mouse. */
export function BrandMarquee({ brands, onPick, reverse }: { brands: Brand[]; onPick: (b: string) => void; reverse?: boolean }) {
  if (!brands.length) return null;
  // Repete a lista até preencher telas largas sem buraco no loop.
  const reps = Math.max(1, Math.ceil(12 / brands.length));
  const group = Array.from({ length: reps }, () => brands).flat();
  const style = { '--duration': `${group.length * 3.4}s` } as CSSProperties;
  const sep = (i: number) => (
    <li key={`sep-${i}`} aria-hidden="true" className="flex items-center px-1">
      <Logo variant="outline" className="h-6 w-auto opacity-60" title="" />
    </li>
  );
  const item = (b: Brand, i: number, hidden: boolean) => [
    <li key={`${b.name}-${i}`}>
      <button
        type="button"
        tabIndex={hidden || i >= brands.length ? -1 : 0}
        onClick={() => onPick(b.name)}
        className="group/brand flex h-[72px] items-center gap-3 rounded-2xl border-[1.5px] border-line bg-surface px-5 text-fg/70 transition hover:border-brand hover:text-fg"
        aria-label={`Ver ${b.count} ${b.count === 1 ? 'carro' : 'carros'} ${b.name}`}
      >
        <BrandMark brand={b.name} size={30} className="transition group-hover/brand:text-brand" />
        <span className="flex flex-col items-start leading-tight">
          <span className="font-display text-[15px] font-extrabold uppercase italic tracking-tight text-fg">{b.name}</span>
          <span className="text-[12px] font-semibold text-muted tnum">
            {b.count} {b.count === 1 ? 'carro' : 'carros'}
          </span>
        </span>
      </button>
    </li>,
    sep(i),
  ];
  return (
    <div className="marquee" data-reverse={reverse ? 'true' : 'false'} style={style}>
      <ul className="marquee-track">{group.map((b, i) => item(b, i, false))}</ul>
      <ul className="marquee-track" aria-hidden="true">
        {group.map((b, i) => item(b, i, true))}
      </ul>
    </div>
  );
}
