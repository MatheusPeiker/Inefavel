import type { Car, StoreSettings } from './types';
import { digits, kmLabel, money, years } from './format';

export function waLink(number: string, text: string) {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(text)}`;
}

export function carInterestText(car: Car, s: StoreSettings) {
  return [
    `Olá, ${s.storeName}! Tenho interesse neste carro:`,
    `*${car.brand} ${car.model} ${car.version}*`,
    `${years(car.yearFab, car.yearModel)} · ${kmLabel(car.km)} · ${money(car.price)}`,
    `Código: ${car.code}`,
    '',
    'Ainda está disponível?',
  ].join('\n');
}

export function testDriveText(car: Car, s: StoreSettings) {
  return `Olá, ${s.storeName}! Gostaria de agendar um test drive do ${car.brand} ${car.model} ${car.version} (${car.code}). Qual o melhor horário?`;
}

export function financeText(car: Car, s: StoreSettings, down: number, months: number, value: number) {
  return [
    `Olá, ${s.storeName}! Fiz uma simulação no site:`,
    `*${car.brand} ${car.model} ${car.version}* (${car.code})`,
    `Valor: ${money(car.price)}`,
    `Entrada: ${money(down)}`,
    `${months}x de aproximadamente ${money(value)}`,
    '',
    'Pode me ajudar com a aprovação do financiamento?',
  ].join('\n');
}

export const genericText = (s: StoreSettings) => `Olá, ${s.storeName}! Vim pelo site e gostaria de mais informações sobre os carros disponíveis.`;
