
import React from 'react';
import { LayoutGrid, Beaker, BookOpen, Megaphone, BarChart3, Palette, Star } from 'lucide-react';
import { Service, DeliveryCard } from './types';

export const SERVICES: Service[] = [
  {
    id: 'mentoria',
    category: 'MENTORIA',
    title: 'Mentoria Individual: O Próximo Passo da sua Marca',
    description: 'Acompanhamento direcionado e personalizado: Diagnóstico profundo, estratégia de crescimento e plano de ação tático. Um acompanhamento que guia pessoas e marcas do ponto A ao B, ajudando a traduzir a essência de forma estratégica. Construímos essa ponte juntos.',
    tags: ['Estratégia', 'Visão'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmvFdvlFUz2SxeWXQ0LiLx8Q9KZx0TzrCUiyI-Luzd7MNCE88nHcXbExdu6S8MxTL1leZ8X2fbmQIvbQwkv5-xcl6-PkTm1yO1RPuQYEQBy3XXLORPQu0hvR9bkkpV_hjC5MwKlG1XcB9mvNWYkYLuWD695Sm-CW2-oAErMxLnMMHdy_zPSZDkT_CQeqw6kCnXD6JytYNozrg-a8WF8E-1SQ2W7I8rCOq4XgWd9d8tNQHBuli-Wy3AeQhgEoB6NvmblZDUzDonjyY',
    icon: 'layout-grid',
  },
  {
    id: 'consultoria',
    category: 'CONSULTORIA',
    title: 'Consultoria Estratégica: Branding e Posicionamento',
    description: 'Estruturação da base da marca: Definição de diferenciais, posicionamento de mercado e diretrizes de comunicação visual e verbal. Diagnóstico, estratégia e plano de ação tático.',
    tags: ['Operação', 'Pureza'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqkSlY91gPp5fNvs7CxyNnK_LF_c2aURQfa59cAYHxkpifOEtgdZ2gdO7JZ_jHi7kRtgjb0Fxfa2wI-n43V-vj2Yv1Q3T0_NRlxeEDbtaGOwIKRUw3NLb981ZYqrMJW5ckDhWzGYlZzu-sSEefI6X6rdGdqqIl069mWaFFZrdBqdoY4gjpgGksQOL440ZisOmR4aRNciGqj8IrnfoO9DZReREjZjVpivsQRgwVHtThjaQFs1P8tTsDiovaOMyQHfTefeWo1VTGF2A',
    icon: 'beaker',
  },
  {
    id: 'conteudo',
    category: 'CONTEÚDO',
    title: 'Criação de Conteúdo: Autoridade e Expressão',
    description: 'Desenvolvimento de narrativas e ativos digitais: Design de posts, roteiros estratégicos e curadoria de imagem para redes sociais com foco em autoridade.',
    tags: ['Editorial', 'Narrativa'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZVGbWlVnw-B0TqI7ojzT8LaPo4v8M_HHtSL0zjNrxfVjKlr1JMEmPCrSPQu-uEQJYagr4CjJFyigUVzaL-pYsiLF401rtP9Vq4t3fFVIyC_F9OWsvU0eog-WlXgXGS8soRWw0HcAGodccPF513rr_KnT7db_toYF9a0nf3CONRknz2MCtN2f1JwbX-q_f5eF0q6ncIA5X6odxRZJVfosi8XNH3Ah2hH6pZurMnxGxfS27QwK1ZH9zMWIU_Zagwm2sVrpbcUpVQM',
    icon: 'book-open',
  },
  {
    id: 'palestras',
    category: 'PALESTRAS',
    title: 'Palestras: A Nova Era da Marca Sensível',
    description: 'Experiência imersiva para eventos e times: Tendências de consumo, o futuro do branding sensível e práticas de diferenciação digital.',
    tags: ['Escala', 'Autoridade'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVN2rPdYm3LdhRvNI1gyVh1VvnnKmhiDq68Bdy1dqQHt6ci1Tsf5B_6ccictdlcDLkhiimvMTdikw1Nmhzs2HfFiYssrR9U7tPbHHOCRho3KYYRK99v_mCLOhqpgMo4iuP023dJYSjq9fzfbs0NdAvqApkDSnKM-a6XreIL2y6KlcfONO17C8qL4XLXTZ9EiZI0lzfos3VhWAYprWHEy8pXmejPvKD2e93lEVxiXVFawctosMO4VpQ4E71HwOKP8FN_neaiyEhz40',
    icon: 'megaphone',
  },
];

export const DELIVERY_CARDS: DeliveryCard[] = [
  {
    title: 'Diagnóstico Preciso',
    description: 'Identificamos os pontos cegos da sua marca para construir uma base de posicionamento inabalável.',
    icon: <BarChart3 className="text-primary w-8 h-8 lg:w-10 lg:h-10" />,
  },
  {
    title: 'Execução Pragmática',
    description: 'Saímos da teoria para o plano tático: cronogramas, ativos e processos prontos para implementação.',
    icon: <Palette className="text-primary w-8 h-8 lg:w-10 lg:h-10" />,
  },
  {
    title: 'Autoridade Percebida',
    description: 'Elevamos a percepção de valor da sua marca através de uma narrativa coerente e sofisticada.',
    icon: <Star className="text-primary w-8 h-8 lg:w-10 lg:h-10" />,
  },
];
