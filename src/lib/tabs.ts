import type { IconName } from './icons';

export const TABS: { path: string; label: string; icon: IconName }[] = [
  { path: '/',            label: 'Кредит',     icon: 'landmark'       },
  { path: '/payments',   label: 'Платежи',     icon: 'calendar-check' },
  { path: '/carsharing', label: 'Каршеринг',   icon: 'car'            },
  { path: '/settings',   label: 'Настройки',   icon: 'settings'       },
];

export const TAB_TITLES: Record<string, string> = {
  '/':            'Кредит',
  '/payments':    'Платежи',
  '/carsharing':  'Каршеринг',
  '/settings':    'Настройки',
};
