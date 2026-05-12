import {
  useQuery,
  useMutation,
  useQueryClient,
  useIsMutating,
} from "@tanstack/react-query";
import type {
  FinanceConfig,
  LoanState,
  CarsharingTrip,
  CarsharingTag,
} from "../types";
import * as api from "../lib/configApi";
import { DEFAULT_CONFIG } from "../defaultConfig";

const QUERY_KEY = ["config"];

function monthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function useConfig() {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => api.fetchConfig(signal),
    staleTime: Infinity,
  });

  const isSaving = useIsMutating() > 0;

  // ── helpers ──────────────────────────────────────────────────────────────────

  function getCache() {
    return queryClient.getQueryData<FinanceConfig>(QUERY_KEY);
  }

  function setCache(next: FinanceConfig) {
    queryClient.setQueryData(QUERY_KEY, next);
  }

  function onMutate(updater: (prev: FinanceConfig) => FinanceConfig) {
    const previous = getCache();
    if (previous) setCache(updater(previous));
    return { previous };
  }

  function onError(
    _: unknown,
    __: unknown,
    ctx: { previous?: FinanceConfig } | undefined,
  ) {
    if (ctx?.previous) setCache(ctx.previous);
  }

  // ── loan ─────────────────────────────────────────────────────────────────────

  const loanMut = useMutation({
    mutationFn: (loan: LoanState) => api.saveLoan(loan),
    onMutate: (loan) => onMutate((c) => ({ ...c, loan })),
    onError,
  });

  const updateLoan = (updates: Partial<LoanState>) => {
    if (!config) return;
    loanMut.mutate({ ...config.loan, ...updates });
  };

  // ── payment amount ────────────────────────────────────────────────────────────

  const paymentAmountMut = useMutation({
    mutationFn: async ({
      id,
      amount,
      loan,
    }: {
      id: string;
      amount: number;
      loan: LoanState;
    }) => {
      await api.savePaymentAmount(id, amount);
      if (id === "loan-early" || id === "loan-mandatory")
        await api.saveLoan(loan);
    },
    onMutate: ({ id, amount, loan }) =>
      onMutate((c) => ({
        ...c,
        payments: c.payments.map((p) => (p.id === id ? { ...p, amount } : p)),
        loan,
      })),
    onError,
  });

  const updatePaymentAmount = (id: string, amount: number) => {
    if (!config) return;
    const loan = {
      ...config.loan,
      ...(id === "loan-early" ? { earlyPayment: amount } : {}),
      ...(id === "loan-mandatory" ? { mandatoryPayment: amount } : {}),
    };
    paymentAmountMut.mutate({ id, amount, loan });
  };

  // ── payment CRUD ─────────────────────────────────────────────────────────────

  const addPaymentMut = useMutation({
    mutationFn: ({ payment, sortOrder }: { payment: import('../types').PaymentItem; sortOrder: number }) =>
      api.insertPayment(payment, sortOrder),
    onMutate: ({ payment }) =>
      onMutate(c => ({ ...c, payments: [...c.payments, payment] })),
    onError,
  });

  const addPayment = (data: Omit<import('../types').PaymentItem, 'id'>) => {
    if (!config) return;
    addPaymentMut.mutate({
      payment: { ...data, id: crypto.randomUUID() },
      sortOrder: config.payments.length,
    });
  };

  const editPaymentMut = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<import('../types').PaymentItem, 'id'>> }) =>
      api.updatePaymentFields(id, updates),
    onMutate: ({ id, updates }) =>
      onMutate(c => ({
        ...c,
        payments: c.payments.map(p => p.id === id ? { ...p, ...updates } : p),
      })),
    onError,
  });

  const editPayment = (id: string, updates: Partial<Omit<import('../types').PaymentItem, 'id'>>) =>
    editPaymentMut.mutate({ id, updates });

  const deletePaymentMut = useMutation({
    mutationFn: (id: string) => api.deletePaymentById(id),
    onMutate: (id) =>
      onMutate(c => ({
        ...c,
        payments: c.payments.filter(p => p.id !== id),
        paymentChecks: Object.fromEntries(
          Object.entries(c.paymentChecks).map(([mk, checks]) => [
            mk,
            Object.fromEntries(Object.entries(checks).filter(([pid]) => pid !== id)),
          ])
        ),
      })),
    onError,
  });

  const deletePayment = (id: string) => deletePaymentMut.mutate(id);

  // ── payment checks ────────────────────────────────────────────────────────────

  const checkMut = useMutation({
    mutationFn: ({
      mk,
      paymentId,
      checked,
    }: {
      mk: string;
      paymentId: string;
      checked: boolean;
    }) => api.upsertPaymentCheck(mk, paymentId, checked),
    onMutate: ({ mk, paymentId, checked }) =>
      onMutate((c) => ({
        ...c,
        paymentChecks: {
          ...c.paymentChecks,
          [mk]: { ...(c.paymentChecks[mk] ?? {}), [paymentId]: checked },
        },
      })),
    onError,
  });

  const togglePaymentCheck = (paymentId: string) => {
    if (!config) return;
    const mk = monthKey();
    const checked = !(config.paymentChecks[mk]?.[paymentId] ?? false);
    checkMut.mutate({ mk, paymentId, checked });
  };

  // ── carsharing trips ──────────────────────────────────────────────────────────

  const addTripMut = useMutation({
    mutationFn: (trip: CarsharingTrip) => api.insertTrip(trip),
    onMutate: (trip) =>
      onMutate((c) => ({
        ...c,
        carsharingTrips: [trip, ...c.carsharingTrips],
      })),
    onError,
  });

  const addCarsharingTrip = (trip: Omit<CarsharingTrip, "id">) =>
    addTripMut.mutate({ ...trip, id: crypto.randomUUID() });

  const deleteTripMut = useMutation({
    mutationFn: (id: string) => api.deleteTrip(id),
    onMutate: (id) =>
      onMutate((c) => ({
        ...c,
        carsharingTrips: c.carsharingTrips.filter((t) => t.id !== id),
      })),
    onError,
  });

  const deleteCarsharingTrip = (id: string) => deleteTripMut.mutate(id);

  // ── carsharing tags ───────────────────────────────────────────────────────────

  const addTagMut = useMutation({
    mutationFn: (tag: CarsharingTag) => api.insertTag(tag),
    onMutate: (tag) =>
      onMutate((c) => ({ ...c, carsharingTags: [...c.carsharingTags, tag] })),
    onError,
  });

  const addCarsharingTag = (name: string) =>
    addTagMut.mutate({ id: crypto.randomUUID(), name });

  const deleteTagMut = useMutation({
    mutationFn: (id: string) => api.deleteTag(id),
    onMutate: (id) =>
      onMutate((c) => ({
        ...c,
        carsharingTags: c.carsharingTags.filter((t) => t.id !== id),
        carsharingTrips: c.carsharingTrips.map((t) => ({
          ...t,
          tagIds: t.tagIds.filter((tid) => tid !== id),
        })),
      })),
    onError,
  });

  const deleteCarsharingTag = (id: string) => deleteTagMut.mutate(id);

  // ── reset ─────────────────────────────────────────────────────────────────────

  const resetMut = useMutation({
    mutationFn: api.resetAllToDefaults,
    onSuccess: () => setCache(DEFAULT_CONFIG),
  });

  const resetToDefaults = () => resetMut.mutate();

  return {
    config,
    isLoading,
    isSaving,
    updateLoan,
    updatePaymentAmount,
    addPayment,
    editPayment,
    deletePayment,
    togglePaymentCheck,
    addCarsharingTrip,
    deleteCarsharingTrip,
    addCarsharingTag,
    deleteCarsharingTag,
    resetToDefaults,
    monthKey,
  };
}
