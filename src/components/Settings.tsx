import { useState } from 'react';
import type { FinanceConfig, PaymentItem } from '../types';
import type { IconName } from '../lib/icons';
import { Icon } from '../lib/icons';
import { formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Props {
  config: FinanceConfig;
  onUpdatePaymentAmount: (id: string, amount: number) => void;
  onResetToDefaults: () => void;
}

function EditablePayment({
  payment,
  onSave,
}: {
  payment: PaymentItem;
  onSave: (amount: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const start = () => { setDraft(String(payment.amount)); setEditing(true); };
  const save = () => {
    const n = Number(draft);
    if (!isNaN(n) && n >= 0) onSave(n);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
        <Icon name={payment.icon as IconName} size={16} className="text-stone-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{payment.name}</div>
        <div className="text-xs text-muted-foreground">{payment.description}</div>
      </div>
      {editing ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <Input
            inputMode="numeric"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
            className="w-28 h-8 text-right text-sm"
            autoFocus
          />
          <Button size="sm" onClick={save} className="h-8 px-2.5 text-xs">OK</Button>
        </div>
      ) : (
        <button
          onClick={start}
          className="flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
        >
          <span className="text-sm font-bold text-stone-600">{formatRub(payment.amount)}</span>
          <span className="text-stone-300 text-xs">✏</span>
        </button>
      )}
    </div>
  );
}

export function Settings({ config, onUpdatePaymentAmount, onResetToDefaults }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const salary = config.payments.filter(p => p.period === 'salary').sort((a, b) => a.dayOfMonth - b.dayOfMonth);
  const advance = config.payments.filter(p => p.period === 'advance').sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-stone-100">
            <div className="text-sm font-semibold">Платежи — Зарплата</div>
            <div className="text-xs text-muted-foreground">Нажми на сумму чтобы изменить</div>
          </div>
          <div className="px-4 divide-y divide-stone-100">
            {salary.map(p => (
              <EditablePayment key={p.id} payment={p} onSave={amount => onUpdatePaymentAmount(p.id, amount)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-stone-100">
            <div className="text-sm font-semibold">Платежи — Аванс</div>
            <div className="text-xs text-muted-foreground">Нажми на сумму чтобы изменить</div>
          </div>
          <div className="px-4 divide-y divide-stone-100">
            {advance.map(p => (
              <EditablePayment key={p.id} payment={p} onSave={amount => onUpdatePaymentAmount(p.id, amount)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-red-100 border">
        <CardContent className="p-4">
          <div className="text-sm font-semibold text-red-700 mb-1">Сброс данных</div>
          <div className="text-xs text-muted-foreground mb-3">
            Вернёт все суммы и настройки к начальным значениям. История каршеринга тоже сотрётся.
          </div>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { onResetToDefaults(); setConfirmReset(false); }}
                className="flex-1"
              >
                Да, сбросить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmReset(false)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmReset(true)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Сбросить к дефолтным
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
