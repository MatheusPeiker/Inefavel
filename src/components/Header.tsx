import { useEffect, useState } from 'react';
import { Heart, Menu, Search, Scale, X, LockKeyhole } from 'lucide-react';
import { Logo } from './Logo';
import { Link, navigate, type Route } from '../lib/router';
import { useStore } from '../lib/store';
import { waLink, genericText } from '../lib/whatsapp';
import { WhatsAppIcon } from './ui';

const NAV: { label: string; to: Route }[] = [
  { label: 'Início', to: { name: 'home' } },
  { label: 'Estoque', to: { name: 'estoque' } },
  { label: 'Avaliar meu carro', to: { name: 'vender' } },
];

export function Header({ route }: { route: Route }) {
  const { favorites, compare, settings } = useStore();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  const isActive = (to: Route) => to.name === route.name;

  return (
    <header className="sticky z-50 border-b border-line bg-surface/92 backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="wrap flex h-[68px] items-center gap-3">
        <Link to={{ name: 'home' }} className="-ml-1 shrink-0 rounded-lg p-1" aria-label="Passos Automóveis, página inicial">
          <Logo className="h-9 w-auto text-fg md:h-10" />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              aria-current={isActive(n.to) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-[14px] font-semibold transition hover:bg-surface-2 ${isActive(n.to) ? 'text-fg underline decoration-brand decoration-[3px] underline-offset-[10px]' : 'text-fg/75'}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button className="icon-btn" aria-label="Buscar no estoque" onClick={() => { navigate({ name: 'estoque' }); setTimeout(() => document.getElementById('busca-estoque')?.focus(), 60); }}>
            <Search size={20} />
          </button>
          <Link to={{ name: 'comparar' }} className="icon-btn relative hidden sm:inline-grid" aria-label={`Comparar (${compare.length})`}>
            <Scale size={20} />
            {compare.length > 0 && <Badge n={compare.length} />}
          </Link>
          <Link to={{ name: 'favoritos' }} className="icon-btn relative" aria-label={`Favoritos (${favorites.length})`}>
            <Heart size={20} />
            {favorites.length > 0 && <Badge n={favorites.length} />}
          </Link>
          <a
            href={waLink(settings.whatsapp, genericText(settings))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm ml-2 hidden md:inline-flex"
          >
            <WhatsAppIcon size={17} /> Fale com a gente
          </a>
          <button className="icon-btn lg:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="anim-sheet border-t border-line bg-surface lg:hidden">
          <nav className="wrap grid gap-1 py-3" aria-label="Menu">
            {[...NAV, { label: `Comparar (${compare.length})`, to: { name: 'comparar' } as Route }, { label: `Favoritos (${favorites.length})`, to: { name: 'favoritos' } as Route }].map((n) => (
              <Link key={n.label} to={n.to} className="rounded-xl px-3 py-3 font-display text-[17px] font-extrabold italic hover:bg-surface-2">
                {n.label}
              </Link>
            ))}
            <a href={waLink(settings.whatsapp, genericText(settings))} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">
              <WhatsAppIcon size={18} /> Chamar no WhatsApp
            </a>
            <Link to={{ name: 'admin' }} className="mt-1 flex items-center gap-2 rounded-xl px-3 py-3 text-[14px] font-semibold text-muted hover:bg-surface-2">
              <LockKeyhole size={16} /> Área do lojista
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-on-brand tnum">
      {n}
    </span>
  );
}
