import {
  Bot, Smartphone, Plug, Car, Star, Globe, Home, Landmark, Zap,
  CalendarCheck, BarChart3, Settings, type LucideProps,
} from 'lucide-react';

export const ICON_MAP = {
  bot: Bot,
  smartphone: Smartphone,
  plug: Plug,
  car: Car,
  star: Star,
  globe: Globe,
  home: Home,
  landmark: Landmark,
  zap: Zap,
  'calendar-check': CalendarCheck,
  'bar-chart': BarChart3,
  settings: Settings,
} as const;

export type IconName = keyof typeof ICON_MAP;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = ICON_MAP[name];
  return <Component {...props} />;
}
