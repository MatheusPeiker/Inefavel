import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useToast } from '../../lib/toast';
import { STATUSES, STATUS_LABEL, type Car, type CarStatus } from '../../lib/types';
import { kmLabel, money, years } from '../../lib/format';
import { Link } from '../../lib/router';
import { CarMedia } from '../../components/CarMedia';
import { ConfirmDialog } from '../../components/ui';
import { CarEditor } from './CarEditor';

const STATUS_STYLE: Record<CarStatus, string> = {
  disponivel: 'bg-success/12 text-success',
  reservado: 'bg-brand-soft text-brand-text',
  vendido: 'bg-surface-2 text-muted',
};

export function Inventory() {
  const { cars, saveCar, removeCar } = useStore();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<CarStatus | 'todos'>('todos');
  const [editing, setEditing] = useState<Car | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Car | null>(null);
  const [busy, setBusy] = useState(false);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return cars
      .filter((c) => (status === 'todos' ? true : c.status === status))
      .filter((c) => !t || `${c.brand} ${c.model} ${c.version} ${c.code}`.toLowerCase().includes(t))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [cars, q, status]);

  const live = cars.filter((c) => c.status !== 'vendido');
  const kpis: [string, string][] = [
    ['Disponíveis', String(cars.filter((c) => c.status === 'disponivel').length)],
    ['Reservados', String(cars.filter((c) => c.status === 'reservado').length)],
    ['Vendidos', String(cars.filter((c) => c.status === 'vendido').length)],
    ['Valor em estoque', money(live.reduce((s, c) => s + c.price, 0))],
    ['Ticket médio', live.length ? money(live.reduce((s, c) => s + c.price, 0) / live.length) : '—'],
  ];

  const quick = async (car: Car, patch: Partial<Car>, msg: string) => {
    try {
      await saveCar({ ...car, ...patch });
      toast(msg);
    } catch (e) {
      toast((e as Error).message, { tone: 'error' });
    }
  };

  return (
    <div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-line lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
        {kpis.map(([l, v]) => (
          <div key={l} className="bg-surface p-4">
            <dt className="text-[12px] font-semibold text-muted">{l}</dt>
            <dd className="price mt-1 text-[22px] leading-none">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-[1_1_240px]">
          <span className="sr-only">Buscar no estoque</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input id="adm-busca" className="input pl-10" placeholder="Buscar por marca, modelo ou código" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(['todos', ...STATUSES] as const).map((s) => (
            <button key={s} className="chip" aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
              <span className="opacity-60 tnum">{s === 'todos' ? cars.length : cars.filter((c) => c.status === s).length}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-primary ml-auto" onClick={() => setEditing('new')}>
          <Plus size={18} /> Adicionar carro
        </button>
      </div>

      <ul className="mt-5 grid gap-2.5">
        {list.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[18px] bg-surface p-3 shadow-card sm:flex-nowrap">
            <CarMedia car={c} label={false} className="h-[68px] w-[108px] shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 basis-[180px]">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-muted">
                <span className="tnum">{c.code}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                {c.photos.length === 0 && <span className="text-[11px]">sem fotos</span>}
              </p>
              <p className="truncate font-display text-[16px] font-extrabold italic">
                {c.brand} {c.model}
              </p>
              <p className="truncate text-[13px] text-muted tnum">
                {c.version} · {years(c.yearFab, c.yearModel)} · {kmLabel(c.km)}
              </p>
            </div>
            <p className="price w-[130px] text-[18px] sm:text-right">{money(c.price)}</p>
            <div className="flex items-center gap-1">
              <label className="sr-only" htmlFor={`st-${c.id}`}>Status de {c.model}</label>
              <select
                id={`st-${c.id}`}
                className="input h-9 w-[132px] text-[13px] font-semibold"
                value={c.status}
                onChange={(e) => quick(c, { status: e.target.value as CarStatus }, `${c.model}: ${STATUS_LABEL[e.target.value as CarStatus].toLowerCase()}`)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                className={`icon-btn ${c.featured ? 'text-brand' : 'text-muted'}`}
                aria-pressed={c.featured}
                aria-label={c.featured ? `Tirar ${c.model} dos destaques` : `Destacar ${c.model}`}
                title={c.featured ? 'Em destaque' : 'Destacar na página inicial'}
                onClick={() => quick(c, { featured: !c.featured }, c.featured ? 'Saiu dos destaques' : 'Agora em destaque na página inicial')}
              >
                <Star size={19} fill={c.featured ? 'currentColor' : 'none'} />
              </button>
              <button className="icon-btn" aria-label={`Editar ${c.model}`} title="Editar" onClick={() => setEditing(c)}>
                <Pencil size={18} />
              </button>
              <button className="icon-btn text-danger" aria-label={`Remover ${c.model}`} title="Remover" onClick={() => setDeleting(c)}>
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
        {!list.length && (
          <li className="rounded-[18px] border-2 border-dashed border-line p-10 text-center text-muted">
            Nenhum carro encontrado. <button className="font-bold text-brand-text underline" onClick={() => setEditing('new')}>Adicionar carro</button>
          </li>
        )}
      </ul>
      <p className="mt-4 text-[13px] text-muted">
        Carros vendidos somem do site, mas continuam aqui no painel. <Link to={{ name: 'estoque' }} className="font-semibold underline">Ver estoque público</Link>
      </p>

      {editing && <CarEditor car={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        title="Remover carro"
        busy={busy}
        confirmLabel="Remover"
        onClose={() => setDeleting(null)}
        message={
          deleting && (
            <>
              <strong className="text-fg">
                {deleting.brand} {deleting.model} {deleting.version}
              </strong>{' '}
              ({deleting.code}) sai do estoque e do site. Se o carro foi vendido, prefira mudar o status para “Vendido” e manter o histórico.
            </>
          )
        }
        onConfirm={async () => {
          if (!deleting) return;
          setBusy(true);
          try {
            const prev = await removeCar(deleting.id);
            toast(`${deleting.model} removido`, {
              action: prev ? { label: 'Desfazer', run: () => void saveCar(prev).then(() => toast('Carro restaurado')) } : undefined,
            });
            setDeleting(null);
          } catch (e) {
            toast((e as Error).message, { tone: 'error' });
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
