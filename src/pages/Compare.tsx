import { Scale, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from '../lib/router';
import { fromInstallment, kmLabel, money, years } from '../lib/format';
import { carInterestText, waLink } from '../lib/whatsapp';
import type { Car } from '../lib/types';
import { CarMedia } from '../components/CarMedia';
import { WhatsAppIcon } from '../components/ui';

type Row = { label: string; value: (c: Car) => React.ReactNode; best?: (cars: Car[]) => string | null };

const pick = (cars: Car[], score: (c: Car) => number) => {
  if (cars.length < 2) return null;
  const sorted = [...cars].sort((a, b) => score(a) - score(b));
  return score(sorted[0]) === score(sorted[1]) ? null : sorted[0].id;
};

export function Compare() {
  const { compare, cars, toggleCompare, clearCompare, settings } = useStore();
  const list = compare.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as Car[];
  const rows: Row[] = [
    { label: 'Preço', value: (c) => <span className="price text-[18px]">{money(c.price)}</span>, best: (l) => pick(l, (c) => c.price) },
    { label: 'Parcela (60x)', value: (c) => money(fromInstallment(c.price, settings.interestRate)) },
    { label: 'Diferença p/ FIPE', value: (c) => (c.fipe ? (c.price < c.fipe ? `${money(c.fipe - c.price)} abaixo` : `${money(c.price - c.fipe)} acima`) : '—'), best: (l) => pick(l, (c) => (c.fipe ? c.price - c.fipe : 0)) },
    { label: 'Ano', value: (c) => years(c.yearFab, c.yearModel), best: (l) => pick(l, (c) => -c.yearModel) },
    { label: 'Quilometragem', value: (c) => kmLabel(c.km), best: (l) => pick(l, (c) => c.km) },
    { label: 'Câmbio', value: (c) => c.transmission },
    { label: 'Combustível', value: (c) => c.fuel },
    { label: 'Carroceria', value: (c) => c.body },
    { label: 'Cor', value: (c) => c.color },
    { label: 'Itens de série e procedência', value: (c) => `${c.features.length} itens`, best: (l) => pick(l, (c) => -c.features.length) },
  ];

  return (
    <div className="wrap pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="tagline text-[13px] text-brand-text">lado a lado</p>
          <h1 className="display text-[clamp(2rem,4.6vw,3.2rem)]">Comparar carros</h1>
        </div>
        {list.length > 0 && (
          <button className="btn btn-ghost" onClick={clearCompare}>
            Limpar comparação
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-[22px] border-2 border-dashed border-line px-6 py-16 text-center">
          <Scale size={34} className="text-brand" />
          <p className="mt-3 font-display text-[20px] font-black italic uppercase">Escolha até 3 carros</p>
          <p className="mt-2 max-w-md text-muted">Toque no ícone de balança nos cartões do estoque para colocar os carros lado a lado.</p>
          <Link to={{ name: 'estoque' }} className="btn btn-primary mt-6">
            Ir para o estoque
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[22px] bg-surface shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
            <thead>
              <tr>
                <th className="w-[180px] p-4 align-bottom">
                  <span className="text-[12px] font-semibold text-muted">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand align-middle" />
                    melhor da linha
                  </span>
                </th>
                {list.map((c) => (
                  <th key={c.id} className="p-4 align-top font-normal">
                    <div className="relative">
                      <Link to={{ name: 'carro', id: c.id }}>
                        <CarMedia car={c} label={false} className="aspect-[16/10] w-full rounded-2xl" />
                      </Link>
                      <button className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-surface/90 shadow" aria-label={`Tirar ${c.model} da comparação`} onClick={() => toggleCompare(c.id)}>
                        <X size={16} />
                      </button>
                    </div>
                    <p className="eyebrow mt-3 text-muted">{c.brand}</p>
                    <p className="font-display text-[18px] font-extrabold italic">{c.model}</p>
                    <p className="truncate text-[13px] text-muted">{c.version}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const best = r.best?.(list);
                return (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="p-4 text-[13px] font-semibold text-muted">
                      {r.label}
                    </th>
                    {list.map((c) => (
                      <td key={c.id} className="p-4 font-semibold tnum">
                        <span className="inline-flex items-center gap-2">
                          {best === c.id && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-label="melhor" />}
                          {r.value(c)}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="border-t border-line">
                <th />
                {list.map((c) => (
                  <td key={c.id} className="p-4">
                    <a className="btn btn-primary btn-sm w-full" target="_blank" rel="noopener noreferrer" href={waLink(settings.whatsapp, carInterestText(c, settings))}>
                      <WhatsAppIcon size={16} /> Tenho interesse
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
