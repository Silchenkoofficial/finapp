import { useState } from 'react';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
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
  onAddPayment: (data: Omit<PaymentItem, 'id'>) => void;
  onEditPayment: (id: string, updates: Partial<Omit<PaymentItem, 'id'>>) => void;
  onDeletePayment: (id: string) => void;
}

const PAYMENT_ICONS: IconName[] = [
  'bot', 'smartphone', 'plug', 'car', 'star', 'globe',
  'home', 'landmark', 'zap', 'bar-chart',
];

const PERIOD_LABELS: Record<'salary' | 'advance', string> = {
  salary: 'Зарплата',
  advance: 'Аванс',
};

// ─── PaymentForm ──────────────────────────────────────────────────────────────

function PaymentForm({
  initial,
  fixedPeriod,
  onSave,
  onCancel,
}: {
  initial?: Partial<PaymentItem>;
  fixedPeriod?: 'salary' | 'advance';
  onSave: (data: Omit<PaymentItem, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName]           = useState(initial?.name ?? '');
  const [amount, setAmount]       = useState(initial?.amount != null ? String(initial.amount) : '');
  const [period, setPeriod]       = useState<'salary' | 'advance'>(fixedPeriod ?? initial?.period ?? 'salary');
  const [day, setDay]             = useState(initial?.dayOfMonth != null ? String(initial.dayOfMonth) : '');
  const [description, setDesc]    = useState(initial?.description ?? '');
  const [icon, setIcon]           = useState<IconName>((initial?.icon as IconName) ?? 'star');

  const canSave = name.trim() && Number(amount) >= 0 && Number(day) >= 1 && Number(day) <= 31;

  const save = () => {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      amount: Number(amount),
      period,
      dayOfMonth: Number(day),
      description: description.trim() || undefined,
      icon,
    });
  };

  return (
    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
      <Input placeholder="Название" value={name} onChange={e => setName(e.target.value)} />

      <div className="flex gap-2">
        <Input
          inputMode="numeric"
          placeholder="Сумма, ₽"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1"
        />
        <Input
          inputMode="numeric"
          placeholder="День"
          value={day}
          onChange={e => setDay(e.target.value)}
          className="w-20"
        />
      </div>

      {!fixedPeriod && (
        <div className="flex gap-2">
          {(['salary', 'advance'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p ? 'bg-[#111827] text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      )}

      <Input
        placeholder="Описание (необязательно)"
        value={description}
        onChange={e => setDesc(e.target.value)}
      />

      {/* Icon selector */}
      <div className="flex flex-wrap gap-2">
        {PAYMENT_ICONS.map(ic => (
          <button
            key={ic}
            onClick={() => setIcon(ic)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              icon === ic ? 'bg-[#111827] text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            <Icon name={ic} size={17} />
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={save} disabled={!canSave} className="flex-1">
          Сохранить
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Отмена
        </Button>
      </div>
    </div>
  );
}

// ─── PaymentRow ───────────────────────────────────────────────────────────────

function PaymentRow({
  payment,
  onEdit,
  onDelete,
}: {
  payment: PaymentItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center px-4 py-3 gap-3">
      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
        <Icon name={payment.icon as IconName} size={15} className="text-stone-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{payment.name}</div>
        {payment.description && (
          <div className="text-xs text-muted-foreground">{payment.description}</div>
        )}
      </div>
      <div className="text-sm font-bold shrink-0">{formatRub(payment.amount)}</div>
      <button onClick={onEdit} className="text-stone-300 hover:text-stone-600 transition-colors p-1 shrink-0">
        <Pencil size={14} />
      </button>
      {confirmDelete ? (
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1">
            <Check size={14} />
          </button>
          <button onClick={() => setConfirmDelete(false)} className="text-stone-400 p-1">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-stone-300 hover:text-red-400 transition-colors p-1 shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ─── PaymentSection ───────────────────────────────────────────────────────────

function PaymentSection({
  label,
  dayLabel,
  payments,
  period,
  onAdd,
  onEdit,
  onDelete,
}: {
  label: string;
  dayLabel: string;
  payments: PaymentItem[];
  period: 'salary' | 'advance';
  onAdd: (data: Omit<PaymentItem, 'id'>) => void;
  onEdit: (id: string, updates: Partial<Omit<PaymentItem, 'id'>>) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <Card className="rounded-2xl border-stone-200">
      <CardContent className="p-0">
        <div className="px-4 py-3 border-b border-stone-100">
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-muted-foreground">{dayLabel}</div>
        </div>

        {payments.map((p, i) => (
          <div key={p.id} className={i < payments.length - 1 || editingId === p.id ? 'border-b border-stone-100' : ''}>
            {editingId === p.id ? (
              <div className="p-3">
                <PaymentForm
                  initial={p}
                  fixedPeriod={period}
                  onSave={data => { onEdit(p.id, data); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <PaymentRow
                payment={p}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => onDelete(p.id)}
              />
            )}
          </div>
        ))}

        {adding ? (
          <div className="p-3 border-t border-stone-100">
            <PaymentForm
              fixedPeriod={period}
              onSave={data => { onAdd(data); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors border-t border-stone-100"
          >
            <Plus size={15} />
            Добавить платёж
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function Settings({ config, onAddPayment, onEditPayment, onDeletePayment }: Props) {
  const salary = config.payments
    .filter(p => p.period === 'salary')
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  const advance = config.payments
    .filter(p => p.period === 'advance')
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  return (
    <div className="space-y-4">
      <PaymentSection
        label="Зарплата"
        dayLabel="15-е число"
        payments={salary}
        period="salary"
        onAdd={onAddPayment}
        onEdit={onEditPayment}
        onDelete={onDeletePayment}
      />

      <PaymentSection
        label="Аванс"
        dayLabel="29-е число"
        payments={advance}
        period="advance"
        onAdd={onAddPayment}
        onEdit={onEditPayment}
        onDelete={onDeletePayment}
      />

    </div>
  );
}
