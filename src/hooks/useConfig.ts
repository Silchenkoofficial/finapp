import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FinanceConfig, CarsharingTrip } from '../types';
import { fetchConfig, saveConfig } from '../lib/configApi';
import { DEFAULT_CONFIG } from '../defaultConfig';

const QUERY_KEY = ['config'];

function monthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

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

  const togglePaymentCheck = (paymentId: string) =>
    update(c => {
      const key = monthKey();
      const month = c.paymentChecks[key] ?? {};
      return {
        ...c,
        paymentChecks: {
          ...c.paymentChecks,
          [key]: { ...month, [paymentId]: !month[paymentId] },
        },
      };
    });

  const addCarsharingTrip = (trip: Omit<CarsharingTrip, 'id'>) =>
    update(c => ({
      ...c,
      carsharingTrips: [{ ...trip, id: crypto.randomUUID() }, ...c.carsharingTrips],
    }));

  const deleteCarsharingTrip = (tripId: string) =>
    update(c => ({ ...c, carsharingTrips: c.carsharingTrips.filter(t => t.id !== tripId) }));

  const addCarsharingTag = (name: string) =>
    update(c => ({
      ...c,
      carsharingTags: [...c.carsharingTags, { id: crypto.randomUUID(), name }],
    }));

  const updatePaymentAmount = (id: string, amount: number) =>
    update(c => ({
      ...c,
      payments: c.payments.map(p => p.id === id ? { ...p, amount } : p),
    }));

  const deleteCarsharingTag = (tagId: string) =>
    update(c => ({
      ...c,
      carsharingTags: c.carsharingTags.filter(t => t.id !== tagId),
      carsharingTrips: c.carsharingTrips.map(trip => ({
        ...trip,
        tagIds: trip.tagIds.filter(id => id !== tagId),
      })),
    }));

  const resetToDefaults = () => mutate(DEFAULT_CONFIG);

  return {
    config,
    isLoading,
    isSaving,
    updateLoan,
    updatePaymentAmount,
    togglePaymentCheck,
    addCarsharingTrip,
    deleteCarsharingTrip,
    addCarsharingTag,
    deleteCarsharingTag,
    resetToDefaults,
    monthKey,
  };
}
