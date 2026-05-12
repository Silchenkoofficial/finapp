import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Settings } from '../components/Settings'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { config, isLoading, addPayment, editPayment, deletePayment, updatePaymentAmount, resetToDefaults } = useConfig()
  if (isLoading || !config) return null
  return (
    <Settings
      config={config}
      onUpdatePaymentAmount={updatePaymentAmount}
      onAddPayment={addPayment}
      onEditPayment={editPayment}
      onDeletePayment={deletePayment}
      onResetToDefaults={resetToDefaults}
    />
  )
}
