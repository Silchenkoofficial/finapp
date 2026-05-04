import { useState } from 'react';
import type { FinanceConfig, Period } from '../types';
import { calcPeriodBalance, formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateIncome: (id: 'salary' | 'advance', value: number) => void;
  onUpdateEarlyLoan: (value: number) => void;
  onUpdateFixed: (periodId: 'salary' | 'advance', expenseId: string, amount: number) => void;
  onUpdateDaily: (periodId: 'salary' | 'advance', expenseId: string, rate: number, days: number) => void;
}

function InlineAmount({
  value,
  colorClass,
  prefix = '−',
  onSave,
}: {
  value: number;
  colorClass: string;
  prefix?: string;
  onSave: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const start = () => { setDraft(String(value)); setEditing(true); };
  const save = () => {
    const n = Number(draft);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <Input
          inputMode="numeric"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          className="w-28 h-8 text-right text-sm"
          autoFocus
        />
        <Button size="sm" onClick={save} className="h-8 px-2.5 text-xs">OK</Button>
      </div>
    );
  }

  return (
    <button
      onClick={start}
      className={`font-bold text-sm shrink-0 flex items-center gap-0.5 hover:opacity-70 transition-opacity ${colorClass}`}
    >
      {value === 0 ? '±0 ₽' : `${prefix}${formatRub(value)}`}
      <span className="text-stone-300 text-xs font-normal">✏</span>
    </button>
  );
}

function InlineDailyAmount({
  dailyRate,
  days,
  onSave,
}: {
  dailyRate: number;
  days: number;
  onSave: (rate: number, days: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftRate, setDraftRate] = useState('');
  const [draftDays, setDraftDays] = useState('');

  const start = () => { setDraftRate(String(dailyRate)); setDraftDays(String(days)); setEditing(true); };
  const save = () => {
    const r = Number(draftRate), d = Number(draftDays);
    if (!isNaN(r) && !isNaN(d) && r >= 0 && d > 0) onSave(r, d);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-1 items-end shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">₽/д</span>
          <Input inputMode="numeric" value={draftRate} onChange={e => setDraftRate(e.target.value)} className="w-20 h-7 text-right text-xs" autoFocus />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">дней</span>
          <Input inputMode="numeric" value={draftDays} onChange={e => setDraftDays(e.target.value)} className="w-20 h-7 text-right text-xs" />
        </div>
        <Button size="sm" onClick={save} className="h-7 px-2 text-xs">OK</Button>
      </div>
    );
  }

  return (
    <button
      onClick={start}
      className="font-bold text-sm text-amber-700 shrink-0 flex items-center gap-0.5 hover:opacity-70 transition-opacity"
    >
      −{formatRub(dailyRate * days)}
      <span className="text-stone-300 text-xs font-normal">✏</span>
    </button>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-stone-50 text-[11px] text-muted-foreground font-medium border-b border-stone-100">
      {label}
    </div>
  );
}

function PeriodCard({
  period,
  onUpdateIncome,
  onUpdateEarlyLoan,
  onUpdateFixed,
  onUpdateDaily,
}: {
  period: Period;
  onUpdateIncome: (v: number) => void;
  onUpdateEarlyLoan: (v: number) => void;
  onUpdateFixed: (id: string, v: number) => void;
  onUpdateDaily: (id: string, rate: number, days: number) => void;
}) {
  const calc = calcPeriodBalance(period);
  const mandatoryLoan = period.id === 'advance' ? 25000 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Badge className={period.id === 'salary' ? 'bg-emerald-100 text-emerald-800 border-0' : 'bg-blue-100 text-blue-800 border-0'}>
          {period.id === 'salary' ? '15 числа — зарплата' : '~29 числа — аванс'}
        </Badge>
        <InlineAmount
          value={period.income}
          colorClass="text-emerald-700"
          prefix="+"
          onSave={onUpdateIncome}
        />
      </div>

      <Card className="rounded-2xl border-stone-200 overflow-hidden">
        <CardContent className="p-0">
          {period.id === 'salary' && (
            <>
              <SectionDivider label="Сразу делаешь (15–16 число)" />
              <div className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fdecea] flex items-center justify-center text-base shrink-0">💳</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Карусель кредитки</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Закрыл 49к → вывел 49к обратно</div>
                </div>
                <span className="font-bold text-sm text-stone-400 shrink-0">±0 ₽</span>
              </div>
              <div className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center text-base shrink-0">🏦</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Кредит (досрочно)</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">⭐ Вносишь сразу с зарплаты</div>
                </div>
                <InlineAmount value={period.earlyLoanPayment} colorClass="text-red-600" onSave={onUpdateEarlyLoan} />
              </div>
              <SectionDivider label="Обязательные платежи 15–28 числа" />
            </>
          )}

          {period.id === 'advance' && (
            <>
              <SectionDivider label="Платежи в начале месяца (до 2-го числа)" />
              <div className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center text-base shrink-0">🏦</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Кредит (обязательный)</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">2-го числа</div>
                </div>
                <span className="font-bold text-sm text-red-600 shrink-0">−{formatRub(mandatoryLoan)}</span>
              </div>
            </>
          )}

          {period.fixedExpenses.map(e => (
            <div key={e.id} className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] flex items-center justify-center text-base shrink-0">{e.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{e.name}</div>
                {e.description && <div className="text-[11px] text-muted-foreground mt-0.5">{e.description}</div>}
              </div>
              <InlineAmount value={e.amount} colorClass="text-violet-600" onSave={v => onUpdateFixed(e.id, v)} />
            </div>
          ))}

          <SectionDivider label={`Тратишь в течение ${period.dailyExpenses[0]?.days ?? 0} дней`} />

          {period.dailyExpenses.map(e => (
            <div key={e.id} className="flex items-center px-4 py-3 border-b border-stone-100 gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center text-base shrink-0">{e.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">~{e.dailyRate.toLocaleString('ru')} ₽/день × {e.days} дней</div>
              </div>
              <InlineDailyAmount dailyRate={e.dailyRate} days={e.days} onSave={(r, d) => onUpdateDaily(e.id, r, d)} />
            </div>
          ))}

          <div className="flex items-center px-4 py-3.5 bg-stone-50 border-t border-stone-200 gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-base shrink-0">🛡</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {period.id === 'salary' ? 'Живой остаток (до аванса)' : 'Остаток после авансового периода'}
              </div>
              <div className="text-xs text-muted-foreground">После всех трат</div>
            </div>
            <div className="font-bold text-base text-emerald-700 shrink-0">{formatRub(calc.balance)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PeriodBreakdown({ config, onUpdateIncome, onUpdateEarlyLoan, onUpdateFixed, onUpdateDaily }: Props) {
  const salaryPeriod = config.periods.find(p => p.id === 'salary')!;
  const advancePeriod = config.periods.find(p => p.id === 'advance')!;
  const totalBalance = calcPeriodBalance(salaryPeriod).balance + calcPeriodBalance(advancePeriod).balance;

  return (
    <div className="space-y-6">
      <PeriodCard
        period={salaryPeriod}
        onUpdateIncome={v => onUpdateIncome('salary', v)}
        onUpdateEarlyLoan={onUpdateEarlyLoan}
        onUpdateFixed={(id, v) => onUpdateFixed('salary', id, v)}
        onUpdateDaily={(id, r, d) => onUpdateDaily('salary', id, r, d)}
      />
      <PeriodCard
        period={advancePeriod}
        onUpdateIncome={v => onUpdateIncome('advance', v)}
        onUpdateEarlyLoan={onUpdateEarlyLoan}
        onUpdateFixed={(id, v) => onUpdateFixed('advance', id, v)}
        onUpdateDaily={(id, r, d) => onUpdateDaily('advance', id, r, d)}
      />

      <div className="bg-emerald-800 rounded-2xl p-5 text-white">
        <div className="text-[10px] tracking-widest text-white/40 uppercase mb-1">Итого на кредит в месяц</div>
        <div className="text-3xl font-bold mb-1">{formatRub(config.loan.earlyPayment + config.loan.mandatoryPayment)}</div>
        <div className="text-sm text-white/60 mb-4">
          {formatRub(config.loan.earlyPayment)} с ЗП (досрочно) + {formatRub(config.loan.mandatoryPayment)} с аванса (обяз.)
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[10px] text-white/40 mb-1">Свободно за цикл</div>
            <div className="font-bold text-sm">{formatRub(totalBalance)}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-[10px] text-white/40 mb-1">Осталось долга</div>
            <div className="font-bold text-sm">{formatRub(config.loan.currentBalance)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
