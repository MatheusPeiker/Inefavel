
import React from 'react';

const FinalCTA: React.FC = () => {
  return (
    <section className="bg-primary rounded-3xl p-10 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10 text-white overflow-hidden relative shadow-2xl mb-32 group">
      <div className="relative z-10 flex-1">
        <h2 className="text-4xl lg:text-6xl serif-font font-bold mb-6 tracking-tight leading-tight">
          Pronto para o próximo passo?
        </h2>
        <p className="text-white/80 text-lg lg:text-xl max-w-md font-light leading-relaxed">
          Inicie sua jornada conosco e transforme sua presença digital em algo verdadeiramente inefável.
        </p>
      </div>
      <div className="relative z-10">
        <button className="bg-white text-primary px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all whitespace-nowrap">
          Agendar Reunião de Diagnóstico
        </button>
      </div>
      {/* Abstract Background Orbs */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-colors duration-1000"></div>
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>
    </section>
  );
};

export default FinalCTA;
