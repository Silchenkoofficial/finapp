import { useState } from 'react';
import { Zap, Landmark, BarChart3 } from 'lucide-react';
import type { FinanceConfig } from '../types';
import { formatRub, loanMonthsLeft } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateLoan: (updates: Partial<FinanceConfig['loan']>) => void;
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

export function LoanTracker({ config, onUpdateLoan }: Props) {
  const { loan } = config;
  const monthlyPayment = loan.earlyPayment + loan.mandatoryPayment;
  const monthsLeft = loanMonthsLeft(loan.currentBalance, monthlyPayment);
  const paid = loan.startBalance - loan.currentBalance;
  const progressPct = Math.min(100, Math.round((paid / loan.startBalance) * 100));

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + monthsLeft);
  const payoffStr = payoffDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  const minMonthlyPayment = loan.currentBalance * 0.01;
  const minMonthsLeft = loanMonthsLeft(loan.currentBalance, minMonthlyPayment);
  const savedMonths = Math.max(0, minMonthsLeft - monthsLeft);

  return (
    <div className="space-y-4">
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
            <div className="text-sm text-white/50">нажми чтобы обновить</div>
          </InlineField>

          <div className="mt-4 mb-3">
            <Progress value={progressPct} className="h-2.5 bg-white/10" indicatorClassName="bg-emerald-400" />
          </div>
          <div className="flex justify-between text-xs text-white/40">
            <span>Выплачено {formatRub(paid)}</span>
            <span>{progressPct}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Закроешь через</div>
            <div className="text-2xl font-bold text-emerald-700">{monthsLeft}</div>
            <div className="text-xs text-muted-foreground">мес. ({payoffStr})</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">В месяц</div>
            <div className="text-2xl font-bold">{formatRub(monthlyPayment)}</div>
            <div className="text-xs text-muted-foreground">суммарно</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Экономия (мес.)</div>
            <div className="text-2xl font-bold text-emerald-700">~{savedMonths}</div>
            <div className="text-xs text-muted-foreground">vs. минималка</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Выплачено</div>
            <div className="text-2xl font-bold">{formatRub(paid)}</div>
            <div className="text-xs text-muted-foreground">из {formatRub(loan.startBalance)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-stone-100">
            <div className="text-sm font-semibold mb-0.5">Структура платежей</div>
            <div className="text-xs text-muted-foreground">Нажми на сумму чтобы изменить</div>
          </div>

          {[
            { Icon: Zap,      bg: 'bg-amber-100',  label: 'Досрочный платёж',  sub: 'С зарплаты 15-го',       value: loan.earlyPayment,    key: 'earlyPayment'    as const },
            { Icon: Landmark, bg: 'bg-yellow-100', label: 'Обязательный платёж', sub: 'С аванса 2-го числа',   value: loan.mandatoryPayment, key: 'mandatoryPayment' as const },
            { Icon: BarChart3, bg: 'bg-stone-100', label: 'Начальный долг',     sub: 'Когда начал отслеживать', value: loan.startBalance,    key: 'startBalance'    as const },
          ].map((row, i, arr) => (
            <div key={row.key} className={`flex items-center px-4 py-3.5 gap-3 ${i < arr.length - 1 ? 'border-b border-stone-100' : ''}`}>
              <div className={`w-9 h-9 rounded-xl ${row.bg} flex items-center justify-center shrink-0`}>
                <row.Icon size={18} className="text-stone-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.sub}</div>
              </div>
              <InlineField
                value={row.value}
                onSave={v => onUpdateLoan({ [row.key]: v })}
                className="flex items-center gap-1 hover:opacity-70 transition-opacity shrink-0"
              >
                <span className="font-bold text-sm text-stone-600">{formatRub(row.value)}</span>
                <span className="text-stone-300 text-xs">✏</span>
              </InlineField>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-emerald-800 mb-1">Правильный путь</div>
        <div className="text-xs text-emerald-700 leading-relaxed">
          Платишь {formatRub(monthlyPayment)}/мес вместо минималки ~{formatRub(minMonthlyPayment)}/мес.
          Экономишь примерно <span className="font-semibold">~{savedMonths} месяцев</span> и много денег на процентах.
        </div>
      </div>
    </div>
  );
}
