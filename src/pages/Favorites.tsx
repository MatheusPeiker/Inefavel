import { Heart } from 'lucide-react';
import { useStore } from '../lib/store';
import { Link } from '../lib/router';
import { CarCard } from '../components/CarCard';

export function Favorites() {
  const { publicCars, favorites } = useStore();
  const list = publicCars.filter((c) => favorites.includes(c.id));
  return (
    <div className="wrap pt-8">
      <p className="tagline text-[13px] text-brand-text">sua garagem</p>
      <h1 className="display text-[clamp(2rem,4.6vw,3.2rem)]">Favoritos</h1>
      {list.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CarCard key={c.id} car={c} />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid place-items-center rounded-[22px] border-2 border-dashed border-line px-6 py-16 text-center">
          <Heart size={34} className="text-brand" />
          <p className="mt-3 font-display text-[20px] font-black italic uppercase">Nenhum carro salvo ainda</p>
          <p className="mt-2 max-w-md text-muted">Toque no coração de um carro para guardar aqui e comparar depois. Fica salvo neste aparelho.</p>
          <Link to={{ name: 'estoque' }} className="btn btn-primary mt-6">
            Explorar o estoque
          </Link>
        </div>
      )}
    </div>
  );
}
