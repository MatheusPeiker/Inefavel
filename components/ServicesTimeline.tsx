
import React from 'react';
import TimelineItem from './TimelineItem';
import { SERVICES } from '../constants';

const ServicesTimeline: React.FC = () => {
  return (
    <section id="caminhos" className="py-20">
      <div className="text-center mb-20">
        <h2 className="text-4xl lg:text-5xl serif-font font-bold mb-4">Soluções e Caminhos</h2>
        <p className="text-text-muted font-light max-w-2xl mx-auto italic text-lg">
          Quatro estágios de refinamento para marcas e líderes que buscam o luxo supremo: a clareza.
        </p>
      </div>

      <div className="relative py-12">
        {/* Central Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] timeline-line hidden lg:block opacity-30"></div>
        
        <div className="flex flex-col gap-24 relative">
          {SERVICES.map((service, index) => (
            <TimelineItem key={service.id} service={service} isEven={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesTimeline;
