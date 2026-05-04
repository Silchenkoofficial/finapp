import type { FinanceConfig } from './types';

export const DEFAULT_CONFIG: FinanceConfig = {
  periods: [
    {
      id: 'salary',
      label: 'Зарплата',
      dayOfMonth: 15,
      income: 84000,
      earlyLoanPayment: 30000,
      fixedExpenses: [
        { id: 'claude', name: 'Claude', icon: '🤖', amount: 2000, dayOfMonth: 15, description: '15-го числа' },
        { id: 'phone', name: 'Телефон T2', icon: '📱', amount: 750, dayOfMonth: 16, description: '16-го числа' },
        { id: 'utilities', name: 'Коммуналка', icon: '🔌', amount: 7000, dayOfMonth: 18, description: '18-го числа' },
        { id: 'yadrive', name: 'Я.Драйв Клуб', icon: '🚘', amount: 700, dayOfMonth: 25, description: '25–26 числа' },
        { id: 'yaplus', name: 'Я.Плюс', icon: '⭐', amount: 425, dayOfMonth: 27, description: '27-го числа' },
        { id: 'vpn', name: 'ВПН', icon: '🌐', amount: 600, dayOfMonth: 28, description: '28–29 числа' },
      ],
      dailyExpenses: [
        { id: 'groceries1', name: 'Продукты', icon: '🛒', dailyRate: 650, days: 16 },
        { id: 'transport1', name: 'Транспорт', icon: '🚗', dailyRate: 750, days: 16 },
      ],
    },
    {
      id: 'advance',
      label: 'Аванс',
      dayOfMonth: 29,
      income: 56000,
      earlyLoanPayment: 0,
      fixedExpenses: [
        { id: 'internet', name: 'Домашний интернет', icon: '🏠', amount: 1000, dayOfMonth: 1, description: '1-го числа' },
      ],
      dailyExpenses: [
        { id: 'groceries2', name: 'Продукты', icon: '🛒', dailyRate: 670, days: 15 },
        { id: 'transport2', name: 'Транспорт', icon: '🚗', dailyRate: 750, days: 15 },
      ],
    },
  ],
  savingsPots: [
    { id: 'pot-claude', name: 'Claude', icon: '🤖', amount: 2000, debitDay: 15, refillDay: 15, refillNote: 'автопополнение 15-го с ЗП' },
    { id: 'pot-phone', name: 'Телефон T2', icon: '📱', amount: 750, debitDay: 16, refillDay: 15, refillNote: 'автопополнение 15-го с ЗП' },
    { id: 'pot-utilities', name: 'Коммуналка', icon: '🔌', amount: 7000, debitDay: 18, refillDay: 15, refillNote: 'автопополнение 15-го с ЗП' },
    { id: 'pot-yadrive', name: 'Я.Драйв Клуб', icon: '🚘', amount: 700, debitDay: 25, refillDay: 15, refillNote: 'автопополнение 15-го (или 24-го)' },
    { id: 'pot-yaplus', name: 'Я.Плюс', icon: '⭐', amount: 425, debitDay: 27, refillDay: 15, refillNote: 'автопополнение 15-го с ЗП' },
    { id: 'pot-vpn', name: 'ВПН', icon: '🌐', amount: 600, debitDay: 28, refillDay: 15, refillNote: 'автопополнение 15-го с ЗП' },
    { id: 'pot-internet', name: 'Домашний интернет', icon: '🏠', amount: 1000, debitDay: 1, refillDay: 29, refillNote: 'автопополнение 29-го с аванса' },
    { id: 'pot-loan-mandatory', name: 'Кредит (обязательный)', icon: '🏦', amount: 25000, debitDay: 2, refillDay: 29, refillNote: 'с аванса 29 числа' },
    { id: 'pot-loan-early', name: 'Кредит (досрочный)', icon: '⚡', amount: 30000, debitDay: 15, refillDay: 15, refillNote: 'с зарплаты сразу' },
  ],
  loan: {
    currentBalance: 600000,
    earlyPayment: 30000,
    mandatoryPayment: 25000,
    startBalance: 600000,
    startDate: new Date().toISOString().split('T')[0],
  },
};
