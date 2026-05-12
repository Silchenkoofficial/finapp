import type { FinanceConfig } from '../types';
import { supabase, CONFIG_ROW_ID } from './supabase';
import { DEFAULT_CONFIG } from '../defaultConfig';

export async function fetchConfig(signal?: AbortSignal): Promise<FinanceConfig> {
  const { data, error } = await supabase
    .from('config')
    .select('data')
    .eq('id', CONFIG_ROW_ID)
    .abortSignal(signal!)
    .single();

  // Если запрос был отменён (StrictMode / смена роута) — не трогать данные
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  const parsed = data?.data as FinanceConfig | null;
  if (error || !Array.isArray(parsed?.payments)) {
    await saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  return parsed;
}

export async function saveConfig(config: FinanceConfig): Promise<void> {
  const { error } = await supabase
    .from('config')
    .upsert({ id: CONFIG_ROW_ID, data: config, updated_at: new Date().toISOString() });

  if (error) throw error;
}
