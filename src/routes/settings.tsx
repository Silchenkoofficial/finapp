import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Settings } from '../components/Settings'
import { Skeleton } from '../components/ui/skeleton'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { config, isLoading, addPayment, editPayment, deletePayment, updatePaymentAmount, resetToDefaults } = useConfig()
  if (isLoading || !config) return <SettingsSkeleton />
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

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {[7, 2].map((count, gi) => (
        <div key={gi} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`flex items-center px-4 py-3 gap-3 ${i < count - 1 ? 'border-b border-stone-100' : ''}`}>
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16 shrink-0" />
            </div>
          ))}
          <div className="px-4 py-3 border-t border-stone-100">
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      ))}
      <Skeleton className="h-24 rounded-2xl" />
    </div>
  )
}
