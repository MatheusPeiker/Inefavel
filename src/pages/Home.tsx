import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Landmark, MessageCircle, Repeat2, ShieldCheck } from 'lucide-react';
import { applyFilters, brandStats, emptyFilters, useStore } from '../lib/store';
import { BODY_TYPES, type BodyType, type Car } from '../lib/types';
import { kmLabel, money, years } from '../lib/format';
import { Link, navigate } from '../lib/router';
import { Logo } from '../components/Logo';
import { BrandMarquee } from '../components/BrandMarquee';
import { CarCard } from '../components/CarCard';
import { CarMedia } from '../components/CarMedia';
import { CarArt } from '../components/CarArt';
import { SectionHead } from '../components/ui';

const PRICE_STEPS = [70000, 100000, 130000, 160000, 200000, 300000];

export function Home() {
  const { publicCars, setFilters } = useStore();
  const brands = useMemo(() => brandStats(publicCars), [publicCars]);
  const featured = useMemo(() => publicCars.filter((c) => c.featured && c.status === 'disponivel'), [publicCars]);
  const latest = useMemo(() => applyFilters(publicCars, emptyFilters).slice(0, 6), [publicCars]);
  const goBrand = (b: string) => {
    setFilters({ ...emptyFilters, brands: [b] });
    navigate({ name: 'estoque' });
  };
  const goBody = (b: BodyType) => {
    setFilters({ ...emptyFilters, bodies: [b] });
    navigate({ name: 'estoque' });
  };

  return (
    <>
      <Hero cars={publicCars} featured={featured.length ? featured : publicCars.slice(0, 4)} brandCount={brands.length} />

      <section className="border-b border-line bg-surface py-9" aria-labelledby="marcas-titulo">
        <div className="wrap mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="tagline text-[13px] text-brand-text">marcas em estoque</p>
            <h2 id="marcas-titulo" className="display text-[clamp(1.5rem,3vw,2rem)]">
              Escolha pela marca
            </h2>
          </div>
          <p className="text-[14px] text-muted">Toque em uma marca para ver os carros dela.</p>
        </div>
        <BrandMarquee brands={brands} onPick={goBrand} />
      </section>

      {featured.length > 0 && <FeaturedRow cars={featured} />}

      <section className="wrap pt-16" aria-label="Categorias">
        <SectionHead eyebrow="por categoria" title="O carro certo para a sua rotina" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {BODY_TYPES.map((b) => {
            const count = publicCars.filter((c) => c.body === b).length;
            return (
              <button
                key={b}
                onClick={() => goBody(b)}
                className="group studio relative flex flex-col overflow-hidden rounded-[20px] p-4 text-left shadow-card transition hover:-translate-y-1"
              >
                <span className="font-display text-[20px] font-black uppercase italic">{b === 'Sedã' ? 'Sedãs' : b === 'SUV' ? 'SUVs' : `${b}s`}</span>
                <span className="text-[13px] font-semibold text-muted tnum">
                  {count} {count === 1 ? 'disponível' : 'disponíveis'}
                </span>
                <span className="relative mt-2 block">
                  <CarArt body={b} color="#5a5a5a" className="w-full transition duration-300 group-hover:opacity-0" />
                  <CarArt body={b} color="#FF8724" className="absolute inset-0 w-full opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </span>
                <ArrowRight size={18} className="absolute right-4 top-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-text" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="wrap pt-16" aria-label="Chegaram agora">
        <SectionHead
          eyebrow="chegaram agora"
          title="Novidades no estoque"
          action={
            <Link to={{ name: 'estoque' }} className="btn btn-outline" onClick={() => setFilters(emptyFilters)}>
              Ver estoque completo ({publicCars.length}) <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      </section>

      <Benefits />
      <SellBanner />
    </>
  );
}

function Hero({ cars, featured, brandCount }: { cars: Car[]; featured: Car[]; brandCount: number }) {
  const { setFilters } = useStore();
  const [brand, setBrand] = useState('');
  const [body, setBody] = useState('');
  const [max, setMax] = useState('');
  const brands = useMemo(() => [...new Set(cars.map((c) => c.brand))].sort((a, b) => a.localeCompare(b)), [cars]);
  const draft = {
    ...emptyFilters,
    brands: brand ? [brand] : [],
    bodies: body ? [body as BodyType] : [],
    priceMax: max ? Number(max) : null,
  };
  const count = applyFilters(cars, draft).length;

  return (
    <section className="relative overflow-hidden bg-ink text-on-ink">
      <Logo variant="outline" className="pointer-events-none absolute -right-32 top-1/2 hidden w-[640px] -translate-y-1/2 opacity-[0.12] lg:block" title="" />
      <Logo variant="outline" className="pointer-events-none absolute -right-24 top-4 w-[420px] opacity-[0.10] lg:hidden" title="" />
      <div className="wrap relative grid items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.02fr_1fr] lg:gap-14 lg:pb-16 lg:pt-14">
        <div className="anim-fade-up min-w-0">
          <p className="tagline text-[15px] text-brand">seminovos selecionados</p>
          <h1 className="display mt-3 text-[clamp(2.5rem,6.2vw,4.9rem)]">
            Seu próximo carro <span className="text-brand">está aqui.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-[17px] text-ink-muted">
            {cars.length} carros revisados e com procedência. Escolha, simule a parcela e fale direto com a gente pelo WhatsApp.
          </p>

          <form
            className="mt-7 grid gap-2 rounded-[20px] bg-surface p-2.5 text-fg shadow-2xl sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              setFilters(draft);
              navigate({ name: 'estoque' });
            }}
          >
            <label className="sr-only" htmlFor="hero-marca">Marca</label>
            <select id="hero-marca" className="input border-transparent bg-surface-2" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Todas as marcas</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-tipo">Tipo</label>
            <select id="hero-tipo" className="input border-transparent bg-surface-2" value={body} onChange={(e) => setBody(e.target.value)}>
              <option value="">Todos os tipos</option>
              {BODY_TYPES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hero-preco">Preço máximo</label>
            <select id="hero-preco" className="input border-transparent bg-surface-2" value={max} onChange={(e) => setMax(e.target.value)}>
              <option value="">Qualquer preço</option>
              {PRICE_STEPS.map((p) => (
                <option key={p} value={p}>
                  Até {money(p)}
                </option>
              ))}
            </select>
            <button className="btn btn-primary h-12 px-5 sm:col-span-3" type="submit">
              Ver {count} {count === 1 ? 'carro' : 'carros'} <ArrowRight size={17} />
            </button>
          </form>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              [String(cars.length), 'carros no estoque'],
              [String(brandCount), 'marcas'],
              ['60x', 'para financiar'],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="sr-only">{l}</dt>
                <dd className="price text-[28px] text-on-ink">{v}</dd>
                <span className="tagline text-[13px] text-ink-muted">{l}</span>
              </div>
            ))}
          </dl>
        </div>
        {featured.length > 0 && <Showcase cars={featured} />}
      </div>
    </section>
  );
}

function Showcase({ cars }: { cars: Car[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const car = cars[i % cars.length];
  useEffect(() => {
    if (paused || cars.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % cars.length), 5500);
    return () => clearTimeout(t);
  }, [i, paused, cars.length]);
  const go = (d: number) => setI((x) => (x + d + cars.length) % cars.length);

  return (
    <div
      className="relative min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Carros em destaque"
    >
      <div className="overflow-hidden rounded-[28px] bg-surface text-fg shadow-2xl">
        <Link to={{ name: 'carro', id: car.id }} className="block" aria-label={`Ver ${car.brand} ${car.model}`}>
          <div key={car.id} className="anim-car-in">
            <CarMedia car={car} eager className="aspect-[16/10] w-full" />
          </div>
        </Link>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-3 p-5">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-brand-text">Destaque · {car.brand}</p>
            <p className="mt-1 font-display text-[22px] font-black italic uppercase leading-none">{car.model}</p>
            <p className="mt-1 truncate text-[13px] text-muted">
              {car.version} · {years(car.yearFab, car.yearModel)} · {kmLabel(car.km)}
            </p>
          </div>
          <div className="text-right">
            <p className="price text-[26px] leading-none">{money(car.price)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-line px-5 py-3">
          <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Escolher destaque">
            {cars.map((c, n) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={n === i % cars.length}
                aria-label={`${c.brand} ${c.model}`}
                onClick={() => setI(n)}
                className={`h-1.5 rounded-full transition-all ${n === i % cars.length ? 'w-7 bg-brand' : 'w-3 bg-line hover:bg-muted'}`}
              />
            ))}
          </div>
          <button className="icon-btn h-9 w-9" aria-label="Destaque anterior" onClick={() => go(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button className="icon-btn h-9 w-9" aria-label="Próximo destaque" onClick={() => go(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedRow({ cars }: { cars: Car[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * Math.min(ref.current.clientWidth * 0.8, 700), behavior: 'smooth' });
  return (
    <section className="pt-16" aria-label="Destaques da semana">
      <div className="wrap">
        <SectionHead
          eyebrow="destaques da semana"
          title="Selecionados pela Passos"
          action={
            <div className="hidden gap-2 md:flex">
              <button className="icon-btn border-[1.5px] border-line" aria-label="Rolar para a esquerda" onClick={() => scroll(-1)}>
                <ChevronLeft size={20} />
              </button>
              <button className="icon-btn border-[1.5px] border-line" aria-label="Rolar para a direita" onClick={() => scroll(1)}>
                <ChevronRight size={20} />
              </button>
            </div>
          }
        />
      </div>
      <div ref={ref} className="wrap flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 no-scrollbar" style={{ scrollPaddingInline: 'max(16px, env(safe-area-inset-left, 0px))' }}>
        {cars.map((c) => (
          <div key={c.id} className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <CarCard car={c} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: ShieldCheck, title: 'Procedência conferida', text: 'Laudo cautelar aprovado e histórico verificado antes de entrar no estoque.' },
    { icon: Repeat2, title: 'Seu usado na troca', text: 'Avaliamos seu carro pelo WhatsApp e usamos o valor como entrada.' },
    { icon: Landmark, title: 'Financiamento em até 60x', text: 'Simule a parcela na página do carro e receba a aprovação rápida.' },
    { icon: MessageCircle, title: 'Atendimento direto', text: 'Fale com um vendedor pelo WhatsApp, sem formulário e sem espera.' },
  ];
  return (
    <section className="wrap pt-20" aria-label="Por que comprar na Passos">
      <div className="grid gap-px overflow-hidden rounded-[22px] bg-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-surface p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-text">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 font-display text-[17px] font-extrabold italic">{title}</h3>
            <p className="mt-1.5 text-[14px] text-muted">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SellBanner() {
  return (
    <section className="wrap pt-16" aria-label="Venda ou troque seu carro">
      <div className="relative overflow-hidden rounded-[28px] bg-brand px-6 py-10 text-on-brand md:px-12 md:py-14">
        <Logo variant="outline" orange="#333333" className="pointer-events-none absolute -bottom-16 -right-10 w-[460px] opacity-[0.16]" title="" />
        <div className="relative max-w-xl">
          <p className="tagline text-[14px]">vender ou trocar</p>
          <h2 className="display mt-2 text-[clamp(1.9rem,4.4vw,3.2rem)]">Quanto vale o seu carro?</h2>
          <p className="mt-3 text-[16px] font-medium">
            Mande os dados pelo site e receba a avaliação pelo WhatsApp. Se quiser trocar, o valor entra como parte do pagamento.
          </p>
          <Link to={{ name: 'vender' }} className="btn btn-ink btn-lg mt-6">
            Avaliar meu carro <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
