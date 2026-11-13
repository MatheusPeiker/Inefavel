import { horizontal, symbol, symbolOutline, type LogoArt } from '../assets/logo-paths';

const ART = { horizontal, symbol, outline: symbolOutline } satisfies Record<string, LogoArt>;

interface Props {
  variant?: keyof typeof ART;
  className?: string;
  title?: string;
  /** cor do contorno e do lettering (padrão: currentColor) */
  ink?: string;
  orange?: string;
}

/** Logo oficial (vetores do PDF). Contorno e lettering seguem a cor do texto. */
export function Logo({ variant = 'horizontal', className, title = 'Passos Automóveis', ink = 'currentColor', orange = '#FF8724' }: Props) {
  const art = ART[variant];
  return (
    <svg viewBox={`0 0 ${art.w} ${art.h}`} className={className} role="img" aria-label={title}>
      {art.paths.map(([role, d], i) => (
        <path key={i} d={d} fill={role === 'orange' ? orange : role === 'white' ? '#fff' : ink} />
      ))}
    </svg>
  );
}
