import type { Car, StoreSettings } from './types';
import { BUNDLED_PHOTOS, defaultSettings, seedCars } from './seed';
import { session, storage } from './storage';
import { blobToDataUrl } from './image';

export interface Credentials {
  email?: string;
  password: string;
}

/** Camada de dados. Hoje: navegador (local). Com as variáveis do Supabase: banco real. */
export interface Repository {
  kind: 'local' | 'supabase';
  listCars(): Promise<Car[]>;
  saveCar(car: Car): Promise<Car>;
  deleteCar(id: string): Promise<void>;
  getSettings(): Promise<StoreSettings>;
  saveSettings(s: StoreSettings): Promise<void>;
  uploadPhoto(blob: Blob): Promise<string>;
  resetDemo(): Promise<Car[]>;
  signIn(c: Credentials): Promise<void>;
  signOut(): Promise<void>;
  isSignedIn(): Promise<boolean>;
}

const K = { cars: 'passos.v2.cars', settings: 'passos.v2.settings', auth: 'passos.v1.admin' };

// As fotos que vêm com o app são guardadas como "@foto:N" para não lotar o armazenamento do navegador.
const TOKEN = '@foto:';
const pack = (cars: Car[]) =>
  cars.map((c) => ({ ...c, photos: c.photos.map((p) => (BUNDLED_PHOTOS.includes(p) ? TOKEN + BUNDLED_PHOTOS.indexOf(p) : p)) }));
const unpack = (cars: Car[]) =>
  cars.map((c) => ({ ...c, photos: c.photos.map((p) => (p.startsWith(TOKEN) ? BUNDLED_PHOTOS[Number(p.slice(TOKEN.length))] ?? '' : p)).filter(Boolean) }));
const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || '1234';

function createLocalRepo(): Repository {
  const read = () => {
    const raw = storage.get<Car[] | null>(K.cars, null);
    return raw ? unpack(raw) : seedCars.map((c) => ({ ...c }));
  };
  return {
    kind: 'local',
    async listCars() {
      return read();
    },
    async saveCar(car) {
      const all = read();
      const i = all.findIndex((c) => c.id === car.id);
      const next = { ...car, updatedAt: new Date().toISOString() };
      if (i >= 0) all[i] = next;
      else all.unshift(next);
      storage.set(K.cars, pack(all));
      return next;
    },
    async deleteCar(id) {
      storage.set(K.cars, pack(read().filter((c) => c.id !== id)));
    },
    async getSettings() {
      return { ...defaultSettings, ...storage.get<Partial<StoreSettings>>(K.settings, {}) };
    },
    async saveSettings(s) {
      storage.set(K.settings, s);
    },
    async uploadPhoto(blob) {
      return blobToDataUrl(blob);
    },
    async resetDemo() {
      storage.remove(K.cars);
      return seedCars;
    },
    async signIn({ password }) {
      if (password.trim() !== ADMIN_PIN) throw new Error('PIN incorreto. Confira e tente de novo.');
      session.set(K.auth, '1');
    },
    async signOut() {
      session.set(K.auth, null);
    },
    async isSignedIn() {
      return session.get(K.auth) === '1';
    },
  };
}

let repoPromise: Promise<Repository> | null = null;

export function getRepository(): Promise<Repository> {
  if (repoPromise) return repoPromise;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  // O build "artifact" nunca inclui o Supabase (arquivo único de revisão).
  if (import.meta.env.MODE !== 'artifact' && url && key) {
    repoPromise = import('./supabase-repo').then((m) => m.createSupabaseRepo(url, key));
  } else {
    repoPromise = Promise.resolve(createLocalRepo());
  }
  return repoPromise;
}
