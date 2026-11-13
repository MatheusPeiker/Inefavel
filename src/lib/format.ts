const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brlCents = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat('pt-BR');

export const money = (v: number) => brl.format(Math.round(v));
export const moneyCents = (v: number) => brlCents.format(v);
export const num = (v: number) => int.format(Math.round(v));
export const kmLabel = (v: number) => (v === 0 ? '0 km' : `${num(v)} km`);
export const years = (fab: number, model: number) => `${fab}/${model}`;
export const digits = (s: string) => s.replace(/\D+/g, '');

/** Formata 5511999999999 como +55 (11) 99999-9999. */
export function phoneLabel(raw: string) {
  const d = digits(raw);
  const m = d.match(/^(55)?(\d{2})(\d{4,5})(\d{4})$/);
  if (!m) return raw;
  return `${m[1] ? '+55 ' : ''}(${m[2]}) ${m[3]}-${m[4]}`;
}

/** Parcela pela Tabela Price. rate em % ao mês. */
export function installment(principal: number, ratePct: number, months: number) {
  if (principal <= 0) return 0;
  const i = ratePct / 100;
  if (i === 0) return principal / months;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

/** Parcela "a partir de": 30% de entrada em 60x. */
export const fromInstallment = (price: number, rate: number) => installment(price * 0.7, rate, 60);

export function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function carTitle(c: { brand: string; model: string }) {
  return `${c.brand} ${c.model}`;
}

export function slug(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}
