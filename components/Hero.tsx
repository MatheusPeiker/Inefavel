
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-12 mb-32">
      <div className="flex-1 w-full animate-in fade-in slide-in-from-left duration-1000">
        <img
          alt="Direção Estratégica"
          className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVN2rPdYm3LdhRvNI1gyVh1VvnnKmhiDq68Bdy1dqQHt6ci1Tsf5B_6ccictdlcDLkhiimvMTdikw1Nmhzs2HfFiYssrR9U7tPbHHOCRho3KYYRK99v_mCLOhqpgMo4iuP023dJYSjq9fzfbs0NdAvqApkDSnKM-a6XreIL2y6KlcfONO17C8qL4XLXTZ9EiZI0lzfos3VhWAYprWHEy8pXmejPvKD2e93lEVxiXVFawctosMO4VpQ4E71HwOKP8FN_neaiyEhz40"
        />
      </div>
      <div className="flex-1 animate-in fade-in slide-in-from-right duration-1000">
        <h1 className="text-5xl lg:text-7xl serif-font font-bold tracking-tight text-text-main leading-tight mb-6">
          Onde a Identidade se torna <i className="text-primary italic">Direção</i>
        </h1>
        <p className="text-text-muted text-lg lg:text-xl font-light leading-relaxed mb-8 max-w-lg">
          Curadoria de alto nível, transformando sua essência em impacto estratégico e presença autoral.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#caminhos"
            className="bg-primary text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all text-center inline-block"
          >
            Explorar Serviços
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
