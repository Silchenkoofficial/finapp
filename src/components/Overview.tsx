import type { FinanceConfig } from '../types';
import type { IconName } from '../lib/icons';
import { Icon } from '../lib/icons';
import { formatRub, loanMonthsLeft } from '../lib/calc';
import { Card, CardContent } from './ui/card';

function daysUntilDay(targetDay: number): number {
  const now = new Date();
  const today = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (today <= targetDay) return targetDay - today;
  const next = new Date(year, month + 1, targetDay);
  const curr = new Date(year, month, today);
  return Math.round((next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
}

function PaydayCard({ label, day }: { label: string; day: number }) {
  const days = daysUntilDay(day);
  const isToday = days === 0;
  const isSoon = days > 0 && days <= 5;

  return (
    <Card className={`rounded-2xl ${isToday ? 'bg-emerald-50 border-emerald-200' : 'border-stone-200'}`}>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-2">{label} · {day}-е</div>
        <div className={`text-4xl font-bold leading-none mb-1 ${
          isToday ? 'text-emerald-600' : isSoon ? 'text-amber-500' : ''
        }`}>
          {days}
        </div>
        <div className="text-xs text-muted-foreground">
          {isToday ? 'Сегодня!' : isSoon ? 'дней (скоро!)' : 'дней'}
        </div>
      </CardContent>
    </Card>
  );
}

export function Overview({ config }: { config: FinanceConfig }) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const weekday = now.toLocaleDateString('ru-RU', { weekday: 'long' });

  // Upcoming payments — within 14 days
  const upcoming = config.payments
    .map(p => ({ ...p, daysLeft: daysUntilDay(p.dayOfMonth) }))
    .filter(p => p.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Loan
  const monthlyPayment = config.loan.earlyPayment + config.loan.mandatoryPayment;
  const monthsLeft = loanMonthsLeft(config.loan.currentBalance, monthlyPayment);

  // Carsharing this month
  const monthTrips = config.carsharingTrips.filter(t => t.date.startsWith(monthKey));
  const carsharingTotal = monthTrips.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Date */}
      <div>
        <div className="text-xs text-muted-foreground capitalize">{weekday}</div>
        <div className="text-xl font-bold">{dateStr}</div>
      </div>

      {/* Payday countdown */}
      <div className="grid grid-cols-2 gap-3">
        <PaydayCard label="Зарплата" day={15} />
        <PaydayCard label="Аванс" day={29} />
      </div>

      {/* Upcoming payments */}
      {upcoming.length > 0 && (
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b border-stone-100">
              <div className="text-sm font-semibold">Ближайшие платежи</div>
              <div className="text-xs text-muted-foreground">Следующие 14 дней</div>
            </div>
            {upcoming.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center px-4 py-3 gap-3 ${i < upcoming.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <Icon name={p.icon as IconName} size={15} className="text-stone-600" />
                </div>
                <div className="flex-1 min-w-0 text-sm font-medium truncate">{p.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  p.daysLeft === 0
                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                    : p.daysLeft <= 3
                    ? 'bg-amber-100 text-amber-700 font-semibold'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {p.daysLeft === 0 ? 'Сегодня' : `${p.daysLeft} дн.`}
                </span>
                <div className="text-sm font-bold shrink-0">{formatRub(p.amount)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Кредит</div>
            <div className="text-lg font-bold">{formatRub(config.loan.currentBalance)}</div>
            <div className="text-xs text-muted-foreground">{monthsLeft} мес. осталось</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Каршеринг в {now.toLocaleDateString('ru-RU', { month: 'long' })}
            </div>
            <div className="text-lg font-bold">
              {carsharingTotal > 0 ? formatRub(carsharingTotal) : '—'}
            </div>
            <div className="text-xs text-muted-foreground">
              {monthTrips.length > 0 ? `${monthTrips.length} поездок` : 'нет поездок'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
