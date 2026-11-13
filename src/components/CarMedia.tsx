import type { Car } from '../lib/types';
import { CarArt } from './CarArt';

/** Foto real (se houver) ou a ilustração na cor do carro. */
export function CarMedia({ car, index = 0, className = '', eager, label = true }: { car: Car; index?: number; className?: string; eager?: boolean; label?: boolean }) {
  const src = car.photos[index];
  const alt = `${car.brand} ${car.model} ${car.version}, ${car.color}`;
  return (
    <div className={`studio relative overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-black/[0.06] to-transparent" />
          <CarArt body={car.body} color={car.colorHex} title={alt} className="absolute bottom-[7%] left-1/2 w-[86%] -translate-x-1/2" />
          {label && <span className="absolute bottom-2 right-3 text-[10px] font-medium text-muted/80">imagem ilustrativa</span>}
        </>
      )}
    </div>
  );
}
