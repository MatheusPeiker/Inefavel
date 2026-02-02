
import React from 'react';

const Manifesto: React.FC = () => {
  return (
    <section id="manifesto" className="py-32 bg-[#0e101b] -mx-6 lg:-mx-40 px-6 lg:px-40 text-white overflow-hidden relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-primary font-bold tracking-[0.3em] text-xs mb-12 uppercase">Nosso Manifesto</span>
          <h2 className="text-4xl lg:text-7xl serif-font font-bold leading-tight mb-16 max-w-4xl">
            Acreditamos que o <i className="text-primary italic">silêncio</i> estratégico comunica mais que o ruído constante.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl border-t border-white/10 pt-16">
            <div className="space-y-6">
              <p className="text-lg font-light text-white/70 leading-relaxed">
                Em um mundo saturado de informações, a verdadeira distinção não vem de gritar mais alto, mas de possuir uma voz que ressoa com verdade e intenção.
              </p>
              <p className="text-lg font-light text-white/70 leading-relaxed">
                Branding não é sobre logos ou cores; é sobre a construção de um ecossistema de significados que torna a concorrência irrelevante.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg font-light text-white/70 leading-relaxed">
                Nós buscamos o <span className="text-white font-medium italic">Inefável</span>: aquilo que é tão profundo que escapa às definições comuns, mas é sentido instantaneamente.
              </p>
              <p className="text-lg font-light text-white/70 leading-relaxed">
                Nossa curadoria é para quem entende que a excelência é um hábito, não um evento. É para marcas que desejam ser atemporais.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default Manifesto;
