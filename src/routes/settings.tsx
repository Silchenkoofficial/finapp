import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Settings } from '../components/Settings'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { config, isLoading, updateLoan, updatePeriodIncome, updateEarlyLoan, updateFixedExpense, updateDailyExpense, resetToDefaults } = useConfig()
  if (isLoading || !config) return null
  return (
    <Settings
      config={config}
      onUpdateIncome={updatePeriodIncome}
      onUpdateEarlyLoan={updateEarlyLoan}
      onUpdateFixed={updateFixedExpense}
      onUpdateDaily={updateDailyExpense}
      onUpdateLoan={updateLoan}
      onReset={resetToDefaults}
    />
  )
}
