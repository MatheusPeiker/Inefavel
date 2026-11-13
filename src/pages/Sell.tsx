import { useState } from 'react';
import { KNOWN_BRANDS } from '../lib/types';
import { digits, num } from '../lib/format';
import { useStore } from '../lib/store';
import { waLink } from '../lib/whatsapp';
import { WhatsAppIcon } from '../components/ui';

const STEPS = [
  ['Conte sobre o carro', 'Marca, modelo, ano e quilometragem. Leva menos de um minuto.'],
  ['Envie as fotos no WhatsApp', 'A conversa já abre com os dados preenchidos. É só anexar as fotos.'],
  ['Receba a avaliação', 'A equipe avalia e responde pelo WhatsApp com a proposta para a troca.'],
];

export function Sell() {
  const { settings } = useStore();
  const [f, setF] = useState({ brand: '', model: '', year: '', km: '', intent: 'Trocar', name: '', notes: '' });
  const [touched, setTouched] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const missing = { brand: !f.brand.trim(), model: !f.model.trim(), year: !/^\d{4}$/.test(f.year), name: !f.name.trim() };
  const valid = !Object.values(missing).some(Boolean);
  const text = [
    f.intent === 'Trocar'
      ? `Olá, ${settings.storeName}! Quero dar meu carro na troca. Podem avaliar?`
      : `Olá, ${settings.storeName}! Vocês têm interesse em avaliar meu carro para compra?`,
    `*${f.brand} ${f.model}* ${f.year}`,
    f.km ? `Quilometragem: ${num(Number(digits(f.km)))} km` : '',
    f.notes ? `Observações: ${f.notes}` : '',
    `Meu nome: ${f.name}`,
    '',
    'Vou enviar as fotos por aqui.',
  ].filter(Boolean).join('\n');

  return (
    <div className="wrap pt-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="tagline text-[13px] text-brand-text">seu usado na troca</p>
          <h1 className="display text-[clamp(2.2rem,5vw,3.6rem)]">Avalie seu carro com a Passos</h1>
          <p className="mt-4 max-w-lg text-[16px] text-muted">
            Aceitamos seu usado na troca, mediante avaliação. Preencha os dados e a conversa continua pelo WhatsApp.
          </p>
          <ol className="mt-8 grid gap-5">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="price grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[16px] text-on-ink">{i + 1}</span>
                <div>
                  <p className="font-display text-[17px] font-extrabold italic">{t}</p>
                  <p className="text-[14px] text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <form className="card grid gap-4 p-5 sm:grid-cols-2 sm:p-7" onSubmit={(e) => e.preventDefault()} noValidate>
          <fieldset className="sm:col-span-2">
            <legend className="field-label">O que você quer fazer?</legend>
            <div className="grid grid-cols-2 gap-2">
              {['Trocar', 'Vender'].map((o) => (
                <button type="button" key={o} className="chip h-11 justify-center text-[14px]" aria-pressed={f.intent === o} onClick={() => setF({ ...f, intent: o })}>
                  {o === 'Vender' ? 'Quero vender' : 'Dar na troca'}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="field-label" htmlFor="v-marca">Marca</label>
            <input id="v-marca" list="v-marcas" className="input" value={f.brand} onChange={set('brand')} aria-invalid={touched && missing.brand} placeholder="Ex.: Volkswagen" />
            <datalist id="v-marcas">
              {KNOWN_BRANDS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="field-label" htmlFor="v-modelo">Modelo e versão</label>
            <input id="v-modelo" className="input" value={f.model} onChange={set('model')} aria-invalid={touched && missing.model} placeholder="Ex.: Gol 1.0" />
          </div>
          <div>
            <label className="field-label" htmlFor="v-ano">Ano do modelo</label>
            <input id="v-ano" inputMode="numeric" maxLength={4} className="input tnum" value={f.year} onChange={(e) => setF({ ...f, year: digits(e.target.value).slice(0, 4) })} aria-invalid={touched && missing.year} placeholder="2020" />
          </div>
          <div>
            <label className="field-label" htmlFor="v-km">Quilometragem</label>
            <input id="v-km" inputMode="numeric" className="input tnum" value={f.km ? num(Number(digits(f.km))) : ''} onChange={(e) => setF({ ...f, km: digits(e.target.value).slice(0, 7) })} placeholder="45.000" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="v-nome">Seu nome</label>
            <input id="v-nome" className="input" value={f.name} onChange={set('name')} aria-invalid={touched && missing.name} autoComplete="name" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="v-obs">Observações (opcional)</label>
            <textarea id="v-obs" rows={3} className="input" value={f.notes} onChange={set('notes')} placeholder="Estado dos pneus, revisões, detalhes de lataria…" />
          </div>
          <div className="sm:col-span-2">
            {touched && !valid && <p className="mb-3 text-[13px] font-semibold text-danger">Preencha marca, modelo, ano (4 dígitos) e seu nome para continuar.</p>}
            <a
              className="btn btn-primary btn-lg w-full"
              href={waLink(settings.whatsapp, text)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!valid) {
                  e.preventDefault();
                  setTouched(true);
                }
              }}
            >
              <WhatsAppIcon size={20} /> Enviar pelo WhatsApp
            </a>
            <p className="mt-2 text-center text-[12px] text-muted">A conversa abre no WhatsApp com os dados preenchidos. Nada é enviado antes de você tocar em enviar.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
