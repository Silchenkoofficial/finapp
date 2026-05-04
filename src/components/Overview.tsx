import type { FinanceConfig } from '../types';
import { calcPeriodBalance, formatRub, loanMonthsLeft } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Props {
  config: FinanceConfig;
}

export function Overview({ config }: Props) {
  const today = new Date();
  const day = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const salaryPeriod = config.periods.find(p => p.id === 'salary')!;
  const advancePeriod = config.periods.find(p => p.id === 'advance')!;
  const salaryCalc = calcPeriodBalance(salaryPeriod);
  const advanceCalc = calcPeriodBalance(advancePeriod);

  const isAfterSalary = day >= salaryPeriod.dayOfMonth;
  let currentPeriodLabel: string;
  let currentBalance: number;
  let daysUntilNext: number;
  let nextLabel: string;

  if (isAfterSalary && day < advancePeriod.dayOfMonth) {
    currentPeriodLabel = 'Период зарплаты';
    currentBalance = salaryCalc.balance;
    daysUntilNext = advancePeriod.dayOfMonth - day;
    nextLabel = 'до аванса';
  } else {
    currentPeriodLabel = 'Период аванса';
    currentBalance = advanceCalc.balance;
    daysUntilNext = day >= advancePeriod.dayOfMonth
      ? daysInMonth - day + salaryPeriod.dayOfMonth
      : salaryPeriod.dayOfMonth - day;
    nextLabel = 'до зарплаты';
  }

  const monthlyPayment = config.loan.earlyPayment + config.loan.mandatoryPayment;
  const monthsLeft = loanMonthsLeft(config.loan.currentBalance, monthlyPayment);
  const loanProgress = Math.round(
    ((config.loan.startBalance - config.loan.currentBalance) / config.loan.startBalance) * 100
  );

  const totalMonthlyIncome = salaryPeriod.income + advancePeriod.income;
  const totalMonthlyExpenses = salaryCalc.fixedTotal + salaryCalc.dailyTotal +
    advanceCalc.fixedTotal + advanceCalc.dailyTotal +
    config.loan.earlyPayment + config.loan.mandatoryPayment;
  const totalBalance = salaryCalc.balance + advanceCalc.balance;

  return (
    <div className="space-y-4">
      {/* Hero card */}
      <Card className="bg-[#111827] text-white border-0 rounded-2xl overflow-hidden">
        <CardContent className="p-5">
          <div className="text-[10px] tracking-widest text-white/30 font-medium mb-1 uppercase">
            {currentPeriodLabel}
          </div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {formatRub(currentBalance)}
              </div>
              <div className="text-sm text-white/50 mt-0.5">остаток после всех трат</div>
            </div>
            <Badge className="bg-white/10 text-white border-0 text-xs">
              {daysUntilNext} дн. {nextLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-1">Доход/мес</div>
              <div className="font-bold text-sm">{formatRub(totalMonthlyIncome)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-1">Расходы/мес</div>
              <div className="font-bold text-sm">{formatRub(totalMonthlyExpenses)}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-1">Свободно</div>
              <div className="font-bold text-sm text-emerald-400">{formatRub(totalBalance)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan progress */}
      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-sm">Кредит</div>
              <div className="text-xs text-muted-foreground">
                {formatRub(config.loan.currentBalance)} остаток
              </div>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50">
              ~{monthsLeft} мес.
            </Badge>
          </div>
          <Progress value={loanProgress} className="h-2 bg-stone-100" />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>Выплачено {loanProgress}%</span>
            <span>{formatRub(monthlyPayment)}/мес</span>
          </div>
        </CardContent>
      </Card>

      {/* Period summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">15-го — зарплата</div>
            <div className="font-bold text-emerald-700">{formatRub(salaryPeriod.income)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              остаток <span className="font-semibold text-foreground">{formatRub(salaryCalc.balance)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">~29-го — аванс</div>
            <div className="font-bold text-blue-700">{formatRub(advancePeriod.income)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              остаток <span className="font-semibold text-foreground">{formatRub(advanceCalc.balance)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings pots total */}
      <Card className="rounded-2xl border-stone-200">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-2">Копилки — автоматика</div>
          <div className="text-xs text-muted-foreground">
            15-го откладываешь{' '}
            <span className="font-semibold text-foreground">
              {formatRub(config.savingsPots.filter(p => p.refillDay === 15).reduce((s, p) => s + p.amount, 0))}
            </span>
            {' '}· 29-го{' '}
            <span className="font-semibold text-foreground">
              {formatRub(config.savingsPots.filter(p => p.refillDay === 29).reduce((s, p) => s + p.amount, 0))}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {config.savingsPots.slice(0, 7).map(pot => (
              <span key={pot.id} className="text-base" title={pot.name}>{pot.icon}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
