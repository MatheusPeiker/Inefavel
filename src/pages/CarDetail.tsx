import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, CalendarDays, MapPin, Check, ChevronLeft, ChevronRight, Expand, Fuel, Gauge, Heart, Link2, Palette, Scale, Settings2, Car as CarIcon, DoorOpen, Hash, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useStore } from '../lib/store';
import { PROVENANCE, STATUS_LABEL, type Car } from '../lib/types';
import { fromInstallment, kmLabel, money, years } from '../lib/format';
import { Link } from '../lib/router';
import { carInterestText, testDriveText, waLink } from '../lib/whatsapp';
import { useToast } from '../lib/toast';
import { CarMedia } from '../components/CarMedia';
import { CarCard } from '../components/CarCard';
import { BrandMark } from '../components/BrandMark';
import { FinanceSimulator } from '../components/FinanceSimulator';
import { WhatsAppIcon, copyText } from '../components/ui';

export function CarDetail({ id }: { id: string }) {
  const { cars, publicCars, settings, favorites, toggleFavorite, compare, toggleCompare } = useStore();
  const toast = useToast();
  const car = cars.find((c) => c.id === id && c.status !== 'vendido');
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  useEffect(() => setPhoto(0), [id]);

  const similar = useMemo(() => {
    if (!car) return [];
    return publicCars
      .filter((c) => c.id !== car.id)
      .map((c) => ({ c, score: (c.body === car.body ? 2 : 0) + (c.brand === car.brand ? 1 : 0) - Math.abs(c.price - car.price) / car.price }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.c);
  }, [car, publicCars]);

  if (!car) {
    return (
      <div className="wrap grid place-items-center py-24 text-center">
        <p className="display text-[clamp(1.8rem,4vw,2.6rem)]">Este carro já foi vendido</p>
        <p className="mt-3 max-w-md text-muted">Ele saiu do nosso estoque, mas temos outras opções parecidas esperando por você.</p>
        <Link to={{ name: 'estoque' }} className="btn btn-primary mt-6">
          Ver estoque
        </Link>
      </div>
    );
  }

  const fav = favorites.includes(car.id);
  const cmp = compare.includes(car.id);
  const provenance = car.features.filter((f) => (PROVENANCE as readonly string[]).includes(f));
  const options = car.features.filter((f) => !(PROVENANCE as readonly string[]).includes(f));
  const nPhotos = car.photos.length;

  const specs: [typeof CalendarDays, string, React.ReactNode][] = [
    [CalendarDays, 'Ano', years(car.yearFab, car.yearModel)],
    [Gauge, 'Quilometragem', kmLabel(car.km)],
    [Settings2, 'Câmbio', car.transmission],
    [Fuel, 'Combustível', car.fuel],
    [CarIcon, 'Carroceria', car.body],
    [
      Palette,
      'Cor',
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: car.colorHex }} />
        {car.color || '—'}
      </span>,
    ],
    [DoorOpen, 'Portas', String(car.doors)],
    car.plateEnd ? [Hash, 'Final da placa', car.plateEnd] : [MapPin, 'Localização', settings.city.replace(' · ', '-')],
  ];

  return (
    <div className="wrap pt-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-muted" aria-label="Você está em">
        <Link to={{ name: 'estoque' }} className="hover:text-fg">
          Estoque
        </Link>
        <ChevronRight size={14} />
        <span>{car.brand}</span>
        <ChevronRight size={14} />
        <span className="text-fg">{car.model}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-[26px] shadow-card">
            <CarMedia car={car} index={photo} eager className={`w-full ${nPhotos ? 'aspect-[4/3]' : 'aspect-[16/10]'}`} />
            {nPhotos > 0 && (
              <button className="absolute inset-0 cursor-zoom-in" aria-label="Ver fotos em tela cheia" onClick={() => setZoom(true)}>
                <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white">
                  <Expand size={18} />
                </span>
              </button>
            )}
            {nPhotos > 1 && (
              <>
                <button className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow" aria-label="Foto anterior" onClick={() => setPhoto((p) => (p - 1 + nPhotos) % nPhotos)}>
                  <ChevronLeft size={22} />
                </button>
                <button className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow" aria-label="Próxima foto" onClick={() => setPhoto((p) => (p + 1) % nPhotos)}>
                  <ChevronRight size={22} />
                </button>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-semibold text-white tnum">
                  {photo + 1}/{nPhotos}
                </span>
              </>
            )}
          </div>
          {nPhotos > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {car.photos.map((p, i) => (
                <button key={i} onClick={() => setPhoto(i)} aria-label={`Foto ${i + 1}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${i === photo ? 'border-brand' : 'border-transparent opacity-75 hover:opacity-100'}`}>
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="mt-8" aria-labelledby="ficha">
            <h2 id="ficha" className="eyebrow mb-3 text-muted">
              Ficha técnica
            </h2>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-line sm:grid-cols-4">
              {specs.map(([Icon, label, value]) => (
                <div key={label} className="bg-surface p-4">
                  <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                    <Icon size={14} /> {label}
                  </dt>
                  <dd className="mt-1 font-bold tnum">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {provenance.length > 0 && (
            <section className="mt-8" aria-labelledby="procedencia">
              <h2 id="procedencia" className="eyebrow mb-3 text-muted">
                Procedência
              </h2>
              <ul className="flex flex-wrap gap-2">
                {provenance.map((p) => (
                  <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1.5 text-[13px] font-bold text-success">
                    <BadgeCheck size={16} /> {p}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {options.length > 0 && (
            <section className="mt-8" aria-labelledby="opcionais">
              <h2 id="opcionais" className="eyebrow mb-3 text-muted">
                Itens e equipamentos
              </h2>
              <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {options.map((o) => (
                  <li key={o} className="flex items-center gap-2.5 text-[15px]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {car.description && (
            <section className="mt-8" aria-labelledby="sobre">
              <h2 id="sobre" className="eyebrow mb-3 text-muted">
                Sobre este carro
              </h2>
              <p className="max-w-[65ch] text-[16px] leading-relaxed">{car.description}</p>
            </section>
          )}
        </div>

        <aside className="min-w-0">
          <div className="grid gap-4 lg:sticky lg:top-[88px]">
            <section className="rounded-[22px] bg-surface p-5 shadow-card">
              <div className="flex items-center gap-2 text-muted">
                <BrandMark brand={car.brand} size={18} />
                <span className="eyebrow">{car.brand}</span>
                <span className="ml-auto text-[12px] font-semibold tnum">Cód. {car.code}</span>
              </div>
              <h1 className="display mt-2 text-[clamp(2rem,4vw,2.8rem)]">{car.model}</h1>
              <p className="mt-1 text-[15px] text-muted">{car.version}</p>
              {car.status === 'reservado' && (
                <p className="mt-3 rounded-xl bg-surface-2 px-3 py-2 text-[13px] font-semibold">
                  {STATUS_LABEL.reservado}: chame no WhatsApp para entrar na fila de espera.
                </p>
              )}
              <div className="mt-5 border-t border-line pt-4">
                <p className="price text-[36px] leading-none">{money(car.price)}</p>
                <p className="mt-1.5 text-[13px] text-muted tnum">ou 60x de {money(fromInstallment(car.price, settings.interestRate))} com 30% de entrada</p>
                {car.fipe ? (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                    <span className="text-muted tnum">Tabela FIPE: {money(car.fipe)}</span>
                    {car.price < car.fipe && <span className="font-bold text-success tnum">{money(car.fipe - car.price)} abaixo da FIPE</span>}
                  </div>
                ) : null}
              </div>
              <div className="mt-5 grid gap-2">
                <a className="btn btn-primary btn-lg w-full" target="_blank" rel="noopener noreferrer" href={waLink(settings.whatsapp, carInterestText(car, settings))}>
                  <WhatsAppIcon size={20} /> Tenho interesse
                </a>
                <a className="btn btn-outline w-full" target="_blank" rel="noopener noreferrer" href={waLink(settings.whatsapp, testDriveText(car, settings))}>
                  Agendar test drive
                </a>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button className={`btn btn-ghost btn-sm ${fav ? 'text-brand-text' : ''}`} aria-pressed={fav} onClick={() => toggleFavorite(car.id)}>
                  <Heart size={16} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Salvo' : 'Salvar'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  aria-pressed={cmp}
                  onClick={() => {
                    if (!toggleCompare(car.id)) toast('Compare até 3 carros por vez.', { tone: 'error' });
                  }}
                >
                  <Scale size={16} /> {cmp ? 'Comparando' : 'Comparar'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={async () => toast((await copyText(location.href)) ? 'Link copiado' : 'Não foi possível copiar o link', { tone: 'ok' })}
                >
                  <Link2 size={16} /> Link
                </button>
              </div>
            </section>
            <FinanceSimulator key={car.id} car={car} settings={settings} />
          </div>
        </aside>
      </div>

      {zoom && nPhotos > 0 && (
        <Lightbox photos={car.photos} index={photo} onIndex={setPhoto} onClose={() => setZoom(false)} title={`${car.brand} ${car.model}`} />
      )}

      {similar.length > 0 && (
        <section className="pt-16" aria-labelledby="parecidos">
          <p className="tagline text-[13px] text-brand-text">você também pode gostar</p>
          <h2 id="parecidos" className="display mb-6 text-[clamp(1.6rem,3.6vw,2.4rem)]">
            Carros parecidos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c: Car) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Lightbox({ photos, index, onIndex, onClose, title }: { photos: string[]; index: number; onIndex: (i: number) => void; onClose: () => void; title: string }) {
  const n = photos.length;
  const go = (d: number) => onIndex((index + d + n) % n);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % n);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [index, n, onClose, onIndex]);
  const startX = useRef(0);
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos do ${title}`}
      className="fixed inset-0 z-[75] flex flex-col bg-[#0e0e0e] text-white"
      style={{ padding: 'env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)' }}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 truncate font-display font-extrabold italic">{title}</p>
        <span className="text-[13px] text-white/70 tnum">
          {index + 1}/{n}
        </span>
        <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Fechar" onClick={onClose} autoFocus>
          <X size={22} />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
        <img src={photos[index]} alt={`${title}, foto ${index + 1}`} className="max-h-full max-w-full rounded-lg object-contain" />
        {n > 1 && (
          <>
            <button className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Foto anterior" onClick={() => go(-1)}>
              <ChevronLeft size={26} />
            </button>
            <button className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Próxima foto" onClick={() => go(1)}>
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {photos.map((p, i) => (
          <button key={i} onClick={() => onIndex(i)} aria-label={`Foto ${i + 1}`} className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? 'border-brand' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={p} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
