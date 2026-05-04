export const TABS = [
  { path: '/', label: 'Обзор', icon: '📊' },
  { path: '/periods', label: 'Периоды', icon: '💸' },
  { path: '/loan', label: 'Кредит', icon: '🏦' },
  { path: '/pots', label: 'Копилки', icon: '💰' },
  { path: '/settings', label: 'Настройки', icon: '⚙️' },
] as const

export const TAB_TITLES: Record<string, string> = {
  '/': 'Обзор',
  '/periods': 'Разбивка по периодам',
  '/loan': 'Кредитный трекер',
  '/pots': 'Накопительные копилки',
  '/settings': 'Настройки',
}
