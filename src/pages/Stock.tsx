import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { applyFilters, countActiveFilters, emptyFilters, useStore, type Filters, type SortKey } from '../lib/store';
import { BODY_TYPES, FUELS, TRANSMISSIONS, type Car } from '../lib/types';
import { money, num } from '../lib/format';
import { genericText, waLink } from '../lib/whatsapp';
import { CarCard } from '../components/CarCard';
import { BrandMark } from '../components/BrandMark';
import { Modal, WhatsAppIcon } from '../components/ui';

const SORTS: [SortKey, string][] = [
  ['recentes', 'Mais recentes'],
  ['menor-preco', 'Menor preço'],
  ['maior-preco', 'Maior preço'],
  ['menor-km', 'Menor km'],
  ['mais-novos', 'Mais novos'],
];
const KM_STEPS = [20000, 50000, 80000];

export function Stock() {
  const { publicCars, filters, setFilters, settings } = useStore();
  const [sheet, setSheet] = useState(false);
  const result = useMemo(() => applyFilters(publicCars, filters), [publicCars, filters]);
  const active = countActiveFilters(filters);
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <div className="wrap pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tagline text-[13px] text-brand-text">estoque completo</p>
          <h1 className="display text-[clamp(2rem,4.6vw,3.2rem)]">Nossos carros</h1>
        </div>
        <p className="text-[14px] text-muted tnum" aria-live="polite">
          {result.length} de {publicCars.length} {publicCars.length === 1 ? 'carro' : 'carros'}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <label className="relative min-w-0 flex-[1_1_260px]">
          <span className="sr-only">Buscar por marca, modelo ou versão</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="busca-estoque"
            className="input pl-10"
            placeholder="Buscar por marca, modelo, versão ou cor"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </label>
        <label className="flex-[0_1_200px]">
          <span className="sr-only">Ordenar por</span>
          <select id="ordenar" className="input" value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortKey })}>
            {SORTS.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-outline lg:hidden" onClick={() => setSheet(true)}>
          <SlidersHorizontal size={17} /> Filtros{active > 0 && ` (${active})`}
        </button>
      </div>

      <ActiveChips />

      <div className="mt-6 grid gap-8 lg:grid-cols-[270px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-[92px] max-h-[calc(100dvh-110px)] overflow-y-auto rounded-[20px] bg-surface p-5 shadow-card [scrollbar-width:thin]">
            <FilterControls cars={publicCars} />
          </div>
        </aside>
        <div className="min-w-0">
          {result.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-[22px] border-2 border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-[22px] font-black italic uppercase">Nenhum carro com esses filtros</p>
              <p className="mt-2 max-w-md text-muted">Tente ampliar a faixa de preço ou remover alguma marca. Se não encontrar, a gente procura para você.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button className="btn btn-outline" onClick={() => setFilters({ ...emptyFilters, sort: filters.sort })}>
                  Limpar filtros
                </button>
                <a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={waLink(settings.whatsapp, `${genericText(settings)} Estou procurando um carro que não encontrei no site.`)}>
                  <WhatsAppIcon size={18} /> Encomendar um carro
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={sheet}
        onClose={() => setSheet(false)}
        title="Filtros"
        variant="sheet"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setFilters({ ...emptyFilters, sort: filters.sort })}>
              Limpar
            </button>
            <button className="btn btn-primary" onClick={() => setSheet(false)}>
              Ver {result.length} {result.length === 1 ? 'carro' : 'carros'}
            </button>
          </>
        }
      >
        <FilterControls cars={publicCars} />
      </Modal>
    </div>
  );
}

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function FilterControls({ cars }: { cars: Car[] }) {
  const { filters, setFilters } = useStore();
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const brands = useMemo(() => {
    const m = new Map<string, number>();
    cars.forEach((c) => m.set(c.brand, (m.get(c.brand) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [cars]);
  const maxPrice = Math.max(100000, Math.ceil(Math.max(0, ...cars.map((c) => c.price)) / 10000) * 10000);
  const minPrice = Math.max(10000, Math.floor(Math.min(maxPrice, ...cars.map((c) => c.price)) / 10000) * 10000);
  const yearsAvail = [...new Set(cars.map((c) => c.yearModel))].sort((a, b) => b - a);
  const fuels = FUELS.filter((f) => cars.some((c) => c.fuel === f));
  const price = filters.priceMax ?? maxPrice;

  return (
    <div className="grid gap-6">
      <Group title="Marca">
        <div className="flex flex-wrap gap-1.5">
          {brands.map(([b, n]) => (
            <button key={b} className="chip" aria-pressed={filters.brands.includes(b)} onClick={() => set({ brands: toggle(filters.brands, b) })}>
              <BrandMark brand={b} size={15} /> {b} <span className="opacity-60 tnum">{n}</span>
            </button>
          ))}
        </div>
      </Group>
      <Group title="Tipo">
        <div className="flex flex-wrap gap-1.5">
          {BODY_TYPES.map((b) => (
            <button key={b} className="chip" aria-pressed={filters.bodies.includes(b)} onClick={() => set({ bodies: toggle(filters.bodies, b) })}>
              {b}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Preço máximo">
        <p className="price mb-2 text-[18px]">{filters.priceMax == null ? 'Qualquer valor' : `Até ${money(price)}`}</p>
        <input
          id="filtro-preco"
          type="range"
          className="w-full accent-[var(--brand)]"
          min={minPrice}
          max={maxPrice}
          step={5000}
          value={price}
          aria-label="Preço máximo"
          onChange={(e) => {
            const v = Number(e.target.value);
            set({ priceMax: v >= maxPrice ? null : v });
          }}
        />
        <div className="mt-1 flex justify-between text-[11px] font-semibold text-muted tnum">
          <span>{money(minPrice)}</span>
          <span>{money(maxPrice)}</span>
        </div>
      </Group>
      <Group title="Ano do modelo">
        <select id="filtro-ano" className="input" value={filters.yearMin ?? ''} onChange={(e) => set({ yearMin: e.target.value ? Number(e.target.value) : null })}>
          <option value="">Qualquer ano</option>
          {yearsAvail.map((y) => (
            <option key={y} value={y}>
              {y} ou mais novo
            </option>
          ))}
        </select>
      </Group>
      <Group title="Quilometragem">
        <div className="flex flex-wrap gap-1.5">
          {KM_STEPS.map((k) => (
            <button key={k} className="chip tnum" aria-pressed={filters.kmMax === k} onClick={() => set({ kmMax: filters.kmMax === k ? null : k })}>
              até {num(k / 1000)} mil km
            </button>
          ))}
        </div>
      </Group>
      <Group title="Câmbio">
        <div className="flex flex-wrap gap-1.5">
          {TRANSMISSIONS.map((t) => (
            <button key={t} className="chip" aria-pressed={filters.transmission === t} onClick={() => set({ transmission: filters.transmission === t ? null : t })}>
              {t}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Combustível">
        <div className="flex flex-wrap gap-1.5">
          {fuels.map((f) => (
            <button key={f} className="chip" aria-pressed={filters.fuel === f} onClick={() => set({ fuel: filters.fuel === f ? null : f })}>
              {f}
            </button>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow mb-2.5 text-muted">{title}</legend>
      {children}
    </fieldset>
  );
}

function ActiveChips() {
  const { filters, setFilters } = useStore();
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const chips: [string, () => void][] = [
    ...filters.brands.map((b) => [b, () => set({ brands: filters.brands.filter((x) => x !== b) })] as [string, () => void]),
    ...filters.bodies.map((b) => [b, () => set({ bodies: filters.bodies.filter((x) => x !== b) })] as [string, () => void]),
  ];
  if (filters.priceMax != null) chips.push([`Até ${money(filters.priceMax)}`, () => set({ priceMax: null })]);
  if (filters.yearMin != null) chips.push([`${filters.yearMin}+`, () => set({ yearMin: null })]);
  if (filters.kmMax != null) chips.push([`Até ${num(filters.kmMax)} km`, () => set({ kmMax: null })]);
  if (filters.transmission) chips.push([filters.transmission, () => set({ transmission: null })]);
  if (filters.fuel) chips.push([filters.fuel, () => set({ fuel: null })]);
  if (filters.q.trim()) chips.push([`“${filters.q.trim()}”`, () => set({ q: '' })]);
  if (!chips.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {chips.map(([label, remove]) => (
        <button key={label} onClick={remove} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-soft px-3 text-[13px] font-semibold text-brand-text hover:brightness-95">
          {label} <X size={14} />
        </button>
      ))}
      <button className="ml-1 text-[13px] font-semibold text-muted underline-offset-4 hover:text-fg hover:underline" onClick={() => setFilters({ ...emptyFilters, sort: filters.sort })}>
        Limpar tudo
      </button>
    </div>
  );
}
