
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-32">
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div className="flex-1 relative">
          <div className="relative z-10">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqkSlY91gPp5fNvs7CxyNnK_LF_c2aURQfa59cAYHxkpifOEtgdZ2gdO7JZ_jHi7kRtgjb0Fxfa2wI-n43V-vj2Yv1Q3T0_NRlxeEDbtaGOwIKRUw3NLb981ZYqrMJW5ckDhWzGYlZzu-sSEefI6X6rdGdqqIl069mWaFFZrdBqdoY4gjpgGksQOL440ZisOmR4aRNciGqj8IrnfoO9DZReREjZjVpivsQRgwVHtThjaQFs1P8tTsDiovaOMyQHfTefeWo1VTGF2A" 
              alt="Founder & Vision" 
              className="rounded-3xl grayscale hover:grayscale-0 transition-all duration-700 w-full h-[500px] object-cover shadow-2xl"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-off-white border border-primary/20 p-8 rounded-2xl hidden lg:block shadow-lg">
            <span className="text-primary font-bold text-4xl serif-font italic">01.</span>
            <p className="mt-4 text-sm text-text-muted leading-relaxed">
              Curadoria focada em marcas que buscam transição de patamar e consolidação de autoridade.
            </p>
          </div>
        </div>
        <div className="flex-1">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-6 block">Sobre a Inefável</span>
          <h2 className="text-4xl lg:text-5xl serif-font font-bold text-text-main mb-8 leading-tight">
            Curadoria para quem não aceita o <i className="text-primary italic">comum</i>.
          </h2>
          <div className="space-y-6 text-text-muted text-lg font-light leading-relaxed">
            <p>
              A INEFÁVEL nasceu do desejo de trazer o rigor da estratégia de marca para o mundo digital, unindo a sensibilidade estética com resultados pragmáticos.
            </p>
            <p>
              Não somos uma agência de massa. Somos um estúdio de estratégia e branding que trabalha com um número limitado de marcas por ano, garantindo que cada projeto receba a profundidade necessária.
            </p>
            <p>
              Nossa metodologia foca no "The Core": a extração da essência autoral que permite criar um posicionamento único e inimitável no mercado.
            </p>
          </div>
          <div className="mt-12 flex gap-12">
            <div>
              <p className="text-3xl font-bold serif-font text-text-main">150+</p>
              <p className="text-xs uppercase tracking-widest text-text-muted mt-1">Marcas Transformadas</p>
            </div>
            <div>
              <p className="text-3xl font-bold serif-font text-text-main">08+</p>
              <p className="text-xs uppercase tracking-widest text-text-muted mt-1">Anos de Mercado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
