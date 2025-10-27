import type { Category, CoupleQuestion } from './types';
import { BookIcon, DumbbellIcon, CarIcon, PalmTreeIcon, BellIcon, GiftIcon } from './components/icons';

export const CATEGORIES: Category[] = [
  { id: 'escola', name: 'Escola', icon: BookIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { id: 'ginasio', name: 'Ginásio', icon: DumbbellIcon, color: 'text-red-500', bgColor: 'bg-red-100' },
  { id: 'conducao', name: 'Condução', icon: CarIcon, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
  { id: 'lazer', name: 'Lazer', icon: PalmTreeIcon, color: 'text-green-500', bgColor: 'bg-green-100' },
  { id: 'aniversario', name: 'Aniversário', icon: GiftIcon, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { id: 'lembrete', name: 'Lembrete', icon: BellIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
];

export const SHOPPING_CATEGORIES = ["Frutas e Legumes", "Padaria", "Talho e Peixaria", "Lacticínios", "Congelados", "Mercearia", "Higiene", "Limpeza", "Outros"];

export const COUPLE_QUESTIONS: Omit<CoupleQuestion, 'answers'>[] = [
    { id: 1, text: "Qual foi a melhor parte do teu dia hoje e porquê?" },
    { id: 2, text: "Se pudéssemos viajar para qualquer lugar agora, para onde irias?" },
    { id: 3, text: "Qual é a tua memória favorita de nós os dois?" },
    { id: 4, text: "O que mais te fez rir esta semana?" },
    { id: 5, text: "Qual é uma pequena coisa que posso fazer por ti amanhã?" },
    { id: 6, text: "Qual é um objetivo que gostarias que alcançássemos juntos este ano?" },
    { id: 7, text: "Descreve o teu dia perfeito, do início ao fim." },
    { id: 8, text: "O que mais admiras em mim neste momento?" },
    { id: 9, text: "Qual é uma música que te faz lembrar de nós?" },
    { id: 10, text: "Como podemos tornar o próximo fim de semana especial?" }
];