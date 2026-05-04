import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FinanceConfig } from '../types';
import { fetchConfig, saveConfig } from '../lib/configApi';
import { DEFAULT_CONFIG } from '../defaultConfig';

const QUERY_KEY = ['config'];

export function useConfig() {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => fetchConfig(signal),
    staleTime: Infinity,
  });

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: saveConfig,
    onMutate: (newConfig) => {
      const previous = queryClient.getQueryData<FinanceConfig>(QUERY_KEY);
      queryClient.setQueryData(QUERY_KEY, newConfig);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEY, context.previous);
    },
  });

  function update(updater: (prev: FinanceConfig) => FinanceConfig) {
    if (!config) return;
    mutate(updater(config));
  }

  const updateLoan = (updates: Partial<FinanceConfig['loan']>) =>
    update(c => ({ ...c, loan: { ...c.loan, ...updates } }));

  const updatePeriodIncome = (id: 'salary' | 'advance', income: number) =>
    update(c => ({
      ...c,
      periods: c.periods.map(p => p.id === id ? { ...p, income } : p),
    }));

  // Обновляет и loan.earlyPayment и period.earlyLoanPayment за один mutate
  const updateEarlyLoan = (amount: number) =>
    update(c => ({
      ...c,
      loan: { ...c.loan, earlyPayment: amount },
      periods: c.periods.map(p => p.id === 'salary' ? { ...p, earlyLoanPayment: amount } : p),
    }));

  const updateFixedExpense = (periodId: 'salary' | 'advance', expenseId: string, amount: number) =>
    update(c => ({
      ...c,
      periods: c.periods.map(p =>
        p.id === periodId
          ? { ...p, fixedExpenses: p.fixedExpenses.map(e => e.id === expenseId ? { ...e, amount } : e) }
          : p
      ),
    }));

  const updateDailyExpense = (periodId: 'salary' | 'advance', expenseId: string, dailyRate: number, days: number) =>
    update(c => ({
      ...c,
      periods: c.periods.map(p =>
        p.id === periodId
          ? { ...p, dailyExpenses: p.dailyExpenses.map(e => e.id === expenseId ? { ...e, dailyRate, days } : e) }
          : p
      ),
    }));

  const resetToDefaults = () => mutate(DEFAULT_CONFIG);

  return {
    config,
    isLoading,
    isSaving,
    updateLoan,
    updatePeriodIncome,
    updateEarlyLoan,
    updateFixedExpense,
    updateDailyExpense,
    resetToDefaults,
  };
}
