export const BODY_TYPES = ['Hatch', 'Sedã', 'SUV', 'Picape'] as const;
export const FUELS = ['Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico'] as const;
export const TRANSMISSIONS = ['Automático', 'Manual'] as const;
export const STATUSES = ['disponivel', 'reservado', 'vendido'] as const;

export type BodyType = (typeof BODY_TYPES)[number];
export type Fuel = (typeof FUELS)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type CarStatus = (typeof STATUSES)[number];

export interface Car {
  id: string;
  code: string; // código de estoque, ex.: PA-1042
  brand: string;
  model: string;
  version: string;
  yearFab: number;
  yearModel: number;
  price: number;
  fipe: number | null;
  km: number;
  fuel: Fuel;
  transmission: Transmission;
  body: BodyType;
  color: string;
  colorHex: string;
  doors: number;
  plateEnd: string;
  features: string[];
  description: string;
  photos: string[];
  featured: boolean;
  status: CarStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  whatsapp: string; // só dígitos, com DDI
  address: string;
  city: string;
  hours: string;
  instagram: string;
  interestRate: number; // % ao mês usado no simulador
}

export const STATUS_LABEL: Record<CarStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
};

/** Selos de procedência: aparecem como destaque na página do carro. */
export const PROVENANCE = [
  'Único dono',
  'IPVA 2026 pago',
  'Revisões em concessionária',
  'Laudo cautelar aprovado',
  'Manual e chave reserva',
  'Garantia de fábrica',
] as const;

export const FEATURES = [
  'Ar-condicionado',
  'Ar digital dual zone',
  'Direção elétrica',
  'Central multimídia',
  'Apple CarPlay / Android Auto',
  'Câmera de ré',
  'Sensor de estacionamento',
  'Piloto automático',
  'Piloto automático adaptativo',
  'Bancos de couro',
  'Teto solar',
  'Rodas de liga leve',
  'Faróis de LED',
  'Chave presencial',
  'Carregador por indução',
  'Painel digital',
  'Controle de tração',
  '6 airbags',
  'Tração 4x4',
  'Capota marítima',
] as const;

export const KNOWN_BRANDS = [
  'Audi', 'BMW', 'BYD', 'Chery', 'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep',
  'Kia', 'Land Rover', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Peugeot', 'Porsche', 'Ram',
  'Renault', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
];

export const COLOR_PRESETS: { name: string; hex: string }[] = [
  { name: 'Branco', hex: '#F2F2EF' },
  { name: 'Prata', hex: '#C3C6CB' },
  { name: 'Cinza', hex: '#6E7276' },
  { name: 'Preto', hex: '#1F2023' },
  { name: 'Vermelho', hex: '#A8151B' },
  { name: 'Azul', hex: '#1F4C9A' },
  { name: 'Verde', hex: '#2F5D46' },
  { name: 'Laranja', hex: '#E8651B' },
  { name: 'Bege', hex: '#C8B79A' },
  { name: 'Marrom', hex: '#5A3E2E' },
];
