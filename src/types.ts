export interface FixedExpense {
  id: string;
  name: string;
  icon: string;
  amount: number;
  dayOfMonth: number;
  description?: string;
}

export interface DailyExpense {
  id: string;
  name: string;
  icon: string;
  dailyRate: number;
  days: number;
}

export interface Period {
  id: 'salary' | 'advance';
  label: string;
  dayOfMonth: number;
  income: number;
  earlyLoanPayment: number;
  fixedExpenses: FixedExpense[];
  dailyExpenses: DailyExpense[];
}

export interface SavingsPot {
  id: string;
  name: string;
  icon: string;
  amount: number;
  debitDay: number;
  refillDay: number;
  refillNote: string;
}

export interface LoanState {
  currentBalance: number;
  earlyPayment: number;
  mandatoryPayment: number;
  startBalance: number;
  startDate: string;
}

export interface FinanceConfig {
  periods: Period[];
  savingsPots: SavingsPot[];
  loan: LoanState;
}
