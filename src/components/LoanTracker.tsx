import { useState } from 'react';
import { Zap, Landmark, BarChart3, CalendarCheck2 } from 'lucide-react';
import type { FinanceConfig } from '../types';
import { formatRub, loanMonthsLeft } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateLoan: (updates: Partial<FinanceConfig['loan']>) => void;
  onUpdatePaymentAmount: (id: string, amount: number) => void;
}

function InlineField({
  value,
  onSave,
  className,
  children,
}: {
  value: number;
  onSave: (v: number) => void;
  className?: string;
  children: React.ReactNode;
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
          className="w-32 h-8 text-right text-sm"
          autoFocus
        />
        <Button size="sm" onClick={save} className="h-8 px-2.5 text-xs">OK</Button>
      </div>
    );
  }

  return (
    <button onClick={start} className={className}>
      {children}
    </button>
  );
}

export function LoanTracker({ config, onUpdateLoan, onUpdatePaymentAmount }: Props) {
  const { loan } = config;
  const monthlyPayment = loan.earlyPayment + loan.mandatoryPayment;
  const monthsLeft = loanMonthsLeft(loan.currentBalance, monthlyPayment);
  const paid = loan.startBalance - loan.currentBalance;
  const progressPct = Math.min(100, Math.round((paid / loan.startBalance) * 100));

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + monthsLeft);
  const payoffStr = payoffDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">

      {/* Остаток и прогресс */}
      <Card className="rounded-2xl border-0 bg-[#111827] text-white overflow-hidden">
        <CardContent className="p-5">
          <div className="text-[10px] tracking-widest text-white/30 uppercase mb-1">Остаток долга</div>
          <InlineField
            value={loan.currentBalance}
            onSave={v => onUpdateLoan({ currentBalance: v })}
            className="text-left"
          >
            <div className="text-3xl font-bold text-white hover:opacity-70 transition-opacity mb-1">
              {formatRub(loan.currentBalance)}
            </div>
            <div className="text-xs text-white/40">нажми чтобы обновить остаток</div>
          </InlineField>

          <div className="mt-4 mb-2">
            <Progress value={progressPct} className="h-2 bg-white/10" indicatorClassName="bg-emerald-400" />
          </div>
          <div className="flex justify-between text-xs text-white/40">
            <span>выплачено {formatRub(paid)} ({progressPct}%)</span>
            <span>начало {formatRub(loan.startBalance)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Дата закрытия — главная карточка */}
      <Card className="rounded-2xl border-emerald-200 bg-emerald-50">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CalendarCheck2 size={20} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-emerald-700 font-medium">Кредит закроется</div>
            <div className="text-lg font-bold text-emerald-800 capitalize">{payoffStr}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-emerald-700">{monthsLeft}</div>
            <div className="text-xs text-emerald-600">месяцев</div>
          </div>
        </CardContent>
      </Card>

      {/* Платежи в месяц */}
      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-stone-100">
            <div className="text-sm font-semibold">Платежи по кредиту</div>
            <div className="text-xs text-muted-foreground">Нажми на сумму чтобы изменить</div>
          </div>

          {[
            {
              Icon: Zap,
              bg: 'bg-amber-100',
              iconCls: 'text-amber-600',
              label: 'Досрочный платёж',
              sub: '15-го числа, с зарплаты',
              value: loan.earlyPayment,
              onSave: (v: number) => onUpdatePaymentAmount('loan-early', v),
            },
            {
              Icon: Landmark,
              bg: 'bg-blue-100',
              iconCls: 'text-blue-600',
              label: 'Обязательный платёж',
              sub: '2-го числа, с аванса',
              value: loan.mandatoryPayment,
              onSave: (v: number) => onUpdatePaymentAmount('loan-mandatory', v),
            },
          ].map((row, i) => (
            <div key={row.label} className={`flex items-center px-4 py-3.5 gap-3 ${i === 0 ? 'border-b border-stone-100' : ''}`}>
              <div className={`w-9 h-9 rounded-xl ${row.bg} flex items-center justify-center shrink-0`}>
                <row.Icon size={18} className={row.iconCls} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.sub}</div>
              </div>
              <InlineField
                value={row.value}
                onSave={row.onSave}
                className="flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
              >
                <span className="font-bold text-sm">{formatRub(row.value)}</span>
                <span className="text-stone-300 text-xs">✏</span>
              </InlineField>
            </div>
          ))}

          {/* Итого */}
          <div className="flex items-center px-4 py-3 bg-stone-50 rounded-b-2xl border-t border-stone-100">
            <div className="flex-1 text-sm font-semibold">Итого в месяц</div>
            <div className="text-sm font-bold">{formatRub(monthlyPayment)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Начальный долг */}
      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-0">
          <div className="flex items-center px-4 py-3.5 gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
              <BarChart3 size={18} className="text-stone-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Начальный долг</div>
              <div className="text-xs text-muted-foreground">Сумма когда начал отслеживать</div>
            </div>
            <InlineField
              value={loan.startBalance}
              onSave={v => onUpdateLoan({ startBalance: v })}
              className="flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
            >
              <span className="font-bold text-sm">{formatRub(loan.startBalance)}</span>
              <span className="text-stone-300 text-xs">✏</span>
            </InlineField>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
