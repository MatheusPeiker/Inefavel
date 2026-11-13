import { useEffect } from 'react';
import { useRoute } from './lib/router';
import { useStore } from './lib/store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CompareBar, WhatsAppFab } from './components/Floating';
import { Home } from './pages/Home';
import { Stock } from './pages/Stock';
import { CarDetail } from './pages/CarDetail';
import { Favorites } from './pages/Favorites';
import { Compare } from './pages/Compare';
import { Sell } from './pages/Sell';
import { Admin } from './pages/admin/Admin';
import { Link } from './lib/router';

const TITLES: Record<string, string> = {
  estoque: 'Estoque',
  favoritos: 'Favoritos',
  comparar: 'Comparar carros',
  vender: 'Avaliar meu carro',
  admin: 'Área do lojista',
};

export default function App() {
  const route = useRoute();
  const { ready, loadError, compare, cars } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  useEffect(() => {
    const car = route.name === 'carro' ? cars.find((c) => c.id === route.id) : null;
    const page = car ? `${car.brand} ${car.model} ${car.yearModel}` : TITLES[route.name];
    document.title = page ? `${page} · Passos Automóveis` : 'Passos Automóveis · Seminovos selecionados';
  }, [route, cars]);

  let page: React.ReactNode;
  if (!ready) page = <Loading />;
  else if (loadError) page = <ErrorState message={loadError} />;
  else {
    switch (route.name) {
      case 'home': page = <Home />; break;
      case 'estoque': page = <Stock />; break;
      case 'carro': page = <CarDetail id={route.id} />; break;
      case 'favoritos': page = <Favorites />; break;
      case 'comparar': page = <Compare />; break;
      case 'vender': page = <Sell />; break;
      case 'admin': page = <Admin />; break;
      default: page = <NotFound />;
    }
  }

  const showCompareBar = compare.length > 0 && route.name !== 'comparar' && route.name !== 'admin';
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }}>
        Pular para o conteúdo
      </a>
      <Header route={route} />
      <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
        {page}
      </main>
      <Footer />
      {route.name !== 'admin' && <WhatsAppFab raised={showCompareBar} />}
      <CompareBar route={route} />
    </div>
  );
}

function Loading() {
  return (
    <div className="wrap grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Carregando estoque">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-[340px] animate-pulse rounded-[20px] bg-surface-2" />
      ))}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="wrap grid place-items-center py-24 text-center">
      <p className="display text-[28px]">Não conseguimos carregar o estoque</p>
      <p className="mt-3 max-w-md text-muted">{message}</p>
      <button className="btn btn-primary mt-6" onClick={() => location.reload()}>
        Tentar de novo
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div className="wrap grid place-items-center py-24 text-center">
      <p className="display text-[clamp(2rem,5vw,3rem)]">Página não encontrada</p>
      <p className="mt-3 text-muted">O endereço pode ter mudado. Que tal ver o estoque?</p>
      <Link to={{ name: 'estoque' }} className="btn btn-primary mt-6">
        Ver estoque
      </Link>
    </div>
  );
}
