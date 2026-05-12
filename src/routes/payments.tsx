import { createFileRoute } from '@tanstack/react-router'
import { useConfig } from '../hooks/useConfig'
import { Payments } from '../components/Payments'
import { PaymentsSkeleton } from '../components/skeletons/PaymentsSkeleton'

export const Route = createFileRoute('/payments')({
  component: PaymentsPage,
})

function PaymentsPage() {
  const { config, isLoading, togglePaymentCheck, monthKey } = useConfig()
  if (isLoading || !config) return <PaymentsSkeleton />
  return <Payments config={config} onToggleCheck={togglePaymentCheck} currentMonthKey={monthKey} />
}
