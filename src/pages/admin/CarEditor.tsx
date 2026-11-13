import { useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useToast } from '../../lib/toast';
import {
  BODY_TYPES, COLOR_PRESETS, FEATURES, FUELS, KNOWN_BRANDS, PROVENANCE, STATUSES, STATUS_LABEL, TRANSMISSIONS,
  type Car, type Fuel,
} from '../../lib/types';
import { digits, num, uid } from '../../lib/format';
import { compressImage } from '../../lib/image';
import { Modal } from '../../components/ui';
import { CarCard } from '../../components/CarCard';

const MAX_PHOTOS = 12;
const THIS_YEAR = 2026;

function blankCar(cars: Car[]): Car {
  const last = Math.max(1000, ...cars.map((c) => Number(digits(c.code)) || 0));
  return {
    id: uid(), code: `PA-${last + 1}`, brand: '', model: '', version: '', yearFab: THIS_YEAR - 2, yearModel: THIS_YEAR - 1,
    price: 0, fipe: null, km: 0, fuel: 'Flex', transmission: 'Automático', body: 'Hatch', color: 'Branco', colorHex: '#F2F2EF',
    doors: 4, plateEnd: '', features: [], description: '', photos: [], featured: false, status: 'disponivel',
    createdAt: new Date().toISOString(),
  };
}

function validate(d: Car) {
  const e: Partial<Record<keyof Car, string>> = {};
  if (!d.brand.trim()) e.brand = 'Informe a marca.';
  if (!d.model.trim()) e.model = 'Informe o modelo.';
  if (d.yearFab < 1980 || d.yearFab > THIS_YEAR + 1) e.yearFab = 'Ano inválido.';
  if (d.yearModel < d.yearFab || d.yearModel > d.yearFab + 1) e.yearModel = 'Use o ano de fabricação ou o seguinte.';
  if (!d.price || d.price < 1000) e.price = 'Informe o preço de venda.';
  return e;
}

export function CarEditor({ car, onClose }: { car: Car | null; onClose: () => void }) {
  const { cars, saveCar, uploadPhoto, mode } = useStore();
  const toast = useToast();
  const [d, setD] = useState<Car>(() => (car ? structuredClone(car) : blankCar(cars)));
  const [touched, setTouched] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState(false);
  const [custom, setCustom] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const errors = validate(d);
  const err = (k: keyof Car) => (touched ? errors[k] : undefined);
  const set = <K extends keyof Car>(k: K, v: Car[K]) => setD((x) => ({ ...x, [k]: v }));

  async function addFiles(files: FileList | File[]) {
    const room = MAX_PHOTOS - d.photos.length;
    const list = [...files].filter((f) => f.type.startsWith('image/')).slice(0, room);
    if (!list.length) {
      toast(room <= 0 ? `Limite de ${MAX_PHOTOS} fotos por carro.` : 'Escolha arquivos de imagem (JPG, PNG ou WEBP).', { tone: 'error' });
      return;
    }
    setUploading((n) => n + list.length);
    for (const f of list) {
      try {
        const blob = mode === 'local' ? await compressImage(f, 1100, 0.74) : await compressImage(f);
        const url = await uploadPhoto(blob);
        setD((x) => ({ ...x, photos: [...x.photos, url] }));
      } catch (e) {
        toast((e as Error).message, { tone: 'error' });
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  const movePhoto = (i: number, to: number) =>
    setD((x) => {
      const p = x.photos.slice();
      const [it] = p.splice(i, 1);
      p.splice(to, 0, it);
      return { ...x, photos: p };
    });

  const toggleFeature = (f: string) => set('features', d.features.includes(f) ? d.features.filter((x) => x !== f) : [...d.features, f]);

  async function submit() {
    setTouched(true);
    if (Object.keys(errors).length) {
      toast('Confira os campos destacados.', { tone: 'error' });
      return;
    }
    setSaving(true);
    try {
      await saveCar({ ...d, brand: d.brand.trim(), model: d.model.trim(), version: d.version.trim() });
      toast(car ? 'Alterações salvas' : `${d.brand} ${d.model} adicionado ao estoque`);
      onClose();
    } catch (e) {
      toast((e as Error).message, { tone: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const extraFeatures = d.features.filter((f) => !(FEATURES as readonly string[]).includes(f) && !(PROVENANCE as readonly string[]).includes(f));

  return (
    <Modal
      open
      onClose={onClose}
      variant="drawer"
      size="xl"
      title={car ? `Editar ${car.brand} ${car.model}` : 'Adicionar carro'}
      footer={
        <>
          <span className="mr-auto text-[12px] font-semibold text-muted tnum">Código {d.code}</span>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={saving || uploading > 0}>
            {saving ? 'Salvando…' : car ? 'Salvar alterações' : 'Publicar no estoque'}
          </button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid min-w-0 gap-8">
          <Section title="Fotos" hint={`Até ${MAX_PHOTOS}. A primeira é a capa. Sem fotos, o site mostra uma ilustração na cor do carro.`}>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                void addFiles(e.dataTransfer.files);
              }}
              className={`grid grid-cols-3 gap-2 rounded-2xl border-2 border-dashed p-2 sm:grid-cols-4 ${drag ? 'border-brand bg-brand-soft' : 'border-line'}`}
            >
              {d.photos.map((p, i) => (
                <div key={p.slice(-40) + i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2">
                  <img src={p} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-on-brand">Capa</span>}
                  <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <PhotoBtn label="Mover para a esquerda" disabled={i === 0} onClick={() => movePhoto(i, i - 1)}>
                      <ArrowLeft size={14} />
                    </PhotoBtn>
                    {i !== 0 && (
                      <PhotoBtn label="Usar como capa" onClick={() => movePhoto(i, 0)}>
                        <Star size={14} />
                      </PhotoBtn>
                    )}
                    <PhotoBtn label="Remover foto" onClick={() => set('photos', d.photos.filter((_, j) => j !== i))}>
                      <Trash2 size={14} />
                    </PhotoBtn>
                    <PhotoBtn label="Mover para a direita" disabled={i === d.photos.length - 1} onClick={() => movePhoto(i, i + 1)}>
                      <ArrowRight size={14} />
                    </PhotoBtn>
                  </div>
                </div>
              ))}
              {Array.from({ length: uploading }, (_, i) => (
                <div key={`up${i}`} className="grid aspect-[4/3] place-items-center rounded-xl bg-surface-2 text-muted">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              ))}
              {d.photos.length + uploading < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="grid aspect-[4/3] place-items-center rounded-xl bg-surface-2 text-center text-[12px] font-semibold text-muted transition hover:text-fg"
                >
                  <span className="grid justify-items-center gap-1">
                    <ImagePlus size={22} />
                    Enviar fotos
                    <span className="hidden font-normal sm:block">ou arraste aqui</span>
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) void addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </Section>

          <Section title="Identificação">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Marca" id="ed-marca" error={err('brand')}>
                <input id="ed-marca" list="ed-marcas" className="input" value={d.brand} onChange={(e) => set('brand', e.target.value)} aria-invalid={!!err('brand')} placeholder="Ex.: Toyota" />
                <datalist id="ed-marcas">
                  {KNOWN_BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              <Field label="Modelo" id="ed-modelo" error={err('model')}>
                <input id="ed-modelo" className="input" value={d.model} onChange={(e) => set('model', e.target.value)} aria-invalid={!!err('model')} placeholder="Ex.: Corolla" />
              </Field>
              <Field label="Versão" id="ed-versao">
                <input id="ed-versao" className="input" value={d.version} onChange={(e) => set('version', e.target.value)} placeholder="Ex.: XEi 2.0 Flex" />
              </Field>
            </div>
          </Section>

          <Section title="Ano, quilometragem e preço">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Ano fabricação" id="ed-anofab" error={err('yearFab')}>
                <input id="ed-anofab" inputMode="numeric" className="input tnum" value={d.yearFab || ''} onChange={(e) => set('yearFab', Number(digits(e.target.value).slice(0, 4)))} aria-invalid={!!err('yearFab')} />
              </Field>
              <Field label="Ano modelo" id="ed-anomod" error={err('yearModel')}>
                <input id="ed-anomod" inputMode="numeric" className="input tnum" value={d.yearModel || ''} onChange={(e) => set('yearModel', Number(digits(e.target.value).slice(0, 4)))} aria-invalid={!!err('yearModel')} />
              </Field>
              <Field label="Quilometragem" id="ed-km">
                <div className="relative">
                  <input id="ed-km" inputMode="numeric" className="input pr-10 tnum" value={d.km ? num(d.km) : ''} placeholder="0" onChange={(e) => set('km', Number(digits(e.target.value).slice(0, 7)))} />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted">km</span>
                </div>
              </Field>
              <Field label="Preço de venda" id="ed-preco" error={err('price')}>
                <MoneyInput id="ed-preco" value={d.price} onChange={(v) => set('price', v)} invalid={!!err('price')} />
              </Field>
              <Field label="Tabela FIPE (opcional)" id="ed-fipe">
                <MoneyInput id="ed-fipe" value={d.fipe ?? 0} onChange={(v) => set('fipe', v || null)} />
              </Field>
            </div>
          </Section>

          <Section title="Características">
            <div className="grid gap-4">
              <Field label="Carroceria" id="ed-body">
                <div className="flex flex-wrap gap-1.5" id="ed-body">
                  {BODY_TYPES.map((b) => (
                    <button key={b} type="button" className="chip" aria-pressed={d.body === b} onClick={() => set('body', b)}>
                      {b}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Field label="Câmbio" id="ed-cambio">
                  <select id="ed-cambio" className="input" value={d.transmission} onChange={(e) => set('transmission', e.target.value as Car['transmission'])}>
                    {TRANSMISSIONS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Combustível" id="ed-comb">
                  <select id="ed-comb" className="input" value={d.fuel} onChange={(e) => set('fuel', e.target.value as Fuel)}>
                    {FUELS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Portas" id="ed-portas">
                  <select id="ed-portas" className="input" value={d.doors} onChange={(e) => set('doors', Number(e.target.value))}>
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Final da placa" id="ed-placa">
                  <select id="ed-placa" className="input" value={d.plateEnd} onChange={(e) => set('plateEnd', e.target.value)}>
                    <option value="">—</option>
                    {Array.from({ length: 10 }, (_, n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Cor" id="ed-cor">
                <div className="flex flex-wrap items-center gap-2">
                  <input id="ed-cor" className="input max-w-[220px]" value={d.color} onChange={(e) => set('color', e.target.value)} placeholder="Ex.: Prata Supernova" />
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.name}
                        aria-label={`Cor ${c.name}`}
                        aria-pressed={d.colorHex.toLowerCase() === c.hex.toLowerCase()}
                        onClick={() => setD((x) => ({ ...x, colorHex: c.hex, color: COLOR_PRESETS.some((p) => p.name === x.color) || !x.color ? c.name : x.color }))}
                        className="h-8 w-8 rounded-full border-2 border-black/10 ring-brand ring-offset-2 ring-offset-surface aria-pressed:ring-2"
                        style={{ background: c.hex }}
                      />
                    ))}
                    <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-line" title="Outra cor">
                      <span className="sr-only">Escolher outra cor</span>
                      <input type="color" value={d.colorHex} onChange={(e) => set('colorHex', e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                      <Plus size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-muted" />
                    </label>
                  </div>
                </div>
              </Field>
            </div>
          </Section>

          <Section title="Procedência" hint="Aparecem como selos verdes na página do carro.">
            <div className="flex flex-wrap gap-1.5">
              {PROVENANCE.map((f) => (
                <button key={f} type="button" className="chip" aria-pressed={d.features.includes(f)} onClick={() => toggleFeature(f)}>
                  {f}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Opcionais">
            <div className="flex flex-wrap gap-1.5">
              {[...FEATURES, ...extraFeatures].map((f) => (
                <button key={f} type="button" className="chip" aria-pressed={d.features.includes(f)} onClick={() => toggleFeature(f)}>
                  {f}
                </button>
              ))}
            </div>
            <form
              className="mt-3 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = custom.trim();
                if (v && !d.features.includes(v)) set('features', [...d.features, v]);
                setCustom('');
              }}
            >
              <label className="sr-only" htmlFor="ed-extra">Outro opcional</label>
              <input id="ed-extra" className="input h-10" placeholder="Outro opcional (ex.: Engate)" value={custom} onChange={(e) => setCustom(e.target.value)} />
              <button className="btn btn-outline btn-sm h-10">Adicionar</button>
            </form>
          </Section>

          <Section title="Descrição">
            <label className="sr-only" htmlFor="ed-desc">Descrição</label>
            <textarea id="ed-desc" rows={4} className="input" value={d.description} onChange={(e) => set('description', e.target.value)} placeholder="Estado de conservação, revisões, histórico…" />
          </Section>

          <Section title="Publicação">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="field-label" htmlFor="ed-status">Status</label>
                <select id="ed-status" className="input w-[180px]" value={d.status} onChange={(e) => set('status', e.target.value as Car['status'])}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
              <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="peer sr-only" checked={d.featured} onChange={(e) => set('featured', e.target.checked)} />
                <span className="relative h-7 w-12 rounded-full bg-line transition peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-brand after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
                <span className="text-[14px] font-semibold">Destacar na página inicial</span>
              </label>
            </div>
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-0">
            <p className="eyebrow mb-3 text-muted">Prévia no site</p>
            <div inert className="pointer-events-none">
              <CarCard car={{ ...d, brand: d.brand || 'Marca', model: d.model || 'Modelo', version: d.version || 'Versão' }} />
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-[16px] font-extrabold italic">{title}</h3>
      {hint && <p className="mb-3 text-[13px] text-muted">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </section>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] font-semibold text-danger">{error}</p>}
    </div>
  );
}

function MoneyInput({ id, value, onChange, invalid }: { id: string; value: number; onChange: (v: number) => void; invalid?: boolean }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted">R$</span>
      <input
        id={id}
        inputMode="numeric"
        className="input pl-10 tnum"
        value={value ? num(value) : ''}
        placeholder="0"
        aria-invalid={invalid}
        onChange={(e) => onChange(Number(digits(e.target.value).slice(0, 9)) || 0)}
      />
    </div>
  );
}

function PhotoBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="grid h-7 w-7 place-items-center rounded-lg bg-black/65 text-white backdrop-blur disabled:opacity-30">
      {children}
    </button>
  );
}
