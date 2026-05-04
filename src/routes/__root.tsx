import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useConfig } from '../hooks/useConfig'

const queryClient = new QueryClient()

const TABS = [
  { path: '/', label: 'Обзор', icon: '📊' },
  { path: '/periods', label: 'Периоды', icon: '💸' },
  { path: '/loan', label: 'Кредит', icon: '🏦' },
  { path: '/pots', label: 'Копилки', icon: '💰' },
  { path: '/settings', label: 'Настройки', icon: '⚙️' },
] as const

const TAB_TITLES: Record<string, string> = {
  '/': 'Обзор',
  '/periods': 'Разбивка по периодам',
  '/loan': 'Кредитный трекер',
  '/pots': 'Накопительные копилки',
  '/settings': 'Настройки',
}

function RootLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: s => s.location.pathname })
  const { isSaving } = useConfig()

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <header className="bg-[#111827] text-white px-5">
        <div className="max-w-lg mx-auto py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-widest text-white/30 font-medium uppercase mb-0.5">
              ФИНАНСОВЫЙ ПЛАН
            </div>
            <div className="text-lg font-bold leading-tight">
              {TAB_TITLES[pathname] ?? 'Финансы'}
            </div>
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
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => {
            const active = pathname === t.path
            return (
              <button
                key={t.path}
                className={`relative flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
                  active ? 'text-[#111827]' : 'text-stone-400'
                }`}
                onClick={() => navigate({ to: t.path })}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[#111827] rounded-b-full" />
                )}
                <span className="text-xl leading-none">{t.icon}</span>
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  ),
})
