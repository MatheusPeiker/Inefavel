import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BodyType, Car, Fuel, StoreSettings, Transmission } from './types';
import { getRepository, type Credentials, type Repository } from './repository';
import { defaultSettings } from './seed';
import { storage } from './storage';

export type SortKey = 'recentes' | 'menor-preco' | 'maior-preco' | 'menor-km' | 'mais-novos';

export interface Filters {
  q: string;
  brands: string[];
  bodies: BodyType[];
  priceMax: number | null;
  yearMin: number | null;
  kmMax: number | null;
  transmission: Transmission | null;
  fuel: Fuel | null;
  sort: SortKey;
}

export const emptyFilters: Filters = {
  q: '', brands: [], bodies: [], priceMax: null, yearMin: null, kmMax: null, transmission: null, fuel: null, sort: 'recentes',
};

interface StoreValue {
  ready: boolean;
  loadError: string | null;
  mode: Repository['kind'];
  cars: Car[]; // todos (inclui vendidos) — o admin usa
  publicCars: Car[]; // disponíveis + reservados
  settings: StoreSettings;
  saveCar(car: Car): Promise<void>;
  removeCar(id: string): Promise<Car | undefined>;
  saveSettings(s: StoreSettings): Promise<void>;
  uploadPhoto(blob: Blob): Promise<string>;
  resetDemo(): Promise<void>;
  signIn(c: Credentials): Promise<void>;
  signOut(): Promise<void>;
  signedIn: boolean;
  favorites: string[];
  toggleFavorite(id: string): void;
  compare: string[];
  toggleCompare(id: string): boolean;
  clearCompare(): void;
  filters: Filters;
  setFilters(f: Filters | ((f: Filters) => Filters)): void;
}

const Ctx = createContext<StoreValue | null>(null);

function usePersistent<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => storage.get(key, initial));
  useEffect(() => {
    try {
      storage.set(key, v);
    } catch {
      /* preferências não são críticas */
    }
  }, [key, v]);
  return [v, setV] as const;
}

export const MAX_COMPARE = 3;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [favorites, setFavorites] = usePersistent<string[]>('passos.v1.favorites', []);
  const [compare, setCompare] = usePersistent<string[]>('passos.v1.compare', []);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await getRepository();
      const [c, s, auth] = await Promise.all([r.listCars(), r.getSettings(), r.isSignedIn()]);
      if (!alive) return;
      setRepo(r);
      setCars(c);
      setSettings(s);
      setSignedIn(auth);
    })()
      .catch((e: Error) => alive && setLoadError(e.message || 'Não foi possível carregar o estoque.'))
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const need = useCallback(() => {
    if (!repo) throw new Error('O estoque ainda está carregando. Tente de novo em instantes.');
    return repo;
  }, [repo]);

  const saveCar = useCallback(
    async (car: Car) => {
      const saved = await need().saveCar(car);
      setCars((all) => {
        const i = all.findIndex((c) => c.id === saved.id);
        if (i < 0) return [saved, ...all];
        const next = all.slice();
        next[i] = saved;
        return next;
      });
    },
    [need],
  );

  const removeCar = useCallback(
    async (id: string) => {
      const prev = cars.find((c) => c.id === id);
      await need().deleteCar(id);
      setCars((all) => all.filter((c) => c.id !== id));
      setFavorites((f) => f.filter((x) => x !== id));
      setCompare((f) => f.filter((x) => x !== id));
      return prev;
    },
    [cars, need, setCompare, setFavorites],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      loadError,
      mode: repo?.kind ?? 'local',
      cars,
      publicCars: cars.filter((c) => c.status !== 'vendido'),
      settings,
      saveCar,
      removeCar,
      async saveSettings(s) {
        await need().saveSettings(s);
        setSettings(s);
      },
      uploadPhoto: (blob) => need().uploadPhoto(blob),
      async resetDemo() {
        setCars(await need().resetDemo());
      },
      async signIn(c) {
        await need().signIn(c);
        setSignedIn(true);
      },
      async signOut() {
        await need().signOut();
        setSignedIn(false);
      },
      signedIn,
      favorites,
      toggleFavorite: (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      compare,
      toggleCompare(id) {
        if (compare.includes(id)) {
          setCompare(compare.filter((x) => x !== id));
          return true;
        }
        if (compare.length >= MAX_COMPARE) return false;
        setCompare([...compare, id]);
        return true;
      },
      clearCompare: () => setCompare([]),
      filters,
      setFilters,
    }),
    [ready, loadError, repo, cars, settings, saveCar, removeCar, need, signedIn, favorites, setFavorites, compare, setCompare, filters],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore fora do StoreProvider');
  return v;
}

export function applyFilters(cars: Car[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  const out = cars.filter((c) => {
    if (q && !`${c.brand} ${c.model} ${c.version} ${c.color} ${c.code}`.toLowerCase().includes(q)) return false;
    if (f.brands.length && !f.brands.includes(c.brand)) return false;
    if (f.bodies.length && !f.bodies.includes(c.body)) return false;
    if (f.priceMax != null && c.price > f.priceMax) return false;
    if (f.yearMin != null && c.yearModel < f.yearMin) return false;
    if (f.kmMax != null && c.km > f.kmMax) return false;
    if (f.transmission && c.transmission !== f.transmission) return false;
    if (f.fuel && c.fuel !== f.fuel) return false;
    return true;
  });
  const by: Record<SortKey, (a: Car, b: Car) => number> = {
    recentes: (a, b) => b.createdAt.localeCompare(a.createdAt),
    'menor-preco': (a, b) => a.price - b.price,
    'maior-preco': (a, b) => b.price - a.price,
    'menor-km': (a, b) => a.km - b.km,
    'mais-novos': (a, b) => b.yearModel - a.yearModel || b.yearFab - a.yearFab,
  };
  // Reservados vão para o fim, mantendo a ordem escolhida.
  return out.sort((a, b) => Number(a.status === 'reservado') - Number(b.status === 'reservado') || by[f.sort](a, b));
}

export function countActiveFilters(f: Filters) {
  return (
    (f.q.trim() ? 1 : 0) + f.brands.length + f.bodies.length + (f.priceMax != null ? 1 : 0) +
    (f.yearMin != null ? 1 : 0) + (f.kmMax != null ? 1 : 0) + (f.transmission ? 1 : 0) + (f.fuel ? 1 : 0)
  );
}

export function brandStats(cars: Car[]) {
  const m = new Map<string, number>();
  for (const c of cars) m.set(c.brand, (m.get(c.brand) ?? 0) + 1);
  return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
