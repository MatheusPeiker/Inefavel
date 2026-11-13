import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'estoque' }
  | { name: 'carro'; id: string }
  | { name: 'favoritos' }
  | { name: 'comparar' }
  | { name: 'vender' }
  | { name: 'admin' }
  | { name: 'notfound' };

/**
 * No build de produção as rotas são caminhos (/carro/pa1042). No build "artifact"
 * (arquivo único para revisão) viram #carro-pa1042, que funciona sem servidor.
 */
const HASH_MODE = import.meta.env.MODE === 'artifact';

const SIMPLE = ['estoque', 'favoritos', 'comparar', 'vender', 'admin'] as const;

function parsePath(path: string): Route {
  const p = path.replace(/^\/+|\/+$/g, '');
  if (p === '') return { name: 'home' };
  if ((SIMPLE as readonly string[]).includes(p)) return { name: p as (typeof SIMPLE)[number] };
  const m = p.match(/^carro[/-]([A-Za-z0-9-]+)$/);
  if (m) return { name: 'carro', id: m[1] };
  return { name: 'notfound' };
}

export function currentRoute(): Route {
  if (HASH_MODE) return parsePath(location.hash.slice(1));
  return parsePath(location.pathname);
}

export function href(r: Route): string {
  const key = r.name === 'home' || r.name === 'notfound' ? '' : r.name === 'carro' ? `carro-${r.id}` : r.name;
  if (HASH_MODE) return key ? `#${key}` : '#';
  return '/' + key.replace(/^carro-/, 'carro/');
}

const listeners = new Set<() => void>();

export function navigate(r: Route) {
  const target = href(r);
  if (HASH_MODE) {
    if (location.hash !== target && !(target === '#' && !location.hash)) location.hash = target === '#' ? '' : target;
    else listeners.forEach((l) => l());
  } else {
    if (location.pathname !== target) history.pushState(null, '', target);
    listeners.forEach((l) => l());
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(currentRoute);
  useEffect(() => {
    const update = () => setRoute(currentRoute());
    listeners.add(update);
    window.addEventListener(HASH_MODE ? 'hashchange' : 'popstate', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener(HASH_MODE ? 'hashchange' : 'popstate', update);
    };
  }, []);
  return route;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: Route };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={href(to)} onClick={handle} {...rest} />;
}
