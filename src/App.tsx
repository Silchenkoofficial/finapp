import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConfig } from './hooks/useConfig';
import { Overview } from './components/Overview';
import { PeriodBreakdown } from './components/PeriodBreakdown';
import { LoanTracker } from './components/LoanTracker';
import { Pots } from './components/Pots';
import { Settings } from './components/Settings';

const queryClient = new QueryClient();

type Tab = 'overview' | 'periods' | 'loan' | 'pots' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Обзор', icon: '📊' },
  { id: 'periods', label: 'Периоды', icon: '💸' },
  { id: 'loan', label: 'Кредит', icon: '🏦' },
  { id: 'pots', label: 'Копилки', icon: '💰' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' },
];

const TAB_TITLES: Record<Tab, string> = {
  overview: 'Обзор',
  periods: 'Разбивка по периодам',
  loan: 'Кредитный трекер',
  pots: 'Накопительные копилки',
  settings: 'Настройки',
};

function AppInner() {
  const [tab, setTab] = useState<Tab>('overview');
  const {
    config,
    isLoading,
    isSaving,
    updateLoan,
    updatePeriodIncome,
    updateEarlyLoan,
    updateFixedExpense,
    updateDailyExpense,
    resetToDefaults,
  } = useConfig();

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-sm mb-2">Загрузка...</div>
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-[#111827] text-white px-5">
        <div className="max-w-lg mx-auto py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-widest text-white/30 font-medium uppercase mb-0.5">
              ФИНАНСОВЫЙ ПЛАН
            </div>
            <div className="text-lg font-bold leading-tight">{TAB_TITLES[tab]}</div>
          </div>
          {isSaving && (
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <div className="w-3 h-3 border border-white/30 border-t-white/60 rounded-full animate-spin" />
              Сохраняю...
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 pb-24">
          {tab === 'overview' && <Overview config={config} />}
          {tab === 'periods' && (
            <PeriodBreakdown
              config={config}
              onUpdateIncome={updatePeriodIncome}
              onUpdateEarlyLoan={updateEarlyLoan}
              onUpdateFixed={updateFixedExpense}
              onUpdateDaily={updateDailyExpense}
            />
          )}
          {tab === 'loan' && <LoanTracker config={config} onUpdateLoan={updateLoan} />}
          {tab === 'pots' && <Pots config={config} />}
          {tab === 'settings' && (
            <Settings
              config={config}
              onUpdateIncome={updatePeriodIncome}
              onUpdateEarlyLoan={updateEarlyLoan}
              onUpdateFixed={updateFixedExpense}
              onUpdateDaily={updateDailyExpense}
              onUpdateLoan={updateLoan}
              onReset={resetToDefaults}
            />
          )}
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
