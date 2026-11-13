import { Heart, Scale } from 'lucide-react';
import type { Car } from '../lib/types';
import { fromInstallment, kmLabel, money, years } from '../lib/format';
import { Link } from '../lib/router';
import { useStore } from '../lib/store';
import { useToast } from '../lib/toast';
import { carInterestText, waLink } from '../lib/whatsapp';
import { CarMedia } from './CarMedia';
import { BrandMark } from './BrandMark';
import { WhatsAppIcon } from './ui';

export function FipeBadge({ car, className = '' }: { car: Car; className?: string }) {
  if (!car.fipe || car.price >= car.fipe) return null;
  return (
    <span className={`inline-flex items-center rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-bold text-success ${className}`}>
      {money(car.fipe - car.price)} abaixo da FIPE
    </span>
  );
}

export function CarCard({ car, compact }: { car: Car; compact?: boolean }) {
  const { favorites, toggleFavorite, compare, toggleCompare, settings } = useStore();
  const toast = useToast();
  const fav = favorites.includes(car.id);
  const cmp = compare.includes(car.id);
  const title = `${car.brand} ${car.model}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[20px] bg-surface shadow-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative">
        <CarMedia car={car} className="aspect-[16/10] w-full" />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {car.status === 'reservado' && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-on-ink">Reservado</span>}
          {car.featured && car.status !== 'reservado' && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-on-brand">Destaque</span>
          )}
        </div>
        <button
          className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition ${fav ? 'text-brand' : 'text-fg/70 hover:text-fg'}`}
          aria-label={fav ? `Remover ${title} dos favoritos` : `Salvar ${title} nos favoritos`}
          aria-pressed={fav}
          onClick={() => {
            toggleFavorite(car.id);
            toast(fav ? 'Removido dos favoritos' : 'Salvo nos favoritos');
          }}
        >
          <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 pt-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-muted">
            <BrandMark brand={car.brand} size={14} />
            <span className="eyebrow">{car.brand}</span>
            <span className="ml-auto text-[11px] font-semibold tnum">{car.code}</span>
          </div>
          <h3 className="mt-1 font-display text-[19px] font-extrabold italic leading-tight">
            <Link to={{ name: 'carro', id: car.id }} className="after:absolute after:inset-0 after:content-['']">
              {car.model}
            </Link>
          </h3>
          <p className="truncate text-[13px] text-muted">{car.version}</p>
        </div>
        {!compact && (
          <ul className="flex flex-wrap gap-1.5 text-[12px] font-semibold text-fg/80">
            <li className="rounded-md bg-surface-2 px-2 py-1 tnum">{years(car.yearFab, car.yearModel)}</li>
            <li className="rounded-md bg-surface-2 px-2 py-1 tnum">{kmLabel(car.km)}</li>
            <li className="rounded-md bg-surface-2 px-2 py-1">{car.transmission}</li>
            <li className="rounded-md bg-surface-2 px-2 py-1">{car.fuel}</li>
          </ul>
        )}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            <FipeBadge car={car} className="mb-1" />
            <p className="price text-[22px] leading-none">{money(car.price)}</p>
            <p className="mt-1 text-[12px] text-muted tnum">ou 60x de {money(fromInstallment(car.price, settings.interestRate))}*</p>
          </div>
          <div className="relative z-10 flex gap-1.5">
            <button
              className={`grid h-10 w-10 place-items-center rounded-xl border-[1.5px] transition ${cmp ? 'border-ink bg-ink text-on-ink' : 'border-line text-fg/75 hover:border-fg hover:text-fg'}`}
              aria-pressed={cmp}
              aria-label={cmp ? `Tirar ${title} da comparação` : `Comparar ${title}`}
              title="Comparar"
              onClick={() => {
                const ok = toggleCompare(car.id);
                if (!ok) toast('Compare até 3 carros por vez. Tire um da lista para incluir este.', { tone: 'error' });
              }}
            >
              <Scale size={18} />
            </button>
            <a
              href={waLink(settings.whatsapp, carInterestText(car, settings))}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-on-brand transition hover:brightness-105"
              aria-label={`Chamar no WhatsApp sobre o ${title}`}
              title="Chamar no WhatsApp"
            >
              <WhatsAppIcon size={19} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
