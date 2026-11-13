import { createClient } from '@supabase/supabase-js';
import type { Repository } from './repository';
import type { Car, StoreSettings } from './types';
import { defaultSettings, seedCars } from './seed';
import { uid } from './format';

const BUCKET = 'car-photos';

type Row = {
  id: string; code: string; brand: string; model: string; version: string;
  year_fab: number; year_model: number; price: number; fipe: number | null; km: number;
  fuel: Car['fuel']; transmission: Car['transmission']; body: Car['body'];
  color: string; color_hex: string; doors: number; plate_end: string;
  features: string[]; description: string; photos: string[];
  featured: boolean; status: Car['status']; created_at: string; updated_at: string | null;
};

const toRow = (c: Car): Row => ({
  id: c.id, code: c.code, brand: c.brand, model: c.model, version: c.version,
  year_fab: c.yearFab, year_model: c.yearModel, price: c.price, fipe: c.fipe, km: c.km,
  fuel: c.fuel, transmission: c.transmission, body: c.body, color: c.color, color_hex: c.colorHex,
  doors: c.doors, plate_end: c.plateEnd, features: c.features, description: c.description,
  photos: c.photos, featured: c.featured, status: c.status, created_at: c.createdAt,
  updated_at: new Date().toISOString(),
});

const fromRow = (r: Row): Car => ({
  id: r.id, code: r.code, brand: r.brand, model: r.model, version: r.version ?? '',
  yearFab: r.year_fab, yearModel: r.year_model, price: Number(r.price), fipe: r.fipe == null ? null : Number(r.fipe),
  km: r.km, fuel: r.fuel, transmission: r.transmission, body: r.body, color: r.color ?? '',
  colorHex: r.color_hex ?? '#8A8D91', doors: r.doors ?? 4, plateEnd: r.plate_end ?? '',
  features: r.features ?? [], description: r.description ?? '', photos: r.photos ?? [],
  featured: !!r.featured, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at ?? undefined,
});

function fail(error: { message: string } | null): asserts error is null {
  if (error) throw new Error(error.message);
}

export function createSupabaseRepo(url: string, key: string): Repository {
  const sb = createClient(url, key);
  return {
    kind: 'supabase',
    async listCars() {
      const { data, error } = await sb.from('cars').select('*').order('created_at', { ascending: false });
      fail(error);
      return (data as Row[]).map(fromRow);
    },
    async saveCar(car) {
      const { data, error } = await sb.from('cars').upsert(toRow(car)).select().single();
      fail(error);
      return fromRow(data as Row);
    },
    async deleteCar(id) {
      const { error } = await sb.from('cars').delete().eq('id', id);
      fail(error);
    },
    async getSettings() {
      const { data, error } = await sb.from('store_settings').select('data').eq('id', 1).maybeSingle();
      fail(error);
      return { ...defaultSettings, ...((data?.data as Partial<StoreSettings>) ?? {}) };
    },
    async saveSettings(s) {
      const { error } = await sb.from('store_settings').upsert({ id: 1, data: s, updated_at: new Date().toISOString() });
      fail(error);
    },
    async uploadPhoto(blob) {
      const path = `${new Date().getFullYear()}/${uid()}.jpg`;
      const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
      fail(error);
      return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
    async resetDemo() {
      // Importa o estoque de exemplo (não apaga carros já cadastrados).
      const { error } = await sb.from('cars').upsert(seedCars.map(toRow));
      fail(error);
      return this.listCars();
    },
    async signIn({ email, password }) {
      const { error } = await sb.auth.signInWithPassword({ email: email ?? '', password });
      if (error) throw new Error('E-mail ou senha incorretos.');
    },
    async signOut() {
      await sb.auth.signOut();
    },
    async isSignedIn() {
      const { data } = await sb.auth.getSession();
      return !!data.session;
    },
  };
}
