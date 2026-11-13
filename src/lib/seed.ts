import type { Car, StoreSettings } from './types';
import p01 from '../assets/cars/fiat-pulse-audace-2022/01-frente-lateral.jpg';
import p02 from '../assets/cars/fiat-pulse-audace-2022/02-frente-direita.jpg';
import p03 from '../assets/cars/fiat-pulse-audace-2022/03-frente.jpg';
import p04 from '../assets/cars/fiat-pulse-audace-2022/04-lateral.jpg';
import p05 from '../assets/cars/fiat-pulse-audace-2022/05-traseira-lateral.jpg';
import p06 from '../assets/cars/fiat-pulse-audace-2022/06-traseira.jpg';
import p07 from '../assets/cars/fiat-pulse-audace-2022/07-painel.jpg';
import p08 from '../assets/cars/fiat-pulse-audace-2022/08-volante.jpg';
import p09 from '../assets/cars/fiat-pulse-audace-2022/09-bancos-dianteiros.jpg';
import p10 from '../assets/cars/fiat-pulse-audace-2022/10-banco-traseiro.jpg';

/** Fotos que já vêm com o app (usadas para não duplicar imagens no armazenamento local). */
export const BUNDLED_PHOTOS = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10];

// Estoque inicial: só carros reais da loja.
export const seedCars: Car[] = [
  {
    id: 'fiat-pulse-audace-2022',
    code: 'PA-1001',
    brand: 'Fiat',
    model: 'Pulse',
    version: 'Audace 1.0 Turbo',
    yearFab: 2022,
    yearModel: 2022,
    price: 94900,
    fipe: null,
    km: 45000,
    fuel: 'Flex',
    transmission: 'Automático',
    body: 'SUV',
    color: 'Azul',
    colorHex: '#3E5670',
    doors: 4,
    plateEnd: '',
    features: [
      'Motor 1.0 Turbo',
      'Câmbio automático CVT',
      'Direção elétrica',
      'Ar-condicionado',
      'Central multimídia',
      'Vidros e travas elétricas',
      'Controles de estabilidade e tração',
      'Assistente de partida em rampa',
    ],
    description:
      'SUV moderno, potente e cheio de tecnologia. Motor 1.0 Turbo com potência e eficiência, câmbio automático CVT e excelente posição de dirigir. Confortável, moderno e versátil. Financiamento facilitado e aceitamos seu usado na troca, mediante avaliação.',
    photos: BUNDLED_PHOTOS,
    featured: true,
    status: 'disponivel',
    createdAt: '2026-11-13T12:00:00.000Z',
  },
];

export const defaultSettings: StoreSettings = {
  storeName: 'Passos Automóveis',
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '5511999999999',
  address: '',
  city: 'Timbó · SC',
  hours: '',
  instagram: '',
  interestRate: 1.69,
};
