import { Scale, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link, type Route } from '../lib/router';
import { genericText, waLink } from '../lib/whatsapp';
import { CarMedia } from './CarMedia';
import { WhatsAppIcon } from './ui';

export function WhatsAppFab({ raised }: { raised: boolean }) {
  const { settings } = useStore();
  return (
    <a
      href={waLink(settings.whatsapp, genericText(settings))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="group fixed z-40 flex items-center gap-2 transition-[bottom] duration-300"
      style={{
        right: 'calc(18px + env(safe-area-inset-right, 0px))',
        bottom: `calc(${raised ? 96 : 18}px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-ink px-3.5 py-2 text-[13px] font-bold text-on-ink opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Fale com um vendedor
      </span>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_10px_24px_-8px_rgb(37_211_102/0.7)] [animation:wa-pulse_2.6s_ease-out_infinite]">
        <WhatsAppIcon size={28} />
      </span>
    </a>
  );
}

export function CompareBar({ route }: { route: Route }) {
  const { compare, cars, toggleCompare, clearCompare } = useStore();
  const list = compare.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as typeof cars;
  if (!list.length || route.name === 'comparar' || route.name === 'admin') return null;
  return (
    <div
      className="anim-sheet fixed inset-x-0 z-40 px-4"
      style={{ bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))', paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'calc(88px + env(safe-area-inset-right, 0px))' }}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl bg-ink p-2.5 pl-3 text-on-ink shadow-2xl">
        <Scale size={18} className="hidden shrink-0 text-brand sm:block" />
        <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar">
          {list.map((c) => (
            <li key={c.id} className="flex shrink-0 items-center gap-2 rounded-xl bg-ink-2 py-1 pl-1 pr-1.5">
              <CarMedia car={c} label={false} className="h-8 w-12 rounded-lg" />
              <span className="max-w-[90px] truncate text-[12px] font-semibold">{c.model}</span>
              <button aria-label={`Tirar ${c.model} da comparação`} className="rounded p-0.5 text-ink-muted hover:text-on-ink" onClick={() => toggleCompare(c.id)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
        <button className="hidden text-[12px] font-semibold text-ink-muted hover:text-on-ink sm:block" onClick={clearCompare}>
          Limpar
        </button>
        <Link to={{ name: 'comparar' }} className="btn btn-primary btn-sm shrink-0">
          Comparar {list.length}
        </Link>
      </div>
    </div>
  );
}
