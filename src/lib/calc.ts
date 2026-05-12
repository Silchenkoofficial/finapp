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
