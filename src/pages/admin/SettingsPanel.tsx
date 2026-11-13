import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useToast } from '../../lib/toast';
import { digits, phoneLabel } from '../../lib/format';
import { genericText, waLink } from '../../lib/whatsapp';
import { ConfirmDialog, WhatsAppIcon } from '../../components/ui';
import type { StoreSettings } from '../../lib/types';

export function SettingsPanel() {
  const { settings, saveSettings, resetDemo, mode } = useStore();
  const toast = useToast();
  const [s, setS] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => setS((x) => ({ ...x, [k]: v }));
  const waOk = /^\d{12,13}$/.test(s.whatsapp);
  const dirty = JSON.stringify(s) !== JSON.stringify(settings);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form
        className="card grid gap-4 p-5 sm:grid-cols-2 sm:p-7"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!waOk) {
            toast('Confira o número do WhatsApp: use DDI + DDD + número, só dígitos.', { tone: 'error' });
            return;
          }
          setSaving(true);
          try {
            await saveSettings(s);
            toast('Configurações salvas');
          } catch (err) {
            toast((err as Error).message, { tone: 'error' });
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="cf-wa">WhatsApp da loja</label>
          <input id="cf-wa" inputMode="numeric" className="input tnum" value={s.whatsapp} onChange={(e) => set('whatsapp', digits(e.target.value).slice(0, 13))} aria-invalid={!waOk} placeholder="5547999999999" />
          <p className={`mt-1 text-[12px] ${waOk ? 'text-muted' : 'font-semibold text-danger'}`}>
            {waOk ? `Os botões do site abrem conversa com ${phoneLabel(s.whatsapp)}.` : 'Use DDI 55 + DDD + número. Ex.: 5547999999999'}
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="cf-nome">Nome da loja</label>
          <input id="cf-nome" className="input" value={s.storeName} onChange={(e) => set('storeName', e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-end">Endereço</label>
          <input id="cf-end" className="input" value={s.address} onChange={(e) => set('address', e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-cidade">Cidade · UF</label>
          <input id="cf-cidade" className="input" value={s.city} onChange={(e) => set('city', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="cf-horario">Horário de atendimento</label>
          <input id="cf-horario" className="input" value={s.hours} onChange={(e) => set('hours', e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-insta">Instagram</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-muted">@</span>
            <input id="cf-insta" className="input pl-8" value={s.instagram} onChange={(e) => set('instagram', e.target.value.replace(/^@/, '').trim())} />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="cf-taxa">Taxa do simulador (% ao mês)</label>
          <input
            id="cf-taxa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            className="input tnum"
            value={s.interestRate}
            onChange={(e) => set('interestRate', Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <button className="btn btn-primary" disabled={saving || !dirty}>
            {saving ? 'Salvando…' : 'Salvar configurações'}
          </button>
          {waOk && (
            <a className="btn btn-ghost" target="_blank" rel="noopener noreferrer" href={waLink(s.whatsapp, genericText(s))}>
              <WhatsAppIcon size={17} /> Testar link do WhatsApp
            </a>
          )}
        </div>
      </form>

      <div className="grid content-start gap-4">
        <div className="card p-5">
          <p className="font-display text-[16px] font-extrabold italic">Onde ficam os dados</p>
          <p className="mt-2 text-[14px] text-muted">
            {mode === 'supabase'
              ? 'Carros, fotos e configurações estão no Supabase. Todos os visitantes veem as mesmas informações.'
              : 'Modo demonstração: carros e fotos ficam salvos só neste navegador. Ao conectar o Supabase, o estoque passa a ser o mesmo para todos os visitantes.'}
          </p>
        </div>
        <div className="card p-5">
          <p className="font-display text-[16px] font-extrabold italic">{mode === 'supabase' ? 'Importar exemplos' : 'Recomeçar a demonstração'}</p>
          <p className="mt-2 text-[14px] text-muted">
            {mode === 'supabase' ? 'Adiciona os 16 carros de exemplo ao banco, sem apagar os seus.' : 'Volta o estoque para os 16 carros de exemplo. Carros e fotos adicionados aqui serão apagados.'}
          </p>
          <button className="btn btn-outline btn-sm mt-4" onClick={() => setConfirm(true)}>
            <RotateCcw size={15} /> {mode === 'supabase' ? 'Importar exemplos' : 'Restaurar exemplos'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title={mode === 'supabase' ? 'Importar carros de exemplo' : 'Restaurar estoque de exemplo'}
        message={mode === 'supabase' ? 'Os carros de exemplo serão adicionados ao banco de dados.' : 'Todos os carros cadastrados neste navegador serão substituídos pelos exemplos.'}
        confirmLabel={mode === 'supabase' ? 'Importar' : 'Restaurar'}
        onClose={() => setConfirm(false)}
        onConfirm={async () => {
          try {
            await resetDemo();
            toast('Estoque de exemplo carregado');
          } catch (e) {
            toast((e as Error).message, { tone: 'error' });
          }
          setConfirm(false);
        }}
      />
    </div>
  );
}
