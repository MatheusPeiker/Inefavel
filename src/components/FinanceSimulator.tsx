import { useState } from 'react';
import { Calculator } from 'lucide-react';
import type { Car, StoreSettings } from '../lib/types';
import { installment, money } from '../lib/format';
import { financeText, waLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './ui';

const TERMS = [12, 24, 36, 48, 60];

export function FinanceSimulator({ car, settings }: { car: Car; settings: StoreSettings }) {
  const step = car.price > 200000 ? 5000 : 1000;
  const [down, setDown] = useState(() => Math.round((car.price * 0.3) / step) * step);
  const [months, setMonths] = useState(48);
  const financed = Math.max(0, car.price - down);
  const pmt = installment(financed, settings.interestRate, months);
  const total = down + pmt * months;
  const pct = Math.round((down / car.price) * 100);

  return (
    <section className="rounded-[22px] bg-surface p-5 shadow-card" aria-labelledby="sim-titulo">
      <div className="flex items-center gap-2">
        <Calculator size={18} className="text-brand-text" />
        <h2 id="sim-titulo" className="font-display text-[17px] font-extrabold italic">
          Simule o financiamento
        </h2>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor="sim-entrada" className="field-label mb-0">
            Entrada
          </label>
          <span className="text-[13px] font-semibold text-muted tnum">{pct}% do valor</span>
        </div>
        <p className="price mt-1 text-[22px]">{money(down)}</p>
        <input
          id="sim-entrada"
          type="range"
          className="mt-2 w-full accent-[var(--brand)]"
          min={0}
          max={Math.round((car.price * 0.9) / step) * step}
          step={step}
          value={down}
          onChange={(e) => setDown(Number(e.target.value))}
        />
      </div>

      <fieldset className="mt-4">
        <legend className="field-label">Prazo</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {TERMS.map((t) => (
            <button key={t} className="chip justify-center px-0 tnum" aria-pressed={months === t} onClick={() => setMonths(t)}>
              {t}x
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 rounded-2xl bg-surface-2 p-4">
        <p className="text-[13px] font-semibold text-muted">Parcela estimada</p>
        <p className="price mt-0.5 text-[30px] leading-none text-fg">
          {months}x {money(pmt)}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
          <div>
            <dt className="text-muted">Valor financiado</dt>
            <dd className="font-bold tnum">{money(financed)}</dd>
          </div>
          <div>
            <dt className="text-muted">Total ao final</dt>
            <dd className="font-bold tnum">{money(total)}</dd>
          </div>
        </dl>
      </div>
      <a
        className="btn btn-outline mt-4 w-full"
        target="_blank"
        rel="noopener noreferrer"
        href={waLink(settings.whatsapp, financeText(car, settings, down, months, pmt))}
      >
        <WhatsAppIcon size={18} /> Enviar simulação no WhatsApp
      </a>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Simulação pela Tabela Price com taxa de {settings.interestRate.toLocaleString('pt-BR')}% ao mês. Valores ilustrativos, sujeitos à análise de crédito.
      </p>
    </section>
  );
}
