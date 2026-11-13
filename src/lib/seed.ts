import type { Car, StoreSettings } from './types';

// Estoque de exemplo para demonstração. Fotos ficam vazias: o app desenha uma
// ilustração na cor do carro até o lojista enviar as fotos reais pelo admin.
const d = (daysAgo: number) => new Date(Date.UTC(2026, 10, 13) - daysAgo * 864e5).toISOString();

type SeedCar = Omit<Car, 'photos' | 'plateEnd' | 'doors'> & Partial<Pick<Car, 'doors' | 'plateEnd'>>;

const cars: SeedCar[] = [
  {
    id: 'pa1042', code: 'PA-1042', brand: 'Toyota', model: 'Corolla', version: 'XEi 2.0 Flex',
    yearFab: 2022, yearModel: 2023, price: 132900, fipe: 138400, km: 38500, fuel: 'Flex',
    transmission: 'Automático', body: 'Sedã', color: 'Prata Supernova', colorHex: '#C3C6CB',
    features: ['Único dono', 'Revisões em concessionária', 'IPVA 2026 pago', 'Central multimídia', 'Apple CarPlay / Android Auto', 'Câmera de ré', 'Piloto automático', 'Bancos de couro', 'Faróis de LED', 'Chave presencial', 'Ar digital dual zone'],
    description: 'Corolla XEi com todas as revisões feitas na concessionária Toyota. Pneus novos, interior muito conservado e manual com chave reserva.',
    featured: true, status: 'disponivel', createdAt: d(2), plateEnd: '7',
  },
  {
    id: 'pa1039', code: 'PA-1039', brand: 'Honda', model: 'Civic', version: 'Touring 1.5 Turbo',
    yearFab: 2021, yearModel: 2022, price: 149900, fipe: 154200, km: 41200, fuel: 'Gasolina',
    transmission: 'Automático', body: 'Sedã', color: 'Cinza Barium', colorHex: '#5B5F64',
    features: ['Laudo cautelar aprovado', 'Manual e chave reserva', 'Teto solar', 'Bancos de couro', 'Piloto automático adaptativo', 'Central multimídia', 'Câmera de ré', 'Carregador por indução', '6 airbags'],
    description: 'Versão topo de linha com pacote Honda Sensing. Teto solar, bancos em couro e piloto adaptativo.',
    featured: false, status: 'disponivel', createdAt: d(6), plateEnd: '2',
  },
  {
    id: 'pa1045', code: 'PA-1045', brand: 'Volkswagen', model: 'T-Cross', version: 'Highline 250 TSI',
    yearFab: 2023, yearModel: 2024, price: 139900, fipe: 143500, km: 22800, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Branco Puro', colorHex: '#F2F2EF',
    features: ['Garantia de fábrica', 'Único dono', 'Painel digital', 'Central multimídia', 'Apple CarPlay / Android Auto', 'Teto solar', 'Faróis de LED', 'Sensor de estacionamento', 'Carregador por indução'],
    description: 'T-Cross Highline ainda na garantia de fábrica. Teto solar panorâmico, painel Active Info Display e baixa quilometragem.',
    featured: true, status: 'disponivel', createdAt: d(1), plateEnd: '4',
  },
  {
    id: 'pa1036', code: 'PA-1036', brand: 'Jeep', model: 'Compass', version: 'Longitude T270',
    yearFab: 2022, yearModel: 2023, price: 144900, fipe: 149800, km: 35400, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Preto Carbon', colorHex: '#1F2023',
    features: ['IPVA 2026 pago', 'Revisões em concessionária', 'Bancos de couro', 'Central multimídia', 'Câmera de ré', 'Faróis de LED', 'Ar digital dual zone', 'Chave presencial'],
    description: 'Compass Longitude com motor T270 turbo flex. Revisões em dia na rede Jeep e pneus em ótimo estado.',
    featured: false, status: 'disponivel', createdAt: d(9), plateEnd: '9',
  },
  {
    id: 'pa1047', code: 'PA-1047', brand: 'Chevrolet', model: 'Onix', version: 'LTZ 1.0 Turbo',
    yearFab: 2023, yearModel: 2024, price: 89900, fipe: 91700, km: 18900, fuel: 'Flex',
    transmission: 'Automático', body: 'Hatch', color: 'Vermelho Carmim', colorHex: '#A8151B',
    features: ['Único dono', 'Garantia de fábrica', 'Central multimídia', 'Apple CarPlay / Android Auto', 'Câmera de ré', 'Rodas de liga leve', '6 airbags'],
    description: 'Onix LTZ turbo automático, econômico e completo. Ideal para o dia a dia na cidade.',
    featured: true, status: 'disponivel', createdAt: d(0), plateEnd: '1',
  },
  {
    id: 'pa1031', code: 'PA-1031', brand: 'Fiat', model: 'Toro', version: 'Volcano 2.0 Diesel 4x4',
    yearFab: 2022, yearModel: 2023, price: 154900, fipe: 159300, km: 61000, fuel: 'Diesel',
    transmission: 'Automático', body: 'Picape', color: 'Cinza Silverstone', colorHex: '#8A8D91',
    features: ['Tração 4x4', 'Capota marítima', 'Bancos de couro', 'Central multimídia', 'Câmera de ré', 'Piloto automático', 'Laudo cautelar aprovado'],
    description: 'Toro Volcano diesel com tração 4x4 e câmbio de 9 marchas. Capota marítima e protetor de caçamba.',
    featured: false, status: 'disponivel', createdAt: d(15), plateEnd: '5',
  },
  {
    id: 'pa1044', code: 'PA-1044', brand: 'Hyundai', model: 'Creta', version: 'Platinum 1.0 TGDI',
    yearFab: 2024, yearModel: 2025, price: 149500, fipe: 152900, km: 12300, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Azul Safira', colorHex: '#24426E',
    features: ['Garantia de fábrica', 'Único dono', 'Teto solar', 'Piloto automático adaptativo', 'Painel digital', 'Bancos de couro', 'Carregador por indução', 'Faróis de LED'],
    description: 'Creta Platinum com pacote Hyundai SmartSense e apenas 12 mil km rodados.',
    featured: false, status: 'disponivel', createdAt: d(3), plateEnd: '8',
  },
  {
    id: 'pa1028', code: 'PA-1028', brand: 'Toyota', model: 'Hilux', version: 'SRX 2.8 Diesel 4x4',
    yearFab: 2021, yearModel: 2022, price: 259900, fipe: 266700, km: 78400, fuel: 'Diesel',
    transmission: 'Automático', body: 'Picape', color: 'Branco Perolizado', colorHex: '#F4F3EE',
    features: ['Tração 4x4', 'Revisões em concessionária', 'Manual e chave reserva', 'Bancos de couro', 'Central multimídia', 'Câmera de ré', 'Piloto automático', 'Capota marítima', 'Ar digital dual zone'],
    description: 'Hilux SRX, a versão mais completa. Toda revisada na Toyota, pronta para trabalho e viagem.',
    featured: true, status: 'disponivel', createdAt: d(20), plateEnd: '3',
  },
  {
    id: 'pa1040', code: 'PA-1040', brand: 'Nissan', model: 'Kicks', version: 'Advance 1.6 CVT',
    yearFab: 2022, yearModel: 2023, price: 104900, fipe: 108100, km: 33100, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Laranja Monarca', colorHex: '#E2621B',
    features: ['IPVA 2026 pago', 'Central multimídia', 'Apple CarPlay / Android Auto', 'Câmera de ré', 'Rodas de liga leve', 'Chave presencial'],
    description: 'Kicks Advance com câmbio CVT, multimídia com espelhamento e câmera de ré.',
    featured: false, status: 'disponivel', createdAt: d(5), plateEnd: '6',
  },
  {
    id: 'pa1038', code: 'PA-1038', brand: 'Volkswagen', model: 'Polo', version: 'Highline 200 TSI',
    yearFab: 2022, yearModel: 2023, price: 98900, fipe: 101300, km: 29500, fuel: 'Flex',
    transmission: 'Automático', body: 'Hatch', color: 'Azul Biscay', colorHex: '#1F3C6E',
    features: ['Único dono', 'Painel digital', 'Central multimídia', 'Sensor de estacionamento', 'Faróis de LED', 'Rodas de liga leve'],
    description: 'Polo Highline turbo, com painel digital e ótimo consumo. Um dono e revisões em dia.',
    featured: false, status: 'disponivel', createdAt: d(8), plateEnd: '0',
  },
  {
    id: 'pa1046', code: 'PA-1046', brand: 'BMW', model: '320i', version: 'M Sport 2.0 Turbo',
    yearFab: 2022, yearModel: 2023, price: 259900, fipe: 268500, km: 27900, fuel: 'Flex',
    transmission: 'Automático', body: 'Sedã', color: 'Azul Portimão', colorHex: '#1D4FA6',
    features: ['Revisões em concessionária', 'Laudo cautelar aprovado', 'Bancos de couro', 'Teto solar', 'Painel digital', 'Piloto automático adaptativo', 'Faróis de LED', 'Carregador por indução'],
    description: '320i M Sport na cor Azul Portimão, com pacote M completo e todas as revisões na BMW.',
    featured: true, status: 'disponivel', createdAt: d(4), plateEnd: '2',
  },
  {
    id: 'pa1025', code: 'PA-1025', brand: 'Ford', model: 'Ranger', version: 'XLS 2.2 Diesel 4x4',
    yearFab: 2022, yearModel: 2022, price: 189900, fipe: 194600, km: 89000, fuel: 'Diesel',
    transmission: 'Automático', body: 'Picape', color: 'Cinza Moondust', colorHex: '#6E7276',
    features: ['Tração 4x4', 'Capota marítima', 'Central multimídia', 'Câmera de ré', 'Piloto automático', 'Manual e chave reserva'],
    description: 'Ranger XLS diesel 4x4 automática, robusta e econômica. Pronta para o campo e a estrada.',
    featured: false, status: 'disponivel', createdAt: d(26), plateEnd: '7',
  },
  {
    id: 'pa1043', code: 'PA-1043', brand: 'Fiat', model: 'Pulse', version: 'Impetus 1.0 Turbo',
    yearFab: 2023, yearModel: 2024, price: 99900, fipe: 103400, km: 24600, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Vermelho Montecarlo', colorHex: '#B01E23',
    features: ['Garantia de fábrica', 'Painel digital', 'Central multimídia', 'Apple CarPlay / Android Auto', 'Carregador por indução', 'Faróis de LED'],
    description: 'Pulse Impetus turbo 200 com conectividade completa e garantia de fábrica.',
    featured: false, status: 'reservado', createdAt: d(7), plateEnd: '4',
  },
  {
    id: 'pa1048', code: 'PA-1048', brand: 'Renault', model: 'Kwid', version: 'Intense 1.0',
    yearFab: 2023, yearModel: 2024, price: 62900, fipe: 64200, km: 15200, fuel: 'Flex',
    transmission: 'Manual', body: 'Hatch', color: 'Branco Glacier', colorHex: '#EFEFEC',
    features: ['Único dono', 'Central multimídia', 'Câmera de ré', 'Direção elétrica', 'Ar-condicionado'],
    description: 'Kwid Intense de único dono, muito econômico. Ótimo primeiro carro.',
    featured: false, status: 'disponivel', createdAt: d(0), plateEnd: '9', doors: 4,
  },
  {
    id: 'pa1041', code: 'PA-1041', brand: 'Honda', model: 'HR-V', version: 'EXL 1.5',
    yearFab: 2023, yearModel: 2024, price: 154900, fipe: 158800, km: 20100, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Cinza Meteoro', colorHex: '#4C5054',
    features: ['Garantia de fábrica', 'Revisões em concessionária', 'Bancos de couro', 'Piloto automático adaptativo', 'Central multimídia', 'Câmera de ré', 'Faróis de LED'],
    description: 'Novo HR-V EXL com Honda Sensing, ainda na garantia e com revisões feitas na Honda.',
    featured: false, status: 'disponivel', createdAt: d(10), plateEnd: '1',
  },
  {
    id: 'pa1022', code: 'PA-1022', brand: 'Chevrolet', model: 'Tracker', version: 'Premier 1.2 Turbo',
    yearFab: 2022, yearModel: 2023, price: 119900, fipe: 122500, km: 42000, fuel: 'Flex',
    transmission: 'Automático', body: 'SUV', color: 'Branco Summit', colorHex: '#F1F1EE',
    features: ['Teto solar', 'Central multimídia', 'Câmera de ré', 'Carregador por indução'],
    description: 'Tracker Premier com teto solar panorâmico.',
    featured: false, status: 'vendido', createdAt: d(34), plateEnd: '6',
  },
];

export const seedCars: Car[] = cars.map((c) => ({ doors: 4, plateEnd: '', photos: [], ...c }));

export const defaultSettings: StoreSettings = {
  storeName: 'Passos Automóveis',
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '5511999999999',
  address: 'Av. Brasil, 1500 · Centro',
  city: 'Sua cidade · UF',
  hours: 'Seg a sex, 8h às 18h · Sáb, 8h às 12h',
  instagram: 'passosautomoveis',
  interestRate: 1.69,
};
