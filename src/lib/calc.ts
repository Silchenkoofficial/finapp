import type { Period } from '../types';

export function calcPeriodBalance(period: Period): {
  income: number;
  fixedTotal: number;
  dailyTotal: number;
  loanPayment: number;
  balance: number;
} {
  const fixedTotal = period.fixedExpenses.reduce((s, e) => s + e.amount, 0);
  const dailyTotal = period.dailyExpenses.reduce((s, e) => s + e.dailyRate * e.days, 0);
  const loanPayment = period.id === 'salary'
    ? period.earlyLoanPayment
    : (period.fixedExpenses.find(e => e.id === 'loan-mandatory')?.amount ?? 25000);
  const mandatoryLoanFromAdvance = period.id === 'advance' ? 25000 : 0;
  const balance = period.income - period.earlyLoanPayment - mandatoryLoanFromAdvance - fixedTotal - dailyTotal;
  return { income: period.income, fixedTotal, dailyTotal, loanPayment, balance };
}

export function getCurrentPeriod(day: number): 'salary' | 'advance' {
  return day >= 15 ? 'salary' : 'advance';
}

export function daysUntilNext(currentDay: number, targetDay: number, daysInMonth: number): number {
  if (targetDay > currentDay) return targetDay - currentDay;
  return daysInMonth - currentDay + targetDay;
}

export function formatRub(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function loanMonthsLeft(currentBalance: number, monthlyPayment: number): number {
  if (monthlyPayment <= 0) return 999;
  return Math.ceil(currentBalance / monthlyPayment);
}
