export interface PaymentItem {
  id: string;
  name: string;
  icon: string;
  amount: number;
  period: 'salary' | 'advance';
  dayOfMonth: number;
  description?: string;
}

// {"2026-05": {"payment-id": true}}
export type PaymentChecks = Record<string, Record<string, boolean>>;

export type CarsharingService = 'yandex' | 'citydrive';

export interface CarsharingTag {
  id: string;
  name: string;
}

export interface CarsharingTrip {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  service: CarsharingService;
  tagIds: string[];
  comment?: string;
}

export interface LoanState {
  currentBalance: number;
  earlyPayment: number;
  mandatoryPayment: number;
  startBalance: number;
  startDate: string;
}

export interface FinanceConfig {
  loan: LoanState;
  payments: PaymentItem[];
  paymentChecks: PaymentChecks;
  carsharingTags: CarsharingTag[];
  carsharingTrips: CarsharingTrip[];
}
