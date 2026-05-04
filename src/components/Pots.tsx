import type { FinanceConfig } from '../types';
import { formatRub } from '../lib/calc';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Props {
  config: FinanceConfig;
}

export function Pots({ config }: Props) {
  const fromSalary = config.savingsPots.filter(p => p.refillDay === 15);
  const fromAdvance = config.savingsPots.filter(p => p.refillDay === 29);
  const totalSalary = fromSalary.reduce((s, p) => s + p.amount, 0);
  const totalAdvance = fromAdvance.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">15-го откладываешь</div>
            <div className="text-xl font-bold text-emerald-700">{formatRub(totalSalary)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{fromSalary.length} копилок</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">29-го откладываешь</div>
            <div className="text-xl font-bold text-blue-700">{formatRub(totalAdvance)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{fromAdvance.length} копилок</div>
          </CardContent>
        </Card>
      </div>

      {/* С зарплаты */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">С зарплаты 15-го</Badge>
        </div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            {fromSalary.map((pot, i) => (
              <div
                key={pot.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < fromSalary.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {pot.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{pot.name}</div>
                  <div className="text-[11px] text-muted-foreground">📆 списание: {pot.debitDay} числа</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-700 text-sm">{formatRub(pot.amount)}</div>
                  <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
                    {pot.refillNote}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* С аванса */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">С аванса ~29-го</Badge>
        </div>
        <Card className="rounded-2xl border-stone-200 overflow-hidden">
          <CardContent className="p-0">
            {fromAdvance.map((pot, i) => (
              <div
                key={pot.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < fromAdvance.length - 1 ? 'border-b border-stone-100' : ''}`}
              >
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {pot.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{pot.name}</div>
                  <div className="text-[11px] text-muted-foreground">📆 списание: {pot.debitDay} числа</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-700 text-sm">{formatRub(pot.amount)}</div>
                  <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
                    {pot.refillNote}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Advice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-indigo-900 mb-2">Автопилот за 20 минут</div>
        <div className="space-y-2 text-xs text-indigo-800 leading-relaxed">
          <p>1️⃣ Открой в банке несколько накопительных счетов/копилок. Назови их как в таблице выше.</p>
          <p>2️⃣ Настрой автопополнение: <span className="font-semibold">15-го — {formatRub(totalSalary)}</span>, 29-го — <span className="font-semibold">{formatRub(totalAdvance)}</span>.</p>
          <p>3️⃣ Подключи автоплатежи с этих копилок на дату списания.</p>
          <p>4️⃣ Результат: ты не думаешь об обязаловке. Деньги списываются сами.</p>
        </div>
      </div>
    </div>
  );
}
