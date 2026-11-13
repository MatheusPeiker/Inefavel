import {
  siAudi, siBmw, siChevrolet, siCitroen, siFiat, siFord, siHonda, siHyundai, siJeep, siKia, siMini,
  siMitsubishi, siNissan, siPeugeot, siPorsche, siRam, siRenault, siSubaru, siSuzuki, siToyota,
  siVolkswagen, siVolvo,
} from 'simple-icons';
import { slug } from '../lib/format';

type Icon = { path: string; title: string };
const ICONS: Record<string, Icon> = Object.fromEntries(
  [siAudi, siBmw, siChevrolet, siCitroen, siFiat, siFord, siHonda, siHyundai, siJeep, siKia, siMini, siMitsubishi,
    siNissan, siPeugeot, siPorsche, siRam, siRenault, siSubaru, siSuzuki, siToyota, siVolkswagen, siVolvo].map((i) => [slug(i.title), i]),
);

export function hasBrandIcon(brand: string) {
  return !!ICONS[slug(brand)];
}

/** Símbolo da montadora (Simple Icons) ou, se não houver, as iniciais. */
export function BrandMark({ brand, size = 28, className = '' }: { brand: string; size?: number; className?: string }) {
  const icon = ICONS[slug(brand)];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
        <path d={icon.path} />
      </svg>
    );
  }
  const initials = brand.replace(/[^A-Za-zÀ-ú ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-full border-2 border-current font-display font-black italic ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
