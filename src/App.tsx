import { useState } from 'react';
import { useConfig } from './hooks/useConfig';
import { Overview } from './components/Overview';
import { PeriodBreakdown } from './components/PeriodBreakdown';
import { LoanTracker } from './components/LoanTracker';
import { Pots } from './components/Pots';

type Tab = 'overview' | 'periods' | 'loan' | 'pots';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Обзор', icon: '📊' },
  { id: 'periods', label: 'Периоды', icon: '💸' },
  { id: 'loan', label: 'Кредит', icon: '🏦' },
  { id: 'pots', label: 'Копилки', icon: '💰' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('overview');
  const { config, updateLoan, updatePeriodIncome, updatePeriodEarlyLoan, updateFixedExpense, updateDailyExpense } = useConfig();

  const tabTitle: Record<Tab, string> = {
    overview: 'Обзор',
    periods: 'Разбивка по периодам',
    loan: 'Кредитный трекер',
    pots: 'Накопительные копилки',
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-[#111827] text-white px-5">
        <div className="max-w-lg mx-auto py-4">
          <div className="text-[10px] tracking-widest text-white/30 font-medium uppercase mb-0.5">
            ФИНАНСОВЫЙ ПЛАН
          </div>
          <div className="text-lg font-bold leading-tight">{tabTitle[tab]}</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 pb-24">
          {tab === 'overview' && <Overview config={config} />}
          {tab === 'periods' && (
            <PeriodBreakdown
              config={config}
              onUpdateIncome={updatePeriodIncome}
              onUpdateEarlyLoan={updatePeriodEarlyLoan}
              onUpdateFixed={updateFixedExpense}
              onUpdateDaily={updateDailyExpense}
            />
          )}
          {tab === 'loan' && <LoanTracker config={config} onUpdateLoan={updateLoan} />}
          {tab === 'pots' && <Pots config={config} />}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`relative flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                tab === t.id ? 'text-[#111827]' : 'text-stone-400'
              }`}
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#111827] rounded-b-full" />
              )}
              <span className="text-xl leading-none">{t.icon}</span>
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
