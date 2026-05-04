import { useState } from 'react';
import type { FinanceConfig, Period } from '../types';
import { calcPeriodBalance, formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from './ui/drawer';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateIncome: (id: 'salary' | 'advance', value: number) => void;
  onUpdateEarlyLoan: (value: number) => void;
  onUpdateFixed: (periodId: 'salary' | 'advance', expenseId: string, amount: number) => void;
  onUpdateDaily: (periodId: 'salary' | 'advance', expenseId: string, rate: number, days: number) => void;
}

interface EditState {
  type: 'income' | 'fixed' | 'daily' | 'early-loan';
  periodId: 'salary' | 'advance';
  expenseId?: string;
  label: string;
  value: number;
  value2?: number;
}

function PeriodCard({ period, onEdit }: { period: Period; onEdit: (s: EditState) => void }) {
  const calc = calcPeriodBalance(period);
  const mandatoryLoan = period.id === 'advance' ? 25000 : 0;

  return (
    <div className="space-y-3">
      {/* Period header */}
      <div className="flex items-center gap-3">
        <Badge className={period.id === 'salary' ? 'bg-emerald-100 text-emerald-800 border-0' : 'bg-blue-100 text-blue-800 border-0'}>
          {period.id === 'salary' ? '15 числа — зарплата' : '~29 числа — аванс'}
        </Badge>
        <button
          className="font-bold text-emerald-700 text-base hover:opacity-70 transition-opacity"
          onClick={() => onEdit({ type: 'income', periodId: period.id, label: 'Доход', value: period.income })}
        >
          +{formatRub(period.income)}
        </button>
      </div>

      {/* Rows */}
      <Card className="rounded-2xl border-stone-200 overflow-hidden">
        <CardContent className="p-0">
          {period.id === 'salary' && (
            <>
              <SectionDivider label="Сразу делаешь (15–16 число)" />
              <ExpenseRow
                icon="💳"
                iconBg="#fdecea"
                label="Карусель кредитки"
                sub="Закрыл 49к → вывел 49к обратно"
                amount={0}
                amountColor="text-stone-400"
                amountLabel="±0 ₽"
              />
              <ExpenseRow
                icon="🏦"
                iconBg="#fef3c7"
                label="Кредит (досрочно)"
                sub="⭐ Вносишь сразу с зарплаты"
                amount={period.earlyLoanPayment}
                amountColor="text-red-600"
                onClick={() => onEdit({ type: 'early-loan', periodId: 'salary', label: 'Досрочный платёж по кредиту', value: period.earlyLoanPayment })}
              />
              <SectionDivider label="Обязательные платежи 15–28 числа" />
            </>
          )}
          {period.id === 'advance' && (
            <>
              <SectionDivider label="Платежи в начале месяца (до 2-го числа)" />
              <ExpenseRow
                icon="🏦"
                iconBg="#fef3c7"
                label="Кредит (обязательный платёж)"
                sub="2-го числа"
                amount={mandatoryLoan}
                amountColor="text-red-600"
              />
            </>
          )}

          {period.fixedExpenses.map(e => (
            <ExpenseRow
              key={e.id}
              icon={e.icon}
              iconBg="#e0e7ff"
              label={e.name}
              sub={e.description}
              amount={e.amount}
              amountColor="text-violet-600"
              onClick={() => onEdit({ type: 'fixed', periodId: period.id, expenseId: e.id, label: e.name, value: e.amount })}
            />
          ))}

          <SectionDivider label={`Тратишь в течение ${period.dailyExpenses[0]?.days ?? 0} дней`} />

          {period.dailyExpenses.map(e => (
            <ExpenseRow
              key={e.id}
              icon={e.icon}
              iconBg="#eff6ff"
              label={e.name}
              sub={`~${e.dailyRate.toLocaleString('ru')} ₽/день × ${e.days} дней`}
              amount={e.dailyRate * e.days}
              amountColor="text-amber-700"
              onClick={() => onEdit({ type: 'daily', periodId: period.id, expenseId: e.id, label: e.name, value: e.dailyRate, value2: e.days })}
            />
          ))}

          {/* Result */}
          <div className="flex items-center px-4 py-3.5 bg-stone-50 border-t border-stone-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-base mr-3 shrink-0">🛡</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {period.id === 'salary' ? 'Живой остаток (до аванса)' : 'Остаток после авансового периода'}
              </div>
              <div className="text-xs text-muted-foreground">После всех трат</div>
            </div>
            <div className="font-bold text-base text-emerald-700">{formatRub(calc.balance)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 bg-stone-50 text-[11px] text-muted-foreground font-medium border-b border-stone-100">
      {label}
    </div>
  );
}

function ExpenseRow({
  icon, iconBg, label, sub, amount, amountColor, amountLabel, onClick,
}: {
  icon: string;
  iconBg: string;
  label: string;
  sub?: string;
  amount: number;
  amountColor: string;
  amountLabel?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center px-4 py-3 border-b border-stone-100 last:border-0 ${onClick ? 'cursor-pointer hover:bg-stone-50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mr-3"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      <div className={`font-bold text-sm ml-2 shrink-0 ${amountColor}`}>
        {amountLabel ?? (amount === 0 ? '±0 ₽' : `−${formatRub(amount)}`)}
      </div>
      {onClick && <div className="ml-1 text-stone-300 text-xs">✏</div>}
    </div>
  );
}

export function PeriodBreakdown({ config, onUpdateIncome, onUpdateEarlyLoan, onUpdateFixed, onUpdateDaily }: Props) {
  const [editing, setEditing] = useState<EditState | null>(null);
  const [val, setVal] = useState('');
  const [val2, setVal2] = useState('');

  const openEdit = (state: EditState) => {
    setEditing(state);
    setVal(String(state.value));
    setVal2(String(state.value2 ?? ''));
  };

  const save = () => {
    if (!editing) return;
    const num = Number(val);
    if (isNaN(num) || num < 0) return;

    if (editing.type === 'income') onUpdateIncome(editing.periodId, num);
    else if (editing.type === 'early-loan') onUpdateEarlyLoan(num);
    else if (editing.type === 'fixed' && editing.expenseId) onUpdateFixed(editing.periodId, editing.expenseId, num);
    else if (editing.type === 'daily' && editing.expenseId) onUpdateDaily(editing.periodId, editing.expenseId, num, Number(val2));

    setEditing(null);
  };

  const salaryPeriod = config.periods.find(p => p.id === 'salary')!;
  const advancePeriod = config.periods.find(p => p.id === 'advance')!;
  const totalBalance = calcPeriodBalance(salaryPeriod).balance + calcPeriodBalance(advancePeriod).balance;

  return (
    <>
      <div className="space-y-6">
        <PeriodCard period={salaryPeriod} onEdit={openEdit} />
        <PeriodCard period={advancePeriod} onEdit={openEdit} />

        {/* Monthly total */}
        <div className="bg-emerald-800 rounded-2xl p-5 text-white">
          <div className="text-[10px] tracking-widest text-white/40 uppercase mb-1">Итого на кредит в месяц</div>
          <div className="text-3xl font-bold mb-1">
            {formatRub(config.loan.earlyPayment + config.loan.mandatoryPayment)}
          </div>
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

      <Drawer open={editing !== null} onOpenChange={open => !open && setEditing(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Изменить: {editing?.label}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 space-y-3 pb-2">
            <div className="space-y-1.5">
              <Label>{editing?.type === 'daily' ? 'Ставка в день (₽)' : 'Сумма (₽)'}</Label>
              <Input
                type="number"
                value={val}
                onChange={e => setVal(e.target.value)}
                className="text-base h-12"
                autoFocus
              />
            </div>
            {editing?.type === 'daily' && (
              <div className="space-y-1.5">
                <Label>Количество дней</Label>
                <Input
                  type="number"
                  value={val2}
                  onChange={e => setVal2(e.target.value)}
                  className="text-base h-12"
                />
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button onClick={save} className="h-12 text-base">Сохранить</Button>
            <Button variant="outline" onClick={() => setEditing(null)} className="h-12 text-base">Отмена</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
