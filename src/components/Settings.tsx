import { useState } from 'react';
import type { FinanceConfig } from '../types';
import { formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdateIncome: (id: 'salary' | 'advance', value: number) => void;
  onUpdateEarlyLoan: (value: number) => void;
  onUpdateFixed: (periodId: 'salary' | 'advance', expenseId: string, amount: number) => void;
  onUpdateDaily: (periodId: 'salary' | 'advance', expenseId: string, rate: number, days: number) => void;
  onUpdateLoan: (updates: Partial<FinanceConfig['loan']>) => void;
  onReset: () => void;
}

function SettingRow({
  label,
  sub,
  value,
  suffix = '₽',
  onSave,
}: {
  label: string;
  sub?: string;
  value: number;
  suffix?: string;
  onSave: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const start = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const save = () => {
    const n = Number(draft);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <div className="flex items-center px-4 py-3 border-b border-stone-100 last:border-0 gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {editing ? (
        <div className="flex items-center gap-2 shrink-0">
          <Input
            type="number"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onKey}
            className="w-32 h-9 text-right text-sm"
            autoFocus
          />
          <Button size="sm" onClick={save} className="h-9 px-3">OK</Button>
        </div>
      ) : (
        <button
          onClick={start}
          className="text-sm font-semibold text-right shrink-0 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          {value.toLocaleString('ru')} {suffix}
          <span className="text-stone-300 text-xs">✏</span>
        </button>
      )}
    </div>
  );
}

function DailyRow({
  label,
  sub,
  dailyRate,
  days,
  onSave,
}: {
  label: string;
  sub?: string;
  dailyRate: number;
  days: number;
  onSave: (rate: number, days: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftRate, setDraftRate] = useState('');
  const [draftDays, setDraftDays] = useState('');

  const start = () => {
    setDraftRate(String(dailyRate));
    setDraftDays(String(days));
    setEditing(true);
  };

  const save = () => {
    const r = Number(draftRate);
    const d = Number(draftDays);
    if (!isNaN(r) && !isNaN(d) && r >= 0 && d > 0) onSave(r, d);
    setEditing(false);
  };

  return (
    <div className="flex items-start px-4 py-3 border-b border-stone-100 last:border-0 gap-3">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {editing ? (
        <div className="flex flex-col gap-1.5 items-end shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">₽/день</span>
            <Input
              type="number"
              value={draftRate}
              onChange={e => setDraftRate(e.target.value)}
              className="w-24 h-8 text-right text-sm"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">дней</span>
            <Input
              type="number"
              value={draftDays}
              onChange={e => setDraftDays(e.target.value)}
              className="w-24 h-8 text-right text-sm"
            />
          </div>
          <Button size="sm" onClick={save} className="h-8 px-3 text-xs">OK</Button>
        </div>
      ) : (
        <button
          onClick={start}
          className="text-sm font-semibold text-right shrink-0 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <span className="text-xs text-muted-foreground font-normal">{dailyRate} ₽ × {days}д =</span>{' '}
          {formatRub(dailyRate * days)}
          <span className="text-stone-300 text-xs">✏</span>
        </button>
      )}
    </div>
  );
}

export function Settings({ config, onUpdateIncome, onUpdateEarlyLoan, onUpdateFixed, onUpdateDaily, onUpdateLoan, onReset }: Props) {
  const salary = config.periods.find(p => p.id === 'salary')!;
  const advance = config.periods.find(p => p.id === 'advance')!;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="space-y-5">
      {/* Доходы */}
      <section>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Доходы</div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            <SettingRow
              label="Зарплата"
              sub="Приходит 15-го числа"
              value={salary.income}
              onSave={v => onUpdateIncome('salary', v)}
            />
            <SettingRow
              label="Аванс"
              sub="Приходит ~29-го числа"
              value={advance.income}
              onSave={v => onUpdateIncome('advance', v)}
            />
          </CardContent>
        </Card>
      </section>

      {/* Кредит */}
      <section>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Кредит</div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            <SettingRow
              label="Текущий остаток долга"
              sub="Обновляй каждый месяц"
              value={config.loan.currentBalance}
              onSave={v => onUpdateLoan({ currentBalance: v })}
            />
            <SettingRow
              label="Досрочный платёж"
              sub="С зарплаты, 15-го числа"
              value={config.loan.earlyPayment}
              onSave={v => { onUpdateLoan({ earlyPayment: v }); onUpdateEarlyLoan(v); }}
            />
            <SettingRow
              label="Обязательный платёж"
              sub="С аванса, 2-го числа"
              value={config.loan.mandatoryPayment}
              onSave={v => onUpdateLoan({ mandatoryPayment: v })}
            />
            <SettingRow
              label="Начальный долг"
              sub="Когда начал отслеживать"
              value={config.loan.startBalance}
              onSave={v => onUpdateLoan({ startBalance: v })}
            />
          </CardContent>
        </Card>
      </section>

      {/* Подписки — с зарплаты */}
      <section>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Подписки — с зарплаты (15-го)</div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            {salary.fixedExpenses.map(e => (
              <SettingRow
                key={e.id}
                label={`${e.icon} ${e.name}`}
                sub={e.description}
                value={e.amount}
                onSave={v => onUpdateFixed('salary', e.id, v)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Подписки — с аванса */}
      <section>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Подписки — с аванса (~29-го)</div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            {advance.fixedExpenses.map(e => (
              <SettingRow
                key={e.id}
                label={`${e.icon} ${e.name}`}
                sub={e.description}
                value={e.amount}
                onSave={v => onUpdateFixed('advance', e.id, v)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Переменные расходы */}
      <section>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Переменные расходы</div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 text-xs text-muted-foreground font-medium">
              Период зарплаты (16 дней до аванса)
            </div>
            {salary.dailyExpenses.map(e => (
              <DailyRow
                key={e.id}
                label={`${e.icon} ${e.name}`}
                dailyRate={e.dailyRate}
                days={e.days}
                onSave={(r, d) => onUpdateDaily('salary', e.id, r, d)}
              />
            ))}
            <div className="px-4 py-2 bg-stone-50 border-t border-b border-stone-100 text-xs text-muted-foreground font-medium">
              Период аванса (15 дней до зарплаты)
            </div>
            {advance.dailyExpenses.map(e => (
              <DailyRow
                key={e.id}
                label={`${e.icon} ${e.name}`}
                dailyRate={e.dailyRate}
                days={e.days}
                onSave={(r, d) => onUpdateDaily('advance', e.id, r, d)}
              />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Сброс */}
      <section>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full text-sm text-red-500 text-center py-2 hover:opacity-70 transition-opacity"
          >
            Сбросить все настройки к дефолтным
          </button>
        ) : (
          <Card className="rounded-2xl border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-red-800 mb-3">Точно сбросить? Все изменения удалятся.</div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>Отмена</Button>
                <Button variant="destructive" size="sm" onClick={() => { onReset(); setShowResetConfirm(false); }}>Сбросить</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
