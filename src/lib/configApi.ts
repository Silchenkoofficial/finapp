/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FinanceConfig,
  LoanState,
  PaymentItem,
  PaymentChecks,
  CarsharingTag,
  CarsharingTrip,
} from "../types";
import { supabase } from "./supabase";
import { DEFAULT_CONFIG } from "../defaultConfig";

// ─── fetch ────────────────────────────────────────────────────────────────────

export async function fetchConfig(
  signal?: AbortSignal,
): Promise<FinanceConfig> {
  // abortSignal должен быть до терминальных методов (.maybeSingle и т.д.)
  const ab = (q: any) => (signal ? q.abortSignal(signal) : q);
  const [loanRes, paymentsRes, checksRes, tagsRes, tripsRes] =
    await Promise.all([
      ab(supabase.from("loan").select("*").eq("id", "singleton")).maybeSingle(),
      ab(supabase.from("payments").select("*").order("sort_order")),
      ab(supabase.from("payment_checks").select("*")),
      ab(supabase.from("carsharing_tags").select("*")),
      ab(
        supabase
          .from("carsharing_trips")
          .select("*")
          .order("date", { ascending: false }),
      ),
    ]);

  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // Первый запуск — сидируем дефолтные данные
  if (!loanRes.data) {
    await seedDefaults();
    return DEFAULT_CONFIG;
  }

  const loan: LoanState = {
    currentBalance: loanRes.data.current_balance,
    earlyPayment: loanRes.data.early_payment,
    mandatoryPayment: loanRes.data.mandatory_payment,
    startBalance: loanRes.data.start_balance,
    startDate: loanRes.data.start_date,
  };

  const payments: PaymentItem[] = (paymentsRes.data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    icon: p.icon,
    amount: p.amount,
    period: p.period as "salary" | "advance",
    dayOfMonth: p.day_of_month,
    description: p.description ?? undefined,
  }));

  const paymentChecks: PaymentChecks = {};
  for (const c of checksRes.data ?? []) {
    if (!paymentChecks[c.month_key]) paymentChecks[c.month_key] = {};
    paymentChecks[c.month_key][c.payment_id] = c.checked;
  }

  const carsharingTags: CarsharingTag[] = (tagsRes.data ?? []).map(
    (t: any) => ({
      id: t.id,
      name: t.name,
    }),
  );

  const carsharingTrips: CarsharingTrip[] = (tripsRes.data ?? []).map(
    (t: any) => ({
      id: t.id,
      date: t.date,
      amount: t.amount,
      service: t.service as "yandex" | "citydrive",
      tagIds: t.tag_ids ?? [],
      comment: t.comment ?? undefined,
    }),
  );

  return { loan, payments, paymentChecks, carsharingTags, carsharingTrips };
}

async function seedDefaults(): Promise<void> {
  await Promise.all([
    saveLoan(DEFAULT_CONFIG.loan),
    supabase.from("payments").insert(
      DEFAULT_CONFIG.payments.map((p, i) => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        amount: p.amount,
        period: p.period,
        day_of_month: p.dayOfMonth,
        description: p.description ?? null,
        sort_order: i,
      })),
    ),
    supabase
      .from("carsharing_tags")
      .insert(
        DEFAULT_CONFIG.carsharingTags.map((t) => ({ id: t.id, name: t.name })),
      ),
  ]);
}

// ─── loan ─────────────────────────────────────────────────────────────────────

export async function saveLoan(loan: LoanState): Promise<void> {
  const { error } = await supabase.from("loan").upsert({
    id: "singleton",
    current_balance: loan.currentBalance,
    early_payment: loan.earlyPayment,
    mandatory_payment: loan.mandatoryPayment,
    start_balance: loan.startBalance,
    start_date: loan.startDate,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

// ─── payments ─────────────────────────────────────────────────────────────────

export async function savePaymentAmount(
  id: string,
  amount: number,
): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update({ amount })
    .eq("id", id);
  if (error) throw error;
}

// ─── payment checks ───────────────────────────────────────────────────────────

export async function upsertPaymentCheck(
  monthKey: string,
  paymentId: string,
  checked: boolean,
): Promise<void> {
  if (checked) {
    const { error } = await supabase
      .from("payment_checks")
      .upsert({ month_key: monthKey, payment_id: paymentId, checked: true });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("payment_checks")
      .delete()
      .eq("month_key", monthKey)
      .eq("payment_id", paymentId);
    if (error) throw error;
  }
}

// ─── carsharing trips ─────────────────────────────────────────────────────────

export async function insertTrip(trip: CarsharingTrip): Promise<void> {
  const { error } = await supabase.from("carsharing_trips").insert({
    id: trip.id,
    date: trip.date,
    amount: trip.amount,
    service: trip.service,
    tag_ids: trip.tagIds,
    comment: trip.comment ?? null,
  });
  if (error) throw error;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase
    .from("carsharing_trips")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ─── carsharing tags ──────────────────────────────────────────────────────────

export async function insertTag(tag: CarsharingTag): Promise<void> {
  const { error } = await supabase
    .from("carsharing_tags")
    .insert({ id: tag.id, name: tag.name });
  if (error) throw error;
}

export async function deleteTag(tagId: string): Promise<void> {
  // Убираем тег из всех поездок, где он есть
  const { data: affected } = await supabase
    .from("carsharing_trips")
    .select("id, tag_ids")
    .contains("tag_ids", [tagId]);

  if (affected?.length) {
    await Promise.all(
      affected.map((t: any) =>
        supabase
          .from("carsharing_trips")
          .update({
            tag_ids: (t.tag_ids as string[]).filter(
              (id: string) => id !== tagId,
            ),
          })
          .eq("id", t.id),
      ),
    );
  }

  const { error } = await supabase
    .from("carsharing_tags")
    .delete()
    .eq("id", tagId);
  if (error) throw error;
}

// ─── reset ────────────────────────────────────────────────────────────────────

export async function resetAllToDefaults(): Promise<void> {
  await Promise.all([
    supabase.from("loan").delete().eq("id", "singleton"),
    supabase.from("payments").delete().neq("id", ""),
    supabase.from("payment_checks").delete().neq("month_key", ""),
    supabase.from("carsharing_tags").delete().neq("id", ""),
    supabase.from("carsharing_trips").delete().neq("id", ""),
  ]);
  await seedDefaults();
}
