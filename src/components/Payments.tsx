import type { FinanceConfig, PaymentItem } from '../types';
import type { IconName } from '../lib/icons';
import { Icon } from '../lib/icons';
import { formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';

interface Props {
  config: FinanceConfig;
  onToggleCheck: (paymentId: string) => void;
  currentMonthKey: () => string;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
      checked ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'
    }`}>
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function PaymentGroup({
  label,
  dayLabel,
  payments,
  checks,
  onToggle,
}: {
  label: string;
  dayLabel: string;
  payments: PaymentItem[];
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const checkedTotal = payments.filter(p => checks[p.id]).reduce((s, p) => s + p.amount, 0);

  return (
    <Card className="rounded-2xl border-stone-200">
      <CardContent className="p-0">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">{dayLabel}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{formatRub(total)}</div>
            {checkedTotal > 0 && (
              <div className="text-xs text-emerald-600">оплачено {formatRub(checkedTotal)}</div>
            )}
          </div>
        </div>
        {payments.map((payment, i) => {
          const checked = !!checks[payment.id];
          return (
            <button
              key={payment.id}
              className={`w-full flex items-center px-4 py-3.5 gap-3 text-left transition-colors ${
                i < payments.length - 1 ? 'border-b border-stone-100' : ''
              } ${checked ? 'opacity-50' : 'active:bg-stone-50'}`}
              onClick={() => onToggle(payment.id)}
            >
              <CheckIcon checked={checked} />
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                <Icon name={payment.icon as IconName} size={18} className="text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${checked ? 'line-through text-muted-foreground' : ''}`}>
                  {payment.name}
                </div>
                {payment.description && (
                  <div className="text-xs text-muted-foreground">{payment.description}</div>
                )}
              </div>
              <div className={`text-sm font-bold shrink-0 ${checked ? 'line-through text-muted-foreground' : ''}`}>
                {formatRub(payment.amount)}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function Payments({ config, onToggleCheck, currentMonthKey }: Props) {
  const key = currentMonthKey();
  const checks = config.paymentChecks[key] ?? {};

  const salary = config.payments
    .filter(p => p.period === 'salary')
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  const advance = config.payments
    .filter(p => p.period === 'advance')
    .sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  const grandTotal = config.payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <PaymentGroup
        label="Зарплата"
        dayLabel="15-е число"
        payments={salary}
        checks={checks}
        onToggle={onToggleCheck}
      />
      <PaymentGroup
        label="Аванс"
        dayLabel="29-е число"
        payments={advance}
        checks={checks}
        onToggle={onToggleCheck}
      />
      <div className="bg-stone-200/60 rounded-2xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Итого в месяц</span>
        <span className="text-sm font-bold">{formatRub(grandTotal)}</span>
      </div>
    </div>
  );
}
