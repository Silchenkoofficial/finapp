import { useState, useEffect } from 'react';
import type { FinanceConfig } from '../types';
import { DEFAULT_CONFIG } from '../defaultConfig';

const STORAGE_KEY = 'finapp_config';

function loadConfig(): FinanceConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return JSON.parse(raw) as FinanceConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function useConfig() {
  const [config, setConfig] = useState<FinanceConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateLoan = (updates: Partial<FinanceConfig['loan']>) => {
    setConfig(c => ({ ...c, loan: { ...c.loan, ...updates } }));
  };

  const updatePeriodIncome = (id: 'salary' | 'advance', income: number) => {
    setConfig(c => ({
      ...c,
      periods: c.periods.map(p => p.id === id ? { ...p, income } : p),
    }));
  };

  const updatePeriodEarlyLoan = (amount: number) => {
    setConfig(c => ({
      ...c,
      periods: c.periods.map(p => p.id === 'salary' ? { ...p, earlyLoanPayment: amount } : p),
    }));
  };

  const updateFixedExpense = (periodId: 'salary' | 'advance', expenseId: string, amount: number) => {
    setConfig(c => ({
      ...c,
      periods: c.periods.map(p =>
        p.id === periodId
          ? { ...p, fixedExpenses: p.fixedExpenses.map(e => e.id === expenseId ? { ...e, amount } : e) }
          : p
      ),
    }));
  };

  const updateDailyExpense = (periodId: 'salary' | 'advance', expenseId: string, dailyRate: number, days: number) => {
    setConfig(c => ({
      ...c,
      periods: c.periods.map(p =>
        p.id === periodId
          ? { ...p, dailyExpenses: p.dailyExpenses.map(e => e.id === expenseId ? { ...e, dailyRate, days } : e) }
          : p
      ),
    }));
  };

  const resetToDefaults = () => setConfig(DEFAULT_CONFIG);

  return { config, updateLoan, updatePeriodIncome, updatePeriodEarlyLoan, updateFixedExpense, updateDailyExpense, resetToDefaults };
}
