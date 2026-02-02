
import React from 'react';
import { DELIVERY_CARDS } from '../constants';

const DeliveryCards: React.FC = () => {
  return (
    <section className="py-20">
      <div className="mt-12 mb-16 flex flex-col items-center text-center">
        <h2 className="text-3xl lg:text-4xl serif-font font-bold tracking-tight mb-4">A Curadoria de Entrega</h2>
        <p className="max-w-xl text-text-muted font-light text-lg">
          Combinamos rigor técnico e sensibilidade estética para entregar clareza absoluta em cada projeto contratado.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {DELIVERY_CARDS.map((card, idx) => (
          <div 
            key={idx} 
            className="p-10 bg-white rounded-2xl border border-[#e7e9f3] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="mb-6">{card.icon}</div>
            <h3 className="text-xl font-bold mb-3 serif-font text-text-main">{card.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DeliveryCards;
