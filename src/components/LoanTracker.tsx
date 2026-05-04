import { useState } from 'react';
import type { FinanceConfig } from '../types';
import { formatRub, loanMonthsLeft } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateLoan: (updates: Partial<FinanceConfig['loan']>) => void;
}

export function LoanTracker({ config, onUpdateLoan }: Props) {
  const { loan } = config;
  const monthlyPayment = loan.earlyPayment + loan.mandatoryPayment;
  const monthsLeft = loanMonthsLeft(loan.currentBalance, monthlyPayment);
  const paid = loan.startBalance - loan.currentBalance;
  const progressPct = Math.min(100, Math.round((paid / loan.startBalance) * 100));

  const [editing, setEditing] = useState<null | 'balance' | 'early' | 'mandatory' | 'start'>(null);
  const [val, setVal] = useState('');

  const open = (field: typeof editing, current: number) => {
    setEditing(field);
    setVal(String(current));
  };

  const save = () => {
    const num = Number(val);
    if (isNaN(num) || num < 0) return;
    if (editing === 'balance') onUpdateLoan({ currentBalance: num });
    else if (editing === 'early') onUpdateLoan({ earlyPayment: num });
    else if (editing === 'mandatory') onUpdateLoan({ mandatoryPayment: num });
    else if (editing === 'start') onUpdateLoan({ startBalance: num });
    setEditing(null);
  };

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + monthsLeft);
  const payoffStr = payoffDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  const minMonthlyPayment = loan.currentBalance * 0.01;
  const minMonthsLeft = loanMonthsLeft(loan.currentBalance, minMonthlyPayment);
  const savedMonths = Math.max(0, minMonthsLeft - monthsLeft);

  return (
    <>
      <div className="space-y-4">
        {/* Main progress card */}
        <Card className="rounded-2xl border-0 bg-[#111827] text-white overflow-hidden">
          <CardContent className="p-5">
            <div className="text-[10px] tracking-widest text-white/30 uppercase mb-1">Остаток долга</div>
            <button
              className="text-3xl font-bold text-white hover:opacity-70 transition-opacity block mb-1"
              onClick={() => open('balance', loan.currentBalance)}
            >
              {formatRub(loan.currentBalance)}
            </button>
            <div className="text-sm text-white/50 mb-4">нажми чтобы обновить</div>

            <div className="mb-3">
              <Progress value={progressPct} className="h-2.5 bg-white/10 [&>div]:bg-emerald-400" />
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span>Выплачено {formatRub(paid)}</span>
              <span>{progressPct}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
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

        {/* Payment breakdown */}
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b border-stone-100">
              <div className="text-sm font-semibold mb-0.5">Структура платежей</div>
              <div className="text-xs text-muted-foreground">Нажми на строку чтобы изменить</div>
            </div>
            <button
              className="w-full flex items-center px-4 py-3.5 border-b border-stone-100 hover:bg-stone-50 transition-colors text-left"
              onClick={() => open('early', loan.earlyPayment)}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-base mr-3">⚡</div>
              <div className="flex-1">
                <div className="text-sm font-medium">Досрочный платёж</div>
                <div className="text-xs text-muted-foreground">С зарплаты 15-го</div>
              </div>
              <div className="font-bold text-red-600 text-sm mr-1">−{formatRub(loan.earlyPayment)}</div>
              <div className="text-stone-300 text-xs">✏</div>
            </button>
            <button
              className="w-full flex items-center px-4 py-3.5 border-b border-stone-100 hover:bg-stone-50 transition-colors text-left"
              onClick={() => open('mandatory', loan.mandatoryPayment)}
            >
              <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-base mr-3">🏦</div>
              <div className="flex-1">
                <div className="text-sm font-medium">Обязательный платёж</div>
                <div className="text-xs text-muted-foreground">С аванса 2-го числа</div>
              </div>
              <div className="font-bold text-red-600 text-sm mr-1">−{formatRub(loan.mandatoryPayment)}</div>
              <div className="text-stone-300 text-xs">✏</div>
            </button>
            <button
              className="w-full flex items-center px-4 py-3.5 hover:bg-stone-50 transition-colors text-left"
              onClick={() => open('start', loan.startBalance)}
            >
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-base mr-3">📊</div>
              <div className="flex-1">
                <div className="text-sm font-medium">Начальный долг</div>
                <div className="text-xs text-muted-foreground">Когда начал отслеживать</div>
              </div>
              <div className="font-bold text-stone-500 text-sm mr-1">{formatRub(loan.startBalance)}</div>
              <div className="text-stone-300 text-xs">✏</div>
            </button>
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

      <Dialog open={editing !== null} onOpenChange={open => !open && setEditing(null)}>
        <DialogContent className="rounded-2xl max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>
              {editing === 'balance' && 'Текущий остаток долга'}
              {editing === 'early' && 'Досрочный платёж'}
              {editing === 'mandatory' && 'Обязательный платёж'}
              {editing === 'start' && 'Начальная сумма долга'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-1.5 block">Сумма (₽)</Label>
            <Input
              type="number"
              value={val}
              onChange={e => setVal(e.target.value)}
              className="text-base"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Отмена</Button>
            <Button onClick={save}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
